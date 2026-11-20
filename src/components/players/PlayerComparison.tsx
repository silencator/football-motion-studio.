import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, type} from '../../design/tokens';
import {useLayout} from '../../design/useLayout';
import {progress} from '../../lib/anim';
import {RadarChart} from '../stats/RadarChart';
import {StatBars, type StatRow} from '../stats/StatBars';
import {AnimatedText} from '../typography/AnimatedText';

export type ComparisonProps = {
  a: {name: string; color?: string; radar?: number[]};
  b: {name: string; color?: string; radar?: number[]};
  rows: StatRow[];
  radarAxes?: string[];
  delay?: number;
};

/** Two players side by side: names, optional overlaid radar, head-to-head bars. Stacks in vertical. */
export const PlayerComparison: React.FC<ComparisonProps> = ({a, b, rows, radarAxes, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {s, vertical} = useLayout();
  const ca = a.color ?? colors.teamA;
  const cb = b.color ?? colors.teamB;
  return (
    <div style={{display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: 'center', gap: s(96), fontFamily: fonts.text}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: s(48)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: s(40)}}>
          <AnimatedText text={a.name} variant="h2" color={ca} delay={delay} />
          <span style={{...type.kicker, fontSize: s(24), color: colors.haze, opacity: progress(frame, delay + 0.3 * fps, 0.5 * fps)}}>VS</span>
          <AnimatedText text={b.name} variant="h2" color={cb} delay={delay + 0.15 * fps} align="right" />
        </div>
        <StatBars rows={rows} delay={delay + 0.5 * fps} colorA={ca} colorB={cb} width={vertical ? 1250 : 900} />
      </div>
      {radarAxes && a.radar && b.radar && (
        <RadarChart axes={radarAxes} delay={delay + 0.4 * fps} size={vertical ? 900 : 620}
          series={[{name: a.name, values: a.radar, color: ca}, {name: b.name, values: b.radar, color: cb}]} />
      )}
    </div>
  );
};
