import React from 'react';
import {Img, staticFile} from 'remotion';
import {fonts, paper, paperEase} from '../../design/tokens';
import {useT} from '../../components/ios';

/** Small production helpers for the Messi 91 film (layout at 1080×1920). */

export const Abs: React.FC<{top?: number; bottom?: number; left?: number; right?: number; center?: boolean; children: React.ReactNode; style?: React.CSSProperties; z?: number}> = ({
  top, bottom, left, right, center = true, children, style, z,
}) => (
  <div style={{position: 'absolute', top, bottom, left: center ? 0 : left, right: center ? 0 : right, display: 'flex', justifyContent: center ? 'center' : 'flex-start', zIndex: z, ...style}}>
    {children}
  </div>
);

export const Kicker: React.FC<{at: number; text: string; color?: string; size?: number; exitAt?: number}> = ({at, text, color = paper.text2, size = 30, exitAt}) => {
  const {p} = useT();
  const k = p(at - 0.05, 0.6);
  const out = exitAt === undefined ? 0 : p(exitAt, 0.3, paperEase.exit);
  return (
    <div style={{fontFamily: fonts.text, fontSize: size, fontWeight: 600, letterSpacing: `${0.16 + (1 - k) * 0.12}em`, textTransform: 'uppercase', color, opacity: k * (1 - out), filter: `blur(${(1 - k) * 6}px)`}}>
      {text}
    </div>
  );
};

/** Huge display number that slams in (scale-down + de-blur) and locks at `lockAt`. Optional gradient fill. */
export const HeroNumber: React.FC<{text: string; at: number; lockAt: number; size: number; color?: string; gradient?: string; exitAt?: number; style?: React.CSSProperties}> = ({
  text, at, lockAt, size, color = paper.text, gradient, exitAt, style,
}) => {
  const {p} = useT();
  const k = p(at, Math.max(0.2, lockAt - at), paperEase.arrive);
  const settle = p(lockAt, 0.5, paperEase.lock);
  const out = exitAt === undefined ? 0 : p(exitAt, 0.35, paperEase.exit);
  return (
    <div
      style={{
        fontFamily: fonts.display,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: '-0.06em',
        lineHeight: 0.86,
        color,
        fontVariantNumeric: 'tabular-nums',
        opacity: Math.min(1, k * 1.8) * (1 - out),
        scale: String(1.35 - 0.35 * k + 0.03 * Math.sin(settle * Math.PI) - out * 0.08),
        filter: `blur(${(1 - k) * 26 + out * 16}px)`,
        ...(gradient ? {backgroundImage: gradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'} : {}),
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Circular avatar cropped from a graded cut-out. */
export const Avatar: React.FC<{src: string; size: number; position?: string; ring?: string}> = ({src, size, position = '50% 6%', ring = '#fff'}) => (
  <div style={{width: size, height: size, borderRadius: size, overflow: 'hidden', background: '#E9E9EE', boxShadow: `0 0 0 4px ${ring}`, flexShrink: 0}}>
    <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: position, scale: '1.6', transformOrigin: position}} />
  </div>
);

/** Count that ticks up with tabular figures (for decimals like 1.32). */
export const CountUp: React.FC<{to: number; start: number; end: number; decimals?: number; size: number; color?: string; weight?: number}> = ({to, start, end, decimals = 0, size, color = paper.text, weight = 800}) => {
  const {p} = useT();
  const k = p(start, end - start, paperEase.arrive);
  return (
    <span style={{fontFamily: fonts.display, fontSize: size, fontWeight: weight, letterSpacing: '-0.055em', color, fontVariantNumeric: 'tabular-nums', lineHeight: 0.9, opacity: Math.min(1, k * 3), filter: `blur(${(1 - Math.min(1, k * 2)) * 10}px)`}}>
      {(to * k).toFixed(decimals)}
    </span>
  );
};

export const fade = (p: number) => ({opacity: p, filter: `blur(${(1 - p) * 10}px)`});
