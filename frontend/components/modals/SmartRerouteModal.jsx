import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useStyles, GREEN } from '../../logic/_styles';

const SmartRerouteModal = ({ 
  visible, 
  alternativeRoute, 
  onClose, 
  onSwitch 
}) => {
  const { s, theme } = useStyles();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={[s.modalBox, { borderTopWidth: 8, borderTopColor: '#f97316' }]}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 40, marginBottom: 8 }}>⚠️</Text>
            <Text style={[s.modalTitle, { color: '#c2410c', marginBottom: 2 }]}>Accessibility Alert</Text>
            <Text style={[s.mutedSm, { fontWeight: '700', color: '#f97316' }]}>ROUTE 915 ISSUE DETECTED</Text>
          </View>
          
          <View style={[s.infoBanner, { backgroundColor: '#fff7ed', borderWidth: 1, borderColor: '#fdba74' }]}>
            <Text style={{ fontSize: 14, color: '#9a3412', lineHeight: 20 }}>
              A community report indicates the <Text style={{ fontWeight: '700' }}>wheelchair ramp</Text> on your usual Route 915 is currently out of service.
            </Text>
          </View>

          <Text style={[s.fieldLabel, { marginTop: 16 }]}>Suggested Alternative</Text>
          <View style={[s.card, s.cardWhite, { borderWidth: 2, borderColor: GREEN, marginBottom: 20 }]}>
            <View style={s.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', color: theme.colors.text, fontSize: 16 }}>
                  {alternativeRoute?.route_long_name || 'Alternative Route'}
                </Text>
                <Text style={s.mutedSm}>Departs in {alternativeRoute?.eta || '8 min'} • Platform 4</Text>
                <View style={[s.row, { marginTop: 6 }]}>
                  <Text style={{ fontSize: 12, color: theme.colors.text }}>♿ Verified Accessible</Text>
                </View>
              </View>
              <Text style={{ fontSize: 28 }}>🚇</Text>
            </View>
          </View>

          <View style={[s.row, { gap: 10 }]}>
            <TouchableOpacity style={[s.btnHalf, theme.isDark ? s.btnPurple : s.btnGray]} onPress={onClose}>
              <Text style={theme.isDark ? s.btnText : s.btnGrayText}>Dismiss</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[s.btnHalf, s.btnGreen]} 
              onPress={onSwitch}
            >
              <Text style={s.btnText}>Switch & Earn +10 pts</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SmartRerouteModal;
