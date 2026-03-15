import React from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useStyles, GREEN } from '../../core/_styles';

const ReportIssueModal = ({
  visible,
  step,
  issueType,
  issueDetails,
  issueRoute,
  onClose,
  onNext,
  onBack,
  setIssueType,
  setIssueDetails,
  setIssueRoute,
}) => {
  const { s, theme } = useStyles();

  const IssueOption = ({ value, label, sub, icon }) => (
    <TouchableOpacity
      style={[
        s.radioRow,
        issueType === value && { 
          borderColor: GREEN, 
          backgroundColor: theme.isDark ? 'rgba(0,118,71,0.2)' : '#f0fdf4' 
        }
      ]}
      onPress={() => setIssueType(value)}
    >
      <View style={[s.radioCircle, issueType === value && { borderColor: GREEN }]}>
        {issueType === value && <View style={s.radioDot} />}
      </View>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={{ fontWeight: '500', color: theme.colors.text, fontSize: 14 }}>{label}</Text>
        <Text style={s.mutedSm}>{sub}</Text>
      </View>
      <Text style={{ fontSize: 20 }}>{icon}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={s.modalBox} activeOpacity={1}>
          {step === 'SELECT_TYPE' && (
            <>
              <Text style={s.modalTitle}>Report an Issue</Text>
              <View style={[s.infoBanner, { backgroundColor: theme.colors.successBg }]}>
                <Text style={{ fontSize: 13, color: theme.colors.successText, marginBottom: 4 }}>Help your community by reporting issues</Text>
                <Text style={{ fontSize: 11, color: theme.colors.successText }}>Earn +20 points and progress toward the "Transit Helper" badge</Text>
              </View>
              <IssueOption value="bus-missed" label="Bus didn't arrive" sub="Snow, delays, or cancellations" icon="🚫" />
              <IssueOption value="wheelchair ramps-out" label="Wheelchair ramps out of service" sub="Accessibility barrier" icon="♿" />
              <IssueOption value="crowding" label="Heavy crowding" sub="Difficult to board" icon="👥" />
              <IssueOption value="bike-rack-full" label="Bike rack is full" sub="No space available on the rack" icon="🚲" />
              <IssueOption value="ramp-unsafe" label="Ramp landing not safe to descend" sub="Hazardous ramp condition reported" icon="⚠️" />
              <IssueOption value="other" label="Other issue" sub="Report another problem" icon="📝" />
              <View style={[s.row, { marginTop: 16, gap: 10 }]}>
                <TouchableOpacity style={[s.btnHalf, theme.isDark ? s.btnPurple : s.btnGray]} onPress={onClose}>
                  <Text style={theme.isDark ? s.btnText : s.btnGrayText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.btnHalf, issueType ? s.btnGreen : s.btnGrayDisabled]}
                  onPress={onNext}
                  disabled={!issueType}
                >
                  <Text style={[s.btnText, !issueType && { color: '#9ca3af' }]}>Next</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 'ENTER_DETAILS' && (
            <>
              <Text style={s.modalTitle}>Provide Details</Text>
              
              <Text style={s.fieldLabel}>Which Route?</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {['915', '302', '900', '405'].map(r => (
                  <TouchableOpacity 
                    key={r} 
                    style={[s.filterChip, issueRoute.includes(r) && s.filterChipActive]}
                    onPress={() => setIssueRoute(`Route ${r}`)}
                  >
                    <Text style={[s.filterChipText, issueRoute.includes(r) && s.filterChipTextActive]}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
               <TextInput
                style={[s.textInput, { height: 45, marginBottom: 12 }]}
                placeholder="Enter Route Name (e.g. Route 915)"
                placeholderTextColor={theme.colors.textSecondary}
                value={issueRoute}
                onChangeText={setIssueRoute}
              />

              <Text style={s.fieldLabel}>Issue Details</Text>
               <TextInput
                style={s.textInput}
                multiline
                placeholder="E.g., North entrance ramp is blocked by snow..."
                placeholderTextColor={theme.colors.textSecondary}
                value={issueDetails}
                onChangeText={text => setIssueDetails(text.slice(0, 200))}
                maxLength={200}
              />
              <Text style={[s.mutedSm, { textAlign: 'right', marginTop: 4, marginBottom: 16 }]}>
                {issueDetails.length}/200 characters
              </Text>
              <View style={[s.row, { gap: 10 }]}>
                <TouchableOpacity style={[s.btnHalf, theme.isDark ? s.btnPurple : s.btnGray]} onPress={onBack}>
                  <Text style={theme.isDark ? s.btnText : s.btnGrayText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[s.btnHalf, (issueType && issueRoute) ? s.btnGreen : s.btnGrayDisabled]} 
                  onPress={onNext}
                  disabled={!issueType || !issueRoute}
                >
                  <Text style={[s.btnText, (!issueType || !issueRoute) && { color: '#9ca3af' }]}>Review</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 'CONFIRM' && (
            <>
              <Text style={s.modalTitle}>Confirm Report</Text>
              <Text style={[s.mutedSm, { marginBottom: 16 }]}>Please review your report before submitting.</Text>
              <View style={{ backgroundColor: theme.colors.inputBg, padding: 14, borderRadius: 10, marginBottom: 16 }}>
                <Text style={[s.mutedSm, { marginBottom: 4 }]}>Issue Type</Text>
                <Text style={{ fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
                  {issueType === 'bus-missed' ? "Bus didn't arrive" : issueType === 'wheelchair ramps-out' ? "Wheelchair ramps out of service" : issueType === 'crowding' ? "Heavy crowding" : issueType === 'bike-rack-full' ? "Bike rack is full" : issueType === 'ramp-unsafe' ? "Ramp landing not safe to descend" : "Other issue"}
                </Text>
                
                <Text style={[s.mutedSm, { marginBottom: 4 }]}>Route</Text>
                <Text style={{ fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>{issueRoute}</Text>

                <Text style={[s.mutedSm, { marginBottom: 4 }]}>Details</Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>
                  {issueDetails || 'No additional details provided.'}
                </Text>
              </View>
              <View style={[s.row, { gap: 10 }]}>
                <TouchableOpacity style={[s.btnHalf, theme.isDark ? s.btnPurple : s.btnGray]} onPress={onBack}>
                  <Text style={theme.isDark ? s.btnText : s.btnGrayText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.btnHalf, s.btnGreen]} onPress={onNext}>
                  <Text style={s.btnText}>Submit Report</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 'SUCCESS' && (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <Text style={{ fontSize: 50, marginBottom: 16 }}>🎉</Text>
              <Text style={s.modalTitle}>Report Submitted!</Text>
              <Text style={[s.mutedSm, { textAlign: 'center', marginBottom: 24 }]}>
                Thank you for helping the community stay informed. Your report is now live for other riders.
              </Text>
              <View style={[s.infoBanner, { backgroundColor: theme.colors.successBg, width: '100%' }]}>
                <Text style={{ color: theme.colors.successText, fontWeight: '700', textAlign: 'center' }}>+20 Points Earned!</Text>
              </View>
              <TouchableOpacity style={[s.btnGreen, { width: '100%', marginTop: 20 }]} onPress={onClose}>
                <Text style={s.btnText}>Great!</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default ReportIssueModal;
