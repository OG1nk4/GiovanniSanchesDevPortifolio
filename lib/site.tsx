import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { dictionaries, type Lang } from './content';

export const siteUrl = 'https://giovannisanchesdev.vercel.app';

const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export const viewport: Viewport = { themeColor: '#0a0a0a' };

export function buildMetadata(lang: Lang): Metadata {
  const t = dictionaries[lang];
  const path = lang === 'pt' ? '/' : '/en';
  return {
    metadataBase: new URL(siteUrl),
    title: t.meta.title,
    description: t.meta.description,
    alternates: { canonical: path, languages: { 'pt-BR': '/', en: '/en' } },
    icons: { icon: '/logo-gs.png', apple: '/logo-gs.png' },
    openGraph: {
      type: 'website',
      url: path,
      title: t.meta.title,
      description: t.meta.description,
      siteName: 'Giovanni Sanches',
      locale: lang === 'pt' ? 'pt_BR' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title: t.meta.title, description: t.meta.description },
  };
}

export function RootHtml({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang === 'pt' ? 'pt-BR' : 'en'} className={mono.variable} suppressHydrationWarning>
      <head>
        <script
          // Runs before paint: lets CSS hide elements that will animate in, and
          // un-hides them after 4s if the animation script never takes over.
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');setTimeout(function(){var d=document.documentElement;if(!d.classList.contains('motion-ready'))d.classList.remove('js')},4000)",
          }}
        />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
