import {linearTiming, springTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {ease} from '../../design/tokens';
import {blurDissolve} from './blurDissolve';

/**
 * House transitions for <TransitionSeries>. Keep to these — restraint is the brand.
 * Usage: <TransitionSeries.Transition presentation={T.blur.presentation} timing={T.blur.timing(fps)} />
 */
export const T = {
  /** Default between scenes: soft blur + scale dissolve. */
  blur: {presentation: blurDissolve(), timing: (fps: number) => linearTiming({durationInFrames: Math.round(0.8 * fps), easing: ease.inOut})},
  fade: {presentation: fade(), timing: (fps: number) => linearTiming({durationInFrames: Math.round(0.6 * fps), easing: ease.inOut})},
  /** Chapter change: directional push. */
  push: {presentation: slide({direction: 'from-right'}), timing: (fps: number) => springTiming({config: {damping: 200}, durationInFrames: Math.round(0.9 * fps)})},
  wipe: {presentation: wipe({direction: 'from-left'}), timing: (fps: number) => linearTiming({durationInFrames: Math.round(0.7 * fps), easing: ease.inOut})},
};
