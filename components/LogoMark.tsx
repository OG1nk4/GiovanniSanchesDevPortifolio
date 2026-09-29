import { LOGO_G, LOGO_S, LOGO_SHADE_DARK, LOGO_SHADE_LIGHT, LOGO_VIEWBOX } from '@/lib/logo-paths';

/** The GS mark as inline SVG (sharp at any size, no extra request). */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} aria-hidden="true">
      <defs>
        <linearGradient id="gsNavFill" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#7cc8ff" />
          <stop offset=".5" stopColor="#38a8ff" />
          <stop offset="1" stopColor="#1d6fd6" />
        </linearGradient>
        <clipPath id="gsNavClip">
          <path d={LOGO_G + LOGO_S} fillRule="evenodd" />
        </clipPath>
      </defs>
      <path d={LOGO_G + LOGO_S} fill="url(#gsNavFill)" fillRule="evenodd" />
      <g clipPath="url(#gsNavClip)">
        <path d={LOGO_SHADE_LIGHT} fill="#2f9cf0" fillRule="evenodd" opacity=".55" />
        <path d={LOGO_SHADE_DARK} fill="#0b4fa3" fillRule="evenodd" opacity=".7" />
      </g>
    </svg>
  );
}
