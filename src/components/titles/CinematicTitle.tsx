import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, ease, gradients} from '../../design/tokens';
import {useLayout} from '../../design/useLayout';
import {mix, progress} from '../../lib/anim';
import {AnimatedText} from '../typography/AnimatedText';
import {Kicker} from '../typography/Kicker';

export type CinematicTitleProps = {
  kicker?: string;
  title: string;
  subtitle?: string;
  /** Total length in frames of the title's Sequence (for the exit). */
  durationInFrames: number;
  gradient?: string;
};

/** Opening title: light sweep, slow push-in, kicker → title → subtitle cascade, blurred exit. */
export const CinematicTitle: React.FC<CinematicTitleProps> = ({kicker, title, subtitle, durationInFrames, gradient = gradients.accentText}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {s, safe} = useLayout();
  const push = mix(progress(frame, 0, durationInFrames, ease.inOut), 1.0, 1.06);
  const exitAt = durationInFrames - Math.round(0.6 * fps);
  const sweep = progress(frame, 0.2 * fps, 1.6 * fps, ease.inOut);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: `${safe.y}px ${safe.x}px`}}>
      {/* light sweep */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(100deg, transparent ${mix(sweep, -30, 100)}%, rgba(255,255,255,0.07) ${mix(sweep, -15, 115)}%, transparent ${mix(sweep, 0, 130)}%)`,
        }}
      />
      <div style={{scale: String(push), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: s(28)}}>
        {kicker && <Kicker text={kicker} delay={0.1 * fps} />}
        <AnimatedText text={title} variant="hero" align="center" delay={0.35 * fps} gradient={gradient} exitAt={exitAt} />
        {subtitle && <AnimatedText text={subtitle} variant="body" color={colors.mist} align="center" delay={0.9 * fps} exitAt={exitAt} />}
      </div>
    </AbsoluteFill>
  );
};
