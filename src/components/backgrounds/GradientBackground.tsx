import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, gradients} from '../../design/tokens';

export type GradientBackgroundProps = {
  base?: keyof typeof gradients | string;
  /** Slow-drifting light orbs for depth. Colors at low alpha. */
  glows?: {color: string; x: number; y: number; size: number}[];
  /** Drift amount in % of canvas over 10s. 0 = static. */
  drift?: number;
  vignette?: boolean;
  grain?: boolean;
};

/** Deep cinematic canvas: radial base + soft moving light + vignette + film grain. */
export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  base = 'night',
  glows = [
    {color: 'rgba(46,123,255,0.22)', x: 25, y: 30, size: 70},
    {color: 'rgba(31,138,76,0.14)', x: 75, y: 75, size: 60},
  ],
  drift = 4,
  vignette = true,
  grain = true,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps / 10;
  const bg = base in gradients ? gradients[base as keyof typeof gradients] : base;
  return (
    <AbsoluteFill style={{background: colors.ink}}>
      <AbsoluteFill style={{background: bg}} />
      {glows.map((g, i) => (
        <AbsoluteFill
          key={i}
          style={{
            background: `radial-gradient(${g.size}% ${g.size}% at ${g.x + Math.sin(t * 2 * Math.PI + i) * drift}% ${
              g.y + Math.cos(t * 2 * Math.PI + i * 2) * drift
            }%, ${g.color} 0%, transparent 70%)`,
            mixBlendMode: 'screen',
          }}
        />
      ))}
      {vignette && <AbsoluteFill style={{background: 'radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.65) 100%)'}} />}
      {grain && <Grain />}
    </AbsoluteFill>
  );
};

/** Deterministic SVG film grain (seed changes per frame, no Math.random). */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.05}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id={`grain-${frame % 8}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 8} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${frame % 8})`} />
      </svg>
    </AbsoluteFill>
  );
};
