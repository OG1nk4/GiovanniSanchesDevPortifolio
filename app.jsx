import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import IntroScreen from './IntroScreen.tsx';
import { I18N } from './data.js';
import { Icon } from './icons.jsx';
import { Hero } from './hero.jsx';
import { About, StackSection, Projects, Services, Education, Contact, TerminalSection } from './sections.jsx';
import { TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakSlider, useTweaks } from './tweaks-panel.jsx';

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

// ─── Particle constellation effect (replaces Matrix Rain) ────────────────────
function ParticleField({ density = 0.6 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const count = Math.round(clamp(density, 0.1, 1.5) * 65);
    let pts = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.4 + 0.4,
        phase: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    // cap at 30fps for GPU efficiency
    let lastT = 0;
    const INTERVAL = 1000 / 30;

    const draw = (ts) => {
      raf = requestAnimationFrame(draw);
      if (ts - lastT < INTERVAL) return;
      lastT = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.025;
        if (p.x < 0) p.x = canvas.width;
        else if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        else if (p.y > canvas.height) p.y = 0;
      }

      // connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140) {
            const a = (1 - Math.sqrt(d2) / 140) * 0.2;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(31,182,255,${a})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const p of pts) {
        const alpha = 0.45 + Math.sin(p.phase) * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(31,182,255,${alpha})`;
        ctx.fill();
      }
    };
    requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [density]);
  return <canvas id="particle-bg" ref={ref} />;
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav({ lang, setLang }) {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const n = I18N[lang].nav;
  const links = [
    { href: '#about',   label: n.about    },
    { href: '#stack',   label: n.stack    },
    { href: '#work',    label: n.work     },
    { href: '#services',label: n.services },
    { href: '#contact', label: n.contact  },
  ];
  return (
    <>
      <nav className={`nav ${compact ? 'compact' : ''}`}>
        <a href="#home" className="nav-brand">
          <img src="/logo-gs.png" alt="Giovanni Sanches" className="nav-logo-img" />
        </a>
        <div className="nav-links">
          {links.map((l, i) => <a key={i} href={l.href}>{l.label}</a>)}
        </div>
        <div className="nav-actions">
          <div className="lang-toggle">
            <button className={lang === 'pt' ? 'active' : ''} onClick={() => setLang('pt')}>PT</button>
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
          </div>
          <a href="#contact" className="nav-cta">{n.cta} <Icon.arrow /></a>
          <button className="nav-burger" onClick={() => setOpen(!open)} aria-label="menu">
            {open ? <Icon.close /> : <Icon.burger />}
          </button>
        </div>
      </nav>
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {links.map((l, i) => (
          <a key={i} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        <a href="#contact" onClick={() => setOpen(false)} style={{ color: 'var(--accent)' }}>{n.cta} →</a>
      </div>
    </>
  );
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "particlesOn": true,
  "particleDensity": 0.6
}/*EDITMODE-END*/;

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('gs_lang') || 'pt');
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const theme = tweaks.theme;

  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('gs_intro_seen'));

  useEffect(() => { localStorage.setItem('gs_lang', lang); }, [lang]);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  useEffect(() => {
    const set = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('gs_intro_seen', 'true');
    setShowIntro(false);
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {tweaks.particlesOn && <ParticleField density={tweaks.particleDensity} />}
      <div className="grain" />
      <Nav lang={lang} setLang={setLang} />
      <main>
        <Hero lang={lang} />
        <About lang={lang} />
        <TerminalSection lang={lang} />
        <StackSection lang={lang} />
        <Projects lang={lang} />
        <Services lang={lang} />
        <Education lang={lang} />
        <Contact lang={lang} />
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection title={lang === 'pt' ? 'Aparência' : 'Appearance'}>
          <TweakRadio
            label={lang === 'pt' ? 'Tema' : 'Theme'}
            value={tweaks.theme}
            options={[
              { value: 'dark',  label: lang === 'pt' ? 'Escuro' : 'Dark'  },
              { value: 'light', label: lang === 'pt' ? 'Claro'  : 'Light' }
            ]}
            onChange={(v) => setTweak('theme', v)}
          />
        </TweakSection>
        <TweakSection title={lang === 'pt' ? 'Efeitos' : 'Effects'}>
          <TweakToggle
            label={lang === 'pt' ? 'Partículas' : 'Particles'}
            value={tweaks.particlesOn}
            onChange={(v) => setTweak('particlesOn', v)}
          />
          <TweakSlider
            label={lang === 'pt' ? 'Densidade' : 'Density'}
            value={tweaks.particleDensity}
            min={0.1} max={1.5} step={0.1}
            onChange={(v) => setTweak('particleDensity', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}
