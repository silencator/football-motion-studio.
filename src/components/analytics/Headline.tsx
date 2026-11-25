import React from 'react';
import {fonts, paper, paperEase} from '../../design/tokens';
import {useT} from '../ios/scene';

/**
 * Analytics-reference headline (MessiWalks): a small grey lead line whose words fly in on their
 * spoken times, over ONE huge black word that slams in (scale-down + de-blur) and locks.
 */
export type HWord = {text: string; at: number};

export const Lead: React.FC<{words: HWord[]; size?: number; color?: string; exitAt?: number; caps?: boolean; align?: 'center' | 'left'}> = ({words, size = 58, color = '#4A4A4F', exitAt, caps, align = 'center'}) => {
  const {p} = useT();
  const out = exitAt === undefined ? 0 : p(exitAt, 0.35, paperEase.exit);
  const offs = [-0.9, 0.6, -0.4, 1, -0.7, 0.5, -0.3];
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: align === 'left' ? 'flex-start' : 'center', columnGap: size * (caps ? 0.4 : 0.24), maxWidth: 960, fontFamily: caps ? fonts.text : fonts.display}}>
      {words.map((w, i) => {
        const k = p(w.at - 0.08, 0.5);
        const o = offs[i % offs.length];
        return (
          <span key={i} style={{display: 'inline-block', fontSize: caps ? size * 0.5 : size, fontWeight: caps ? 600 : 650, letterSpacing: caps ? '0.2em' : '-0.03em', textTransform: caps ? 'uppercase' : undefined,
            color: caps ? paper.text2 : color, opacity: Math.min(1, k * 1.7) * (1 - out), translate: `${(1 - k) * size * 0.3 * o}px ${(1 - k) * size * 0.8 * o - out * 20}px`,
            filter: `blur(${(1 - k) * 10 + out * 10}px)`}}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

export const BigWord: React.FC<{text: string; at: number; size?: number; color?: string; exitAt?: number; style?: React.CSSProperties; gradient?: string}> = ({text, at, size = 210, color = paper.text, exitAt, style, gradient}) => {
  const {p} = useT();
  const k = p(at - 0.12, 0.55, paperEase.arrive);
  const out = exitAt === undefined ? 0 : p(exitAt, 0.35, paperEase.exit);
  if (k <= 0) return null;
  return (
    <div style={{fontFamily: fonts.display, fontSize: size, fontWeight: 800, letterSpacing: '-0.055em', lineHeight: 0.95, color, whiteSpace: 'nowrap',
      opacity: Math.min(1, k * 2) * (1 - out), scale: String(1.25 - 0.25 * k - out * 0.06), filter: `blur(${(1 - k) * 22 + out * 14}px)`, translate: `0 ${-out * 30}px`,
      ...(gradient ? {backgroundImage: gradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', paddingBottom: size * 0.08} : {}), ...style}}>
      {text}
    </div>
  );
};

/** Lead line + big word, centred near the top (y≈200–480 at 1080×1920). */
export const Headline: React.FC<{lead?: HWord[]; word?: {text: string; at: number}; top?: number; size?: number; exitAt?: number; caps?: boolean; gradient?: string}> = ({lead, word, top = 200, size = 210, exitAt, caps, gradient}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 5}}>
    {lead && <Lead words={lead} exitAt={exitAt} caps={caps} />}
    {word && <BigWord text={word.text} at={word.at} size={size} exitAt={exitAt} gradient={gradient} />}
  </div>
);

/** Tiny uppercase callout with a hairline leader (reference: "LEFT.", "TIRED", "SPACE"). */
export const Callout: React.FC<{text: string; at: number; x: number; y: number; dx?: number; dy?: number; exitAt?: number; dark?: boolean; size?: number}> = ({text, at, x, y, dx = 0, dy = 0, exitAt, dark, size = 30}) => {
  const {p} = useT();
  const k = p(at - 0.05, 0.45);
  const out = exitAt === undefined ? 0 : p(exitAt, 0.3, paperEase.exit);
  const c = dark ? '#F5F5F7' : paper.text;
  const len = Math.hypot(dx, dy);
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: k * (1 - out), pointerEvents: 'none'}}>
      {len > 0 && (
        <svg style={{position: 'absolute', left: Math.min(0, dx) - 4, top: Math.min(0, dy) - 4, overflow: 'visible'}} width={Math.abs(dx) + 8} height={Math.abs(dy) + 8}>
          <line x1={-Math.min(0, dx) + 4} y1={-Math.min(0, dy) + 4} x2={-Math.min(0, dx) + 4 + dx * k} y2={-Math.min(0, dy) + 4 + dy * k} stroke={c} strokeWidth={2} />
          <circle cx={-Math.min(0, dx) + 4} cy={-Math.min(0, dy) + 4} r={5} fill={c} />
        </svg>
      )}
      <div style={{position: 'absolute', left: dx, top: dy, translate: `${dx < 0 ? '-100%' : '0'} -50%`, padding: dx < 0 ? '0 14px 0 0' : '0 0 0 14px', whiteSpace: 'nowrap',
        fontFamily: fonts.text, fontSize: size, fontWeight: 700, letterSpacing: '0.18em', color: c, filter: `blur(${(1 - k) * 6}px)`}}>
        {text}
      </div>
    </div>
  );
};
