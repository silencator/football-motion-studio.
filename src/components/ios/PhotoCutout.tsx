import React from 'react';
import {Img, staticFile} from 'remotion';
import {paperEase} from '../../design/tokens';
import {useT} from './scene';

/**
 * Pre-graded cut-out (shadow baked in by scripts/grade-photos.py) entering with depth:
 * rises + de-blurs, then drifts slowly (parallax) until the scene ends.
 */
export const PhotoCutout: React.FC<{
  src: string; // file in public/images
  at: number;
  until: number;
  height: number;
  x?: number; // px offset from centre
  bottom?: number;
  from?: 'below' | 'right' | 'left' | 'scale';
  drift?: number; // px of slow parallax travel
  exitAt?: number;
  style?: React.CSSProperties;
}> = ({src, at, until, height, x = 0, bottom = 0, from = 'below', drift = 40, exitAt, style}) => {
  const {p, t} = useT();
  const k = p(at, 0.9, paperEase.arrive);
  const life = Math.min(1, Math.max(0, (t - at) / Math.max(0.5, until - at)));
  const out = exitAt === undefined ? 0 : p(exitAt, 0.4, paperEase.exit);
  const ox = from === 'right' ? (1 - k) * 260 : from === 'left' ? -(1 - k) * 260 : 0;
  const oy = from === 'below' ? (1 - k) * 220 : 0;
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute',
        left: '50%',
        bottom,
        height,
        translate: `calc(-50% + ${x + ox - life * drift * 0.4}px) ${oy - life * drift * 0.25 + out * 60}px`,
        scale: String((from === 'scale' ? 0.9 + 0.1 * k : 1) * (1 + life * 0.035)),
        opacity: Math.min(1, k * 1.4) * (1 - out),
        filter: `blur(${(1 - k) * 14 + out * 12}px)`,
        transformOrigin: '50% 100%',
        ...style,
      }}
    />
  );
};
