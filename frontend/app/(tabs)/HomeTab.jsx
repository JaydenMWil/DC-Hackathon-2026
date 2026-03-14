import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { s, GREEN } from './styles';

const HomeTab = ({ points, communityAlerts, gpsAlertEnabled, alertRadius, handleOpenReport, setShowGpsSettings }) => (
  <ScrollView style={s.tabContent} showsVerticalScrollIndicator={false}>

    {/* Balance Card */}
    <View style={[s.card, s.gradientGreen, { marginBottom: 12 }]}>
      <Text style={s.cardTitle}>Your Balance</Text>
      <Text style={s.bigPoints}>{points} points</Text>
      <Text style={{ color: '#bbf7d0', fontSize: 13 }}>Ready to redeem at local partners</Text>
    </View>

    {/* Community Alerts */}
    <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
      <View style={s.row}>
        <Text style={s.iconMd}>🚨</Text>
        <Text style={s.sectionTitle}>Community Alerts</Text>
      </View>
      {communityAlerts.slice(0, 3).map(alert => (
        <View key={alert.id} style={s.alertBox}>
          <View style={[s.rowBetween, { marginBottom: 2 }]}>
            <Text style={s.alertRoute}>{alert.route}</Text>
            <Text style={s.mutedSm}>{alert.time}</Text>
          </View>
          <Text style={s.alertIssue}>{alert.issue}</Text>
          <Text style={{ fontSize: 11, color: '#c2410c', fontWeight: '600', marginTop: 4 }}>+{alert.points} pts for reporter</Text>
        </View>
      ))}
      <TouchableOpacity style={s.btnOrange} onPress={handleOpenReport}>
        <Text style={s.btnText}>Report an Issue (+20 pts)</Text>
      </TouchableOpacity>
    </View>

    {/* Smart Routine Reminder */}
    <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
      <View style={[s.row, { marginBottom: 10 }]}>
        <Text style={s.iconMd}>🧠</Text>
        <Text style={s.sectionTitle}>Smart Routine Reminder</Text>
      </View>
      <View style={s.reminderBox}>
        <View style={s.row}>
          <Text style={{ fontSize: 22, marginRight: 10 }}>⏰</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '600', color: '#111827', fontSize: 13, marginBottom: 2 }}>Your Regular Route Detected</Text>
            <Text style={s.mutedSm}>Route 915 at 8:10 AM • Weekdays</Text>
            <View style={s.quoteBox}>
              <Text style={s.mutedSm}>💬 "Leave in 5 minutes to catch your usual 8:10 AM bus"</Text>
            </View>
            <Text style={s.mutedSm}>We noticed you take this route regularly. Would you like automatic reminders?</Text>
          </View>
        </View>
      </View>
      <View style={[s.row, { gap: 8, marginBottom: 10 }]}>
        <TouchableOpacity style={[s.btnHalf, s.btnGray]}>
          <Text style={s.btnGrayText}>Not Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.btnHalf, s.btnGreen]}>
          <Text style={s.btnText}>Enable Reminders</Text>
        </TouchableOpacity>
      </View>
      <View style={s.divider} />
      <Text style={[s.mutedSm, { marginBottom: 4 }]}>✨ Smart features:</Text>
      {['Calculates walking time to your stop', 'Adjusts for weather delays', 'Considers snow-day reports', 'Works with radius-based alerts'].map((f, i) => (
        <Text key={i} style={[s.mutedSm, { marginBottom: 2 }]}>• {f}</Text>
      ))}
    </View>

    {/* Weekly Challenge */}
    <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
      <View style={s.rowBetween}>
        <Text style={s.sectionTitle}>Weekly Challenge</Text>
        <Text style={{ fontSize: 22 }}>🎯</Text>
      </View>
      <Text style={{ fontWeight: '600', color: '#374151', fontSize: 14, marginTop: 6 }}>Peak Avoider</Text>
      <Text style={s.mutedSm}>Take 5 off-peak rides (+10 pts each)</Text>
      <View style={[s.row, { marginTop: 10 }]}>
        <View style={s.progressTrack}>
          <View style={[s.progressBar, { width: '60%' }]} />
        </View>
        <Text style={{ fontWeight: '700', color: '#374151', marginLeft: 8 }}>3/5</Text>
      </View>
      <Text style={[s.mutedSm, { marginTop: 6 }]}>🎁 +50 points bonus reward</Text>
    </View>

    {/* GPS Alerts */}
    <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
      <View style={s.rowBetween}>
        <View style={s.row}>
          <Text style={s.iconMd}>📍</Text>
          <Text style={s.sectionTitle}>Stop Approach Alerts</Text>
        </View>
        <TouchableOpacity onPress={() => setShowGpsSettings(true)}>
          <Text style={{ color: GREEN, fontSize: 13, fontWeight: '500' }}>Settings</Text>
        </TouchableOpacity>
      </View>
      {gpsAlertEnabled ? (
        <View>
          <View style={s.gpsBadgeEnabled}>
            <Text style={{ color: '#15803d', fontSize: 16, marginRight: 6 }}>✓</Text>
            <Text style={{ color: '#15803d', fontWeight: '500', fontSize: 13 }}>Alerts enabled at {alertRadius}m</Text>
          </View>
          <Text style={[s.mutedSm, { marginTop: 4 }]}>Vibration, sound, and visual cues when approaching your stop</Text>
        </View>
      ) : (
        <View>
          <Text style={[s.mutedSm, { marginBottom: 10 }]}>Get notified when approaching your destination</Text>
          <TouchableOpacity style={s.btnGreen} onPress={() => setShowGpsSettings(true)}>
            <Text style={s.btnText}>Enable Alerts</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>

    {/* Recent Activity */}
    <View style={[s.card, s.cardWhite, { marginBottom: 80 }]}>
      <Text style={s.sectionTitle}>Recent Activity</Text>
      <Text style={[s.mutedSm, { marginBottom: 10 }]}>Your last accessible ride</Text>
      <View style={s.recentBox}>
        <View>
          <Text style={{ fontWeight: '600', color: '#111827', fontSize: 13 }} numberOfLines={1} adjustsFontSizeToFit>Downtown → Durham college North campus</Text>
          <Text style={s.mutedSm}>Route 915 • Platform 2</Text>
          <Text style={{ color: '#15803d', fontWeight: '700', marginTop: 4 }}>+15 pts</Text>
        </View>
        <View style={[s.row, { marginTop: 6, flexWrap: 'wrap' }]}>
          <Text style={s.mutedSm}>♿ Accessible route bonus</Text>
          <Text style={[s.mutedSm, { marginHorizontal: 4 }]}>•</Text>
          <Text style={s.mutedSm}>2 hours ago</Text>
        </View>
      </View>
    </View>
  </ScrollView>
);

export default HomeTab;
