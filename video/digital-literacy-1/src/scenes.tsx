import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { FONT, SERIF, fadeUp, useTheme, type Theme } from './lib';

/**
 * Five theme-aware lesson scene components — premium motion-graphics edition.
 *
 * Visual goals: broadcast-quality explainer / motion-graphics aesthetic while
 * staying calm and legible for older-beginner learners. Large type, gentle
 * motion, high contrast throughout.
 *
 * Rules kept:
 * - All colour read from useTheme(); zero hardcoded hex values.
 * - All prop signatures unchanged (LessonOverview / EngineSmoke still compile).
 * - Animate via useCurrentFrame() + interpolate() + fadeUp(); no DOM events.
 * - Fixed 1920 × 1080 — no responsive layout.
 */

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

/** Polished circular icon badge: accent-tinted gradient fill + thin accent ring. */
const IconBadge: React.FC<{
  children: React.ReactNode;
  size?: number;
  fontSize?: number;
  theme: Theme;
}> = ({ children, size = 84, fontSize = 42, theme }) => (
  <span
    style={{
      flexShrink: 0,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle at 38% 38%, ${theme.accentSoft}28 0%, ${theme.accent}18 60%, transparent 100%)`,
      border: `2.5px solid ${theme.accent}`,
      boxShadow: `0 0 0 6px ${theme.accent}12, 0 4px 16px rgba(0,0,0,0.28)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize,
      lineHeight: 1,
    }}
  >
    {children}
  </span>
);

/** Numeral badge: gradient accent fill, used for Steps. */
const NumBadge: React.FC<{ n: number; theme: Theme }> = ({ n, theme }) => (
  <span
    style={{
      flexShrink: 0,
      width: 80,
      height: 80,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${theme.accentSoft} 0%, ${theme.accent} 100%)`,
      boxShadow: `0 0 0 5px ${theme.accent}22, 0 6px 20px rgba(0,0,0,0.32)`,
      color: '#0D1B2A',
      fontWeight: 900,
      fontSize: 42,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONT,
    }}
  >
    {n}
  </span>
);

// ---------------------------------------------------------------------------
// BrandStar — persistent brand mark: gold star + "Digital Literacy · Level 1"
// small-caps wordmark, top-left of every ThemedStage.
// ---------------------------------------------------------------------------
const BrandStar: React.FC = () => {
  const theme = useTheme();
  return (
    <div
      style={{
        position: 'absolute',
        top: 44,
        left: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        pointerEvents: 'none',
      }}
    >
      {/* Gold star chip */}
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: '50%',
          background: `radial-gradient(circle at 38% 38%, ${theme.brandSoft} 0%, ${theme.brand} 100%)`,
          boxShadow: `0 0 0 4px ${theme.brand}28, 0 4px 14px rgba(0,0,0,0.36)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          lineHeight: 1,
          color: '#0D1B2A',
        }}
      >
        ★
      </div>
      {/* Wordmark */}
      <div
        style={{
          fontFamily: FONT,
          fontVariant: 'small-caps',
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: 2.2,
          color: theme.brand,
          opacity: 0.85,
          lineHeight: 1.25,
          textTransform: 'uppercase',
        }}
      >
        Digital Literacy
        <br />
        <span style={{ opacity: 0.65, letterSpacing: 1.8 }}>Level 1</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ThemedStage — full-bleed stage with subtle depth: radial key light, vignette,
// fine dot texture, and the navy→baseMid gradient.
// ---------------------------------------------------------------------------
const ThemedStage: React.FC<{
  children: React.ReactNode;
  align?: 'center' | 'flex-start';
  brandStar?: boolean;
}> = ({ children, align = 'center', brandStar = true }) => {
  const theme = useTheme();
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(150deg, ${theme.baseMid} 0%, ${theme.base} 60%, #060d16 100%)`,
        fontFamily: FONT,
        color: theme.text,
        justifyContent: 'center',
        alignItems: align,
        padding: 140,
        textAlign: align === 'center' ? 'center' : 'left',
      }}
    >
      {/* Subtle radial key light — top-centre warm glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 0%, ${theme.accent}1a 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      {/* Fine dot texture */}
      <AbsoluteFill style={{ opacity: 0.08, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,.55) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </AbsoluteFill>
      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />
      {brandStar ? <BrandStar /> : null}
      {children}
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        color: theme.accentSoft,
        fontWeight: 800,
        letterSpacing: 5,
        textTransform: 'uppercase',
        fontSize: 26,
      }}
    >
      {/* Short accent rule on each side of the kicker text */}
      <span
        style={{
          display: 'inline-block',
          width: 52,
          height: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, transparent, ${theme.accent})`,
          opacity: 0.8,
        }}
      />
      {children}
      <span
        style={{
          display: 'inline-block',
          width: 52,
          height: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${theme.accent}, transparent)`,
          opacity: 0.8,
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// 1. ChapterCard — centered title card (hook / objectives / chapter / signpost
//    / recap / outro). Optional accent-ringed objective rows.
// ---------------------------------------------------------------------------
export interface ChapterObjective {
  icon?: string;
  label: string;
}

export interface ChapterCardProps {
  kicker?: string;
  heading: string;
  subtitle?: string;
  objectives?: ChapterObjective[];
  brandStar?: boolean;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  kicker,
  heading,
  subtitle,
  objectives,
  brandStar = true,
}) => {
  const f = useCurrentFrame();
  const theme = useTheme();
  const hasObjectives = objectives && objectives.length > 0;

  return (
    <ThemedStage brandStar={brandStar}>
      <div style={{ ...fadeUp(f, 6), maxWidth: 1500 }}>
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        {/* Accent underline rule below the kicker */}
        {kicker ? (
          <div
            style={{
              width: 80,
              height: 4,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentSoft})`,
              margin: '16px auto 0',
              opacity: 0.9,
            }}
          />
        ) : null}
        <h1
          style={{
            fontFamily: SERIF,
            fontWeight: 900,
            fontSize: hasObjectives ? 80 : 96,
            margin: kicker ? '22px 0 0' : '0',
            lineHeight: 1.06,
            letterSpacing: -0.5,
          }}
        >
          {heading}
        </h1>
        {subtitle ? (
          <p
            style={{
              ...fadeUp(f, 26),
              marginTop: 28,
              fontSize: 38,
              lineHeight: 1.55,
              color: theme.muted,
              maxWidth: 1280,
              marginLeft: 'auto',
              marginRight: 'auto',
              opacity: 0.88,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {hasObjectives ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            marginTop: 44,
            width: 1180,
            textAlign: 'left',
          }}
        >
          {objectives!.map((o, i) => (
            <div
              key={i}
              style={{
                ...fadeUp(f, 38 + i * 18, 16, 24),
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                background: `rgba(255,255,255,0.035)`,
                border: `1px solid ${theme.accent}28`,
                borderRadius: 16,
                padding: '16px 24px',
              }}
            >
              <IconBadge size={72} fontSize={34} theme={theme}>
                {o.icon ?? '★'}
              </IconBadge>
              <span
                style={{
                  fontSize: 34,
                  lineHeight: 1.35,
                  color: theme.text,
                  fontWeight: 500,
                }}
              >
                {o.label}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </ThemedStage>
  );
};

// ---------------------------------------------------------------------------
// 2. UiCallout — refined panels: subtle gradient fill, 1px accent border,
//    soft outer glow, generous padding, large radius, accent highlight strip.
// ---------------------------------------------------------------------------
export interface Callout {
  label: string;
  note?: string;
}

export interface UiCalloutProps {
  heading: string;
  callouts: Callout[];
  caption?: string;
}

export const UiCallout: React.FC<UiCalloutProps> = ({ heading, callouts, caption }) => {
  const f = useCurrentFrame();
  const theme = useTheme();
  return (
    <ThemedStage>
      <h2
        style={{
          ...fadeUp(f, 4),
          fontFamily: SERIF,
          fontWeight: 800,
          fontSize: 64,
          margin: '0 0 44px',
          maxWidth: 1500,
          letterSpacing: -0.3,
        }}
      >
        {heading}
      </h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 34,
          width: 1560,
        }}
      >
        {callouts.map((c, i) => (
          <div
            key={i}
            style={{
              ...fadeUp(f, 24 + i * 18, 16, 28),
              flex: '1 1 400px',
              maxWidth: 480,
              minWidth: 360,
              background: `linear-gradient(160deg, ${theme.accent}10 0%, rgba(255,255,255,0.04) 100%)`,
              border: `1px solid ${theme.accent}50`,
              borderRadius: 26,
              boxShadow: `0 0 0 1px ${theme.accent}14, 0 0 40px ${theme.accent}14, 0 16px 48px rgba(0,0,0,0.38)`,
              padding: '0 0 36px',
              textAlign: 'left',
              overflow: 'hidden',
            }}
          >
            {/* Accent highlight strip at top of each card */}
            <div
              style={{
                height: 5,
                background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentSoft}88)`,
                borderRadius: '26px 26px 0 0',
                marginBottom: 32,
              }}
            />
            <div style={{ padding: '0 36px' }}>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: theme.accentSoft,
                  lineHeight: 1.2,
                }}
              >
                {c.label}
              </div>
              {c.note ? (
                <div
                  style={{
                    marginTop: 14,
                    fontSize: 30,
                    lineHeight: 1.5,
                    color: theme.muted,
                    opacity: 0.84,
                  }}
                >
                  {c.note}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      {caption ? (
        <p
          style={{
            ...fadeUp(f, 24 + callouts.length * 18),
            marginTop: 40,
            fontSize: 30,
            color: theme.muted,
            maxWidth: 1300,
            opacity: 0.76,
          }}
        >
          {caption}
        </p>
      ) : null}
    </ThemedStage>
  );
};

// ---------------------------------------------------------------------------
// 3. Compare — refined columns with card elevation, accent-tinted headers,
//    icon badges, consistent vertical rhythm; shape + label never color alone.
// ---------------------------------------------------------------------------
export interface CompareColumn {
  icon?: string;
  title: string;
  lines: string[];
}

export interface CompareProps {
  heading: string;
  columns: CompareColumn[];
}

export const Compare: React.FC<CompareProps> = ({ heading, columns }) => {
  const f = useCurrentFrame();
  const theme = useTheme();
  return (
    <ThemedStage>
      <h2
        style={{
          ...fadeUp(f, 4),
          fontFamily: SERIF,
          fontWeight: 800,
          fontSize: 64,
          margin: '0 0 44px',
          maxWidth: 1500,
          letterSpacing: -0.3,
        }}
      >
        {heading}
      </h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
          gap: 28,
          width: 1640,
        }}
      >
        {columns.map((col, i) => (
          <div
            key={i}
            style={{
              ...fadeUp(f, 24 + i * 20, 16, 28),
              flex: '1 1 0',
              background: `linear-gradient(170deg, ${theme.accent}0e 0%, rgba(255,255,255,0.03) 100%)`,
              borderRadius: 24,
              border: `1px solid ${theme.accent}3a`,
              boxShadow: `0 0 0 1px ${theme.accent}10, 0 12px 40px rgba(0,0,0,0.32)`,
              overflow: 'hidden',
              textAlign: 'left',
            }}
          >
            {/* Column accent header band */}
            <div
              style={{
                background: `linear-gradient(90deg, ${theme.accent}30, ${theme.accentSoft}14)`,
                borderBottom: `1px solid ${theme.accent}30`,
                padding: '28px 32px',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <IconBadge size={66} fontSize={30} theme={theme}>
                {col.icon ?? '▸'}
              </IconBadge>
              <span
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: theme.accentSoft,
                  lineHeight: 1.2,
                }}
              >
                {col.title}
              </span>
            </div>
            {/* Body lines */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                padding: '28px 32px',
              }}
            >
              {col.lines.map((line, j) => (
                <div
                  key={j}
                  style={{
                    display: 'flex',
                    gap: 16,
                    fontSize: 31,
                    lineHeight: 1.4,
                    color: theme.muted,
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Diamond marker — distinct shape, not just a bullet */}
                  <span
                    style={{
                      color: theme.accent,
                      flexShrink: 0,
                      fontWeight: 900,
                      fontSize: 22,
                      marginTop: 5,
                      lineHeight: 1,
                    }}
                  >
                    ◆
                  </span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ThemedStage>
  );
};

// ---------------------------------------------------------------------------
// 4. Steps — gradient accent numeral circles connected by a thin vertical
//    accent line; staggered reveal; note text in muted.
// ---------------------------------------------------------------------------
export interface Step {
  label: string;
  note?: string;
}

export interface StepsProps {
  heading: string;
  steps: Step[];
}

export const Steps: React.FC<StepsProps> = ({ heading, steps }) => {
  const f = useCurrentFrame();
  const theme = useTheme();
  // Line height per step row for the connector.
  const ROW_H = 108;

  return (
    <ThemedStage>
      <h2
        style={{
          ...fadeUp(f, 4),
          fontFamily: SERIF,
          fontWeight: 800,
          fontSize: 64,
          margin: '0 0 44px',
          maxWidth: 1500,
          letterSpacing: -0.3,
        }}
      >
        {heading}
      </h2>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
          width: 1360,
          textAlign: 'left',
        }}
      >
        {/* Thin vertical connector line behind the badges */}
        <div
          style={{
            position: 'absolute',
            left: 39,
            top: 80,
            width: 2,
            height: (steps.length - 1) * ROW_H - 20,
            background: `linear-gradient(180deg, ${theme.accent}80, transparent)`,
            borderRadius: 1,
            pointerEvents: 'none',
          }}
        />
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              ...fadeUp(f, 26 + i * 22, 16, 28),
              display: 'flex',
              alignItems: 'flex-start',
              gap: 30,
              minHeight: i < steps.length - 1 ? ROW_H : undefined,
            }}
          >
            <NumBadge n={i + 1} theme={theme} />
            <div style={{ paddingTop: 8 }}>
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 700,
                  color: theme.text,
                  lineHeight: 1.25,
                }}
              >
                {s.label}
              </div>
              {s.note ? (
                <div
                  style={{
                    fontSize: 28,
                    lineHeight: 1.45,
                    color: theme.muted,
                    marginTop: 8,
                    opacity: 0.78,
                  }}
                >
                  {s.note}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </ThemedStage>
  );
};

// ---------------------------------------------------------------------------
// 5. Question — hold the question for ~45% of the scene, then reveal the
//    answer in a polished panel with an accent left-border + gradient card.
// ---------------------------------------------------------------------------
export interface QuestionProps {
  question: string;
  answer: string;
  why?: string;
}

export const Question: React.FC<QuestionProps> = ({ question, answer, why }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const theme = useTheme();

  const revealAt = Math.round(durationInFrames * 0.45);
  const reveal = interpolate(f, [revealAt, revealAt + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const revealY = interpolate(f, [revealAt, revealAt + 20], [32, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <ThemedStage>
      <div style={{ ...fadeUp(f, 6), maxWidth: 1500 }}>
        <Kicker>Quick check</Kicker>
        <div
          style={{
            width: 80,
            height: 4,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentSoft})`,
            margin: '16px auto 0',
            opacity: 0.9,
          }}
        />
        <h2
          style={{
            fontFamily: SERIF,
            fontWeight: 800,
            fontSize: 76,
            margin: '24px 0 0',
            lineHeight: 1.12,
            letterSpacing: -0.3,
          }}
        >
          {question}
        </h2>
      </div>

      {/* Answer reveal panel */}
      <div
        style={{
          opacity: reveal,
          transform: `translateY(${revealY}px)`,
          marginTop: 52,
          maxWidth: 1320,
          borderRadius: 26,
          overflow: 'hidden',
          boxShadow: `0 0 0 1px ${theme.accent}30, 0 20px 56px rgba(0,0,0,0.44)`,
          display: 'flex',
        }}
      >
        {/* Thick accent left border — strong Q→A visual marker */}
        <div
          style={{
            flexShrink: 0,
            width: 10,
            background: `linear-gradient(180deg, ${theme.accentSoft}, ${theme.accent})`,
          }}
        />
        <div
          style={{
            flex: 1,
            background: `linear-gradient(120deg, ${theme.accent}16 0%, rgba(255,255,255,0.06) 100%)`,
            padding: '36px 44px',
          }}
        >
          <div
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: theme.accentSoft,
              lineHeight: 1.25,
            }}
          >
            {answer}
          </div>
          {why ? (
            <div
              style={{
                marginTop: 18,
                fontSize: 30,
                lineHeight: 1.5,
                color: theme.muted,
                opacity: 0.82,
              }}
            >
              {why}
            </div>
          ) : null}
        </div>
      </div>
    </ThemedStage>
  );
};
