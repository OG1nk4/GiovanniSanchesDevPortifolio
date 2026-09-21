'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { createLoop, fitCanvas, prefersReducedMotion, watchVisibility } from '@/lib/canvas';

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// Halftone: each cell samples the photo's luminance and draws a dot sized by
// it. Inside the lens the real photo shows through; around the lens edge the
// dots pick up the accent colour.
const FRAG = `
precision highp float;
uniform sampler2D u_img;
uniform vec2 u_res;
uniform float u_dpr;
uniform vec2 u_mouse;
uniform float u_radius;
uniform float u_cell;
uniform vec2 u_uvScale;
uniform float u_time;
const vec3 BG = vec3(0.039);
const vec3 FG = vec3(0.925, 0.922, 0.902);
const vec3 ACCENT = vec3(0.22, 0.66, 1.0);

vec2 cover(vec2 uv) { return vec2((uv.x - 0.5) * u_uvScale.x + 0.5, uv.y * u_uvScale.y); }
float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

void main() {
  vec2 size = u_res / u_dpr;
  vec2 css = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y) / u_dpr;
  vec3 photo = texture2D(u_img, cover(css / size)).rgb;

  vec2 center = (floor(css / u_cell) + 0.5) * u_cell;
  float l = luma(texture2D(u_img, cover(center / size)).rgb);
  // Near-black background drops out entirely; the subject gets the dots.
  l = smoothstep(0.07, 0.62, l);
  // A slow ripple running through the dot sizes keeps the portrait breathing.
  l *= 0.9 + 0.1 * sin(u_time * 1.6 - length(center - size * vec2(0.5, 0.3)) * 0.035);
  float r = sqrt(l) * 0.6 * u_cell;
  float dotMask = 1.0 - smoothstep(r - 0.7, r + 0.7, length(css - center));

  float md = distance(css, u_mouse);
  float lens = 1.0 - smoothstep(u_radius * 0.72, u_radius, md);
  float glow = 1.0 - smoothstep(u_radius * 0.9, u_radius * 1.35, md);
  vec3 dotCol = mix(FG * 0.82, ACCENT, 0.85 * glow * step(0.5, u_radius));

  vec3 halftone = mix(BG, dotCol, dotMask);
  vec3 col = mix(halftone, photo, lens);
  // Thin accent ring on the lens edge.
  float ring = smoothstep(1.6, 0.0, abs(md - u_radius * 0.86)) * step(0.5, u_radius);
  col = mix(col, ACCENT, ring * 0.9);
  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
  return s;
}

type Props = { src: string; alt: string; width: number; height: number };

/**
 * Portrait rendered as a live halftone in WebGL. A lens follows the cursor
 * (or a finger) and reveals the real photo; with no pointer, the lens drifts
 * over the face on its own. On first view the halftone resolves from coarse
 * to fine. The plain <Image> underneath is the fallback and the LCP image.
 */
export function HalftonePortrait({ src, alt, width, height }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || prefersReducedMotion()) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl || gl.isContextLost()) return;

    let program: WebGLProgram;
    try {
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { console.error("[halftone] link", gl.getProgramInfoLog(program)); return; }
    } catch (err) {
      console.error("[halftone]", err);
      return;
    }
    gl.useProgram(program);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u('u_res'), uDpr = u('u_dpr'), uMouse = u('u_mouse'), uRadius = u('u_radius');
    const uCell = u('u_cell'), uScale = u('u_uvScale'), uTime = u('u_time');

    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      // Use layout size, not the (possibly scaled) visual rect.
      W = wrap.offsetWidth;
      H = wrap.offsetHeight;
      dpr = fitCanvas(canvas, W, H);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const ca = W / H, ia = width / height;
      gl.uniform2f(uScale, ia < ca ? 1 : ca / ia, ia < ca ? ia / ca : 1);
    };

    const state = {
      hover: false,
      mx: 0, my: 0, // lens position (smoothed)
      tx: 0, ty: 0, // target
      radius: 0,
      cell: 34,
      targetCell: 34,
      start: 0,
    };

    const frame = (t: number) => {
      if (!state.start) state.start = t;
      const time = (t - state.start) / 1000;
      if (!state.hover) {
        // Wander in a slow figure-eight around the face.
        state.tx = W * (0.5 + 0.26 * Math.sin(time * 0.55));
        state.ty = H * (0.3 + 0.16 * Math.sin(time * 1.1));
      }
      state.mx += (state.tx - state.mx) * 0.12;
      state.my += (state.ty - state.my) * 0.12;
      const targetR = state.hover ? Math.min(W, H) * 0.3 : Math.min(W, H) * 0.2;
      state.radius += (targetR - state.radius) * 0.08;
      state.cell += (state.targetCell - state.cell) * 0.05;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uDpr, dpr);
      gl.uniform2f(uMouse, state.mx, state.my);
      gl.uniform1f(uRadius, state.radius);
      gl.uniform1f(uCell, state.cell);
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      return true;
    };
    const loop = createLoop(frame);

    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
    };
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e);
      state.hover = true;
      state.tx = p.x;
      state.ty = p.y;
    };
    const onLeave = () => (state.hover = false);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointercancel', onLeave);

    let cancelled = false;
    let stopVisibility = () => {};
    const ro = new ResizeObserver(resize);

    const img = new window.Image();
    img.decoding = 'async';
    img.src = `/_next/image?url=${encodeURIComponent(src)}&w=828&q=75`;
    img.onload = () => {
      if (cancelled) return;
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      resize();
      state.mx = state.tx = W / 2;
      state.my = state.ty = H * 0.3;
      ro.observe(wrap);
      stopVisibility = watchVisibility(canvas, (v) => {
        // First time it scrolls into view, resolve from coarse to fine.
        if (v) state.targetCell = W < 400 ? 6 : 7;
        loop.setAllowed(v);
      });
      canvas.style.opacity = '1';
    };

    return () => {
      cancelled = true;
      loop.stop();
      stopVisibility();
      ro.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointercancel', onLeave);
    };
  }, [src, width, height]);

  return (
    <div ref={wrapRef} data-media className="absolute inset-0">
      <Image src={src} alt={alt} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover object-top" />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 touch-pan-y opacity-0 transition-opacity duration-700"
      />
    </div>
  );
}
