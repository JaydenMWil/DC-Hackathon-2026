import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useStyles, GREEN } from '../../core/_styles';

const GpsSettingsModal = ({
  visible,
  alertRadius,
  vibrationAlert,
  soundCueAlert,
  visualPopupAlert,
  onClose,
  onEnableAlerts,
  setAlertRadius,
  setVibrationAlert,
  setSoundCueAlert,
  setVisualPopupAlert,
}) => {
  const { s, theme } = useStyles();

  const RadiusOption = ({ value, label }) => (
    <TouchableOpacity
      style={[
        s.radioRow,
        alertRadius === value && { 
          borderColor: GREEN, 
          backgroundColor: theme.isDark ? 'rgba(0,118,71,0.2)' : '#f0fdf4' 
        }
      ]}
      onPress={() => setAlertRadius(value)}
    >
      <View style={[s.radioCircle, alertRadius === value && { borderColor: GREEN }]}>
        {alertRadius === value && <View style={s.radioDot} />}
      </View>
      <Text style={{ flex: 1, fontWeight: '500', color: theme.colors.text, marginLeft: 10 }}>{value} meters</Text>
      <Text style={s.mutedSm}>{label}</Text>
    </TouchableOpacity>
  );

  const AlertTypeRow = ({ icon, label, value, onChange }) => (
    <View style={[s.radioRow, { borderColor: theme.colors.border }]}>
      <Text style={{ fontSize: 20, marginRight: 10 }}>{icon}</Text>
      <Text style={{ flex: 1, fontWeight: '500', color: theme.colors.text, fontSize: 13 }}>{label}</Text>
      <Switch 
        value={value} 
        onValueChange={onChange}
        trackColor={{ true: GREEN }} 
      />
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
        <ScrollView style={[s.modalBox, { maxHeight: '90%' }]}>
          <TouchableOpacity activeOpacity={1}>
            <Text style={s.modalTitle}>GPS Alert Settings</Text>
            
            <Text style={s.fieldLabel}>Stop Proximity Radius</Text>
            <RadiusOption value={150} label="Safe margin" />
            <RadiusOption value={100} label="Standard" />
            <RadiusOption value={50} label="Last minute" />

            <Text style={[s.fieldLabel, { marginTop: 14 }]}>Alert Types</Text>
            <AlertTypeRow 
              icon="📳" 
              label="Vibration Alert" 
              value={vibrationAlert} 
              onChange={setVibrationAlert} 
            />
            <AlertTypeRow 
              icon="🔊" 
              label="Sound Cue" 
              value={soundCueAlert} 
              onChange={setSoundCueAlert} 
            />
            <AlertTypeRow 
              icon="💬" 
              label="Visual Popup" 
              value={visualPopupAlert} 
              onChange={setVisualPopupAlert} 
            />

            <View style={[s.infoBanner, { backgroundColor: theme.colors.successBg, marginTop: 14 }]}>
              <Text style={{ fontWeight: '600', color: theme.colors.text, marginBottom: 6 }}>✨ Universal Design Benefits</Text>
              {[
                'Helps visually impaired riders navigate confidently',
                'Reduces anxiety on unfamiliar routes',
                'Prevents missing stops when distracted',
                'Perfect for tourists and new riders',
                'Useful at night with low visibility',
                'Makes multitasking safer',
              ].map((b, i) => <Text key={i} style={[s.mutedSm, { marginBottom: 2 }]}>• {b}</Text>)}
            </View>

            <View style={[s.row, { marginTop: 16, marginBottom: 16, gap: 10 }]}>
              <TouchableOpacity style={[s.btnHalf, theme.isDark ? s.btnPurple : s.btnGray]} onPress={onClose}>
                <Text style={theme.isDark ? s.btnText : s.btnGrayText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btnHalf, s.btnGreen]} onPress={onEnableAlerts}>
                <Text style={s.btnText}>Enable Alerts</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </TouchableOpacity>
    </Modal>
  );
};

export default GpsSettingsModal;
