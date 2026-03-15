import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useStyles, GREEN } from '../../logic/_styles';

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
        <View style={[s.modalBox, { maxHeight: '90%', paddingBottom: 10 }]}>
          <TouchableOpacity activeOpacity={1}>
            <Text style={s.modalTitle} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.7}>GPS Alert Settings</Text>
            
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: '80%' }}>
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
                ].map((b, i) => <Text key={i} style={[s.mutedSm, { marginBottom: 3 }]}>• {b}</Text>)}
              </View>
            </ScrollView>

            {/* Buttons pinned to bottom outside scroll */}
            <View style={[s.row, { marginTop: 20, gap: 10 }]}>
              <TouchableOpacity style={[s.btnHalf, theme.isDark ? s.btnPurple : s.btnGray]} onPress={onClose}>
                <Text style={theme.isDark ? s.btnText : s.btnGrayText} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.7}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btnHalf, s.btnGreen]} onPress={onEnableAlerts}>
                <Text style={s.btnText} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.7}>Enable Alerts</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default GpsSettingsModal;
