import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig, type EasingFunction} from 'remotion';
import {paperEase} from '../../design/tokens';

/**
 * Absolute-time scenes: every scene and element is keyed to narration timestamps (seconds),
 * so visuals stay locked to the voice-over. useT() gives absolute time + progress helpers.
 */
const Offset = createContext(0);

/** Absolute start (seconds) of the enclosing Scene. */
export const useSceneOffset = () => useContext(Offset);

export const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const off = useContext(Offset);
  const t = frame / fps + off;
  /** 0→1 progress starting at absolute second `at` lasting `dur` seconds. */
  const p = (at: number, dur = 0.6, easing: EasingFunction = paperEase.arrive) =>
    interpolate(t, [at, at + Math.max(0.001, dur)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});
  return {t, p, fps, frame};
};

export type Transition = 'slide' | 'rise' | 'zoom' | 'blur' | 'none' | 'whip' | 'push';

const tx = (kind: Transition, k: number, dir: 1 | -1): React.CSSProperties => {
  // k: 0 = settled, 1 = fully away
  if (kind === 'none') return {};
  const blur = `blur(${k * 16}px)`;
  if (kind === 'slide') return {translate: `${dir * k * 220}px 0`, opacity: 1 - k, filter: blur};
  if (kind === 'rise') return {translate: `0 ${dir * k * 180}px`, opacity: 1 - k, filter: blur};
  if (kind === 'whip') return {translate: `${dir * k * 900}px 0`, opacity: 1 - k * k, filter: `blur(${k * 34}px)`, scale: String(1 - k * 0.06)};
  if (kind === 'push') return {scale: String(1 + dir * k * 0.45), opacity: 1 - k, filter: `blur(${k * 28}px)`};
  if (kind === 'zoom') return {scale: String(1 + dir * k * 0.12), opacity: 1 - k, filter: blur};
  return {opacity: 1 - k, filter: blur, scale: String(1 + k * 0.03)};
};

/** A scene living from `from` to `to` (absolute seconds), with overlapping enter/exit motion. */
export const Scene: React.FC<{from: number; to: number; enter?: Transition; exit?: Transition; children: React.ReactNode; name?: string}> = ({
  from, to, enter = 'slide', exit = 'slide', children, name,
}) => {
  const {fps} = useVideoConfig();
  const tail = 0.35;
  const start = Math.round(from * fps);
  const dur = Math.round((to + tail) * fps) - start;
  return (
    <Sequence from={start} durationInFrames={dur} name={name}>
      <Offset.Provider value={start / fps}>
        <SceneMotion from={from} to={to} enter={enter} exit={exit} tail={tail}>
          {children}
        </SceneMotion>
      </Offset.Provider>
    </Sequence>
  );
};

const SceneMotion: React.FC<{from: number; to: number; enter: Transition; exit: Transition; tail: number; children: React.ReactNode}> = ({from, to, enter, exit, tail, children}) => {
  const {p} = useT();
  const kin = 1 - p(from, 0.5, paperEase.arrive);
  const kout = p(to - 0.05, tail, paperEase.exit);
  const s = kout > 0 ? tx(exit, kout, -1) : tx(enter, kin, 1);
  return <AbsoluteFill style={s}>{children}</AbsoluteFill>;
};
