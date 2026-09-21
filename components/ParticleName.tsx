'use client';

import { useEffect, useRef } from 'react';
import { createLoop, fitCanvas, prefersReducedMotion, watchVisibility } from '@/lib/canvas';

const FG = '#ecebe6';
const ACCENT = '#38a8ff';

// Physics tuning.
const SPRING = 0.045; // pull back toward the letter
const DAMPING = 0.86;
const PUSH = 9; // cursor repulsion strength
const DRAG = 0.35; // how much cursor velocity drags particles along
const WAVE_SPEED = 900; // px/s for click shockwaves
const WAVE_BAND = 60;
const WAVE_LIFE = 1.2;

type Props = { words: string[]; className?: string };

/**
 * The hero name drawn as a field of square particles sampled from the real
 * text. Particles fly in and assemble, get pushed aside by the cursor (or a
 * finger), and spring back; clicks and taps send a shockwave through them.
 *
 * The real <h1> stays in the DOM for SEO and screen readers; its text is only
 * made transparent once the canvas has taken over.
 */
export function ParticleName({ words, className }: Props) {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const h1 = h1Ref.current;
    const canvas = canvasRef.current;
    if (!h1 || !canvas) return;
    const showText = () => h1.setAttribute('data-particles', 'off');
    if (prefersReducedMotion()) return showText();
    const ctx = canvas.getContext('2d');
    if (!ctx) return showText();

    let W = 0, H = 0, pad = 0, dpr = 1, size = 2, radius = 120;
    let n = 0;
    let hx = new Float32Array(0), hy = hx, x = hx, y = hx, vx = hx, vy = hx, born = hx;
    let start = 0;
    let lastInteraction = 0;
    let nextAutoWave = 3;
    const pointer = { x: -1e4, y: -1e4, vx: 0, vy: 0, active: false };
    const waves: { x: number; y: number; t: number }[] = [];

    const build = (intro: boolean) => {
      const rect = h1.getBoundingClientRect();
      const cs = getComputedStyle(h1);
      const fontSize = parseFloat(cs.fontSize);
      pad = Math.round(fontSize * 0.5);
      W = Math.ceil(rect.width + pad * 2);
      H = Math.ceil(rect.height + pad * 2);
      canvas.style.left = `${-pad}px`;
      canvas.style.top = `${-pad}px`;
      dpr = fitCanvas(canvas, W, H);
      radius = Math.max(70, fontSize * 0.75);

      // Draw each letter where the DOM laid it out, then sample its pixels.
      const off = document.createElement('canvas');
      off.width = W;
      off.height = H;
      const o = off.getContext('2d', { willReadFrequently: true })!;
      o.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      o.textBaseline = 'middle';
      o.fillStyle = '#fff';
      h1.querySelectorAll<HTMLElement>('[data-char]').forEach((ch) => {
        const r = ch.getBoundingClientRect();
        o.fillText((ch.textContent ?? '').toUpperCase(), r.left - rect.left + pad, r.top - rect.top + pad + r.height / 2);
      });

      let gap = Math.max(3, Math.round(fontSize / 30));
      const data = o.getImageData(0, 0, W, H).data;
      let pts: number[] = [];
      for (;;) {
        pts = [];
        for (let py = 0; py < H; py += gap)
          for (let px = 0; px < W; px += gap) if (data[(py * W + px) * 4 + 3] > 128) pts.push(px, py);
        if (pts.length / 2 <= 9000) break;
        gap++; // keep the particle count sane on huge screens
      }
      size = Math.max(1.4, gap * 0.5);

      // Center the ink vertically in the h1 box (canvas baselines differ from CSS).
      let minY = Infinity, maxY = -Infinity;
      for (let i = 1; i < pts.length; i += 2) {
        minY = Math.min(minY, pts[i]);
        maxY = Math.max(maxY, pts[i]);
      }
      const shiftY = pad + rect.height / 2 - (minY + maxY) / 2;

      n = pts.length / 2;
      hx = new Float32Array(n); hy = new Float32Array(n);
      x = new Float32Array(n); y = new Float32Array(n);
      vx = new Float32Array(n); vy = new Float32Array(n);
      born = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        hx[i] = pts[i * 2];
        hy[i] = pts[i * 2 + 1] + shiftY;
        if (intro) {
          // Scatter, then let the spring assemble the letters left to right.
          x[i] = hx[i] + (Math.random() - 0.5) * W * 0.5;
          y[i] = hy[i] + (Math.random() - 0.5) * H * 1.6;
          born[i] = 0.15 + (hx[i] / W) * 0.7 + Math.random() * 0.25;
        } else {
          x[i] = hx[i];
          y[i] = hy[i];
        }
      }
      h1.setAttribute('data-particles', 'on');
    };

    const frame = (t: number) => {
      if (!start) start = t;
      const el = (t - start) / 1000;

      // Idle for a while? Send a wave on our own so the name never looks dead.
      if (el - lastInteraction > 4 && el > nextAutoWave && n) {
        const i = (Math.random() * n) | 0;
        waves.push({ x: hx[i], y: hy[i], t: el });
        nextAutoWave = el + 5 + Math.random() * 3;
      }
      for (let w = waves.length - 1; w >= 0; w--) if (el - waves[w].t > WAVE_LIFE) waves.splice(w, 1);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const calm = new Path2D();
      const moving = new Path2D();
      const R2 = radius * radius;
      const pvx = pointer.vx, pvy = pointer.vy;
      pointer.vx *= 0.85;
      pointer.vy *= 0.85;

      for (let i = 0; i < n; i++) {
        if (el < born[i]) continue;
        let ax = (hx[i] - x[i]) * SPRING;
        let ay = (hy[i] - y[i]) * SPRING;

        if (pointer.active) {
          const dx = x[i] - pointer.x, dy = y[i] - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            let f = 1 - d / radius;
            f *= f;
            ax += (dx / d) * f * PUSH + pvx * f * DRAG;
            ay += (dy / d) * f * PUSH + pvy * f * DRAG;
          }
        }

        for (let w = 0; w < waves.length; w++) {
          const wave = waves[w];
          const age = el - wave.t;
          const dx = x[i] - wave.x, dy = y[i] - wave.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const off = Math.abs(d - age * WAVE_SPEED);
          if (off < WAVE_BAND) {
            const k = (1 - off / WAVE_BAND) * (1 - age / WAVE_LIFE) * 14;
            ax += (dx / d) * k;
            ay += (dy / d) * k;
          }
        }

        vx[i] = (vx[i] + ax) * DAMPING;
        vy[i] = (vy[i] + ay) * DAMPING;
        x[i] += vx[i];
        y[i] += vy[i];

        const disp = Math.abs(x[i] - hx[i]) + Math.abs(y[i] - hy[i]);
        (disp > 3 ? moving : calm).rect(x[i], y[i], size, size);
      }

      ctx.fillStyle = FG;
      ctx.fill(calm);
      ctx.fillStyle = ACCENT;
      ctx.fill(moving);
      return true;
    };

    const loop = createLoop(frame);

    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const sx = W / r.width;
      return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sx, inside: e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom };
    };
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e);
      if (pointer.active) {
        pointer.vx = gClamp(p.x - pointer.x);
        pointer.vy = gClamp(p.y - pointer.y);
      }
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.active = p.inside;
      if (p.inside) lastInteraction = (performance.now() - start) / 1000;
    };
    const onDown = (e: PointerEvent) => {
      const p = toLocal(e);
      if (!p.inside) return;
      const el = (performance.now() - start) / 1000;
      waves.push({ x: p.x, y: p.y, t: el });
      lastInteraction = el;
    };
    const onLeave = () => (pointer.active = false);

    let cancelled = false;
    let stopVisibility = () => {};
    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => n && build(false), 150);
    });

    document.fonts.ready.then(() => {
      if (cancelled) return;
      try {
        build(true);
      } catch {
        return showText();
      }
      ro.observe(h1);
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      stopVisibility = watchVisibility(canvas, (v) => loop.setAllowed(v));
      loop.wake();
    });

    return () => {
      cancelled = true;
      loop.stop();
      stopVisibility();
      ro.disconnect();
      clearTimeout(resizeTimer);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div data-hero-name className="relative mt-6">
      <h1 ref={h1Ref} aria-label={words.join(' ')} data-particle-text className={className}>
        {words.map((w) => (
          <span key={w} className="block">
            {[...w].map((c, i) => (
              <span key={i} data-char className="inline-block">
                {c}
              </span>
            ))}
          </span>
        ))}
      </h1>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute" />
    </div>
  );
}

const gClamp = (v: number) => Math.max(-40, Math.min(40, v));
