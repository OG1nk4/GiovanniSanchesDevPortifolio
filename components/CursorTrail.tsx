'use client';

import { useEffect, useRef } from 'react';
import { createLoop, fitCanvas, prefersReducedMotion } from '@/lib/canvas';

const LIFE = 420; // ms a point stays in the trail
const MAX_WIDTH = 7;

/**
 * A tapered accent ribbon that trails the mouse across the whole page and
 * fades out when the mouse stops. Only on devices with a real mouse.
 */
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = 1;
    const resize = () => (dpr = fitCanvas(canvas, window.innerWidth, window.innerHeight));
    resize();

    const points: { x: number; y: number; t: number }[] = [];

    const frame = (now: number) => {
      while (points.length && now - points[0].t > LIFE) points.shift();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (points.length < 2) return points.length > 0;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      // Draw segment by segment so width and opacity can taper toward the tail.
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1], b = points[i];
        const life = 1 - (now - b.t) / LIFE;
        const k = (i / points.length) * life;
        ctx.strokeStyle = `rgba(56,168,255,${k * 0.85})`;
        ctx.lineWidth = Math.max(0.5, MAX_WIDTH * k);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      return true;
    };
    const loop = createLoop(frame);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      points.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (points.length > 60) points.shift();
      loop.wake();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', resize);

    return () => {
      loop.stop();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[55] hidden pointer-fine:block"
    />
  );
}
