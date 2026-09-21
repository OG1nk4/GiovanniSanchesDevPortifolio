import { ImageResponse } from 'next/og';
import { dictionaries, type Lang } from './content';

export const ogSize = { width: 1200, height: 630 };

export function renderOgImage(lang: Lang) {
  const t = dictionaries[lang];
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#0a0a0a',
          color: '#ecebe6',
        }}
      >
        <div style={{ fontSize: 26, color: '#8c8b86', letterSpacing: 4, textTransform: 'uppercase' }}>
          {t.hero.kicker}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 150, fontWeight: 700, lineHeight: 0.9, letterSpacing: -6 }}>GIOVANNI</div>
          <div style={{ fontSize: 150, fontWeight: 700, lineHeight: 0.9, letterSpacing: -6 }}>SANCHES</div>
          <div style={{ marginTop: 36, height: 2, width: 120, background: '#38a8ff' }} />
          <div style={{ marginTop: 28, fontSize: 30, color: '#8c8b86', maxWidth: 900 }}>{t.meta.description}</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
