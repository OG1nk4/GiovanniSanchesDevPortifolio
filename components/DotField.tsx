'use client';

import { useEffect, useRef } from 'react';
import { createLoop, fitCanvas, prefersReducedMotion, watchVisibility } from '@/lib/canvas';

const MUTED = [140, 139, 134];
const ACCENT = [56, 168, 255];
const WAVE_SPEED = 520;
const WAVE_BAND = 80;
const WAVE_LIFE = 2.2;

/**
 * A grid of dots filling its parent. Dots near the pointer swell, brighten and
 * lean away from it; clicks, taps and an occasional ambient pulse send rings
 * rippling across the grid. Meant to sit behind a section's content.
 */
export function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host || prefersReducedMotion()) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1, spacing = 28;
    let gx = new Float32Array(0), gy = gx;
    const pointer = { x: -1e4, y: -1e4, active: false };
    const waves: { x: number; y: number; t: number }[] = [];
    let start = 0;
    let nextAuto = 0.6;

    const resize = () => {
      W = host.offsetWidth;
      H = host.offsetHeight;
      dpr = fitCanvas(canvas, W, H);
      spacing = W < 640 ? 22 : 28;
      const cols = Math.ceil(W / spacing) + 1;
      const rows = Math.ceil(H / spacing) + 1;
      gx = new Float32Array(cols * rows);
      gy = new Float32Array(cols * rows);
      const ox = (W - (cols - 1) * spacing) / 2;
      const oy = (H - (rows - 1) * spacing) / 2;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          gx[r * cols + c] = ox + c * spacing;
          gy[r * cols + c] = oy + r * spacing;
        }
    };

    const frame = (t: number) => {
      if (!start) start = t;
      const el = (t - start) / 1000;
      if (el > nextAuto) {
        waves.push({ x: W * (0.15 + Math.random() * 0.7), y: H * (0.2 + Math.random() * 0.6), t: el });
        nextAuto = el + 3.5 + Math.random() * 2;
      }
      for (let w = waves.length - 1; w >= 0; w--) if (el - waves[w].t > WAVE_LIFE) waves.splice(w, 1);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const R = Math.max(140, Math.min(W, H) * 0.28);
      const base = new Path2D();

      for (let i = 0; i < gx.length; i++) {
        let px = gx[i], py = gy[i];
        let energy = 0;

        if (pointer.active) {
          const dx = px - pointer.x, dy = py - pointer.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          if (d < R) {
            const f = 1 - d / R;
            energy += f * f;
            px += (dx / d) * f * f * 22;
            py += (dy / d) * f * f * 22;
          }
        }
        for (let w = 0; w < waves.length; w++) {
          const wave = waves[w];
          const age = el - wave.t;
          const dx = gx[i] - wave.x, dy = gy[i] - wave.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const off = Math.abs(d - age * WAVE_SPEED);
          if (off < WAVE_BAND) {
            const k = (1 - off / WAVE_BAND) * (1 - age / WAVE_LIFE);
            energy += k * 0.9;
            px += (dx / d) * k * 8;
            py += (dy / d) * k * 8;
          }
        }

        if (energy < 0.02) {
          base.rect(px - 0.75, py - 0.75, 1.5, 1.5);
        } else {
          const e = Math.min(1, energy);
          const r = 0.9 + e * 2.6;
          const c = MUTED.map((m, j) => Math.round(m + (ACCENT[j] - m) * e));
          ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${0.35 + e * 0.65})`;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.fillStyle = 'rgba(140,139,134,0.28)';
      ctx.fill(base);
      return true;
    };
    const loop = createLoop(frame);

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, inside: e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom };
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.active = p.inside;
    };
    const onDown = (e: PointerEvent) => {
      const p = local(e);
      if (p.inside) waves.push({ x: p.x, y: p.y, t: (performance.now() - start) / 1000 });
    };
    const onLeave = () => (pointer.active = false);

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    const stopVisibility = watchVisibility(host, (v) => loop.setAllowed(v));

    return () => {
      loop.stop();
      stopVisibility();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]"
    />
  );
}
