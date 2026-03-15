import { StyleSheet, Platform } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from './ThemeContext';
import { GREEN, DARK_GREEN } from './themes';

// Re-export brand constants for backwards compat
export { GREEN, DARK_GREEN };

// BG is now dynamic — legacy callers should use theme.colors.bg instead
export const BG = '#f0f7f4';

// ── Dynamic style factory ────────────────────────────────────────────────────
export function createStyles(theme) {
  const { colors, fonts, isDark } = theme;
  const c = colors;
  const f = fonts;

  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.headerBg },
    header: { backgroundColor: c.headerBg, paddingHorizontal: 16, paddingBottom: 14 },
    headerTitle: { fontSize: f.title + 3, fontFamily: 'Lexend-Bold', color: c.textOnGreen },
    headerSub: { fontSize: f.label, fontFamily: 'Lexend-Regular', color: 'rgba(255,255,255,0.9)', marginTop: 2 },
    howBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },

    tabContent: { flex: 1, paddingHorizontal: 17, paddingTop: 14 },

    card: { borderRadius: 16, padding: 18, marginBottom: 0 },
    cardWhite: {
      backgroundColor: c.card,
      ...(Platform.OS === 'web'
        ? { boxShadow: c.cardShadow }
        : { elevation: 2 }),
    },
    gradientGreen: { backgroundColor: GREEN },

    cardTitle: { fontSize: f.sectionTitle, fontFamily: 'Lexend-Bold', color: c.textOnGreen, marginBottom: 6 },
    bigPoints: { fontSize: f.big, fontFamily: 'Lexend-Bold', color: c.textOnGreen, marginBottom: 4 },

    sectionTitle: { fontSize: f.sectionTitle, fontFamily: 'Lexend-Bold', color: c.text, marginLeft: 6 },
    pageTitle: { fontSize: f.title, fontFamily: 'Lexend-Bold', color: c.text },
    mutedSm: { fontSize: f.label, fontFamily: 'Lexend-Regular', color: c.textSecondary },

    row: { flexDirection: 'row', alignItems: 'center' },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

    alertBox: { borderLeftWidth: 4, borderLeftColor: c.alertBorder, backgroundColor: c.alertBg, borderRadius: 8, padding: 10, marginBottom: 8 },
    alertRoute: { fontFamily: 'Lexend-Bold', color: c.text, fontSize: f.subtitle },
    alertIssue: { fontSize: f.label, fontFamily: 'Lexend-Regular', color: c.textSecondary },

    btnOrange: { backgroundColor: '#f97316', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginTop: 8 },
    btnGreen: { backgroundColor: GREEN, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    btnPurple: { backgroundColor: '#7c3aed', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    btnGray: { backgroundColor: isDark ? c.border : '#e5e7eb', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    btnGrayDisabled: { backgroundColor: isDark ? c.border : '#e5e7eb', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    btnHalf: { flex: 1 },
    btnText: { color: '#fff', fontFamily: 'Lexend-Bold', fontSize: f.button },
    btnGrayText: { color: isDark ? c.text : '#374151', fontFamily: 'Lexend-Bold', fontSize: f.button },

    reminderBox: { backgroundColor: c.reminderBg, borderRadius: 10, padding: 14, marginBottom: 10 },
    quoteBox: { backgroundColor: c.card, borderRadius: 8, padding: 8, marginVertical: 6 },
    divider: { height: 1, backgroundColor: c.border, marginVertical: 10 },

    progressTrack: { flex: 1, height: 8, backgroundColor: c.progressTrack, borderRadius: 99, overflow: 'hidden', marginTop: 6 },
    progressBar: { height: 8, backgroundColor: c.progressBar, borderRadius: 99 },

    grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    quickAction: { width: '48%', borderWidth: 2, borderRadius: 10, padding: 14, alignItems: 'flex-start', borderColor: c.border },

    gpsBadgeEnabled: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.successBg, padding: 12, borderRadius: 10, marginTop: 8 },
    recentBox: { borderLeftWidth: 4, borderLeftColor: '#22c55e', backgroundColor: c.successBg, borderRadius: 8, padding: 14 },

    dot: { width: 10, height: 10, borderRadius: 99 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },

    statBadge: { flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: 10, alignItems: 'center' },
    redeemBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
    redeemBtnActive: { backgroundColor: GREEN },
    redeemBtnDisabled: { backgroundColor: isDark ? c.border : '#e5e7eb' },
    redeemBtnText: { color: '#fff', fontFamily: 'Lexend-Bold', fontSize: f.subtitle },

    radioRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: c.borderStrong, borderRadius: 10, padding: 12, marginBottom: 8 },
    radioCircle: { width: 18, height: 18, borderRadius: 99, borderWidth: 2, borderColor: isDark ? '#6b7280' : '#9ca3af', alignItems: 'center', justifyContent: 'center' },
    radioDot: { width: 8, height: 8, borderRadius: 99, backgroundColor: GREEN },

    bottomNav: {
      flexDirection: 'row',
      backgroundColor: c.navBg,
      paddingVertical: 10,
      paddingHorizontal: 8,
    },
    navItem: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 10 },
    navItemActive: { backgroundColor: GREEN },
    navLabel: { fontSize: f.label, fontFamily: 'Lexend-Regular', color: c.textSecondary, marginTop: 2 },

    overlay: { flex: 1, backgroundColor: c.overlay, justifyContent: 'center', alignItems: 'center', padding: 16 },
    modalBox: { backgroundColor: c.modalBg, borderRadius: 20, padding: 22, width: '100%', maxWidth: 480 },
    modalTitle: { fontSize: f.heading, fontFamily: 'Lexend-Bold', color: c.text, marginBottom: 12 },
    infoBanner: { borderRadius: 10, padding: 14, marginBottom: 12 },
    fieldLabel: { fontFamily: 'Lexend-Bold', color: c.text, fontSize: f.button, marginBottom: 8 },

    stepRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
    stepCircle: { width: 44, height: 44, borderRadius: 99, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    stepNum: { color: '#fff', fontFamily: 'Lexend-Bold', fontSize: f.heading - 2 },
    detailBox: { backgroundColor: isDark ? c.card : '#f9fafb', borderRadius: 8, padding: 10 },

    iconMd: { fontSize: f.icon },

    qrBox: { backgroundColor: c.qrBg, borderRadius: 10, padding: 14, width: '100%', marginBottom: 8 },
    qrInner: { backgroundColor: c.qrInner, padding: 24, borderRadius: 8, alignItems: 'center', marginBottom: 6 },
    textInput: { backgroundColor: c.inputBg, borderWidth: 1, borderColor: c.inputBorder, borderRadius: 10, padding: 12, fontSize: f.body, fontFamily: 'Lexend-Regular', color: c.text, height: 100, textAlignVertical: 'top' },
    filterChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    filterChipActive: {
      backgroundColor: GREEN,
      borderColor: GREEN,
    },
    filterChipText: {
      fontSize: f.label + 1,
      fontFamily: 'Lexend-Regular',
      color: c.textSecondary,
    },
    filterChipTextActive: {
      color: c.textOnGreen,
    },
  });
}

// ── Convenience hook ─────────────────────────────────────────────────────────
export function useStyles() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return { s: styles, theme };
}

// Legacy static export for files not yet migrated (will be removed)
export const s = createStyles({
  isDark: false,
  colors: {
    bg: '#f0f7f4', card: '#ffffff', cardShadow: '0 2px 6px rgba(0,0,0,0.08)',
    text: '#111827', textSecondary: '#6b7280', textOnGreen: '#ffffff',
    border: '#e5e7eb', borderStrong: '#d1d5db',
    headerBg: GREEN, navBg: '#ffffff', navBorder: '#e5e7eb',
    inputBg: '#f9fafb', inputBorder: '#e5e7eb',
    alertBg: '#fff7ed', alertBorder: '#f97316',
    successBg: '#f0fdf4', successText: '#15803d',
    infoBg: '#eff6ff', infoText: '#1d4ed8',
    dangerBg: '#fff5f5', dangerBorder: '#fecaca', dangerText: '#b91c1c',
    reminderBg: '#f5f3ff', radioSelected: '#f0fdf4',
    switchTrack: GREEN, progressTrack: '#e5e7eb', progressBar: '#22c55e',
    skeleton: '#e5e7eb', qrBg: '#f3f4f6', qrInner: '#ffffff',
    overlay: 'rgba(0,0,0,0.5)', modalBg: '#ffffff',
  },
  fonts: {
    body: 14, label: 11, labelMd: 12, button: 14, subtitle: 13,
    title: 19, sectionTitle: 15, heading: 20, big: 34, icon: 20, iconLg: 26,
  },
  green: GREEN, darkGreen: DARK_GREEN,
});
