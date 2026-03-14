import { StyleSheet } from 'react-native';

export const GREEN = '#007647';
export const DARK_GREEN = '#00703c';
export const BG = '#f0f7f4';

export const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: GREEN },
  header: { backgroundColor: GREEN, paddingHorizontal: 16, paddingVertical: 14 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  howBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },

  tabContent: { flex: 1, paddingHorizontal: 14, paddingTop: 14 },

  card: { borderRadius: 16, padding: 18, marginBottom: 0 },
  cardWhite: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  gradientGreen: { backgroundColor: GREEN },

  cardTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 6 },
  bigPoints: { fontSize: 34, fontWeight: '700', color: '#fff', marginBottom: 4 },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginLeft: 6 },
  pageTitle: { fontSize: 19, fontWeight: '700', color: '#111827' },
  mutedSm: { fontSize: 11, color: '#6b7280' },

  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  alertBox: { borderLeftWidth: 4, borderLeftColor: '#f97316', backgroundColor: '#fff7ed', borderRadius: 8, padding: 10, marginBottom: 8 },
  alertRoute: { fontWeight: '600', color: '#111827', fontSize: 13 },
  alertIssue: { fontSize: 11, color: '#374151' },

  btnOrange: { backgroundColor: '#f97316', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  btnGreen: { backgroundColor: GREEN, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnGray: { backgroundColor: '#e5e7eb', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnGrayDisabled: { backgroundColor: '#e5e7eb', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnHalf: { flex: 1 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  btnGrayText: { color: '#374151', fontWeight: '700', fontSize: 14 },

  reminderBox: { backgroundColor: '#f5f3ff', borderRadius: 10, padding: 14, marginBottom: 10 },
  quoteBox: { backgroundColor: '#fff', borderRadius: 8, padding: 8, marginVertical: 6 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 10 },

  progressTrack: { flex: 1, height: 8, backgroundColor: '#e5e7eb', borderRadius: 99, overflow: 'hidden', marginTop: 6 },
  progressBar: { height: 8, backgroundColor: '#22c55e', borderRadius: 99 },

  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickAction: { width: '48%', borderWidth: 2, borderRadius: 10, padding: 14, alignItems: 'flex-start' },

  gpsBadgeEnabled: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', padding: 12, borderRadius: 10, marginTop: 8 },
  recentBox: { borderLeftWidth: 4, borderLeftColor: '#22c55e', backgroundColor: '#f0fdf4', borderRadius: 8, padding: 14 },

  dot: { width: 10, height: 10, borderRadius: 99 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },

  statBadge: { flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: 10, alignItems: 'center' },
  redeemBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  redeemBtnActive: { backgroundColor: GREEN },
  redeemBtnDisabled: { backgroundColor: '#e5e7eb' },
  redeemBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  radioRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#d1d5db', borderRadius: 10, padding: 12, marginBottom: 8 },
  radioCircle: { width: 18, height: 18, borderRadius: 99, borderWidth: 2, borderColor: '#9ca3af', alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 8, height: 8, borderRadius: 99, backgroundColor: GREEN },

  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingVertical: 10, paddingHorizontal: 8, paddingBottom: 16 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 10 },
  navItemActive: { backgroundColor: GREEN },
  navLabel: { fontSize: 11, fontWeight: '500', color: '#6b7280', marginTop: 2 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalBox: { backgroundColor: '#fff', borderRadius: 20, padding: 22, width: '100%', maxWidth: 480 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 12 },
  infoBanner: { borderRadius: 10, padding: 14, marginBottom: 12 },
  fieldLabel: { fontWeight: '600', color: '#111827', fontSize: 14, marginBottom: 8 },

  stepRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  stepCircle: { width: 44, height: 44, borderRadius: 99, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepNum: { color: '#fff', fontWeight: '700', fontSize: 18 },
  detailBox: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 10 },

  iconMd: { fontSize: 20 },

  qrBox: { backgroundColor: '#f3f4f6', borderRadius: 10, padding: 14, width: '100%', marginBottom: 8 },
  qrInner: { backgroundColor: '#fff', padding: 24, borderRadius: 8, alignItems: 'center', marginBottom: 6 },
  textInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, fontSize: 14, color: '#111827', height: 100, textAlignVertical: 'top' },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  filterChipText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#fff',
  },
});
