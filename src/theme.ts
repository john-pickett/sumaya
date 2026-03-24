/**
 * Central colour palette for the app.
 * All colours used in components and screens live here —
 * update a value once and it changes everywhere.
 */
export const colors = {
  // ── Brand ─────────────────────────────────────────────────────────────────
  /** Primary purple accent used on buttons, active states, links, etc. */
  accent: '#7B68B5',

  // ── Surfaces ──────────────────────────────────────────────────────────────
  /** Warm off-white used as the main screen background. */
  background: '#F7F5F2',
  /** Creamy white used for cards, modals, and sheet backgrounds. */
  card: '#FFFDF9',

  // ── Borders & dividers ────────────────────────────────────────────────────
  /** Standard border / divider colour. */
  border: '#E7E1D8',
  /** Lighter border used for inactive controls (radio buttons, pills, etc.). */
  borderLight: '#C8C2BA',

  // ── Text ──────────────────────────────────────────────────────────────────
  /** Headings and high-emphasis body text. */
  textPrimary: '#1A1A2E',
  /** Secondary / supporting body text. */
  textSecondary: '#6F6B66',
  /** Dark-grey text used for names, labels on cards. */
  textDark: '#444',
  /** Mid-grey used for sub-labels and done-screen subtext. */
  textMid: '#666',
  /** Muted grey for secondary indicators and status text. */
  textMuted: '#888',
  /** Very light grey used for skip links and least-emphasis text. */
  textFaint: '#999',

  // ── Always-white ──────────────────────────────────────────────────────────
  /** White text / fill used on coloured backgrounds (buttons, selected states). */
  white: '#fff',

  // ── Overlays & shadows ────────────────────────────────────────────────────
  /** Semi-transparent black used for modal/dialog backdrops. */
  modalBackdrop: 'rgba(0,0,0,0.45)',
  /** Black used as the base shadow colour (shadowColor). */
  shadow: '#000',

  // ── Activity dot indicators (calendar) ───────────────────────────────────
  /** Green dot on the calendar for meditation sessions. */
  dotMeditation: '#4CAF50',
  /** Amber dot on the calendar for breathing sessions. */
  dotBreathing: '#F9A825',
} as const;
