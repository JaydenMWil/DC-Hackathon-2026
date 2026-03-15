// ─── Color Palettes & Font Scales ────────────────────────────────────────────
// WCAG 2.1 AA compliant: normal text ≥ 4.5:1, large text ≥ 3:1

export const GREEN = '#007647';
export const DARK_GREEN = '#00703c';

// ── Light palette ────────────────────────────────────────────────────────────
export const lightColors = {
  bg: '#f0f7f4',
  card: '#ffffff',
  cardShadow: '0 2px 6px rgba(0,0,0,0.08)',
  text: '#111827',
  textSecondary: '#6b7280',
  textOnGreen: '#ffffff',
  border: '#e5e7eb',
  borderStrong: '#d1d5db',
  headerBg: GREEN,
  navBg: '#ffffff',
  navBorder: '#e5e7eb',
  inputBg: '#f9fafb',
  inputBorder: '#e5e7eb',
  alertBg: '#fff7ed',
  alertBorder: '#f97316',
  successBg: '#f0fdf4',
  successText: '#15803d',
  infoBg: '#eff6ff',
  infoText: '#1d4ed8',
  dangerBg: '#fff5f5',
  dangerBorder: '#fecaca',
  dangerText: '#b91c1c',
  reminderBg: '#f5f3ff',
  radioSelected: '#f0fdf4',
  switchTrack: GREEN,
  progressTrack: '#e5e7eb',
  progressBar: '#22c55e',
  skeleton: '#e5e7eb',
  qrBg: '#f3f4f6',
  qrInner: '#ffffff',
  overlay: 'rgba(0,0,0,0.5)',
  modalBg: '#ffffff',
};

// ── Dark palette ─────────────────────────────────────────────────────────────
export const darkColors = {
  bg: '#0f1419',
  card: '#1a2332',
  cardShadow: '0 2px 6px rgba(0,0,0,0.3)',
  text: '#e5e7eb',
  textSecondary: '#9ca3af',
  textOnGreen: '#ffffff',
  border: '#2d3748',
  borderStrong: '#4a5568',
  headerBg: '#004d2f',
  navBg: '#111827',
  navBorder: '#2d3748',
  inputBg: '#1f2937',
  inputBorder: '#374151',
  alertBg: '#431407',
  alertBorder: '#f97316',
  successBg: '#052e16',
  successText: '#4ade80',
  infoBg: '#172554',
  infoText: '#60a5fa',
  dangerBg: '#450a0a',
  dangerBorder: '#dc2626',
  dangerText: '#fca5a5',
  reminderBg: '#1e1b4b',
  radioSelected: '#052e16',
  switchTrack: GREEN,
  progressTrack: '#374151',
  progressBar: '#22c55e',
  skeleton: '#374151',
  qrBg: '#1f2937',
  qrInner: '#111827',
  overlay: 'rgba(0,0,0,0.7)',
  modalBg: '#1a2332',
};

// ── High-contrast overlay ────────────────────────────────────────────────────
// Applied on top of light or dark palette for 7:1+ ratios
export const highContrastOverrides = {
  light: {
    bg: '#ffffff',
    card: '#ffffff',
    text: '#000000',
    textSecondary: '#1f2937',
    border: '#000000',
    borderStrong: '#000000',
    navBorder: '#000000',
    inputBorder: '#000000',
    cardShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  dark: {
    bg: '#000000',
    card: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#e5e7eb',
    border: '#ffffff',
    borderStrong: '#ffffff',
    navBorder: '#ffffff',
    inputBorder: '#ffffff',
    cardShadow: '0 2px 8px rgba(255,255,255,0.1)',
  },
};

// ── Font scales ──────────────────────────────────────────────────────────────
export const fontScales = {
  small: {
    body: 12,
    label: 10,
    labelMd: 11,
    button: 12,
    subtitle: 13,
    title: 17,
    sectionTitle: 13,
    heading: 18,
    big: 28,
    icon: 18,
    iconLg: 22,
  },
  medium: {
    body: 14,
    label: 11,
    labelMd: 12,
    button: 14,
    subtitle: 13,
    title: 19,
    sectionTitle: 15,
    heading: 20,
    big: 34,
    icon: 20,
    iconLg: 26,
  },
  large: {
    body: 17,
    label: 13,
    labelMd: 14,
    button: 17,
    subtitle: 15,
    title: 23,
    sectionTitle: 18,
    heading: 24,
    big: 40,
    icon: 24,
    iconLg: 30,
  },
};

// ── Theme resolver ───────────────────────────────────────────────────────────
export function resolveTheme(colorMode, osScheme, fontSize, highContrast) {
  // Resolve actual mode
  const isDark = colorMode === 'dark' || (colorMode === 'system' && osScheme === 'dark');
  const baseColors = isDark ? { ...darkColors } : { ...lightColors };

  // Apply high-contrast overrides
  const colors = highContrast
    ? { ...baseColors, ...(isDark ? highContrastOverrides.dark : highContrastOverrides.light) }
    : baseColors;

  return {
    isDark,
    colors,
    fonts: fontScales[fontSize] || fontScales.medium,
    green: GREEN,
    darkGreen: DARK_GREEN,
  };
}
