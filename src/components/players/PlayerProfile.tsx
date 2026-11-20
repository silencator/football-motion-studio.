import React from 'react';
import {Img, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, type} from '../../design/tokens';
import {useLayout} from '../../design/useLayout';
import {mix, progress} from '../../lib/anim';
import {GlassPanel} from '../backgrounds/GlassPanel';
import {AnimatedText} from '../typography/AnimatedText';
import {Kicker} from '../typography/Kicker';

export type Player = {
  name: string;
  club?: string;
  position?: string;
  number?: number;
  nationality?: string;
  /** staticFile('images/...') or URL of a cut-out photo. */
  photo?: string;
  color?: string;
  stats?: {label: string; value: string}[];
};

/** Player card: photo with rim light, name reveal, key facts in a glass strip. */
export const PlayerProfile: React.FC<{player: Player; delay?: number; align?: 'left' | 'right'}> = ({player, delay = 0, align = 'left'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {s} = useLayout();
  const accent = player.color ?? colors.accent;
  const photoP = progress(frame, delay, 1.2 * fps);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: align === 'left' ? 'flex-start' : 'flex-end', gap: s(24), fontFamily: fonts.text}}>
      {player.photo && (
        <div style={{position: 'relative', width: s(460), height: s(560), opacity: photoP, translate: `0 ${mix(photoP, s(40), 0)}px`}}>
          <div style={{position: 'absolute', inset: 0, background: `radial-gradient(60% 50% at 50% 60%, ${accent}55 0%, transparent 70%)`}} />
          <Img src={player.photo} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', filter: 'contrast(1.05) saturate(1.05)'}} />
        </div>
      )}
      <Kicker text={[player.position, player.club].filter(Boolean).join('  ·  ')} delay={delay + 0.2 * fps} color={accent} />
      <div style={{display: 'flex', alignItems: 'baseline', gap: s(24)}}>
        {player.number !== undefined && (
          <span style={{...type.h1, fontFamily: fonts.display, fontSize: s(type.h1.fontSize), color: accent, opacity: progress(frame, delay + 0.3 * fps, 0.6 * fps)}}>{player.number}</span>
        )}
        <AnimatedText text={player.name} variant="h1" delay={delay + 0.35 * fps} />
      </div>
      {player.stats && (
        <GlassPanel padding={28} style={{display: 'flex', gap: s(48), opacity: progress(frame, delay + 0.8 * fps, 0.7 * fps)}}>
          {player.stats.map((st) => (
            <div key={st.label}>
              <div style={{...type.h2, fontFamily: fonts.display, fontSize: s(type.h2.fontSize), color: colors.white}}>{st.value}</div>
              <div style={{...type.kicker, fontSize: s(18), color: colors.mist}}>{st.label}</div>
            </div>
          ))}
        </GlassPanel>
      )}
    </div>
  );
};
