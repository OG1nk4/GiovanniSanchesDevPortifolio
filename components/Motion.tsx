'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { CursorTrail } from './CursorTrail';

gsap.registerPlugin(ScrollTrigger, SplitText);

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>';
const glyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
const EXPO = 'expo.out';

/**
 * Decodes each target from random glyphs back to its original character,
 * roughly left to right. Works on a single element (its text) or on a list
 * of one-character spans.
 */
function scramble(targets: HTMLElement[], duration = 1) {
  const finals = targets.map((el) => (el.dataset.final ??= el.textContent ?? ''));
  const single = targets.length === 1;
  const chars = single ? [...finals[0]] : finals;
  const settle = chars.map((_, i) => (i / Math.max(chars.length - 1, 1)) * 0.7 + Math.random() * 0.3);
  const state = { p: 0 };
  let frame = 0;
  const render = (done: boolean) => {
    const out = chars.map((c, i) => (done || c === ' ' || state.p >= settle[i] ? c : glyph()));
    if (single) targets[0].textContent = out.join('');
    else targets.forEach((el, i) => (el.textContent = out[i]));
  };
  return gsap.to(state, {
    p: 1,
    duration,
    ease: 'none',
    onUpdate: () => {
      // Swap glyphs every other frame so it reads as decoding, not flicker.
      if (frame++ % 2 === 0) render(false);
    },
    onComplete: () => render(true),
  });
}

function setupHero() {
  const tl = gsap.timeline({ defaults: { ease: EXPO } });

  const lead = document.querySelector<HTMLElement>('[data-hero-lead]');
  const leadLines = lead ? SplitText.create(lead, { type: 'lines', mask: 'lines' }).lines : [];
  // The lines are masked individually, so the paragraph itself can be shown.
  if (lead) gsap.set(lead, { autoAlpha: 1 });

  tl.fromTo('[data-header]', { yPercent: -100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.2 }, 0)
    .fromTo('[data-hero-kicker]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1 }, 0.15)
    .fromTo('[data-hero-rule]', { scaleX: 0, autoAlpha: 1 }, { scaleX: 1, duration: 1.6, ease: 'expo.inOut' }, 0.6)
    .fromTo(leadLines, { yPercent: 100 }, { yPercent: 0, duration: 1.2, stagger: 0.08 }, 0.9)
    .fromTo('[data-hero-fade]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.1 }, 1.05);

  // As the hero leaves, the name drifts up and the whole block fades back.
  gsap.to('[data-hero-name]', {
    yPercent: -25,
    ease: 'none',
    scrollTrigger: { trigger: '[data-hero-section]', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('[data-hero-inner]', {
    autoAlpha: 0.15,
    ease: 'none',
    scrollTrigger: { trigger: '[data-hero-section]', start: 'center top', end: 'bottom top', scrub: true },
  });
}

function setupReveals() {
  const onEnter = (el: Element, start = 'top 88%') => ({ trigger: el, start, once: true });

  gsap.utils.toArray<HTMLElement>('[data-anim="up"]').forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 48 },
      { autoAlpha: 1, y: 0, duration: 1.3, ease: EXPO, delay: Number(el.dataset.delay ?? 0), scrollTrigger: onEnter(el) },
    );
  });

  gsap.utils.toArray<HTMLElement>('[data-anim="line"]').forEach((el) => {
    gsap.fromTo(
      el,
      { scaleX: 0, autoAlpha: 1, transformOrigin: 'left center' },
      { scaleX: 1, duration: 1.8, ease: 'expo.inOut', scrollTrigger: onEnter(el, 'top 95%') },
    );
  });

  gsap.utils.toArray<HTMLElement>('[data-anim="stagger"]').forEach((el) => {
    gsap.set(el, { autoAlpha: 1 });
    gsap.fromTo(
      el.children,
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: 1, ease: EXPO, stagger: 0.05, scrollTrigger: onEnter(el) },
    );
  });

  gsap.utils.toArray<HTMLElement>('[data-anim="lines"]').forEach((el) => {
    const { lines } = SplitText.create(el, { type: 'lines', mask: 'lines' });
    gsap.set(el, { autoAlpha: 1 });
    gsap.fromTo(
      lines,
      { yPercent: 105 },
      { yPercent: 0, duration: 1.4, ease: EXPO, stagger: 0.1, scrollTrigger: onEnter(el) },
    );
  });

  // Paragraphs light up word by word as they scroll through the viewport.
  gsap.utils.toArray<HTMLElement>('[data-anim="words"]').forEach((el) => {
    const { words } = SplitText.create(el, { type: 'words' });
    gsap.set(el, { autoAlpha: 1 });
    gsap.fromTo(
      words,
      { opacity: 0.12 },
      { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: true } },
    );
  });

  // Image revealed by a rising mask, then keeps a slow parallax inside it.
  gsap.utils.toArray<HTMLElement>('[data-anim="clip"]').forEach((el) => {
    const img = el.querySelector<HTMLElement>('[data-media]') ?? el.querySelector('img');
    gsap.fromTo(
      el,
      { clipPath: 'inset(100% 0% 0% 0%)', autoAlpha: 1 },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'expo.inOut', scrollTrigger: onEnter(el, 'top 80%') },
    );
    if (img) {
      gsap.fromTo(img, { scale: 1.35 }, { scale: 1.1, duration: 2.2, ease: EXPO, scrollTrigger: onEnter(el, 'top 80%') });
      gsap.fromTo(
        img,
        { yPercent: -6 },
        { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    }
  });

  // Giant footer wordmark assembles letter by letter while you reach the end.
  gsap.utils.toArray<HTMLElement>('[data-anim="chars-scrub"]').forEach((el) => {
    const { chars } = SplitText.create(el, { type: 'chars', mask: 'chars' });
    gsap.set(el, { autoAlpha: 1 });
    gsap.fromTo(
      chars,
      { yPercent: 110 },
      { yPercent: 0, ease: 'none', stagger: 0.06, scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } },
    );
  });

  gsap.utils.toArray<HTMLElement>('[data-scramble]').forEach((el) => {
    ScrollTrigger.create({ ...onEnter(el, 'top 85%'), onEnter: () => scramble([el], 1.1) });
  });
}

function setupChrome() {
  gsap.fromTo(
    '[data-progress]',
    { scaleX: 0 },
    { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } },
  );

  // Header slides away while reading down and comes back on the way up.
  const header = document.querySelector('[data-header]');
  if (header) {
    ScrollTrigger.create({
      start: 'top -160',
      end: 'max',
      onUpdate: (self) =>
        gsap.to(header, { yPercent: self.direction === 1 ? -100 : 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' }),
      onLeaveBack: () => gsap.to(header, { yPercent: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' }),
    });
  }

  // Marquee: constant drift that speeds up with scroll velocity.
  gsap.utils.toArray<HTMLElement>('[data-marquee]').forEach((track) => {
    const loop = gsap.to(track, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
    ScrollTrigger.create({
      trigger: track,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const boost = gsap.utils.clamp(1, 8, 1 + Math.abs(self.getVelocity()) / 250);
        gsap.timeline()
          .to(loop, { timeScale: boost, duration: 0.2, overwrite: true })
          .to(loop, { timeScale: 1, duration: 1.2, ease: 'power2.out' });
      },
    });
  });
}

function setupPointer(cursor: HTMLElement | null) {
  const cleanups: (() => void)[] = [];

  gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * 0.3);
      y((e.clientY - (r.top + r.height / 2)) * 0.4);
    };
    const leave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)', overwrite: true });
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    });
  });

  if (cursor) {
    gsap.set(cursor, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const cx = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3.out' });
    const cy = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3.out' });
    let hovering = false;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      cx(e.clientX);
      cy(e.clientY);
      const interactive = e.target instanceof Element && !!e.target.closest('a, button, [data-cursor]');
      if (interactive !== hovering) {
        hovering = interactive;
        gsap.to(cursor, { scale: interactive ? 2.4 : 1, duration: 0.5, ease: 'power3.out' });
      }
      gsap.to(cursor, { autoAlpha: 1, duration: 0.3, overwrite: 'auto' });
    };
    const out = () => gsap.to(cursor, { autoAlpha: 0, duration: 0.3 });
    const down = () => gsap.to(cursor, { scale: hovering ? 2 : 0.7, duration: 0.2 });
    const up = () => gsap.to(cursor, { scale: hovering ? 2.4 : 1, duration: 0.4, ease: 'back.out(3)' });
    window.addEventListener('pointermove', move);
    document.documentElement.addEventListener('pointerleave', out);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    cleanups.push(() => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', out);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    });
  }

  return () => cleanups.forEach((fn) => fn());
}

/**
 * Wires every scroll and pointer animation on the page. Elements opt in with
 * data attributes (data-anim, data-scramble, data-magnetic…), so the page
 * itself stays a server component. Under prefers-reduced-motion nothing runs
 * and the content is simply shown.
 */
export function Motion() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const ready = () => root.classList.add('motion-ready');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ready();
      return;
    }

    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 } });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    let ctx: gsap.Context | undefined;
    let removePointer: (() => void) | undefined;
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        setupHero();
        setupReveals();
        setupChrome();
        if (window.matchMedia('(pointer: fine)').matches) removePointer = setupPointer(cursorRef.current);
      });
      ready();
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      removePointer?.();
      ctx?.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <CursorTrail />
      <div
        data-progress
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left scale-x-0 bg-accent"
      />
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden size-4 rounded-full bg-fg mix-blend-difference pointer-fine:block"
        style={{ opacity: 0 }}
      />
    </>
  );
}
