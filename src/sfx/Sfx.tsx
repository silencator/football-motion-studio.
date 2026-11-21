import React from 'react';
import {Sequence, staticFile, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';

export type SfxName = 'whoosh-soft' | 'whoosh-fast' | 'whoosh-low' | 'click' | 'tick' | 'pop' | 'impact' | 'impact-soft' | 'kick' | 'net';

/** One sound effect at an absolute second (top-level, outside Scenes). Files in public/sfx (scripts/make-sfx.py). */
export const Sfx: React.FC<{at: number; name: SfxName; volume?: number}> = ({at, name, volume = 0.35}) => {
  const {fps} = useVideoConfig();
  return (
    <Sequence from={Math.max(0, Math.round(at * fps))} durationInFrames={Math.round(1.3 * fps)} layout="none" name={`sfx:${name}`}>
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
    </Sequence>
  );
};
