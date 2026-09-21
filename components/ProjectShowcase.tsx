'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { Lang } from '@/lib/content';
import type { Project } from '@/lib/projects';

type Props = { projects: Project[]; lang: Lang; visitLabel: string };

/**
 * Typographic project list. On devices with a real pointer, hovering a row
 * shows that project's screenshot following the cursor. On touch devices the
 * screenshot is shown inline in each row instead.
 */
export function ProjectShowcase({ projects, lang, visitLabel }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = previewRef.current;
    if (!el || active === null) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pos = { ...target.current };
    let raf = 0;
    const tick = () => {
      // Ease toward the cursor so the image trails slightly behind it.
      const ease = reduced ? 1 : 0.18;
      pos.x += (target.current.x - pos.x) * ease;
      pos.y += (target.current.y - pos.y) * ease;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const onMove = (e: React.PointerEvent) => {
    target.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div className="relative">
      <ul className="border-t border-line" onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
        {projects.map((p, i) => (
          <li key={p.href} className="border-b border-line">
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') {
                  target.current = { x: e.clientX, y: e.clientY };
                  setActive(i);
                }
              }}
              className="group grid gap-4 py-8 md:grid-cols-12 md:items-baseline md:py-10"
            >
              <span className="font-mono text-xs text-muted md:col-span-2">{p.year}</span>
              <span className="text-3xl font-medium tracking-tight transition-colors duration-300 group-hover:text-accent md:col-span-5 md:text-5xl">
                {p.title}
              </span>
              <span className="text-muted md:col-span-5">
                {p.description[lang]}
                <span className="mt-3 block font-mono text-xs">{p.stack.join(' / ')}</span>
                <span className="sr-only"> — {visitLabel}</span>
              </span>
              <span className="relative mt-2 block aspect-[16/10] overflow-hidden rounded-sm pointer-fine:hidden md:col-span-12">
                <Image src={p.image} alt="" fill sizes="100vw" className="object-cover" />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div
        ref={previewRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-30 hidden aspect-[16/10] w-[min(28rem,32vw)] overflow-hidden rounded-sm transition-opacity duration-300 pointer-fine:block ${
          active === null ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {projects.map((p, i) => (
          <Image
            key={p.href}
            src={p.image}
            alt=""
            fill
            sizes="32vw"
            className={`object-cover transition-opacity duration-300 ${active === i ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
      </div>
    </div>
  );
}
