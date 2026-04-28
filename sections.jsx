import React, { useRef, useEffect } from 'react';
import { I18N } from './data.js';
import { Icon } from './icons.jsx';

export function About({ lang }) {
  const t = I18N[lang].about;
  return (
    <section className="about" id="about">
      <div className="container">
        <span className="eyebrow">{t.eyebrow}</span>
        <h2 className="section-title">{t.title[0]}<em>{t.title[1]}</em></h2>
        <div className="about-grid" style={{ marginTop: 60 }}>
          <div className="about-photo-wrap">
            <div className="photo-glow"></div>
            <img src="assets/giovanni-headshot.jpeg" alt="Giovanni" />
            <div className="about-meta">
              <span>{t.meta_a}</span>
              <span className="pulse">{t.meta_b}</span>
            </div>
          </div>
          <div className="about-body">
            <p dangerouslySetInnerHTML={{ __html: t.p1.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
            <p dangerouslySetInnerHTML={{ __html: t.p2.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
            <div className="about-stats">
              {t.stats.map((s, i) => (
                <div className="about-stat" key={i}>
                  <div className="num">{s.n}</div>
                  <div className="lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StackSection({ lang }) {
  const t = I18N[lang].stack;
  const pills = [
    { name: "TypeScript", icn: "ts" }, { name: "React", icn: "react" },
    { name: "Next.js", icn: "next" }, { name: "Node.js", icn: "node" },
    { name: "Python", icn: "python" }, { name: "Java", icn: "java" },
    { name: "Llama 3 API", icn: "ai" }, { name: "Supabase", icn: "db" },
    { name: "MySQL", icn: "db" }, { name: "Docker", icn: "docker" },
    { name: "n8n", icn: "bolt" }, { name: "Angular", icn: "code" },
  ];
  const doubled = [...pills, ...pills];

  return (
    <section className="stack" id="stack">
      <div className="container">
        <span className="eyebrow">{t.eyebrow}</span>
        <h2 className="section-title">{t.title[0]}<em>{t.title[1]}</em></h2>
        <p style={{ color: 'var(--fg-dim)', fontSize: 18, marginTop: 18, maxWidth: '52ch' }}>{t.sub}</p>

        <div className="stack-grid">
          {t.cats.map((c, i) => (
            <div className="stack-cat" key={i}>
              <div className="stack-cat-num">[{c.num}]</div>
              <div className="stack-cat-title">{c.title}</div>
              <div className="stack-cat-list">
                {c.items.map((it, j) => <span key={j}>{it}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="stack-marquee">
        <div className="marquee-track">
          {doubled.map((p, i) => (
            <div className="stack-pill" key={i}>
              <span className="icn">{Icon[p.icn] ? Icon[p.icn]() : null}</span>
              {p.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Per-project visual canvas — generative shader-ish background
export function ProjectVisual({ idx, hue }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    let t = idx * 100;
    const draw = () => {
      t += 0.6;
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      // gradient bg
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, `hsl(${hue},70%,8%)`);
      grad.addColorStop(1, `hsl(${(hue+30)%360},80%,4%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // grid
      ctx.strokeStyle = `hsla(${hue},80%,60%,0.08)`;
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 30) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
      }
      for (let i = 0; i < h; i += 30) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
      }

      // orbs
      for (let i = 0; i < 3; i++) {
        const x = w/2 + Math.cos(t/100 + i*2) * (w/3);
        const y = h/2 + Math.sin(t/80 + i*1.5) * (h/3);
        const r = 60 + Math.sin(t/60 + i) * 20;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `hsla(${hue + i*20},90%,60%,0.5)`);
        g.addColorStop(1, `hsla(${hue + i*20},90%,60%,0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // accent line
      ctx.strokeStyle = `hsla(${hue},90%,70%,0.6)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const y = h/2 + Math.sin(x/40 + t/30) * 30 + Math.sin(x/20 + t/20) * 12;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [idx, hue]);

  return <canvas ref={ref}></canvas>;
}

export function Projects({ lang }) {
  const t = I18N[lang].projects;
  const railRef = useRef(null);
  const scrollBy = (dir) => {
    if (railRef.current) railRef.current.scrollBy({ left: dir * 504, behavior: 'smooth' });
  };
  const hues = [200, 170, 280, 320, 30, 250];

  return (
    <section className="projects" id="work">
      <div className="container">
        <span className="eyebrow">{t.eyebrow}</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <h2 className="section-title">{t.title[0]}<em>{t.title[1]}</em></h2>
          <p style={{ color: 'var(--fg-dim)', fontSize: 16, maxWidth: '32ch' }}>{t.sub}</p>
        </div>
      </div>

      <div className="projects-rail-wrap">
        <div className="projects-rail" ref={railRef}>
          {t.list.map((p, i) => (
            <article className="proj-card" key={i}>
              <div className="proj-visual">
                <ProjectVisual idx={i} hue={hues[i % hues.length]} />
                <span className="proj-tag">{p.tag}</span>
                <span className="proj-num">/{String(i+1).padStart(2,'0')}</span>
              </div>
              <div className="proj-meta">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="proj-stack">
                  {p.stack.map((s, j) => <span key={j}>{s}</span>)}
                </div>
                <a className="proj-link" href="#">{p.link} <Icon.arrow /></a>
              </div>
            </article>
          ))}
        </div>
        <div className="rail-controls">
          <button className="rail-btn" onClick={() => scrollBy(-1)} aria-label="prev">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button className="rail-btn" onClick={() => scrollBy(1)} aria-label="next">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export function Services({ lang }) {
  const t = I18N[lang].services;
  const icons = ['code', 'brain', 'bolt', 'layout', 'server', 'compass'];
  return (
    <section className="services" id="services">
      <div className="container">
        <span className="eyebrow">{t.eyebrow}</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <h2 className="section-title">{t.title[0]}<em>{t.title[1]}</em></h2>
          <p style={{ color: 'var(--fg-dim)', fontSize: 16, maxWidth: '36ch' }}>{t.sub}</p>
        </div>
        <div className="services-grid">
          {t.list.map((s, i) => {
            const IconC = Icon[icons[i]];
            return (
              <div className="service" key={i}>
                <span className="num">/{s.num}</span>
                <div className="service-icon">{IconC ? IconC() : null}</div>
                <h4>{s.t}</h4>
                <p>{s.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Education({ lang }) {
  const t = I18N[lang].edu;
  return (
    <section className="education" id="education">
      <div className="container">
        <span className="eyebrow">{t.eyebrow}</span>
        <h2 className="section-title">{t.title[0]}<em>{t.title[1]}</em></h2>
        <div className="edu-grid">
          <div className="edu-list">
            {t.list.map((e, i) => (
              <div className="edu-item" key={i}>
                <span className="edu-year">{e.year}</span>
                <div className="edu-info">
                  <h5>{e.t}</h5>
                  <p>{e.p}</p>
                </div>
                <span className={`edu-status ${e.active ? 'active' : ''}`}>{e.status}</span>
              </div>
            ))}
          </div>
          <div className="edu-side">
            <div className="edu-card">
              <h6>{t.langs_title}</h6>
              {t.langs.map((l, i) => (
                <div className="lang-row" key={i}>
                  <span>{l.name}</span>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span className="level">{l.level}</span>
                    <div className="lang-bar"><span style={{ width: `${l.pct}%` }}></span></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="edu-card">
              <h6>{t.tools_title}</h6>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {t.tools.map((tool, i) => (
                  <span key={i} style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12,
                    padding: '6px 12px', border: '1px solid var(--line)',
                    borderRadius: 999, color: 'var(--fg-dim)'
                  }}>{tool}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact({ lang }) {
  const t = I18N[lang].contact;
  return (
    <section className="contact" id="contact">
      <div className="contact-bg"></div>
      <div className="container contact-inner">
        <h2 className="contact-headline">
          {t.title[0]}<em>{t.title[1]}</em>{t.title[2]}
        </h2>
        <p style={{ color: 'var(--fg-dim)', fontSize: 18, marginTop: 30, maxWidth: '46ch', marginLeft: 'auto', marginRight: 'auto' }}>{t.sub}</p>
        <a className="contact-cta" href="mailto:ginkasanches@gmail.com">
          {t.cta} <Icon.arrow />
        </a>
        <div className="contact-channels">
          {t.channels.map((c, i) => {
            const IconC = Icon[c.icon];
            return (
              <a key={i} className="contact-channel" href={c.href} target="_blank" rel="noopener">
                {IconC ? IconC() : null} {c.label}
              </a>
            );
          })}
        </div>
      </div>
      <div className="footer">
        <span>{I18N[lang].footer.left}</span>
        <span>{I18N[lang].footer.right}</span>
      </div>
    </section>
  );
}

// Removed window assignments for ESM

