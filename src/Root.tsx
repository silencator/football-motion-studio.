import React from 'react';
import {Composition, Folder} from 'remotion';
import {narrationMetadata} from './audio/narration';
import {Messi91} from './compositions/messi91/Messi91';
import {Dribbles10} from './compositions/dribbles10/Dribbles10';
import {Walks5} from './compositions/walks5/Walks5';
import {TestAnimation, testSchema} from './compositions/test/TestAnimation';

/**
 * Every production registers 4 deliverables: 1920×1080 & 1080×1920, each at 30 and 60 fps.
 * Naming: <Project>-Landscape-30 | <Project>-Landscape-60 | <Project>-Vertical-30 | <Project>-Vertical-60
 * Duration is normally computed from narration via calculateMetadata (durationInFrames below is a fallback).
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Messi-91">
        {/* 71.4 s narration + 3 s end card = 74.4 s → 4464 frames @ 60 fps */}
        <Composition id="Messi91-Vertical-60" component={Messi91} durationInFrames={4464} fps={60} width={1080} height={1920} />
      </Folder>
      <Folder name="Dribbles-10">
        {/* 10 s teaser + 2 s end card */}
        <Composition id="Dribbles10-Vertical-60" component={Dribbles10} durationInFrames={720} fps={60} width={1080} height={1920} />
      </Folder>
      <Folder name="Walks-5">
        {/* 5 s teaser + 1.5 s end card */}
        <Composition id="Walks5-Vertical-60" component={Walks5} durationInFrames={390} fps={60} width={1080} height={1920} />
      </Folder>
      <Folder name="System-Test">
        <Composition id="Test-Landscape-30" component={TestAnimation} schema={testSchema} calculateMetadata={narrationMetadata(30)}
          durationInFrames={180} fps={30} width={1920} height={1080} defaultProps={{title: 'Football Motion Studio', narration: 'test-narration.mp3'}} />
        <Composition id="Test-Landscape-60" component={TestAnimation} schema={testSchema} calculateMetadata={narrationMetadata(60)}
          durationInFrames={360} fps={60} width={1920} height={1080} defaultProps={{title: 'Football Motion Studio', narration: 'test-narration.mp3'}} />
        <Composition id="Test-Vertical-30" component={TestAnimation} schema={testSchema} calculateMetadata={narrationMetadata(30)}
          durationInFrames={180} fps={30} width={1080} height={1920} defaultProps={{title: 'Football Motion Studio', narration: 'test-narration.mp3'}} />
        <Composition id="Test-Vertical-60" component={TestAnimation} schema={testSchema} calculateMetadata={narrationMetadata(60)}
          durationInFrames={360} fps={60} width={1080} height={1920} defaultProps={{title: 'Football Motion Studio', narration: 'test-narration.mp3'}} />
      </Folder>
    </>
  );
};
