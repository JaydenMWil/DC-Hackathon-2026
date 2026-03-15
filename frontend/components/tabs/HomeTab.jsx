import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useStyles, GREEN } from '../_styles';

const HomeTab = ({ 
  points, communityAlerts, gpsAlertEnabled, alertRadius, handleOpenReport, setShowGpsSettings, 
  isTracking, distanceM, trackedBus,
  // Smart Reminder props
  smartRemindersEnabled, setSmartRemindersEnabled,
  safetyBuffer, setSafetyBuffer,
  walkingInfo, setIsSimulatingIssue
}) => {
  const { s, theme } = useStyles();
  const c = theme.colors;

  return (
    <ScrollView style={s.tabContent} showsVerticalScrollIndicator={false}>

      {/* Balance Card */}
      <View style={[s.card, s.gradientGreen, { marginBottom: 12 }]}>
        <Text style={s.cardTitle}>Your Balance</Text>
        <Text style={s.bigPoints}>{points} points</Text>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Ready to redeem at local partners</Text>
      </View>

      {/* Live Boarding Status */}
      {isTracking && trackedBus && (
        <View style={[s.card, s.cardWhite, { marginBottom: 12, borderLeftWidth: 4, borderLeftColor: GREEN }]}>
          <View style={s.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={[s.mutedSm, { fontWeight: '700', color: GREEN }]}>LIVE BOARDING STATUS</Text>
              <Text style={{ fontWeight: '700', color: c.text, fontSize: 16, marginTop: 2 }}>
                {trackedBus.route_long_name === 'Unknown Route' ? trackedBus.route_name : trackedBus.route_long_name}
              </Text>
              <Text style={s.mutedSm}>Vehicle approaching your stop</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 24, fontWeight: '800', color: c.text }}>
                {distanceM ? `${Math.round(distanceM)}m` : '--'}
              </Text>
              <Text style={s.mutedSm}>away</Text>
            </View>
          </View>
          <View style={[s.progressTrack, { marginTop: 12, height: 6 }]}>
            <View style={[s.progressBar, { width: `${Math.max(10, Math.min(100, (1 - (distanceM || 0) / 1000) * 100))}%` }]} />
          </View>
        </View>
      )}

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
            <Text style={{ fontSize: 11, color: c.successText, fontWeight: '600', marginTop: 4 }}>+{alert.points} pts for reporter</Text>
          </View>
        ))}
        <TouchableOpacity 
          style={s.btnOrange} 
          onPress={handleOpenReport}
          accessibilityLabel="Report an Issue, earn 20 points"
          accessibilityRole="button"
        >
          <Text style={s.btnText}>Report an Issue (+20 pts)</Text>
        </TouchableOpacity>
      </View>

      {/* Smart Routine Reminder */}
      <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
        <View style={s.rowBetween}>
          <View style={s.row}>
            <Text style={s.iconMd}>🧠</Text>
            <Text style={s.sectionTitle}>Smart Routine Reminder</Text>
          </View>
          {smartRemindersEnabled && (
            <TouchableOpacity 
              onPress={() => {
                const next = safetyBuffer >= 15 ? 5 : safetyBuffer + 5;
                setSafetyBuffer(next);
              }}
              style={[s.row, { backgroundColor: c.successBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }]}
            >
              <Text style={{ fontSize: 13, marginRight: 4 }}>⚙️</Text>
              <Text style={{ color: c.successText, fontWeight: '600', fontSize: 12 }}>+{safetyBuffer}m</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[s.reminderBox, smartRemindersEnabled && { borderLeftWidth: 4, borderLeftColor: GREEN }]}>
          <View style={s.row}>
            <Text style={{ fontSize: 22, marginRight: 10 }}>⏰</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600', color: c.text, fontSize: 13, marginBottom: 2 }}>
                {smartRemindersEnabled ? 'Next Reminder Active' : 'Your Regular Route Detected'}
              </Text>
              <Text style={s.mutedSm}>Route 915 at 8:10 AM • Weekdays</Text>
              
              {smartRemindersEnabled && walkingInfo ? (
                <View style={[s.quoteBox, { backgroundColor: c.successBg, borderColor: GREEN, borderWidth: 1 }]}>
                  <Text style={{ fontWeight: '700', color: GREEN, fontSize: 13 }}>
                    💬 Leave in {walkingInfo.walkingTimeMin} min + {safetyBuffer}m buffer
                  </Text>
                  <Text style={[s.mutedSm, { marginTop: 2 }]}>
                    Total time to leave: {walkingInfo.totalBufferMin} min
                  </Text>
                </View>
              ) : (
                <View style={s.quoteBox}>
                  <Text style={s.mutedSm}>💬 "Leave in 5 minutes to catch your usual 8:10 AM bus"</Text>
                </View>
              )}
              
              {!smartRemindersEnabled && (
                <Text style={s.mutedSm}>We noticed you take this route regularly. Would you like automatic reminders?</Text>
              )}
            </View>
          </View>
        </View>

        {!smartRemindersEnabled ? (
          <View style={[s.row, { gap: 8, marginBottom: 10 }]}>
            <TouchableOpacity style={[s.btnHalf, theme.isDark ? s.btnPurple : s.btnGray]} onPress={() => {}}>
              <Text style={theme.isDark ? s.btnText : s.btnGrayText}>Not Now</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[s.btnHalf, s.btnGreen]}
              onPress={() => setSmartRemindersEnabled(true)}
            >
              <Text style={s.btnText}>Enable Reminders</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 8, marginBottom: 10 }}>
            <TouchableOpacity 
              style={[s.btnGreen, { backgroundColor: '#f97316' }]}
              onPress={() => setIsSimulatingIssue(true)}
            >
              <Text style={s.btnText}>DEMO: Simulate Route 915 Issue 🚨</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={theme.isDark ? s.btnPurple : s.btnGray}
              onPress={() => setSmartRemindersEnabled(false)}
            >
              <Text style={theme.isDark ? s.btnText : s.btnGrayText}>Disable Reminders</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={s.divider} />
        <Text style={[s.mutedSm, { marginBottom: 4 }]}>✨ Smart features:</Text>
        {[
          `Calculates walking time to your stop (${walkingInfo ? Math.round(walkingInfo.distanceM) + 'm' : 'calculating...'})`,
          `Adjusts for ${safetyBuffer}m safety buffer ⚙️`,
          'Automatically suggests alternatives on issue detection',
          'Works with community-reported barrier alerts'
        ].map((f, i) => (
          <Text key={i} style={[s.mutedSm, { marginBottom: 2 }]}>• {f}</Text>
        ))}
      </View>

      {/* Weekly Challenge */}
      <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
        <View style={s.rowBetween}>
          <Text style={s.sectionTitle}>Weekly Challenge</Text>
          <Text style={{ fontSize: 22 }}>🎯</Text>
        </View>
        <Text style={{ fontWeight: '600', color: c.text, fontSize: 14, marginTop: 6 }}>Peak Avoider</Text>
        <Text style={s.mutedSm}>Take 5 off-peak rides (+10 pts each)</Text>
        <View style={[s.row, { marginTop: 10 }]}>
          <View style={s.progressTrack}>
            <View style={[s.progressBar, { width: '60%' }]} />
          </View>
          <Text style={{ fontWeight: '700', color: c.text, marginLeft: 8 }}>3/5</Text>
        </View>
        <Text style={[s.mutedSm, { marginTop: 6, color: c.successText, fontWeight: '600' }]}>🎁 +50 points bonus reward</Text>
      </View>

      {/* GPS Alerts */}
      <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
        <View style={s.rowBetween}>
          <View style={s.row}>
            <Text style={s.iconMd}>📍</Text>
            <Text style={s.sectionTitle}>Stop Approach Alerts</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setShowGpsSettings(true)}
            accessibilityLabel="Stop Approach Alert Settings"
            accessibilityRole="button"
          >
            <Text style={{ color: GREEN, fontSize: 13, fontWeight: '500' }}>Settings</Text>
          </TouchableOpacity>
        </View>
        {gpsAlertEnabled ? (
          <View>
            <View style={s.gpsBadgeEnabled}>
              <Text style={{ color: c.successText, fontSize: 16, marginRight: 6 }}>✓</Text>
              <Text style={{ color: c.successText, fontWeight: '500', fontSize: 13 }}>Alerts enabled at {alertRadius}m</Text>
            </View>
            <Text style={[s.mutedSm, { marginTop: 4 }]}>Vibration, sound, and visual cues when approaching your stop</Text>
          </View>
        ) : (
          <View>
            <Text style={[s.mutedSm, { marginBottom: 10 }]}>Get notified when approaching your destination</Text>
            <TouchableOpacity 
              style={s.btnGreen} 
              onPress={() => setShowGpsSettings(true)}
              accessibilityLabel="Enable Stop Approach Alerts"
              accessibilityRole="button"
            >
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
            <Text style={{ fontWeight: '600', color: c.text, fontSize: 13 }} numberOfLines={1} adjustsFontSizeToFit>Downtown → Durham college North campus</Text>
            <Text style={s.mutedSm}>Route 915 • Platform 2</Text>
            <Text style={{ color: c.successText, fontWeight: '700', marginTop: 4 }}>+15 pts</Text>
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
};

export default HomeTab;
