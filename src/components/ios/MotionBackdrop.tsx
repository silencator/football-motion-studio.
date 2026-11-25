import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {paper} from '../../design/tokens';
import {Grain} from '../backgrounds/GradientBackground';

/**
 * Living paper: the off-white canvas never sits still — two soft light pools drift, a faint
 * perspective dot-floor scrolls toward camera, fine grain. Keeps every frame in motion.
 */
export const MotionBackdrop: React.FC<{grain?: number}> = ({grain = 0.05}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const ax = 50 + 18 * Math.sin(t * 0.21), ay = 38 + 10 * Math.cos(t * 0.17);
  const bx = 50 + 22 * Math.cos(t * 0.13 + 1), by = 70 + 8 * Math.sin(t * 0.19 + 2);
  const scroll = (t * 40) % 80;
  return (
    <AbsoluteFill style={{background: paper.bg}}>
      <AbsoluteFill style={{background: `radial-gradient(60% 42% at ${ax}% ${ay}%, #FFFFFF 0%, rgba(255,255,255,0) 70%), radial-gradient(70% 50% at ${bx}% ${by}%, rgba(205,205,212,0.55) 0%, rgba(205,205,212,0) 70%), radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 55%, ${paper.bgEdge} 100%)`}} />
      {/* scrolling perspective dot floor (very faint) */}
      <div style={{position: 'absolute', left: '-50%', right: '-50%', bottom: -200, height: 1100, perspective: 900, opacity: 0.55}}>
        <div style={{position: 'absolute', inset: 0, rotate: 'x 72deg', transformOrigin: '50% 100%',
          backgroundImage: 'radial-gradient(circle, rgba(29,29,31,0.16) 2.2px, transparent 2.6px)', backgroundSize: '80px 80px', backgroundPosition: `0 ${scroll}px`,
          maskImage: 'linear-gradient(180deg, transparent 0%, #000 60%)', WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 60%)'}} />
      </div>
      {grain > 0 && <Grain opacity={grain} />}
    </AbsoluteFill>
  );
};
