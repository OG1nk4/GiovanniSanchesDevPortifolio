import Image from 'next/image';
import { links, type Dictionary, type Lang } from '@/lib/content';
import { Roll } from './Roll';

type Props = { t: Dictionary; lang: Lang; hasProjects: boolean };

export function Header({ t, lang, hasProjects }: Props) {
  const nav = [
    { href: '#services', label: t.nav.services },
    ...(hasProjects ? [{ href: '#work', label: t.nav.work }] : []),
    { href: '#about', label: t.nav.about },
    { href: '#education', label: t.nav.education },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <header data-header data-anim="hero" className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        <a
          href="#top"
          aria-label="Giovanni Sanches"
          className="-ml-1 inline-flex size-11 shrink-0 items-center justify-center transition-transform duration-700 ease-out-expo hover:rotate-[-8deg] hover:scale-110"
        >
          <Image src="/logo-gs.png" alt="" width={36} height={36} priority />
        </a>

        <nav className="hidden md:block">
          <ul className="flex gap-8 text-sm text-muted">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group relative inline-flex py-2 transition-colors hover:text-fg after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-right after:scale-x-0 after:bg-fg after:transition-transform after:duration-500 after:ease-out-expo hover:after:origin-left hover:after:scale-x-100"
                >
                  <Roll>{item.label}</Roll>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Plain <a>: PT and EN are separate root layouts, so this is a full
              navigation — which is what lets the CSS view transition run. */}
          <a
            href={lang === 'pt' ? '/en' : '/'}
            hrefLang={lang === 'pt' ? 'en' : 'pt-BR'}
            aria-label={t.nav.switchLangLabel}
            className="group inline-flex h-11 min-w-11 items-center justify-center font-mono text-xs text-muted transition-colors hover:text-fg"
          >
            <Roll>{t.nav.switchLang}</Roll>
          </a>
          <a
            href={links.whatsapp(t.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            data-magnetic
            className="group relative inline-flex h-11 items-center overflow-hidden rounded-full border border-line px-4 text-sm transition-colors duration-500 hover:border-fg hover:text-bg before:absolute before:inset-0 before:translate-y-full before:rounded-full before:bg-fg before:transition-transform before:duration-500 before:ease-out-expo hover:before:translate-y-0"
          >
            <span className="relative">
              <Roll>WhatsApp</Roll>
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
