import React from 'react';
import { Composition } from 'remotion';
import { Intro } from './Intro';
import { LessonOverview, totalFrames, type OverviewScene } from './LessonOverview';
import { WEEK1_OVERVIEW, WEEK2_OVERVIEW, WEEK2_LESSON } from './weeks-data';
import { WEEK1_LESSON } from './week1-lesson-data';
import { WEEK3_LESSON } from './week3-lesson-data';
import { WEEK4_LESSON } from './week4-lesson-data';
import { WEEK5_LESSON } from './week5-lesson-data';
import { WEEK_THEMES } from './lib';

// Smoke test: exercises all five theme-aware scene kinds in the Week-2 accent.
// No audio, no bg — purely to verify the engine compiles and renders.
const ENGINE_SMOKE: OverviewScene[] = [
  {
    kind: 'chapterCard',
    durationInFrames: 150,
    kicker: 'Week 2 · Objectives',
    heading: "Today you'll be able to…",
    objectives: [
      { icon: '🧭', label: 'Navigate your computer and a web browser' },
      { icon: '📶', label: 'Understand how you connect to the internet' },
      { icon: '🔧', label: 'Fix common connection problems yourself' },
      { icon: '🔍', label: 'Search smarter and use content fairly' },
    ],
  },
  {
    kind: 'uiCallout',
    durationInFrames: 150,
    heading: 'Desktop · Taskbar · Start',
    callouts: [
      { label: 'Desktop', note: 'The main screen — your icons and background.' },
      { label: 'Taskbar', note: 'The bottom strip: open programs, clock, Start.' },
      { label: 'Start menu', note: 'Press the Windows key to find any program.' },
    ],
    body: 'The same screen you see every day is your home base.',
  },
  {
    kind: 'compare',
    durationInFrames: 150,
    heading: 'Wired · Wi-Fi · Cellular',
    columns: [
      { icon: '🔌', title: 'Wired', lines: ['A cable to the router', 'Fast and steady', 'Common for desktops'] },
      { icon: '📶', title: 'Wi-Fi', lines: ['A wireless signal', 'No cables needed', 'Connects through the air'] },
      { icon: '📱', title: 'Cellular', lines: ['Mobile data', 'The phone network', 'Internet away from Wi-Fi'] },
    ],
  },
  {
    kind: 'steps',
    durationInFrames: 150,
    heading: 'When the internet stops working',
    steps: [
      { label: 'Check the Wi-Fi icon', note: 'Make sure Wi-Fi is on and the right network.' },
      { label: 'Try a different website', note: 'If only one fails, the problem is that site.' },
      { label: 'Restart the modem/router', note: 'Unplug, wait 30 seconds, plug back in.' },
      { label: 'Restart your computer', note: 'Clears many small glitches.' },
    ],
  },
  {
    kind: 'question',
    durationInFrames: 150,
    heading: 'A globe icon means…?',
    question: 'A globe icon means…?',
    answer: 'You are NOT connected to the internet.',
    why: 'Check that Wi-Fi is on and you joined the right network.',
  },
  {
    kind: 'chapterCard',
    durationInFrames: 150,
    kicker: 'Recap',
    heading: 'You did it.',
    subtitle: 'Get online, stay connected, and search with confidence.',
  },
];

// ~2:40 at 30fps. Keep durationInFrames in sync with the scene timings in Intro.tsx.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={4800}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Week1Overview"
        component={LessonOverview}
        durationInFrames={totalFrames(WEEK1_OVERVIEW)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ scenes: WEEK1_OVERVIEW }}
      />
      <Composition
        id="Week2Overview"
        component={LessonOverview}
        durationInFrames={totalFrames(WEEK2_OVERVIEW)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ scenes: WEEK2_OVERVIEW }}
      />
      <Composition
        id="Week2Lesson"
        component={LessonOverview}
        durationInFrames={totalFrames(WEEK2_LESSON)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ scenes: WEEK2_LESSON, theme: WEEK_THEMES.week2 }}
      />
      <Composition
        id="Week1Lesson"
        component={LessonOverview}
        durationInFrames={totalFrames(WEEK1_LESSON)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ scenes: WEEK1_LESSON, theme: WEEK_THEMES.week1 }}
      />
      <Composition
        id="Week3Lesson"
        component={LessonOverview}
        durationInFrames={totalFrames(WEEK3_LESSON)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ scenes: WEEK3_LESSON, theme: WEEK_THEMES.week3 }}
      />
      <Composition
        id="Week4Lesson"
        component={LessonOverview}
        durationInFrames={totalFrames(WEEK4_LESSON)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ scenes: WEEK4_LESSON, theme: WEEK_THEMES.week4 }}
      />
      <Composition
        id="Week5Lesson"
        component={LessonOverview}
        durationInFrames={totalFrames(WEEK5_LESSON)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ scenes: WEEK5_LESSON, theme: WEEK_THEMES.week5 }}
      />
      <Composition
        id="EngineSmoke"
        component={LessonOverview}
        durationInFrames={totalFrames(ENGINE_SMOKE)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ scenes: ENGINE_SMOKE, theme: WEEK_THEMES.week2 }}
      />
    </>
  );
};
