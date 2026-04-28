import React, { useState, useEffect, useRef } from 'react';
import { I18N } from './data.js';
import { Icon } from './icons.jsx';
import { Hero } from './hero.jsx';
import { About, StackSection, Projects, Services, Education, Contact } from './sections.jsx';
import { TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakSlider, useTweaks } from './tweaks-panel.jsx';

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

function MatrixRain({ density = 0.6 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハ{}<>/=*+-";
    let drops = [];
    let cols = 0;
    const fontSize = 14;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / fontSize);
      drops = Array(cols).fill(0).map(() => Math.random() * -50);
    };
    resize();
    window.addEventListener('resize', resize);

    const speed = clamp(density, 0.1, 1.5);
    const draw = () => {
      ctx.fillStyle = "rgba(3,6,13,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;
      for (let i = 0; i < drops.length; i++) {
        const txt = chars[Math.floor(Math.random() * chars.length)];
        const y = drops[i] * fontSize;
        const grad = y / canvas.height;
        ctx.fillStyle = `hsla(195, 100%, ${50 + (1-grad)*30}%, ${0.5 + (1-grad)*0.5})`;
        ctx.fillText(txt, i * fontSize, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += speed * 0.6;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [density]);
  return <canvas id="matrix-bg" ref={ref}></canvas>;
}

function Nav({ lang, setLang, theme, setTheme }) {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const n = I18N[lang].nav;
  const links = [
    { href: '#about', label: n.about },
    { href: '#stack', label: n.stack },
    { href: '#work', label: n.work },
    { href: '#services', label: n.services },
    { href: '#contact', label: n.contact },
  ];
  return (
    <>
      <nav className={`nav ${compact ? 'compact' : ''}`}>
        <a href="#home" className="nav-brand">
          <span className="logo-mark">GS</span>
          <span>GIOVANNI SANCHES</span>
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
  "heroStyle": "terminal",
  "particleDensity": 0.6,
  "matrixOn": true
}/*EDITMODE-END*/;

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('gs_lang') || 'pt');
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const theme = tweaks.theme;

  useEffect(() => { localStorage.setItem('gs_lang', lang); }, [lang]);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  // viewport height var for mobile
  useEffect(() => {
    const set = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  return (
    <>
      {tweaks.matrixOn && <MatrixRain density={tweaks.particleDensity} />}
      <div className="grain"></div>
      <Nav lang={lang} setLang={setLang} theme={theme} setTheme={(v) => setTweak('theme', v)} />
      <main>
        <Hero lang={lang} heroStyle={tweaks.heroStyle} />
        <About lang={lang} />
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
              { value: 'dark', label: lang === 'pt' ? 'Escuro' : 'Dark' },
              { value: 'light', label: lang === 'pt' ? 'Claro' : 'Light' }
            ]}
            onChange={(v) => setTweak('theme', v)}
          />
        </TweakSection>
        <TweakSection title={lang === 'pt' ? 'Hero' : 'Hero'}>
          <TweakRadio
            label={lang === 'pt' ? 'Estilo' : 'Style'}
            value={tweaks.heroStyle}
            options={[
              { value: 'terminal', label: lang === 'pt' ? 'Terminal' : 'Terminal' },
              { value: 'minimal', label: lang === 'pt' ? 'Minimal' : 'Minimal' }
            ]}
            onChange={(v) => setTweak('heroStyle', v)}
          />
        </TweakSection>
        <TweakSection title={lang === 'pt' ? 'Efeitos' : 'Effects'}>
          <TweakToggle
            label={lang === 'pt' ? 'Matrix Rain' : 'Matrix Rain'}
            value={tweaks.matrixOn}
            onChange={(v) => setTweak('matrixOn', v)}
          />
          <TweakSlider
            label={lang === 'pt' ? 'Densidade de partículas' : 'Particle density'}
            value={tweaks.particleDensity}
            min={0.1} max={1.5} step={0.1}
            onChange={(v) => setTweak('particleDensity', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// ReactDOM.render moved to main.jsx
