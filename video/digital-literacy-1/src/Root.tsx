import React from 'react';
import { Composition } from 'remotion';
import { Intro } from './Intro';

// ~2:40 at 30fps. Keep durationInFrames in sync with the scene timings in Intro.tsx.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Intro"
      component={Intro}
      durationInFrames={4800}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
