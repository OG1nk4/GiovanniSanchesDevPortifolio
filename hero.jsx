import { useState, useEffect } from 'react';
import { I18N } from './data.js';

const TAGS = [
  { style: { top: '18%', left: '6%'  }, text: 'TypeScript',   delay: '0.45s' },
  { style: { top: '26%', right: '7%' }, text: 'Next.js',      delay: '0.6s'  },
  { style: { top: '52%', left: '4%'  }, text: 'React',        delay: '0.75s' },
  { style: { top: '60%', right: '5%' }, text: 'Python',       delay: '0.9s'  },
  { style: { top: '76%', left: '9%'  }, text: 'Supabase',     delay: '1.05s' },
  { style: { top: '74%', right: '11%'}, text: 'n8n / Docker', delay: '1.2s'  },
];

export function Hero({ lang }) {
  const t = I18N[lang].hero;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 120);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="hero" id="home">
      {/* Drop assets/intro.mp4 to enable the video background */}
      <video
        className="hero-video"
        autoPlay muted loop playsInline
        poster="/giovanni-portrait.png"
      >
        <source src="assets/intro.mp4" type="video/mp4" />
      </video>

      <div className="hero-overlay" />
      <div className="hero-bg-blob" />
      <div className="hero-grid-overlay" />

      {/* Portrait — decorative, right side */}
      <img
        src="/giovanni-portrait.png"
        alt=""
        aria-hidden="true"
        className={`hero-portrait ${ready ? 'hero-portrait--in' : ''}`}
      />

      {/* Main content */}
      <div className={`hero-content ${ready ? 'hero-content--in' : ''}`}>
        <div className="hero-eyebrow">
          <span className="hero-dot-live" />
          Full Stack Developer · UI/UX Designer
        </div>

        <h1 className="hero-title">
          <span>GIOVANNI</span>
          <span>SANCHES</span>
        </h1>

        <p className="hero-sub">{t.role}</p>

        <div className="hero-ctas">
          <a href="#work" className="btn-primary">
            {lang === 'pt' ? 'Ver Projetos' : 'View Projects'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="#contact" className="btn-outline">
            {lang === 'pt' ? 'Falar Comigo' : "Let's Talk"}
          </a>
        </div>
      </div>

      {/* Floating tech tags */}
      <div className={`hero-tags ${ready ? 'hero-tags--in' : ''}`}>
        {TAGS.map((tag, i) => (
          <div
            key={i}
            className="hero-tag"
            style={{ ...tag.style, transitionDelay: tag.delay }}
          >
            {tag.text}
          </div>
        ))}
      </div>

      <div className="scroll-indicator">
        <span>{t.scroll}</span>
        <span className="line" />
      </div>
    </section>
  );
}
