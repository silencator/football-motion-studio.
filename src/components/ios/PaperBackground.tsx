import React from 'react';
import {AbsoluteFill} from 'remotion';
import {paper} from '../../design/tokens';
import {Grain} from '../backgrounds/GradientBackground';

/** Off-white studio paper with a soft white-to-grey vignette and fine grain (photo reference). */
export const PaperBackground: React.FC<{grain?: number}> = ({grain = 0.05}) => (
  <AbsoluteFill style={{background: paper.bg}}>
    <AbsoluteFill style={{background: `radial-gradient(75% 55% at 50% 45%, #FBFBFC 0%, ${paper.bg} 55%, ${paper.bgEdge} 100%)`}} />
    {grain > 0 && <Grain opacity={grain} />}
  </AbsoluteFill>
);
