import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';

type Props = {maxBlur?: number; scale?: number};

const BlurDissolve: React.FC<TransitionPresentationComponentProps<Props>> = ({children, presentationDirection, presentationProgress, passedProps}) => {
  const {maxBlur = 24, scale = 0.04} = passedProps;
  const entering = presentationDirection === 'entering';
  const p = presentationProgress;
  const k = entering ? 1 - p : p; // 0 = sharp, 1 = gone
  return (
    <AbsoluteFill style={{opacity: entering ? p : 1 - p, filter: `blur(${k * maxBlur}px)`, scale: String(entering ? 1 + k * scale : 1 - k * scale * 0.5)}}>
      {children}
    </AbsoluteFill>
  );
};

/** Apple-style blur dissolve with a subtle depth push. */
export const blurDissolve = (props: Props = {}): TransitionPresentation<Props> => ({component: BlurDissolve, props});
