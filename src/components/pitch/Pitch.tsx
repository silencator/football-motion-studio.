import React, {createContext, useContext} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from '../../design/tokens';
import {mix, progress} from '../../lib/anim';

/** Pitch coordinate system: x 0–105 (length, metres), y 0–68 (width). Use for all overlays. */
export const PITCH_W = 105;
export const PITCH_H = 68;

const PitchContext = createContext({portrait: false});
/** Overlays use this to keep labels upright when the pitch is rotated. */
export const usePitch = () => useContext(PitchContext);

export type PitchProps = {
  /** Rendered width in px; height derives from aspect. */
  width: number;
  /** Seconds the line-drawing takes. 0 = already drawn. */
  drawDuration?: number;
  delay?: number;
  lineColor?: string;
  surface?: 'glass' | 'grass' | 'none';
  /** Rotate to portrait (for vertical formats). */
  portrait?: boolean;
  children?: React.ReactNode; // SVG overlays in pitch coordinates
  /** 3D tilt in degrees (CSS perspective). */
  tilt?: number;
};

/** Minimal line-art pitch that draws itself; overlays use metric pitch coordinates. */
export const Pitch: React.FC<PitchProps> = ({
  width, drawDuration = 1.6, delay = 0, lineColor = 'rgba(255,255,255,0.55)', surface = 'glass', portrait = false, children, tilt = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = drawDuration === 0 ? 1 : progress(frame, delay, drawDuration * fps);
  const vbW = portrait ? PITCH_H : PITCH_W;
  const vbH = portrait ? PITCH_W : PITCH_H;
  const height = (width * vbH) / vbW;
  const line = {fill: 'none', stroke: lineColor, strokeWidth: 0.3, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p} as const;
  const fill = surface === 'grass'
    ? `linear-gradient(180deg, ${colors.pitch} 0%, ${colors.pitchDeep} 100%)`
    : surface === 'glass' ? 'linear-gradient(180deg, rgba(31,138,76,0.18) 0%, rgba(11,61,34,0.08) 100%)' : 'transparent';
  return (
    <div style={{width, height, perspective: width * 1.4}}>
      <div style={{width, height, rotate: `x ${tilt}deg`, transformStyle: 'preserve-3d', borderRadius: width * 0.012, background: fill, opacity: mix(progress(frame, delay, 0.5 * fps), 0, 1)}}>
        <svg viewBox={`0 0 ${vbW} ${vbH}`} width={width} height={height} style={{overflow: 'visible'}}>
          <g transform={portrait ? `translate(${PITCH_H} 0) rotate(90)` : undefined}>
            <rect x={0} y={0} width={PITCH_W} height={PITCH_H} {...line} />
            <path d={`M52.5 0 V68`} {...line} />
            <circle cx={52.5} cy={34} r={9.15} {...line} />
            <circle cx={52.5} cy={34} r={0.4} fill={lineColor} opacity={p} />
            {[0, 1].map((side) => {
              const m = (x: number) => (side ? PITCH_W - x : x);
              return (
                <g key={side}>
                  <path d={`M${m(0)} 13.84 H${m(16.5)} V54.16 H${m(0)}`} {...line} />
                  <path d={`M${m(0)} 24.84 H${m(5.5)} V43.16 H${m(0)}`} {...line} />
                  <circle cx={m(11)} cy={34} r={0.4} fill={lineColor} opacity={p} />
                  <path d={side ? `M${m(16.5)} 26.69 A9.15 9.15 0 0 0 ${m(16.5)} 41.31` : `M16.5 26.69 A9.15 9.15 0 0 1 16.5 41.31`} {...line} />
                </g>
              );
            })}
            <PitchContext.Provider value={{portrait}}>{children}</PitchContext.Provider>
          </g>
        </svg>
      </div>
    </div>
  );
};
