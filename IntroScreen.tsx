'use client';

/**
 * IntroScreen — Tela de introdução animada para portfólio Next.js App Router
 *
 * ─── SETUP ───────────────────────────────────────────────────────────────────
 * 1. Instale as dependências:
 *      npm install gsap
 *      npm install framer-motion   ← use no pai com <AnimatePresence>
 *
 * 2. Adicione as fontes no layout.tsx (recomendado em produção):
 *      import { Bebas_Neue, Outfit } from 'next/font/google';
 *      const bebas  = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-headline' });
 *      const outfit = Outfit({ subsets: ['latin'], variable: '--font-body' });
 *      export default function RootLayout({ children }) {
 *        return <html className={`${bebas.variable} ${outfit.variable}`}>...
 *      }
 *      Se fizer isso, remova o <style> de import de fontes dentro deste componente.
 *
 * 3. Coloque a logo em /public/logo-gs.png
 *
 * 4. Uso no pai:
 *      const [showIntro, setShowIntro] = useState(true);
 *      {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}
 *
 *    Com framer-motion AnimatePresence (fade automático no unmount):
 *      <AnimatePresence>
 *        {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}
 *      </AnimatePresence>
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  radius: number;
}

interface IntroScreenProps {
  /** Chamado após o fim natural da intro (≈3.6s) ou quando o usuário pula */
  onComplete: () => void;
}

// ─── Constantes de identidade visual ─────────────────────────────────────────

const ACCENT     = '#00AAFF';
const ACCENT_DIM = '#0066CC';
const BG_COLOR   = '#0A0A0A';
const NAME       = 'GIOVANNI SANCHES';

// ─── Componente ───────────────────────────────────────────────────────────────

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  // Refs de elementos DOM
  const wrapperRef      = useRef<HTMLDivElement>(null);
  const parallaxRef     = useRef<HTMLDivElement>(null);  // div que recebe o transform do mouse
  const logoRef         = useRef<HTMLDivElement>(null);  // div interna: GSAP controla scale/opacity
  const logoImgRef      = useRef<HTMLImageElement>(null);// img: GSAP controla o filter/glow
  const nameRef         = useRef<HTMLDivElement>(null);
  const subtitleRef     = useRef<HTMLParagraphElement>(null);
  const progressWrapRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const canvasRef       = useRef<HTMLCanvasElement>(null);

  // Refs de estado interno — sem causar re-render
  const tlRef       = useRef<gsap.core.Timeline | null>(null);
  const particleRaf = useRef<number>(0);
  const parallaxRaf = useRef<number>(0);
  const mousePos    = useRef({ x: 0, y: 0 });
  const logoPos     = useRef({ x: 0, y: 0 }); // posição atual suavizada
  const doneRef     = useRef(false);           // garante que onComplete é chamado 1x

  // ─── finish(): encerra a intro via skip ou timer ─────────────────────────
  // fast=true → 0.3s (skip pelo usuário); fast=false → 0.4s (timer natural)
  const finish = useCallback((fast = false) => {
    if (doneRef.current) return;
    doneRef.current = true;

    tlRef.current?.kill();
    cancelAnimationFrame(particleRaf.current);
    cancelAnimationFrame(parallaxRaf.current);

    gsap.to(wrapperRef.current, {
      opacity: 0,
      scale:   1.05,
      duration: fast ? 0.3 : 0.4,
      ease:    'power2.in',
      onComplete: onComplete,
    });
  }, [onComplete]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas  = canvasRef.current;
    if (!wrapper || !canvas) return;

    // ── Canvas de Partículas ───────────────────────────────────────────────
    // 60 partículas no desktop, 30 no mobile para preservar performance
    const ctx = canvas.getContext('2d')!;
    const isMobile = window.innerWidth <= 768;
    const COUNT = isMobile ? 30 : 60;
    let W = 0, H = 0;
    let particles: Particle[] = [];

    const initCanvas = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    initCanvas();
    window.addEventListener('resize', initCanvas);

    // Inicializa cada partícula com posição, velocidade e opacidade aleatórias
    particles = Array.from({ length: COUNT }, () => ({
      x:       Math.random() * window.innerWidth,
      y:       Math.random() * window.innerHeight,
      vx:      (Math.random() - 0.5) * 0.55,
      vy:      (Math.random() - 0.5) * 0.55,
      opacity: 0.15 + Math.random() * 0.25,
      radius:  1.2  + Math.random() * 2,
    }));

    // Loop de desenho — roda até a intro terminar
    const drawParticles = () => {
      particleRaf.current = requestAnimationFrame(drawParticles);
      ctx.clearRect(0, 0, W, H);

      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      const REPEL_R = 80;   // raio de repulsão do cursor em px
      const REPEL_F = 2.8;  // intensidade da força de repulsão

      for (const p of particles) {
        // Calcula distância ao cursor e aplica força de repulsão
        const dx   = p.x - mx;
        const dy   = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_R && dist > 0) {
          const force = ((REPEL_R - dist) / REPEL_R) * REPEL_F;
          p.vx += (dx / dist) * force * 0.12;
          p.vy += (dy / dist) * force * 0.12;
        }

        // Amortecimento para evitar velocidade infinita
        p.vx *= 0.97;
        p.vy *= 0.97;

        // Move a partícula
        p.x += p.vx;
        p.y += p.vy;

        // Wrap: ao sair da tela, reaparece do lado oposto
        if      (p.x < 0) p.x = W;
        else if (p.x > W) p.x = 0;
        if      (p.y < 0) p.y = H;
        else if (p.y > H) p.y = 0;

        // Desenha o ponto
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      }
    };
    drawParticles();

    // ── Parallax da Logo com Lerp (requestAnimationFrame) ─────────────────
    // A logo acompanha o cursor suavemente com fator de interpolação 0.08
    const LERP   = 0.08;
    const MAX_PX = 15; // deslocamento máximo em pixels

    const runParallax = () => {
      parallaxRaf.current = requestAnimationFrame(runParallax);
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;

      // Normaliza posição do cursor para o intervalo [-MAX_PX, +MAX_PX]
      const tx = ((mousePos.current.x - cx) / cx) * MAX_PX;
      const ty = ((mousePos.current.y - cy) / cy) * MAX_PX;

      // Interpolação linear suave (lerp) para movimento fluido
      logoPos.current.x += (tx - logoPos.current.x) * LERP;
      logoPos.current.y += (ty - logoPos.current.y) * LERP;

      if (parallaxRef.current) {
        parallaxRef.current.style.transform =
          `translate(${logoPos.current.x.toFixed(2)}px, ${logoPos.current.y.toFixed(2)}px)`;
      }
    };
    runParallax();

    // ── Listeners de eventos ───────────────────────────────────────────────

    // Atualiza posição do mouse a cada movimento
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);

    // Scroll pula a intro imediatamente com animação acelerada de 0.4s
    const onWheel = () => finish(true);
    window.addEventListener('wheel', onWheel, { once: true });

    // ── Glitch: chamado pelo timeline em 3.0s ──────────────────────────────
    // Distorce as letras do nome com translateX e skewX aleatórios por 0.3s
    const triggerGlitch = () => {
      const spans = Array.from(
        nameRef.current?.querySelectorAll<HTMLElement>('span') ?? []
      );
      if (!spans.length) return;

      const g = gsap.timeline();

      // 5 pulsos rápidos com deslocamento e cor alternados
      for (let i = 0; i < 5; i++) {
        g.to(spans, {
          x:     () => (Math.random() - 0.5) * 16,
          skewX: () => (Math.random() - 0.5) * 10,
          color: i % 2 === 0 ? ACCENT : '#ffffff',
          duration: 0.05,
          stagger:  0.006,
          ease:     'none',
        }, i * 0.055);
      }

      // Retorna ao estado original
      g.to(spans, { x: 0, skewX: 0, color: '#ffffff', duration: 0.08 }, 0.3);
    };

    // ── Timeline Principal GSAP ────────────────────────────────────────────
    const tl = gsap.timeline();
    tlRef.current = tl;

    // 0.0s — Estado inicial: tudo invisível, logo pequena
    gsap.set(
      [logoRef.current, nameRef.current, subtitleRef.current, progressWrapRef.current],
      { opacity: 0 }
    );
    gsap.set(logoRef.current, { scale: 0.3 });

    // Letras do nome iniciam deslocadas para baixo
    const letterSpans = Array.from(
      nameRef.current?.querySelectorAll<HTMLElement>('span') ?? []
    );
    gsap.set(letterSpans, { opacity: 0, y: 15 });

    // 0.3s — Logo entra: scale 0.3→1, opacity 0→1, easing power3.out, 0.8s
    tl.to(logoRef.current, {
      scale:    1,
      opacity:  1,
      duration: 0.8,
      ease:     'power3.out',
    }, 0.3);

    // 0.8s — Glow pulsa: 0px → 40px (0.25s) → 20px (0.25s)
    tl.to(logoImgRef.current, {
      filter:   `drop-shadow(0 0 40px ${ACCENT})`,
      duration: 0.25,
      ease:     'power2.out',
    }, 0.8).to(logoImgRef.current, {
      filter:   `drop-shadow(0 0 20px ${ACCENT})`,
      duration: 0.25,
      ease:     'power2.in',
    }, 1.05);

    // 1.2s — Nome aparece letra por letra, stagger 0.04s cada
    tl.to(nameRef.current, { opacity: 1, duration: 0.01 }, 1.2)
      .to(letterSpans, {
        opacity:  1,
        y:        0,
        duration: 0.4,
        stagger:  0.04,
        ease:     'power2.out',
      }, 1.2);

    // 1.8s — Subtítulo aparece com fade + translateY(20px → 0)
    gsap.set(subtitleRef.current, { y: 20 });
    tl.to(subtitleRef.current, {
      opacity:  1,
      y:        0,
      duration: 0.5,
      ease:     'power2.out',
    }, 1.8);

    // 2.2s — Barra de progresso: container aparece, fill expande 0%→100% em 0.8s
    tl.to(progressWrapRef.current, { opacity: 1, duration: 0.3 }, 2.2)
      .fromTo(
        progressFillRef.current,
        { width: '0%' },
        { width: '100%', duration: 0.8, ease: 'power1.inOut' },
        2.2
      );

    // 3.0s — Glitch no nome (0.3s) antes do fade out
    tl.call(triggerGlitch, [], 3.0);

    // 3.2s — Fade out geral: opacity 1→0, scale 1→1.05, 0.4s
    tl.to(wrapper, {
      opacity:  0,
      scale:    1.05,
      duration: 0.4,
      ease:     'power2.in',
    }, 3.2);

    // 3.6s — Chama onComplete após o fade terminar
    tl.call(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        cancelAnimationFrame(particleRaf.current);
        cancelAnimationFrame(parallaxRaf.current);
        onComplete();
      }
    }, [], 3.6);

    // Cleanup ao desmontar
    return () => {
      tl.kill();
      cancelAnimationFrame(particleRaf.current);
      cancelAnimationFrame(parallaxRaf.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('wheel',     onWheel);
      window.removeEventListener('resize',    initCanvas);
    };
  }, [finish, onComplete]);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <>
      {/* 
        Aviso: as fontes 'Bebas Neue' e 'Outfit' já devem estar importadas globalmente
        no index.html ou no layout.tsx.
      */}

      {/* ── Wrapper principal: cobre 100vw × 100vh, z-index 9999 ── */}
      <div
        ref={wrapperRef}
        style={{
          position:        'fixed',
          inset:           0,
          zIndex:          9999,
          backgroundColor: BG_COLOR,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          overflow:        'hidden',
        }}
      >

        {/* ── Canvas de partículas — z-index 0, fundo completo ── */}
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        />

        {/* ── Container central — z-index 1 ── */}
        <div
          style={{
            position:       'relative',
            zIndex:         1,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:            '16px',
            textAlign:      'center',
            padding:        '0 24px',
            userSelect:     'none',
          }}
        >

          {/*
            Wrapper de parallax — recebe o transform do mouse via JS.
            Separado da div de GSAP para evitar conflito de transforms.
          */}
          <div ref={parallaxRef} style={{ willChange: 'transform' }}>
            {/* Div interna: GSAP controla scale e opacity */}
            <div ref={logoRef}>
              {/*
                Logo GS — certifique-se de que o arquivo está em /public/logo-gs.png
                Em Next.js, substitua por:
                  import Image from 'next/image';
                  <Image src="/logo-gs.png" alt="GS" width={160} height={160} ... />
              */}
              <img
                ref={logoImgRef}
                src="/logo-gs.png"
                alt="GS — Giovanni Sanches"
                style={{
                  width:      'clamp(100px, 15vw, 160px)',
                  height:     'auto',
                  display:    'block',
                  filter:     `drop-shadow(0 0 20px ${ACCENT})`,
                  willChange: 'filter',
                }}
              />
            </div>
          </div>

          {/*
            Nome dividido em <span> individuais para o stagger do GSAP.
            Cada caractere é um elemento separado; espaço vira &nbsp;
          */}
          <div ref={nameRef} aria-label="Giovanni Sanches">
            <p
              style={{
                fontFamily:    "'Bebas Neue', var(--font-headline, sans-serif)",
                fontSize:      'clamp(2rem, 5vw, 4rem)',
                color:         '#ffffff',
                letterSpacing: '0.1em',
                lineHeight:    1,
                margin:        0,
              }}
            >
              {NAME.split('').map((char, i) => (
                <span key={i} style={{ display: 'inline-block' }}>
                  {char === ' ' ? ' ' : char}
                </span>
              ))}
            </p>
          </div>

          {/* Subtítulo — fonte Outfit, cor #7799BB, uppercase */}
          <p
            ref={subtitleRef}
            style={{
              fontFamily:    "'Outfit', var(--font-body, sans-serif)",
              fontSize:      'clamp(0.72rem, 1.4vw, 0.92rem)',
              color:         '#7799BB',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight:    400,
              margin:        0,
            }}
          >
            Full Stack Developer &amp; AI Engineer
          </p>

          {/* Barra de progresso: wrapper + fill animado pelo GSAP */}
          <div
            ref={progressWrapRef}
            style={{
              width:           'clamp(160px, 28vw, 280px)',
              height:          '2px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius:    '999px',
              overflow:        'hidden',
              marginTop:       '12px',
            }}
          >
            <div
              ref={progressFillRef}
              style={{
                height:       '100%',
                width:        '0%',
                background:   `linear-gradient(90deg, ${ACCENT_DIM}, ${ACCENT})`,
                borderRadius: '999px',
                boxShadow:    `0 0 10px ${ACCENT}88`,
              }}
            />
          </div>
        </div>

        {/* ── Botão "Pular intro" — canto inferior direito ── */}
        <button
          type="button"
          onClick={() => finish(true)}
          onMouseEnter={e => {
            e.currentTarget.style.color       = '#7799BB';
            e.currentTarget.style.borderColor = '#7799BB';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color       = '#445566';
            e.currentTarget.style.borderColor = '#445566';
          }}
          style={{
            position:    'absolute',
            bottom:      '24px',
            right:       '24px',
            fontFamily:  "'Outfit', var(--font-body, sans-serif)",
            fontSize:    '12px',
            color:       '#445566',
            background:  'none',
            border:      '1px solid #445566',
            borderRadius:'4px',
            padding:     '6px 14px',
            cursor:      'pointer',
            zIndex:      2,
            letterSpacing: '0.08em',
            transition:  'color 0.2s ease, border-color 0.2s ease',
          }}
        >
          Pular intro
        </button>
      </div>
    </>
  );
}
