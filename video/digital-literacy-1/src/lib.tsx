import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from 'remotion';

/**
 * Shared visual system for the Digital Literacy — Level 1 videos.
 * Used by the per-week LessonOverview composition (and, going forward, the
 * intro). Keep this as the single source of truth for the look and feel.
 */

export const NAVY = '#0D1B2A';
export const NAVY_MID = '#1B365D';
export const GOLD = '#C9A227';
export const GOLD_LIGHT = '#E6C65C';
export const WHITE = '#FFFFFF';
export const MUTED = '#E6ECF7';
export const FONT = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
export const SERIF = 'Georgia, "Times New Roman", serif';

/**
 * Per-week theme. The navy `base` and gold `brand` are constant VUB marks;
 * `baseMid`/`accent`/`accentSoft` shift per week so each lesson reads as its
 * own chapter while staying on-brand. `text`/`muted` stay high-contrast for
 * the older-learner audience.
 */
export interface Theme {
  base: string;
  baseMid: string;
  accent: string;
  accentSoft: string;
  brand: string;
  brandSoft: string;
  text: string;
  muted: string;
}

export const DEFAULT_THEME: Theme = {
  base: '#0D1B2A',
  baseMid: '#1B365D',
  accent: '#C9A227',
  accentSoft: '#E6C65C',
  brand: '#C9A227',
  brandSoft: '#E6C65C',
  text: '#FFFFFF',
  muted: '#E6ECF7',
};

// Shared across all weeks: constant navy base + gold brand, white text.
const BRAND = { base: '#0D1B2A', brand: '#C9A227', brandSoft: '#E6C65C', text: '#FFFFFF', muted: '#E6ECF7' };

export const WEEK_THEMES: Record<string, Theme> = {
  week1: { ...BRAND, baseMid: '#20384b', accent: '#6f97ad', accentSoft: '#a9c6d4' },
  week2: { ...BRAND, baseMid: '#2f4853', accent: '#7fa3b0', accentSoft: '#b3ccd4' },
  week3: { ...BRAND, baseMid: '#1c2d46', accent: '#5d82b8', accentSoft: '#a9c0e0' },
  week4: { ...BRAND, baseMid: '#4d1e28', accent: '#c05568', accentSoft: '#e3909c' },
  week5: { ...BRAND, baseMid: '#283f2b', accent: '#6fa06b', accentSoft: '#a7c9a4' },
};

const ThemeContext = React.createContext<Theme>(DEFAULT_THEME);

export const useTheme = (): Theme => React.useContext(ThemeContext);

export const ThemeProvider: React.FC<{ theme?: Theme; children: React.ReactNode }> = ({
  theme,
  children,
}) => <ThemeContext.Provider value={theme ?? DEFAULT_THEME}>{children}</ThemeContext.Provider>;

export const fadeUp = (
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

export const Stage: React.FC<{ children: React.ReactNode; transparent?: boolean }> = ({
  children,
  transparent,
}) => (
  <AbsoluteFill
    style={{
      background: transparent
        ? 'transparent'
        : `linear-gradient(135deg, ${NAVY_MID} 0%, ${NAVY} 100%)`,
      fontFamily: FONT,
      color: WHITE,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 140,
      textAlign: 'center',
    }}
  >
    {/* faint star band (only on the solid-navy treatment, not over a photo) */}
    {transparent ? null : (
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
    )}
    {children}
  </AbsoluteFill>
);

export const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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

export const Centered: React.FC<{
  eyebrow: string;
  heading: string;
  body: string;
  transparent?: boolean;
}> = ({ eyebrow, heading, body, transparent }) => {
  const f = useCurrentFrame();
  return (
    <Stage transparent={transparent}>
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

export const Bullets: React.FC<{
  eyebrow: string;
  heading: string;
  items: string[];
  transparent?: boolean;
}> = ({ eyebrow, heading, items, transparent }) => {
  const f = useCurrentFrame();
  return (
    <Stage transparent={transparent}>
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
