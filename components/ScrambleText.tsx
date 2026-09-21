'use client';

import { createElement, useEffect, useRef, useState } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>';

type Props = {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span';
  className?: string;
  /** 'mount' runs once on load; 'view' runs once when the element scrolls into view. */
  trigger?: 'mount' | 'view';
  /** Total time, in ms, for the last character to settle. */
  duration?: number;
  delay?: number;
};

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * Renders the final text on the server (good for SEO and no-JS) and "decodes"
 * it from random glyphs on the client. Screen readers get the real text via
 * aria-label; the animated characters are hidden from them.
 */
export function ScrambleText({
  text,
  as = 'span',
  className,
  trigger = 'view',
  duration = 900,
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let timeout = 0;
    const chars = [...text];
    // Each character settles at its own time, roughly left to right.
    const settleAt = chars.map(
      (_, i) => (i / Math.max(chars.length - 1, 1)) * duration * 0.75 + Math.random() * duration * 0.25,
    );

    const run = () => {
      let start = 0;
      let lastSwap = 0;
      const frame = (now: number) => {
        if (!start) start = now;
        const elapsed = now - start;
        // Swap glyphs ~every 45ms instead of every frame so it reads, not flickers.
        if (now - lastSwap > 45) {
          lastSwap = now;
          setDisplay(
            chars
              .map((c, i) => (c === ' ' || elapsed >= settleAt[i] ? c : randomGlyph()))
              .join(''),
          );
        }
        if (elapsed < duration) raf = requestAnimationFrame(frame);
        else setDisplay(text);
      };
      raf = requestAnimationFrame(frame);
    };

    const begin = () => {
      timeout = window.setTimeout(run, delay);
    };

    if (trigger === 'mount') {
      begin();
      return () => {
        clearTimeout(timeout);
        cancelAnimationFrame(raf);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        begin();
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [text, trigger, duration, delay]);

  return createElement(
    as,
    { ref, className, 'aria-label': text },
    <span aria-hidden="true">{display}</span>,
  );
}
