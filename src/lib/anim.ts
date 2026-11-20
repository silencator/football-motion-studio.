import {interpolate, type EasingFunction} from 'remotion';
import {ease} from '../design/tokens';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0→1 progress between two frames with the house easing. */
export const progress = (frame: number, start: number, duration: number, easing: EasingFunction = ease.out) =>
  interpolate(frame, [start, start + Math.max(1, duration)], [0, 1], {...clamp, easing});

/** Map progress to a range. */
export const mix = (p: number, from: number, to: number) => from + (to - from) * p;

/** Enter + exit envelope: rises over `inDur`, holds, falls over `outDur` before `end`. */
export const envelope = (frame: number, start: number, end: number, inDur: number, outDur: number) =>
  Math.min(progress(frame, start, inDur), 1 - progress(frame, end - outDur, outDur, ease.in));

export const sec = (seconds: number, fps: number) => Math.round(seconds * fps);
