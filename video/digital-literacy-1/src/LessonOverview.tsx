import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from 'remotion';
import {
  Stage,
  Centered,
  Bullets,
  fadeUp,
  NAVY,
  GOLD,
  GOLD_LIGHT,
  MUTED,
  SERIF,
  ThemeProvider,
  DEFAULT_THEME,
  type Theme,
} from './lib';
import {
  ChapterCard,
  UiCallout,
  Compare,
  Steps,
  Question,
  type ChapterObjective,
  type Callout,
  type CompareColumn,
  type Step,
} from './scenes';

/**
 * Data-driven per-week lesson-overview video. A week is just an array of
 * scenes (on-screen text + the narration clip + its on-screen duration), so a
 * new week is a data block, not a new component. See weeks-data.ts.
 *
 * A scene may carry a `bg` image (in public/). When present it is shown
 * full-screen behind a navy scrim, and the text is drawn on a transparent
 * Stage so it stays legible over the photo.
 */

export type OverviewSceneKind =
  | 'title'
  | 'centered'
  | 'bullets'
  | 'closing'
  | 'chapterCard'
  | 'uiCallout'
  | 'compare'
  | 'steps'
  | 'question';

export interface OverviewScene {
  kind: OverviewSceneKind;
  /** narration clip filename in public/, e.g. "w1-1-title.mp3" (optional) */
  audio?: string;
  /** how long this scene holds on screen (30fps) */
  durationInFrames: number;
  /** optional full-screen background image in public/, e.g. "w2-bg-1.png" */
  bg?: string;
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  body?: string;
  items?: string[];
  // Theme-aware scene fields (chapterCard / uiCallout / compare / steps / question).
  kicker?: string;
  callouts?: Callout[];
  columns?: CompareColumn[];
  steps?: Step[];
  objectives?: ChapterObjective[];
  question?: string;
  answer?: string;
  why?: string;
}

export interface LessonOverviewProps {
  scenes: OverviewScene[];
  theme?: Theme;
}

export const totalFrames = (scenes: OverviewScene[]): number =>
  scenes.reduce((sum, s) => sum + s.durationInFrames, 0);

// Navy scrim over background photos so white/gold text keeps its contrast.
const PHOTO_OVERLAY =
  'linear-gradient(135deg, rgba(13,27,42,0.55) 0%, rgba(13,27,42,0.74) 100%)';

const TitleScene: React.FC<{
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  transparent?: boolean;
}> = ({ eyebrow, heading, subtitle, transparent }) => {
  const f = useCurrentFrame();
  return (
    <Stage transparent={transparent}>
      <div style={fadeUp(f, 6)}>
        <div style={{ fontSize: 40, color: GOLD, letterSpacing: 10 }}>★ ★ ★</div>
        {eyebrow ? (
          <div
            style={{
              color: GOLD_LIGHT,
              fontWeight: 800,
              letterSpacing: 6,
              textTransform: 'uppercase',
              fontSize: 30,
              marginTop: 14,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <h1
          style={{
            fontFamily: SERIF,
            fontWeight: 900,
            fontSize: 104,
            margin: '14px 0 6px',
            lineHeight: 1.04,
          }}
        >
          {heading}
        </h1>
      </div>
      {subtitle ? (
        <div style={{ ...fadeUp(f, 40), marginTop: 26, fontSize: 34, color: MUTED, maxWidth: 1300 }}>
          {subtitle}
        </div>
      ) : null}
    </Stage>
  );
};

const ClosingScene: React.FC<{ heading: string; body?: string; transparent?: boolean }> = ({
  heading,
  body,
  transparent,
}) => {
  const f = useCurrentFrame();
  return (
    <Stage transparent={transparent}>
      <div style={fadeUp(f, 8)}>
        <div style={{ fontSize: 40, color: GOLD, letterSpacing: 10 }}>★ ★ ★</div>
        <h2 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 88, margin: '18px 0 16px' }}>
          {heading}
        </h2>
        {body ? <p style={{ fontSize: 38, color: MUTED, maxWidth: 1200 }}>{body}</p> : null}
      </div>
    </Stage>
  );
};

const renderScene = (s: OverviewScene, transparent: boolean): React.ReactNode => {
  if (s.kind === 'chapterCard') {
    return (
      <ChapterCard
        kicker={s.kicker}
        heading={s.heading}
        subtitle={s.subtitle ?? s.body}
        objectives={s.objectives}
      />
    );
  }
  if (s.kind === 'uiCallout') {
    return <UiCallout heading={s.heading} callouts={s.callouts ?? []} caption={s.body} />;
  }
  if (s.kind === 'compare') {
    return <Compare heading={s.heading} columns={s.columns ?? []} />;
  }
  if (s.kind === 'steps') {
    return <Steps heading={s.heading} steps={s.steps ?? []} />;
  }
  if (s.kind === 'question') {
    return <Question question={s.question ?? s.heading} answer={s.answer ?? ''} why={s.why} />;
  }
  if (s.kind === 'title') {
    return (
      <TitleScene
        eyebrow={s.eyebrow}
        heading={s.heading}
        subtitle={s.subtitle}
        transparent={transparent}
      />
    );
  }
  if (s.kind === 'bullets') {
    return (
      <Bullets
        eyebrow={s.eyebrow ?? ''}
        heading={s.heading}
        items={s.items ?? []}
        transparent={transparent}
      />
    );
  }
  if (s.kind === 'closing') {
    return <ClosingScene heading={s.heading} body={s.body} transparent={transparent} />;
  }
  return (
    <Centered
      eyebrow={s.eyebrow ?? ''}
      heading={s.heading}
      body={s.body ?? ''}
      transparent={transparent}
    />
  );
};

// Soft dip-to-navy fade in/out + a slow Ken Burns push so nothing sits still.
const SceneFrame: React.FC<{ scene: OverviewScene; index: number }> = ({ scene, index }) => {
  const f = useCurrentFrame();
  const dur = scene.durationInFrames;
  const opacity = interpolate(f, [0, 12, dur - 12, dur], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (!scene.bg) {
    return <AbsoluteFill style={{ opacity }}>{renderScene(scene, false)}</AbsoluteFill>;
  }

  const src = staticFile(scene.bg);
  // Alternate the zoom direction per scene for variety.
  const [from, to] = index % 2 === 0 ? [1.06, 1.16] : [1.16, 1.06];
  const scale = interpolate(f, [0, dur], [from, to], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: NAVY }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        {/* Blurred copy fills the 16:9 frame for any source aspect ratio... */}
        <AbsoluteFill>
          <Img
            src={src}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(48px)',
              transform: 'scale(1.2)',
            }}
          />
        </AbsoluteFill>
        {/* ...while the full image shows centered and uncropped on top. */}
        <AbsoluteFill>
          <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: PHOTO_OVERLAY }} />
      {renderScene(scene, true)}
    </AbsoluteFill>
  );
};

export const LessonOverview: React.FC<LessonOverviewProps> = ({ scenes, theme }) => {
  // Cumulative start frame for each scene.
  const starts: number[] = [];
  scenes.reduce((acc, s, i) => {
    starts[i] = acc;
    return acc + s.durationInFrames;
  }, 0);

  return (
    <ThemeProvider theme={theme ?? DEFAULT_THEME}>
      <AbsoluteFill style={{ backgroundColor: NAVY }}>
        {scenes.map((s, i) => (
          <Sequence key={i} from={starts[i]} durationInFrames={s.durationInFrames}>
            {s.audio ? <Audio src={staticFile(s.audio)} /> : null}
            <SceneFrame scene={s} index={i} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </ThemeProvider>
  );
};
