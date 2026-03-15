import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useStyles, GREEN } from '../../core/_styles';

const HowItWorksModal = ({ visible, onClose }) => {
  const { s, theme } = useStyles();

  const DiagramStep = ({ num, title, desc, detail }) => (
    <View>
      <div style={s.stepRow}>
        <View style={s.stepCircle}>
          <Text style={s.stepNum}>{num}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700', color: theme.colors.text, marginBottom: 4 }}>{title}</Text>
          <Text style={[s.mutedSm, { marginBottom: 6 }]}>{desc}</Text>
          <View style={s.detailBox}>
            <Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>{detail}</Text>
          </View>
        </View>
      </div>
      <View style={{ alignItems: 'center', marginVertical: 8 }}>
        <Text style={{ color: GREEN, fontSize: 20 }}>↓</Text>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
        <ScrollView style={[s.modalBox, { maxHeight: '90%' }]}>
          <TouchableOpacity activeOpacity={1}>
            <Text style={[s.modalTitle, { marginBottom: 4 }]}>How AccessRide Works</Text>
            <Text style={[s.mutedSm, { marginBottom: 20 }]}>An inclusive, gamified transit companion</Text>
            
            <DiagramStep num="1" title="🧠 Smart Routine Reminder" desc="App learns your weekly habits and reminds you when to leave" detail={'Example: "Leave in 5 minutes to catch your usual 8:10 AM bus"'} />
            <DiagramStep num="2" title="📍 Radius-Based GPS Alerts" desc="Get notified when approaching your stop at 150m, 100m, and 50m" detail="Alerts: Vibration, sound cues, visual popups" />
            <DiagramStep num="3" title="🗺️ Accessible Route Planning" desc="Choose step-free, low-crowding, wheelchair-accessible routes" detail="Features: Real-time wheelchair ramps status, crowding levels, accessibility info" />
            <DiagramStep num="4" title="🚨 Community Issue Reporting" desc="Report missed buses, accessibility barriers, help others in real-time" detail="Examples: Bus delays, wheelchair ramps outages, crowding alerts" />
            <DiagramStep num="5" title="⭐ Earn Points & Rewards" desc="Collect points for positive transit habits" detail="Earn from: +5 per ride, +10 off-peak, +15 accessible routes, +20 issue reports" />
            
            <View>
              <View style={s.stepRow}>
                <View style={s.stepCircle}><Text style={s.stepNum}>6</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: theme.colors.text, marginBottom: 4 }}>🎁 Redeem at Local Businesses</Text>
                  <Text style={[s.mutedSm, { marginBottom: 6 }]}>Exchange points for real rewards from community partners</Text>
                  <View style={s.detailBox}>
                    <Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>Rewards: Free coffee, restaurant discounts, museum passes, local shop coupons</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={[s.infoBanner, { backgroundColor: theme.colors.successBg, marginTop: 20 }]}>
              <Text style={{ fontWeight: '700', color: theme.colors.text, marginBottom: 10 }}>✨ Core Features</Text>
              <View style={s.grid2}>
                {[
                  ['🧠', 'Smart reminders'], ['📍', 'GPS stop alerts'],
                  ['♿', 'Accessibility-first'], ['🚨', 'Community reports'],
                  ['⚡', 'Daily streaks'], ['🎯', 'Weekly challenges'],
                  ['🏆', 'Achievement badges'], ['🤝', 'Local partnerships'],
                ].map(([icon, label], i) => (
                  <View key={i} style={[s.row, { width: '48%', marginBottom: 8 }]}>
                    <Text style={{ fontSize: 16, marginRight: 6 }}>{icon}</Text>
                    <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity style={[s.btnGreen, { marginTop: 16, marginBottom: 16 }]} onPress={onClose}>
              <Text style={s.btnText}>Got it!</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </ScrollView>
      </TouchableOpacity>
    </Modal>
  );
};

export default HowItWorksModal;
