export type ThemeId = 'light' | 'dark' | 'system';

export type Colors = {
  accent: string;
  background: string;
  card: string;
  border: string;
  borderLight: string;
  textPrimary: string;
  textSecondary: string;
  textDark: string;
  textMid: string;
  textMuted: string;
  textFaint: string;
  white: string;
  modalBackdrop: string;
  shadow: string;
  dotMeditation: string;
  dotBreathing: string;
};

export const lightColors: Colors = {
  // ── Brand ─────────────────────────────────────────────────────────────────
  accent: '#7B68B5',

  // ── Surfaces ──────────────────────────────────────────────────────────────
  background: '#F7F5F2',
  card: '#FFFDF9',

  // ── Borders & dividers ────────────────────────────────────────────────────
  border: '#E7E1D8',
  borderLight: '#C8C2BA',

  // ── Text ──────────────────────────────────────────────────────────────────
  textPrimary: '#1A1A2E',
  textSecondary: '#6F6B66',
  textDark: '#444',
  textMid: '#666',
  textMuted: '#888',
  textFaint: '#999',

  // ── Always-white ──────────────────────────────────────────────────────────
  white: '#fff',

  // ── Overlays & shadows ────────────────────────────────────────────────────
  modalBackdrop: 'rgba(0,0,0,0.45)',
  shadow: '#000',

  // ── Activity dot indicators (calendar) ───────────────────────────────────
  dotMeditation: '#4CAF50',
  dotBreathing: '#F9A825',
};

export const darkColors: Colors = {
  // ── Brand ─────────────────────────────────────────────────────────────────
  accent: '#9E8FD5',

  // ── Surfaces ──────────────────────────────────────────────────────────────
  background: '#1C1814',
  card: '#252118',

  // ── Borders & dividers ────────────────────────────────────────────────────
  border: '#3D362D',
  borderLight: '#524A41',

  // ── Text ──────────────────────────────────────────────────────────────────
  textPrimary: '#F0EBE5',
  textSecondary: '#9A9490',
  textDark: '#C2BCB5',
  textMid: '#A39D98',
  textMuted: '#827D78',
  textFaint: '#665F59',

  // ── Always-white ──────────────────────────────────────────────────────────
  white: '#fff',

  // ── Overlays & shadows ────────────────────────────────────────────────────
  modalBackdrop: 'rgba(0,0,0,0.65)',
  shadow: '#000',

  // ── Activity dot indicators (calendar) ───────────────────────────────────
  dotMeditation: '#4CAF50',
  dotBreathing: '#F9A825',
};

/** Kept for backward compatibility — resolves to light palette. */
export const colors = lightColors;
