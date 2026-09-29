'use client';

import { useEffect, useRef, useState } from 'react';
import { LOGO_G, LOGO_S, LOGO_SHADE_DARK, LOGO_SHADE_LIGHT, LOGO_VIEWBOX } from '@/lib/logo-paths';
import './hero-scene.css';

/**
 * The hero "scene": a photo cut-out surrounded by a composition rebuilt in
 * code (animated GS mark, glass panels, circuit lines, digital skyline).
 * Everything reacts to the pointer (or the gyroscope on phones) with layered
 * parallax. Only the portrait is an image.
 */

export type HeroSceneCopy = {
  services: string[];
  phrases: string[];
  metrics: string[];
  photoAlt: string;
};

const CIRCUITS = [
  { d: 'M612 430 L612 300 L640 300', n: [612, 300], delay: 0.9 },
  { d: 'M727 560 L800 560 L800 385', n: [800, 560], delay: 1.1 },
  { d: 'M900 250 L990 250 L990 150 L1060 150', n: [990, 250], delay: 1.2 },
  { d: 'M1388 600 L1352 600 L1352 770 L1322 770', n: [1352, 600], delay: 1.5 },
  { d: 'M1600 0 L1600 160 L1640 190', n: [1600, 160], delay: 0.6 },
  { d: 'M1330 0 L1330 40 L1296 70 L1296 120', n: [1296, 120], delay: 0.8 },
  { d: 'M1500 941 L1500 875', n: [1500, 875], delay: 1.8 },
  { d: 'M500 941 L500 820 L560 760 L560 700', n: [560, 700], delay: 1.3 },
];

// Light columns of the "digital skyline" (deterministic, so SSR and client match).
const CITY = (() => {
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: 42 }, () => ({
    x: 900 + rnd() * 780,
    w: 6 + rnd() * 40,
    h: 60 + rnd() * 380,
    y: 80 + rnd() * 420,
    accent: rnd() > 0.78,
    o: (0.05 + rnd() * 0.16).toFixed(2),
    t: (3 + rnd() * 5).toFixed(1),
    dl: (-rnd() * 5).toFixed(1),
  }));
})();

const ICONS = [
  'M3 5h18v12H3zM8 21h8M12 17v4',
  'M4 3h16v18H4zM4 9h16M4 15h16M8 6h.01M8 12h.01M8 18h.01',
  'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
];

export function HeroScene({ copy }: { copy: HeroSceneCopy }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const hoverRef = useRef(false);
  const [active, setActive] = useState(0);
  const [ind, setInd] = useState({ y: 0, h: 0 });

  // Services panel: cycles on its own until hovered.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!hoverRef.current) setActive((a) => (a + 1) % copy.services.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [copy.services.length]);

  useEffect(() => {
    const place = () => {
      const el = listRef.current?.children[active + 1] as HTMLElement | undefined;
      if (el) setInd({ y: el.offsetTop, h: el.offsetHeight });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [active]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let alive = true;
    let visible = true;
    const rafs: number[] = [];
    const timers: number[] = [];
    const sleep = (ms: number) => new Promise<void>((r) => timers.push(window.setTimeout(r, ms)));

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '100px' });
    io.observe(root);

    // ---- parallax: pointer, gyroscope and scroll ----
    let tx = 0, ty = 0, mx = 0, my = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 30));
      ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('deviceorientation', onTilt);
    const frame = () => {
      if (!alive) return;
      if (visible) {
        const k = reduced ? 1 : 0.07;
        mx += (tx - mx) * k;
        my += (ty - my) * k;
        root.style.setProperty('--mx', mx.toFixed(4));
        root.style.setProperty('--my', my.toFixed(4));
        root.style.setProperty('--sy', Math.min(window.scrollY, window.innerHeight).toFixed(1));
      }
      rafs[0] = requestAnimationFrame(frame);
    };
    rafs[0] = requestAnimationFrame(frame);

    // ---- live chart ----
    const line = root.querySelector<SVGPathElement>('.hs-chart-line')!;
    const area = root.querySelector<SVGPathElement>('.hs-chart-area')!;
    const dot = root.querySelector<SVGCircleElement>('.hs-chart-dot')!;
    const N = 8, W = 160, H = 80, t0 = performance.now();
    const base = (i: number) => H - 10 - (i / (N - 1)) * 55;
    let pts = Array.from({ length: N }, (_, i) => base(i) + 10);
    let goal = pts.slice();
    let drawn = 0;
    const newGoal = () => {
      goal = goal.map((_, i) => base(i) + (Math.random() - 0.5) * 22 * (i === N - 1 ? 0.3 : 1));
    };
    newGoal();
    const gi = window.setInterval(newGoal, 2600);
    const xs = (i: number) => (i / (N - 1)) * W;
    const chart = (now: number) => {
      if (!alive) return;
      if (visible) {
        if (now - t0 > 2200) drawn = Math.min(1, drawn + 0.02);
        pts = pts.map((v, i) => v + (goal[i] - v) * 0.04);
        const shown = pts.map((v, i) => (i / (N - 1) <= drawn ? v : pts[Math.floor(drawn * (N - 1))]));
        let d = `M0 ${shown[0]}`;
        for (let i = 1; i < N; i++) {
          const cx = (xs(i - 1) + xs(i)) / 2;
          d += ` C${cx} ${shown[i - 1]} ${cx} ${shown[i]} ${xs(i)} ${shown[i]}`;
        }
        line.setAttribute('d', d);
        area.setAttribute('d', `${d} L${W} ${H} L0 ${H}Z`);
        area.style.opacity = String(drawn);
        dot.setAttribute('cx', String(drawn * W));
        dot.setAttribute('cy', String(shown[N - 1]));
      }
      rafs[1] = requestAnimationFrame(chart);
    };
    rafs[1] = requestAnimationFrame(chart);

    // ---- code window typing ----
    const pre = root.querySelector<HTMLElement>('.hs-code-pre')!;
    const nums = root.querySelector<HTMLElement>('.hs-code-nums')!;
    const caret = Object.assign(document.createElement('span'), { className: 'hs-caret' });
    type Tok = [string, string, boolean?];
    const lines: Tok[][] = [
      [['k', 'import '], ['p', '{ '], ['x', 'useState'], ['p', ' } '], ['k', 'from '], ['s', "'react'"]],
      [],
      [['k', 'export default function '], ['f', 'Hero'], ['p', '() {']],
      [['k', '  return '], ['p', '(']],
      [['p', '    <'], ['t', 'main '], ['a', 'className'], ['p', '='], ['s', '"min-h-svh"'], ['p', '>']],
      [['p', '      <'], ['t', 'h1'], ['p', '>'], ['x', copy.phrases[0], true], ['p', '</'], ['t', 'h1'], ['p', '>']],
      [['p', '    </'], ['t', 'main'], ['p', '>']],
      [['p', '  )']],
      [['p', '}']],
    ];
    pre.textContent = '';
    nums.textContent = '';
    (async () => {
      let h1: HTMLSpanElement | null = null;
      await sleep(reduced ? 0 : 1600);
      for (let li = 0; li < lines.length && alive; li++) {
        nums.insertAdjacentHTML('beforeend', `${li + 1}<br>`);
        for (const [cls, txt, mark] of lines[li]) {
          const s = document.createElement('span');
          s.className = `hs-${cls}`;
          if (mark) h1 = s;
          pre.appendChild(s);
          s.after(caret);
          for (const ch of txt) {
            if (!alive) return;
            s.textContent += ch;
            if (!reduced) await sleep(ch === ' ' ? 12 : 22 + Math.random() * 28);
          }
        }
        pre.appendChild(document.createTextNode('\n'));
        pre.appendChild(caret);
        if (!reduced) await sleep(90);
      }
      let p = 0;
      while (alive && !reduced && h1) {
        await sleep(3200);
        if (!alive) return;
        h1.after(caret);
        while (alive && h1.textContent!.length) {
          h1.textContent = h1.textContent!.slice(0, -1);
          await sleep(28);
        }
        p = (p + 1) % copy.phrases.length;
        for (const ch of copy.phrases[p]) {
          if (!alive) return;
          h1.textContent += ch;
          await sleep(55 + Math.random() * 40);
        }
      }
    })();

    // ---- terminal loop ----
    const term = root.querySelector<HTMLElement>('.hs-term-out')!;
    (async () => {
      await sleep(reduced ? 0 : 2400);
      const spin = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
      do {
        term.innerHTML = '<span class="hs-prompt">&gt; </span><span class="hs-cmd"></span><span class="hs-caret"></span>';
        const cmd = term.querySelector('.hs-cmd')!;
        for (const ch of 'npm run build') {
          if (!alive) return;
          cmd.textContent += ch;
          await sleep(reduced ? 0 : 80);
        }
        await sleep(350);
        if (!alive) return;
        term.querySelector('.hs-caret')?.remove();
        const l2 = document.createElement('div');
        l2.className = 'hs-dim';
        term.appendChild(l2);
        for (let i = 0; i < (reduced ? 1 : 16) && alive; i++) {
          l2.textContent = `${spin[i % spin.length]} compiling...`;
          await sleep(80);
        }
        l2.outerHTML = '<div class="hs-ok">✓ Compiled successfully</div>';
        await sleep(4500);
      } while (alive && !reduced);
    })();

    return () => {
      alive = false;
      io.disconnect();
      rafs.forEach(cancelAnimationFrame);
      timers.forEach(clearTimeout);
      window.clearInterval(gi);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('deviceorientation', onTilt);
    };
  }, [copy.phrases]);

  return (
    <div ref={rootRef} className="hs-root" aria-hidden="false">
      <div className="hs-floor" aria-hidden="true" />
      <div className="hs-scene">
        <div className="hs-layer hs-city" aria-hidden="true">
          <svg viewBox="0 0 1672 941" preserveAspectRatio="none">
            {CITY.map((r, i) => (
              <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} className={r.accent ? 'hs-city-accent' : ''}
                style={{ '--o': r.o, '--t': `${r.t}s`, '--dl': `${r.dl}s` } as React.CSSProperties} />
            ))}
          </svg>
        </div>

        <div className="hs-layer hs-logo" aria-hidden="true">
          <svg viewBox={LOGO_VIEWBOX}>
            <defs>
              <linearGradient id="hsLogoFill" x1="0" y1="0" x2="0.4" y2="1">
                <stop offset="0" stopColor="#7cc8ff" />
                <stop offset=".5" stopColor="#38a8ff" />
                <stop offset="1" stopColor="#1d6fd6" />
              </linearGradient>
              <clipPath id="hsLogoClip">
                <path d={LOGO_G + LOGO_S} fillRule="evenodd" />
              </clipPath>
              <filter id="hsGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="14" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <g className="hs-logo-glow">
              <g className="hs-logo-g">
                <path className="hs-logo-fill" d={LOGO_G} fillRule="evenodd" />
                <path className="hs-logo-stroke" d={LOGO_G} pathLength={1} />
              </g>
              <g className="hs-logo-s">
                <path className="hs-logo-fill" d={LOGO_S} fillRule="evenodd" />
                <path className="hs-logo-stroke" d={LOGO_S} pathLength={1} />
              </g>
              <g className="hs-logo-shade" clipPath="url(#hsLogoClip)">
                <path d={LOGO_SHADE_LIGHT} fill="#2f9cf0" fillRule="evenodd" opacity=".55" />
                <path d={LOGO_SHADE_DARK} fill="#0b4fa3" fillRule="evenodd" opacity=".7" />
              </g>
            </g>
          </svg>
        </div>

        <div className="hs-layer hs-circuits" aria-hidden="true">
          <svg viewBox="0 0 1672 941" preserveAspectRatio="none">
            <defs>
              <linearGradient id="hsArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#38a8ff" stopOpacity=".35" />
                <stop offset="1" stopColor="#38a8ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {CIRCUITS.map((c, i) => (
              <g key={i}>
                <path className="hs-track" pathLength={1} d={c.d} style={{ '--delay': `${c.delay}s` } as React.CSSProperties} />
                <path className="hs-pulse" pathLength={1} d={c.d}
                  style={{ '--t': `${2.8 + (i % 3) * 0.9}s`, '--dl': `${2 + i * 0.45}s` } as React.CSSProperties} />
                <circle className="hs-node" cx={c.n[0]} cy={c.n[1]} r="4.5" style={{ '--delay': `${c.delay + 1.2}s` } as React.CSSProperties} />
              </g>
            ))}
          </svg>
        </div>

        <div className="hs-layer hs-person">
          <div className="hs-person-glow" aria-hidden="true" />
          <div className="hs-reveal" style={{ '--delay': '.2s' } as React.CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/giovanni-hero.webp" alt={copy.photoAlt} width={520} height={660} fetchPriority="high" />
          </div>
        </div>

        <div className="hs-layer hs-codewin" aria-hidden="true">
          <div className="hs-reveal" style={{ '--delay': '1s' } as React.CSSProperties}>
            <div className="hs-panel">
              <div className="hs-winbar">
                <div className="hs-dots"><i /><i /><i /></div>
                <span className="hs-tab">app.tsx</span>
              </div>
              <div className="hs-code">
                <div className="hs-code-nums" />
                <pre className="hs-code-pre" />
              </div>
            </div>
          </div>
        </div>

        <nav className="hs-layer hs-services" aria-label="Serviços">
          <div className="hs-reveal" style={{ '--delay': '1.2s' } as React.CSSProperties}>
            <div className="hs-panel">
              <ul ref={listRef}>
                <div className="hs-indicator" style={{ transform: `translateY(${ind.y}px)`, height: ind.h }} />
                {copy.services.map((s, i) => (
                  <li key={s} className={i === active ? 'hs-on' : ''}>
                    <a href="#services"
                      onPointerEnter={() => { hoverRef.current = true; setActive(i); }}
                      onPointerLeave={() => { hoverRef.current = false; }}
                      onFocus={() => setActive(i)}>
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={ICONS[i % ICONS.length]} /></svg>
                      {s}
                      <span className="hs-sdot" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        <div className="hs-layer hs-stats" aria-hidden="true">
          <div className="hs-reveal" style={{ '--delay': '1.4s' } as React.CSSProperties}>
            <div className="hs-panel">
              <div className="hs-bars"><i /><i /><i /></div>
              <ul>{copy.metrics.map((m) => <li key={m}>{m}</li>)}</ul>
              <svg className="hs-chart" viewBox="0 0 160 80" preserveAspectRatio="none">
                <path className="hs-chart-area" />
                <path className="hs-chart-line" />
                <circle className="hs-chart-dot" r="4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="hs-layer hs-terminal" aria-hidden="true">
          <div className="hs-reveal" style={{ '--delay': '1.6s' } as React.CSSProperties}>
            <div className="hs-panel">
              <div className="hs-winbar"><div className="hs-dots"><i /><i /><i /></div></div>
              <div className="hs-term-out" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
