import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {useWindowedAudioData, visualizeAudio} from '@remotion/media-utils';
import {colors} from '../design/tokens';
import {useLayout} from '../design/useLayout';

/**
 * Live spectrum bars from an audio file (music beds / narration), via @remotion/media-utils.
 * For loudness-only effects prefer envelopeAt() from pre-analysed timing JSON (cheaper, deterministic).
 */
export const SpectrumBars: React.FC<{src: string; bars?: number; color?: string; height?: number; width?: number}> = ({
  src, bars = 48, color = colors.accentSoft, height = 160, width = 900,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {s} = useLayout();
  const {audioData, dataOffsetInSeconds} = useWindowedAudioData({src, frame, fps, windowInSeconds: 10});
  if (!audioData) return null;
  const v = visualizeAudio({fps, frame, audioData, numberOfSamples: 128, optimizeFor: 'speed', dataOffsetInSeconds}).slice(0, bars);
  const W = s(width);
  const H = s(height);
  const bw = W / bars;
  return (
    <svg width={W} height={H}>
      {v.map((amp, i) => {
        const h = Math.max(2, Math.min(1, amp * 3) * H);
        return <rect key={i} x={i * bw + bw * 0.25} y={(H - h) / 2} width={bw * 0.5} height={h} rx={bw * 0.25} fill={color} opacity={0.4 + amp} />;
      })}
    </svg>
  );
};

/** Wrap anything to make it breathe with narration loudness (0–1 from envelopeAt). */
export const Pulse: React.FC<{level: number; amount?: number; children: React.ReactNode; glow?: string}> = ({level, amount = 0.04, children, glow}) => (
  <div style={{scale: String(1 + level * amount), filter: glow ? `drop-shadow(0 0 ${level * 40}px ${glow})` : undefined}}>{children}</div>
);
