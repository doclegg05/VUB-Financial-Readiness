import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from 'remotion';

/**
 * Intro explainer for "Digital Literacy — Level 1" (VUB).
 * Narration matches courses/digital-literacy-1/intro-video-transcript.html.
 * Scene timings (30fps):
 *   Title      0–240    (8s)
 *   What is DL 240–720   (16s)
 *   IC3/ladder 720–1170  (15s)
 *   Roadmap    1170–2670 (50s)
 *   How it works 2670–3420 (25s)
 *   Why vets   3420–4170 (25s)
 *   Closing    4170–4800 (21s)
 */

const NAVY = '#0D1B2A';
const NAVY_MID = '#1B365D';
const GOLD = '#C9A227';
const GOLD_LIGHT = '#E6C65C';
const WHITE = '#FFFFFF';
const MUTED = '#E6ECF7';
const FONT = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';

const fadeUp = (
  frame: number,
  start: number,
  dur = 18,
  shift = 28
): React.CSSProperties => {
  const opacity = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [start, start + dur], [shift, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return { opacity, transform: `translateY(${y}px)` };
};

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(135deg, ${NAVY_MID} 0%, ${NAVY} 100%)`,
      fontFamily: FONT,
      color: WHITE,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 140,
      textAlign: 'center',
    }}
  >
    {/* faint star band */}
    <AbsoluteFill style={{ opacity: 0.12, pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
    </AbsoluteFill>
    {children}
  </AbsoluteFill>
);

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      color: GOLD_LIGHT,
      fontWeight: 800,
      letterSpacing: 6,
      textTransform: 'uppercase',
      fontSize: 26,
    }}
  >
    {children}
  </div>
);

const Title: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <div style={fadeUp(f, 6)}>
        <div style={{ fontSize: 40, color: GOLD, letterSpacing: 10 }}>★ ★ ★</div>
        <h1
          style={{
            fontFamily: SERIF,
            fontWeight: 900,
            fontSize: 120,
            margin: '18px 0 6px',
            lineHeight: 1.02,
          }}
        >
          Digital Literacy
        </h1>
        <div style={{ fontSize: 64, fontWeight: 800, color: GOLD_LIGHT }}>
          Level 1
        </div>
      </div>
      <div style={{ ...fadeUp(f, 40), marginTop: 34, fontSize: 32, color: MUTED }}>
        Veterans Upward Bound · A U.S. Department of Education TRIO Program
      </div>
    </Stage>
  );
};

const Centered: React.FC<{
  eyebrow: string;
  heading: string;
  body: string;
}> = ({ eyebrow, heading, body }) => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <div style={fadeUp(f, 4)}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h2
        style={{
          ...fadeUp(f, 16),
          fontFamily: SERIF,
          fontWeight: 800,
          fontSize: 78,
          margin: '20px 0 26px',
          maxWidth: 1400,
        }}
      >
        {heading}
      </h2>
      <p
        style={{
          ...fadeUp(f, 30),
          fontSize: 40,
          lineHeight: 1.5,
          color: MUTED,
          maxWidth: 1320,
        }}
      >
        {body}
      </p>
    </Stage>
  );
};

const WEEKS: { n: string; title: string; topic: string }[] = [
  { n: '1', title: 'Inside the Computer', topic: 'Devices, hardware, software & operating systems' },
  { n: '2', title: 'Getting Online', topic: 'Browsers, networks & Wi-Fi, searching, copyright' },
  { n: '3', title: 'Creating & Communicating', topic: 'Documents, files, printing, email, teamwork' },
  { n: '4', title: 'Citizenship & Safety', topic: 'Identity, privacy, passwords, online safety' },
  { n: '5', title: 'Review & Testing Day', topic: 'A review game, then the Post-Test' },
];

const Roadmap: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <div style={fadeUp(f, 4)}>
        <Eyebrow>Five weeks · two hours each</Eyebrow>
        <h2
          style={{
            fontFamily: SERIF,
            fontWeight: 800,
            fontSize: 70,
            margin: '16px 0 40px',
          }}
        >
          Your roadmap
        </h2>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
          width: 1300,
        }}
      >
        {WEEKS.map((w, i) => {
          // stagger each row in after the heading
          const start = 60 + i * 60;
          return (
            <div
              key={w.n}
              style={{
                ...fadeUp(f, start, 16, 34),
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(228,196,90,0.35)',
                borderRadius: 14,
                padding: '22px 30px',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: 78,
                  height: 78,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 50% 38%, ${NAVY_MID}, ${NAVY})`,
                  border: `3px solid ${GOLD}`,
                  color: GOLD_LIGHT,
                  fontWeight: 900,
                  fontSize: 38,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {w.n}
              </div>
              <div>
                <div style={{ fontSize: 40, fontWeight: 800 }}>{w.title}</div>
                <div style={{ fontSize: 28, color: MUTED, marginTop: 4 }}>
                  {w.topic}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

const Bullets: React.FC<{ eyebrow: string; heading: string; items: string[] }> = ({
  eyebrow,
  heading,
  items,
}) => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <div style={fadeUp(f, 4)}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h2
        style={{
          ...fadeUp(f, 16),
          fontFamily: SERIF,
          fontWeight: 800,
          fontSize: 70,
          margin: '16px 0 36px',
        }}
      >
        {heading}
      </h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          width: 1200,
          textAlign: 'left',
        }}
      >
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              ...fadeUp(f, 40 + i * 22, 16, 24),
              display: 'flex',
              alignItems: 'flex-start',
              gap: 20,
              fontSize: 38,
              lineHeight: 1.4,
            }}
          >
            <span style={{ color: GOLD, fontWeight: 900, flexShrink: 0 }}>★</span>
            <span style={{ color: MUTED }}>{it}</span>
          </div>
        ))}
      </div>
    </Stage>
  );
};

const Closing: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Stage>
      <div style={fadeUp(f, 8)}>
        <div style={{ fontSize: 40, color: GOLD, letterSpacing: 10 }}>★ ★ ★</div>
        <h2
          style={{
            fontFamily: SERIF,
            fontWeight: 900,
            fontSize: 96,
            margin: '20px 0 18px',
          }}
        >
          Let&rsquo;s get started.
        </h2>
        <p style={{ fontSize: 40, color: MUTED, maxWidth: 1200 }}>
          Open Week 1 in your course dashboard, and take the Pre-Test when you
          are ready. You have got this.
        </p>
      </div>
    </Stage>
  );
};

export const Intro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <Sequence durationInFrames={240}>
        <Audio src={staticFile('vo-1-welcome.mp3')} />
        <Title />
      </Sequence>
      <Sequence from={240} durationInFrames={480}>
        <Audio src={staticFile('vo-2-what.mp3')} />
        <Centered
          eyebrow="What is digital literacy?"
          heading="The confidence to use today's technology"
          body="Digital literacy is being able to use computers, the internet, and everyday digital tools comfortably and safely — for your health, your benefits, your family, and your goals."
        />
      </Sequence>
      <Sequence from={720} durationInFrames={450}>
        <Audio src={staticFile('vo-3-ic3.mp3')} />
        <Centered
          eyebrow="A recognized standard"
          heading="Aligned to IC3 GS6 — Level 1"
          body="This course follows the IC3 Digital Literacy objectives, Level 1. It is the first step of a Level 1 → 2 → 3 path, so you can keep building from here."
        />
      </Sequence>
      <Sequence from={1170} durationInFrames={1500}>
        <Audio src={staticFile('vo-4-roadmap.mp3')} />
        <Roadmap />
      </Sequence>
      <Sequence from={2670} durationInFrames={750}>
        <Audio src={staticFile('vo-5-how.mp3')} />
        <Bullets
          eyebrow="How the class works"
          heading="Hands-on, at your pace"
          items={[
            'We meet once a week for two hours, in the computer lab.',
            'Every week has a hands-on lab so you practice on a real computer.',
            'A Pre-Test in Week 1 and a Post-Test in Week 5 show how much you have grown.',
          ]}
        />
      </Sequence>
      <Sequence from={3420} durationInFrames={750}>
        <Audio src={staticFile('vo-6-why.mp3')} />
        <Bullets
          eyebrow="Why it matters"
          heading="Skills that serve you"
          items={[
            'Manage your VA benefits and health care online.',
            'Stay connected with family and your community.',
            'Protect your identity, your devices, and your money.',
          ]}
        />
      </Sequence>
      <Sequence from={4170} durationInFrames={630}>
        <Audio src={staticFile('vo-7-closing.mp3')} />
        <Closing />
      </Sequence>
    </AbsoluteFill>
  );
};
