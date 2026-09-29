import { useEffect, useRef, useState } from 'react';
import { I18N } from './data.js';
import './hero-scene.css';

/* =====================================================================
   HERO INTERATIVA — cena recriada em código (só a foto é imagem).
   Todas as classes usam o prefixo gx- para não colidir com styles.css.
   ===================================================================== */

const COPY = {
  pt: {
    chip: 'Disponível para novos projetos',
    sub: 'Desenvolvedor Full-Stack focado em front-end, IA e automação. Transformo ideias em interfaces rápidas, animadas e com código limpo.',
    work: 'Ver Projetos',
    talk: 'Falar Comigo',
    phrases: ['Build. Create. Innovate.', 'Design. Code. Deliver.', 'Ideias → Impacto real.'],
    ideas: ['Ideias', 'Código', 'Impacto Real'],
  },
  en: {
    chip: 'Available for new projects',
    sub: 'Full-Stack developer focused on front-end, AI and automation. I turn ideas into fast, animated interfaces with clean code.',
    work: 'View Projects',
    talk: "Let's Talk",
    phrases: ['Build. Create. Innovate.', 'Design. Code. Deliver.', 'Ideas → Real Impact.'],
    ideas: ['Ideas', 'Code', 'Real Impact'],
  },
};

const SKILLS = [
  { label: 'Frontend', d: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16' },
  { label: 'Backend', d: 'M4 3h16v18H4zM4 9h16M4 15h16M8 6h.01M8 12h.01M8 18h.01' },
  { label: 'UI/UX', d: 'M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3' },
  { label: 'AI & Automation', d: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z' },
  { label: 'Clean Architecture', d: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5' },
];

const CIRCUITS = [
  { d: 'M0 520 L390 700 L390 941', n: [390, 700], delay: 0.4 },
  { d: 'M612 430 L612 300 L640 300', n: [612, 300], delay: 0.9 },
  { d: 'M727 560 L800 560 L800 385', n: [800, 560], delay: 1.1 },
  { d: 'M900 250 L990 250 L990 150 L1060 150', n: [990, 250], delay: 1.2 },
  { d: 'M1388 600 L1352 600 L1352 770 L1322 770', n: [1352, 600], delay: 1.5 },
  { d: 'M1600 0 L1600 160 L1640 190', n: [1600, 160], delay: 0.6 },
  { d: 'M1330 0 L1330 40 L1296 70 L1296 120', n: [1296, 120], delay: 0.8 },
  { d: 'M1500 941 L1500 875', n: [1500, 875], delay: 1.8 },
  { d: 'M470 941 L470 820 L540 760 L540 700', n: [540, 700], delay: 1.3 },
];

// colunas de luz da "cidade digital" (geradas uma vez, determinísticas)
const CITY = (() => {
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: 46 }, () => ({
    x: 900 + rnd() * 780, w: 6 + rnd() * 40, h: 60 + rnd() * 380, y: 80 + rnd() * 420,
    fill: rnd() > 0.7 ? '#1fb6ff' : '#0e3a7a',
    o: (0.08 + rnd() * 0.25).toFixed(2), t: (3 + rnd() * 5).toFixed(1), dl: (-rnd() * 5).toFixed(1),
  }));
})();

const G_PATH = 'M300 70 H220 A150 150 0 0 0 220 370 H250 L272 260 H190';
const S_PATH = 'M420 180 H330 A48 48 0 0 0 330 276 H360 A48 48 0 0 1 360 372 H240';

// Espera a IntroScreen (div fixa com z-index 9999) sair antes de animar
function waitForIntro(cb) {
  const start = Date.now();
  const check = () => {
    const intro = [...document.querySelectorAll('#root div')].some(d => {
      const s = d.style;
      return (s.position === 'fixed' && String(s.zIndex) === '9999') ||
        (d.childElementCount < 40 && getComputedStyle(d).position === 'fixed' && getComputedStyle(d).zIndex === '9999');
    });
    if (!intro || Date.now() - start > 12000) cb(); else setTimeout(check, 200);
  };
  check();
}

export function Hero({ lang }) {
  const t = I18N[lang]?.hero || {};
  const c = COPY[lang] || COPY.pt;
  const rootRef = useRef(null);
  const [play, setPlay] = useState(false);
  const [active, setActive] = useState(0);
  const hoverRef = useRef(false);
  const langRef = useRef(c);
  langRef.current = c;

  // 1) espera a intro
  useEffect(() => { let alive = true; waitForIntro(() => alive && setPlay(true)); return () => { alive = false; }; }, []);

  // 2) skills: troca automática
  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => { if (!hoverRef.current) setActive(a => (a + 1) % SKILLS.length); }, 2200);
    return () => clearInterval(id);
  }, [play]);

  // 3) parallax, gráfico, digitação e terminal
  useEffect(() => {
    if (!play) return;
    const root = rootRef.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let alive = true;
    const rafs = [];
    const timers = [];
    const sleep = ms => new Promise(r => timers.push(setTimeout(r, ms)));

    // ---- parallax (mouse, giroscópio, scroll) ----
    let tx = 0, ty = 0, mx = 0, my = 0;
    const onMove = e => {
      tx = (e.clientX / innerWidth) * 2 - 1; ty = (e.clientY / innerHeight) * 2 - 1;
      const r = root.getBoundingClientRect();
      root.style.setProperty('--px', `${e.clientX - r.left}px`);
      root.style.setProperty('--py', `${e.clientY - r.top}px`);
    };
    const onTilt = e => {
      if (e.gamma == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 30)); ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    };
    addEventListener('pointermove', onMove);
    addEventListener('deviceorientation', onTilt);
    const frame = () => {
      if (!alive) return;
      const k = reduced ? 1 : 0.07;
      mx += (tx - mx) * k; my += (ty - my) * k;
      root.style.setProperty('--mx', mx.toFixed(4));
      root.style.setProperty('--my', my.toFixed(4));
      root.style.setProperty('--sy', Math.min(scrollY, innerHeight).toFixed(1));
      rafs[0] = requestAnimationFrame(frame);
    };
    rafs[0] = requestAnimationFrame(frame);

    // ---- gráfico "vivo" ----
    const line = root.querySelector('.gx-chart-line'), area = root.querySelector('.gx-chart-area'), dot = root.querySelector('.gx-chart-dot');
    const N = 8, W = 160, H = 80, t0 = performance.now();
    const base = i => H - 10 - (i / (N - 1)) * 55;
    let pts = Array.from({ length: N }, (_, i) => base(i) + 10), goal = pts.slice(), drawn = 0;
    const newGoal = () => { goal = goal.map((_, i) => base(i) + (Math.random() - 0.5) * 22 * (i === N - 1 ? 0.3 : 1)); };
    newGoal(); const gi = setInterval(newGoal, 2600);
    const xs = i => (i / (N - 1)) * W;
    const chart = now => {
      if (!alive) return;
      if (now - t0 > 1400) drawn = Math.min(1, drawn + 0.02);
      pts = pts.map((v, i) => v + (goal[i] - v) * 0.04);
      const shown = pts.map((v, i) => (i / (N - 1)) <= drawn ? v : pts[Math.floor(drawn * (N - 1))]);
      let d = `M0 ${shown[0]}`;
      for (let i = 1; i < N; i++) { const cx = (xs(i - 1) + xs(i)) / 2; d += ` C${cx} ${shown[i - 1]} ${cx} ${shown[i]} ${xs(i)} ${shown[i]}`; }
      line.setAttribute('d', d); area.setAttribute('d', `${d} L${W} ${H} L0 ${H}Z`); area.style.opacity = drawn;
      dot.setAttribute('cx', drawn * W); dot.setAttribute('cy', shown[N - 1]);
      rafs[1] = requestAnimationFrame(chart);
    };
    rafs[1] = requestAnimationFrame(chart);

    // ---- janela de código ----
    const pre = root.querySelector('.gx-code-pre'), nums = root.querySelector('.gx-code-nums');
    const caret = Object.assign(document.createElement('span'), { className: 'gx-caret' });
    const L = (...tk) => tk;
    const lines = [
      L(['k', 'import '], ['p', '{ '], ['x', 'useState'], ['p', ' } '], ['k', 'from '], ['s', "'react'"]),
      L(),
      L(['k', 'export default function '], ['f', 'Hero'], ['p', '() {']),
      L(['k', '  return '], ['p', '(']),
      L(['p', '    <'], ['t', 'div '], ['a', 'className'], ['p', '='], ['s', '"min-h-screen"'], ['p', '>']),
      L(['p', '      <'], ['t', 'h1'], ['p', '>'], ['x', langRef.current.phrases[0], 'h1'], ['p', '</'], ['t', 'h1'], ['p', '>']),
      L(['p', '    </'], ['t', 'div'], ['p', '>']),
      L(['p', '  )']),
      L(['p', '}']),
    ];
    pre.textContent = ''; nums.textContent = '';
    (async () => {
      let h1 = null;
      await sleep(reduced ? 0 : 1300);
      for (let li = 0; li < lines.length && alive; li++) {
        nums.insertAdjacentHTML('beforeend', `${li + 1}<br>`);
        for (const [cls, txt, id] of lines[li]) {
          const s = document.createElement('span'); s.className = `gx-${cls}`;
          if (id) h1 = s;
          pre.appendChild(s); s.after(caret);
          for (const ch of txt) { if (!alive) return; s.textContent += ch; if (!reduced) await sleep(ch === ' ' ? 12 : 22 + Math.random() * 28); }
        }
        pre.appendChild(document.createTextNode('\n')); pre.appendChild(caret);
        if (!reduced) await sleep(90);
      }
      let p = 0;
      while (alive && !reduced) {
        await sleep(3200); if (!alive) return;
        h1.after(caret);
        while (alive && h1.textContent.length) { h1.textContent = h1.textContent.slice(0, -1); await sleep(28); }
        const ph = langRef.current.phrases; p = (p + 1) % ph.length;
        for (const ch of ph[p]) { if (!alive) return; h1.textContent += ch; await sleep(55 + Math.random() * 40); }
      }
    })();

    // ---- terminal ----
    const term = root.querySelector('.gx-term-out');
    (async () => {
      await sleep(reduced ? 0 : 2000);
      const spin = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
      do {
        term.innerHTML = '<span class="gx-prompt">&gt; </span><span class="gx-cmd"></span><span class="gx-caret"></span>';
        const cmd = term.querySelector('.gx-cmd');
        for (const ch of 'npm run dev') { if (!alive) return; cmd.textContent += ch; await sleep(reduced ? 0 : 80); }
        await sleep(350); if (!alive) return;
        term.querySelector('.gx-caret')?.remove();
        const l2 = document.createElement('div'); l2.className = 'gx-dim'; term.appendChild(l2);
        for (let i = 0; i < (reduced ? 1 : 16) && alive; i++) { l2.textContent = `${spin[i % spin.length]} compiling...`; await sleep(80); }
        l2.outerHTML = '<div class="gx-ok">✓ Compiled successfully!</div>';
        await sleep(4500);
      } while (alive && !reduced);
    })();

    // ---- botões magnéticos ----
    const mags = [...root.querySelectorAll('.gx-magnetic')];
    const mm = e => { const b = e.currentTarget, r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`; };
    const ml = e => { const b = e.currentTarget; b.style.transition = 'transform .5s cubic-bezier(.3,1.6,.4,1)'; b.style.transform = ''; timers.push(setTimeout(() => { b.style.transition = ''; }, 500)); };
    mags.forEach(b => { b.addEventListener('pointermove', mm); b.addEventListener('pointerleave', ml); });

    return () => {
      alive = false;
      rafs.forEach(cancelAnimationFrame); timers.forEach(clearTimeout); clearInterval(gi);
      removeEventListener('pointermove', onMove); removeEventListener('deviceorientation', onTilt);
      mags.forEach(b => { b.removeEventListener('pointermove', mm); b.removeEventListener('pointerleave', ml); });
    };
  }, [play]);

  // posição do indicador das skills
  const skillsRef = useRef(null);
  const [ind, setInd] = useState({ y: 0, h: 0 });
  useEffect(() => {
    const place = () => {
      const el = skillsRef.current?.children[active + 1];
      if (el) setInd({ y: el.offsetTop, h: el.offsetHeight });
    };
    place();
    addEventListener('resize', place);
    return () => removeEventListener('resize', place);
  }, [active, play]);

  return (
    <section className={`gx-hero ${play ? 'gx-play' : ''}`} id="home" ref={rootRef}>
      <div className="gx-spotlight" />
      <div className="gx-floor" />

      {/* ---------- TEXTO ---------- */}
      <div className="gx-copy">
        <span className="gx-chip gx-in" style={{ '--delay': '.2s' }}><i />{c.chip}</span>
        <h1 className="gx-title">
          <span className="gx-line"><span style={{ '--delay': '.35s' }}>GIOVANNI</span></span>
          <span className="gx-line"><span className="gx-grad" style={{ '--delay': '.5s' }}>SANCHES</span></span>
        </h1>
        <p className="gx-role gx-in" style={{ '--delay': '.7s' }}>{t.role || 'FULL-STACK · AI · AUTOMATION'}</p>
        <p className="gx-sub gx-in" style={{ '--delay': '.85s' }}>{c.sub}</p>
        <div className="gx-ctas gx-in" style={{ '--delay': '1s' }}>
          <a href="#work" className="gx-btn gx-btn--primary gx-magnetic">{c.work}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg></a>
          <a href="#contact" className="gx-btn gx-btn--ghost gx-magnetic">{c.talk}</a>
        </div>
        <div className="gx-socials gx-in" style={{ '--delay': '1.15s' }}>
          <a href="https://github.com/OG1nk4" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z" /></svg>GitHub</a>
          <a href="https://linkedin.com/in/giovanni-sanches-9b3371348/" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.5V9h3.6v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z" /></svg>LinkedIn</a>
        </div>
      </div>

      {/* ---------- CENA ---------- */}
      <div className="gx-scene-wrap">
        <div className="gx-scene">
          <div className="gx-layer gx-city">
            <svg viewBox="0 0 1672 941" preserveAspectRatio="none">
              {CITY.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} style={{ '--o': r.o, '--t': `${r.t}s`, '--dl': `${r.dl}s` }} />)}
              {[[1618, 330, 26, 50], [1640, 560, 30, 110], [1600, 700, 40, 26], [1630, 420, 18, 90]].map(([x, y, w, h], i) =>
                <rect key={`b${i}`} x={x} y={y} width={w} height={h} rx="2" fill="#3fbcff" style={{ '--o': 0.6, filter: 'drop-shadow(0 0 10px #1fb6ff)' }} />)}
            </svg>
          </div>

          <div className="gx-layer gx-logo">
            <div className="gx-reveal" style={{ '--delay': '.5s' }}>
              <svg viewBox="0 0 460 460">
                <defs>
                  <linearGradient id="gxGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#8fdcff" /><stop offset=".45" stopColor="#1fb6ff" /><stop offset="1" stopColor="#0b3a8c" />
                  </linearGradient>
                  <filter id="gxNeon" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <g transform="skewX(-12) translate(60 0)" className="gx-logo-glow">
                  <path className="gx-logo-stroke" pathLength="1" d={G_PATH} />
                  <path className="gx-logo-stroke" pathLength="1" d={S_PATH} />
                  <path className="gx-logo-edge" pathLength="1" d={G_PATH} />
                  <path className="gx-logo-edge" pathLength="1" d={S_PATH} />
                </g>
              </svg>
            </div>
          </div>

          <div className="gx-layer gx-circuits">
            <svg viewBox="0 0 1672 941" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gxArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1fb6ff" stopOpacity=".45" /><stop offset="1" stopColor="#1fb6ff" stopOpacity="0" /></linearGradient>
              </defs>
              {CIRCUITS.map((cc, i) => (
                <g key={i}>
                  <path className="gx-track" pathLength="1" d={cc.d} style={{ '--delay': `${cc.delay}s` }} />
                  <path className="gx-pulse" pathLength="1" d={cc.d} style={{ '--t': `${2.8 + (i % 3) * 0.9}s`, '--dl': `${2 + i * 0.45}s` }} />
                  <circle className="gx-node" cx={cc.n[0]} cy={cc.n[1]} r="5" style={{ '--delay': `${cc.delay + 1.2}s` }} />
                </g>
              ))}
            </svg>
          </div>

          <div className="gx-layer gx-person">
            <div className="gx-person-glow" />
            <div className="gx-reveal" style={{ '--delay': '.3s' }}>
              <img src="/giovanni-hero.webp" alt="Giovanni Sanches" width="520" height="660" />
            </div>
          </div>

          <div className="gx-layer gx-codewin">
            <div className="gx-reveal" style={{ '--delay': '1.1s' }}>
              <div className="gx-panel">
                <div className="gx-winbar"><div className="gx-dots"><i /><i /><i /></div><span className="gx-tab"><b>⚛</b> app.tsx ×</span></div>
                <div className="gx-code"><div className="gx-code-nums" /><pre className="gx-code-pre" /></div>
              </div>
            </div>
          </div>

          <div className="gx-layer gx-skills">
            <div className="gx-reveal" style={{ '--delay': '1.3s' }}>
              <div className="gx-panel">
                <ul ref={skillsRef}>
                  <div className="gx-indicator" style={{ transform: `translateY(${ind.y}px)`, height: ind.h }} />
                  {SKILLS.map((s, i) => (
                    <li key={s.label} className={i === active ? 'gx-on' : ''}
                      onPointerEnter={() => { hoverRef.current = true; setActive(i); }}
                      onPointerLeave={() => { hoverRef.current = false; }}>
                      <svg viewBox="0 0 24 24"><path d={s.d} /></svg>{s.label}<span className="gx-sdot" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="gx-layer gx-stats">
            <div className="gx-reveal" style={{ '--delay': '1.5s' }}>
              <div className="gx-panel">
                <div className="gx-bars"><i /><i /><i /></div>
                <ul>{c.ideas.map(x => <li key={x}>{x}</li>)}</ul>
                <svg className="gx-chart" viewBox="0 0 160 80" preserveAspectRatio="none">
                  <path className="gx-chart-area" /><path className="gx-chart-line" /><circle className="gx-chart-dot" r="4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="gx-layer gx-terminal">
            <div className="gx-reveal" style={{ '--delay': '1.7s' }}>
              <div className="gx-panel">
                <div className="gx-winbar"><div className="gx-dots"><i /><i /><i /></div></div>
                <div className="gx-term-out" />
              </div>
            </div>
          </div>

          <div className="gx-layer gx-rocks">
            <svg viewBox="0 0 400 260">
              <defs><linearGradient id="gxRock" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0d1a2e" /><stop offset="1" stopColor="#010307" /></linearGradient></defs>
              <path d="M0 60 L60 20 L120 50 L150 110 L210 130 L260 190 L330 210 L400 260 L0 260Z" fill="url(#gxRock)" />
              <path d="M0 60 L60 20 L120 50 L150 110 L210 130 L260 190 L330 210 L400 260" fill="none" stroke="rgba(90,180,255,.35)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>

      <div className="gx-scroll"><span />{t.scroll || 'SCROLL'}</div>
    </section>
  );
}
