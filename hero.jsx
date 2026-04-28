import React, { useState, useEffect, useRef, useMemo } from 'react';
import { I18N } from './data.js';


function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function ease(t) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2; }

// scroll progress hook for an element
function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const p = clamp(scrolled / total, 0, 1);
      setProgress(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);
  return progress;
}

function TypingTerminal({ progress, lines, lang }) {
  // total characters across all lines
  const total = useMemo(() => lines.reduce((s, l) => s + l.text.length + 1, 0), [lines, lang]);
  const charsToShow = Math.floor(progress * total);

  let acc = 0;
  return (
    <div className="terminal-body">
      {lines.map((line, i) => {
        const start = acc;
        const end = acc + line.text.length;
        acc = end + 1;
        const localChars = clamp(charsToShow - start, 0, line.text.length);
        if (localChars <= 0 && i > 0 && charsToShow < start) return null;
        const visible = line.text.slice(0, localChars);
        const isCursor = charsToShow >= start && charsToShow <= end;
        const cls = line.type === "comment" ? "t-comment" : "";
        return (
          <div key={i} className={`t-line ${cls}`}>
            {line.type === "code" && i > 0 ? <span className="t-prompt">$ </span> : null}
            {colorize(visible, line.type)}
            {isCursor && <span className="t-cur"></span>}
          </div>
        );
      })}
    </div>
  );
}

function colorize(text, type) {
  if (type === "comment") return text;
  // simple syntax highlight
  const parts = [];
  let i = 0;
  const re = /("[^"]*")|(\b\d+\b)|(\b(const|await|new|true|false|null)\b)|(\w+\()|(\w+:)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(<span key={i++}>{text.slice(last, m.index)}</span>);
    if (m[1]) parts.push(<span key={i++} className="t-str">{m[1]}</span>);
    else if (m[2]) parts.push(<span key={i++} className="t-num">{m[2]}</span>);
    else if (m[3]) parts.push(<span key={i++} className="t-key">{m[3]}</span>);
    else if (m[5]) parts.push(<span key={i++} className="t-fn">{m[5]}</span>);
    else if (m[6]) parts.push(<span key={i++} className="t-key">{m[6]}</span>);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(<span key={i++}>{text.slice(last)}</span>);
  return parts;
}

export function Hero({ lang, heroStyle }) {
  const ref = useRef(null);
  const progress = useScrollProgress(ref);
  const t = I18N[lang].hero;

  // 3-phase animation:
  // 0.0 - 0.45: terminal types
  // 0.45 - 0.7: terminal scales away, name appears
  // 0.7 - 1.0: portrait rises, tags fly in, settle
  const p1 = clamp(progress / 0.45, 0, 1);
  const p2 = clamp((progress - 0.4) / 0.3, 0, 1);
  const p3 = clamp((progress - 0.65) / 0.35, 0, 1);

  // terminal transform
  const termScale = lerp(1, 0.4, ease(p2));
  const termOpacity = 1 - p2;
  const termY = lerp(0, -120, ease(p2));

  // name
  const nameOpacity = ease(p2) * (1 - p3 * 0.3);
  const nameScale = lerp(0.7, 1, ease(p2));
  const nameY = lerp(40, -p3 * 60, ease(p2));
  const nameLetterSpace = lerp(-0.1, -0.05, ease(p2));

  // portrait
  const portraitOpacity = ease(p3);
  const portraitY = lerp(80, 0, ease(p3));
  const portraitScale = lerp(0.92, 1, ease(p3));

  // bg blob
  const blobX = lerp(-20, 30, progress);
  const blobY = lerp(0, -30, progress);
  const blobScale = lerp(1, 1.4, progress);

  // grid
  const gridScale = lerp(1, 1.3, progress);

  // scroll indicator
  const scrollOp = 1 - clamp(progress * 4, 0, 1);

  // tags
  const tagPositions = [
    { top: '15%', left: '8%',  text: 'TypeScript', delay: 0 },
    { top: '22%', right: '10%', text: 'Llama 3 API', delay: 0.05 },
    { top: '40%', left: '5%',  text: 'Next.js', delay: 0.1 },
    { top: '52%', right: '6%', text: 'Python', delay: 0.15 },
    { top: '70%', left: '12%', text: 'Supabase', delay: 0.2 },
    { top: '78%', right: '14%', text: 'n8n / Docker', delay: 0.25 },
  ];

  // hero style variations
  const variant = heroStyle || 'terminal'; // 'terminal' | 'minimal' | 'particles'

  return (
    <section className="hero" ref={ref} id="home">
      <div className="hero-sticky">
        <div className="hero-bg-blob"
             style={{ transform: `translate(${blobX}vw, ${blobY}vh) scale(${blobScale})` }} />
        <div className="hero-grid-overlay"
             style={{ transform: `scale(${gridScale})` }} />

        {variant !== 'minimal' && (
          <div className="terminal" style={{
            transform: `translate(0, ${termY}px) scale(${termScale})`,
            opacity: termOpacity,
            pointerEvents: termOpacity < 0.1 ? 'none' : 'auto'
          }}>
            <div className="terminal-bar">
              <span className="dot r"></span>
              <span className="dot y"></span>
              <span className="dot g"></span>
              <span className="title">~/giovanni-sanches/portfolio</span>
              <span className="badge">zsh · v3.0</span>
            </div>
            <TypingTerminal progress={p1} lines={t.typing} lang={lang} />
          </div>
        )}

        <div className="hero-name" style={{
          opacity: nameOpacity,
          transform: `translateY(${nameY}px) scale(${nameScale})`
        }}>
          <div>
            <h1 style={{ letterSpacing: `${nameLetterSpace}em` }}>GIOVANNI</h1>
            <h1 style={{ letterSpacing: `${nameLetterSpace}em`, marginTop: '-0.05em' }}>
              SANCHES
            </h1>
            <div className="role">{t.role}</div>
          </div>
        </div>

        {variant !== 'minimal' && (
          <img
            src="assets/giovanni-portrait.png"
            alt="Giovanni Sanches"
            className="hero-portrait"
            style={{
              opacity: portraitOpacity,
              transform: `translateX(-50%) translateY(${portraitY}px) scale(${portraitScale})`
            }}
          />
        )}

        <div className="hero-tags" style={{ opacity: portraitOpacity * 0.95 }}>
          {tagPositions.map((tag, i) => {
            const tp = clamp((p3 - tag.delay) / 0.4, 0, 1);
            const dx = (tag.left ? -40 : 40) * (1 - ease(tp));
            return (
              <div key={i} className="hero-tag" style={{
                top: tag.top,
                left: tag.left,
                right: tag.right,
                opacity: ease(tp),
                transform: `translateX(${dx}px)`
              }}>
                {tag.text}
              </div>
            );
          })}
        </div>

        <div className="scroll-indicator" style={{ opacity: scrollOp }}>
          <span>{t.scroll}</span>
          <span className="line"></span>
        </div>
      </div>
    </section>
  );
}

// Removed window assignments for ESM

