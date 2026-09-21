import Image from 'next/image';
import Link from 'next/link';
import { links, type Dictionary, type Lang } from '@/lib/content';

type Props = { t: Dictionary; lang: Lang; hasProjects: boolean };

export function Header({ t, lang, hasProjects }: Props) {
  const home = lang === 'pt' ? '/' : '/en';
  const nav = [
    { href: '#services', label: t.nav.services },
    ...(hasProjects ? [{ href: '#work', label: t.nav.work }] : []),
    { href: '#about', label: t.nav.about },
    { href: '#education', label: t.nav.education },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        <Link href={home} aria-label="Giovanni Sanches" className="-ml-1 inline-flex size-11 shrink-0 items-center justify-center">
          <Image src="/logo-gs.png" alt="" width={36} height={36} priority />
        </Link>

        <nav className="hidden md:block">
          <ul className="flex gap-8 text-sm text-muted">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors hover:text-fg">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={lang === 'pt' ? '/en' : '/'}
            hrefLang={lang === 'pt' ? 'en' : 'pt-BR'}
            aria-label={t.nav.switchLangLabel}
            className="inline-flex h-11 min-w-11 items-center justify-center font-mono text-xs text-muted transition-colors hover:text-fg"
          >
            {t.nav.switchLang}
          </Link>
          <a
            href={links.whatsapp(t.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-full border border-line px-4 text-sm transition-colors hover:border-fg"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
