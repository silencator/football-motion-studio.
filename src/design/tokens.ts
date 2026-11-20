/**
 * Permanent design system — Apple-inspired football storytelling.
 * All sizes are authored for a 1920-wide landscape canvas and scaled via useLayout().
 * Refine these values (not individual scenes) when the reference video is studied.
 */
import {Easing} from 'remotion';

export const colors = {
  ink: '#05060A', // near-black canvas
  graphite: '#0E1017',
  slate: '#1A1D27',
  white: '#F5F5F7',
  mist: 'rgba(245,245,247,0.62)', // secondary text
  haze: 'rgba(245,245,247,0.32)', // tertiary text / hairlines
  hairline: 'rgba(255,255,255,0.10)',
  accent: '#2E7BFF', // primary accent (cool blue)
  accentSoft: '#6AA6FF',
  pitch: '#1F8A4C', // restrained football green
  pitchDeep: '#0B3D22',
  gold: '#E8C46A', // trophies / records only
  danger: '#FF453A',
  teamA: '#2E7BFF',
  teamB: '#FF6B3D',
} as const;

export const gradients = {
  night: `radial-gradient(120% 90% at 50% 0%, #1B2234 0%, ${colors.ink} 60%)`,
  stage: `radial-gradient(80% 60% at 50% 45%, #161B28 0%, ${colors.ink} 75%)`,
  pitchGlow: `radial-gradient(90% 70% at 50% 60%, #0F3B25 0%, ${colors.ink} 70%)`,
  accentText: `linear-gradient(180deg, #FFFFFF 0%, #B9C6DA 100%)`,
  goldText: `linear-gradient(180deg, #FFF1C9 0%, ${colors.gold} 55%, #A9812F 100%)`,
} as const;

export const fonts = {
  display: '"Inter", "SF Pro Display", system-ui, sans-serif',
  text: '"Inter", "SF Pro Text", system-ui, sans-serif',
  mono: '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
} as const;

/** Type scale at 1920px width. */
export const type = {
  hero: {fontSize: 168, fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 0.95},
  h1: {fontSize: 112, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.0},
  h2: {fontSize: 72, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.05},
  h3: {fontSize: 48, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1},
  body: {fontSize: 36, fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.35},
  kicker: {fontSize: 26, fontWeight: 600, letterSpacing: '0.18em', lineHeight: 1.2, textTransform: 'uppercase' as const},
  stat: {fontSize: 220, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 0.9},
  caption: {fontSize: 24, fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1.3},
} as const;

/** 8pt spacing grid at 1920px width. */
export const space = {xs: 8, sm: 16, md: 32, lg: 64, xl: 96, xxl: 160} as const;

export const radius = {sm: 12, md: 24, lg: 40} as const;

/** Signature curves. Prefer these over ad-hoc easings. */
export const ease = {
  /** Apple-like expo-out: fast start, long graceful settle. Default for entrances. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Symmetric, for camera moves and morphs. */
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  /** Exits: gentle acceleration away. */
  in: Easing.bezier(0.7, 0, 0.84, 0),
} as const;

/** Spring configs for remotion's spring(). */
export const springs = {
  soft: {damping: 200, mass: 1, stiffness: 100},
  snappy: {damping: 20, mass: 0.6, stiffness: 180},
} as const;

/** Durations in seconds — multiply by fps. */
export const timing = {
  reveal: 0.9,
  stagger: 0.06,
  hold: 1.6,
  transition: 0.8,
  sceneMin: 2.5,
} as const;
