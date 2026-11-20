import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, ease, fonts, type} from '../../design/tokens';
import {useLayout} from '../../design/useLayout';
import {mix, progress} from '../../lib/anim';

export type TimelineEvent = {
  /** Position label (year, minute "67'", date). */
  at: string;
  title: string;
  detail?: string;
  /** 0–1 position along the line. Defaults to even spacing. */
  pos?: number;
  highlight?: boolean;
};

/** Career / match timeline: hairline draws, nodes pop, labels rise. Horizontal or vertical (auto in portrait). */
export const Timeline: React.FC<{events: TimelineEvent[]; delay?: number; perEvent?: number; length?: number; orientation?: 'auto' | 'horizontal' | 'vertical'; accent?: string}> = ({
  events, delay = 0, perEvent = 0.45, length = 1500, orientation = 'auto', accent = colors.accent,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {s, vertical: portrait} = useLayout();
  const vert = orientation === 'vertical' || (orientation === 'auto' && portrait);
  const L = s(length);
  const lineP = progress(frame, delay, (events.length * perEvent + 0.4) * fps, ease.inOut);
  return (
    <div style={{position: 'relative', width: vert ? s(900) : L, height: vert ? L : s(360), fontFamily: fonts.text}}>
      <div style={{position: 'absolute', background: colors.hairline, ...(vert ? {left: s(40), top: 0, width: 2, height: L} : {top: s(180), left: 0, height: 2, width: L})}} />
      <div style={{position: 'absolute', background: `linear-gradient(${vert ? '180deg' : '90deg'}, transparent, ${accent})`,
        ...(vert ? {left: s(40), top: 0, width: 2, height: L * lineP} : {top: s(180), left: 0, height: 2, width: L * lineP})}} />
      {events.map((e, i) => {
        const pos = e.pos ?? (events.length === 1 ? 0.5 : 0.05 + (0.9 * i) / (events.length - 1));
        const start = delay + i * perEvent * fps + 0.2 * fps;
        const p = progress(frame, start, 0.7 * fps);
        const dot = s(e.highlight ? 22 : 14);
        const c = e.highlight ? colors.gold : accent;
        const above = !vert && i % 2 === 0;
        return (
          <div key={i} style={{position: 'absolute', ...(vert ? {top: L * pos, left: s(40)} : {left: L * pos, top: s(180)})}}>
            <div style={{position: 'absolute', width: dot, height: dot, borderRadius: 99, background: c, left: -dot / 2 + 1, top: -dot / 2 + 1, scale: String(p), boxShadow: `0 0 ${s(24)}px ${c}`}} />
            <div style={{position: 'absolute', opacity: p, width: s(360),
              ...(vert ? {left: s(48), top: -s(28), translate: `${mix(p, s(24), 0)}px 0`} : {left: -s(180), textAlign: 'center', [above ? 'bottom' : 'top']: s(36), translate: `0 ${mix(p, above ? s(20) : -s(20), 0)}px`})}}>
              <div style={{...type.kicker, fontSize: s(22), color: c}}>{e.at}</div>
              <div style={{...type.h3, fontFamily: fonts.display, fontSize: s(40), color: colors.white, marginTop: s(6)}}>{e.title}</div>
              {e.detail && <div style={{...type.caption, fontSize: s(24), color: colors.mist, marginTop: s(4)}}>{e.detail}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
