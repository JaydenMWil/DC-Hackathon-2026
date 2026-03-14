import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  StatusBar,
  Switch,
} from 'react-native';

// ─── MINIMAL QR CODE GENERATOR ───────────────────────────────────────────────
// Generates a visual QR-like grid from a string (simplified visual representation)
const QRCode = ({ value, size = 160 }) => {
  const cells = useMemo(() => {
    // Create a deterministic grid from the value string
    const hash = (str) => {
      let h = 5381;
      for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
      return Math.abs(h);
    };
    const N = 21;
    const grid = Array.from({ length: N }, (_, r) =>
      Array.from({ length: N }, (_, c) => {
        // Always-dark finder patterns (top-left, top-right, bottom-left corners)
        const inFinder = (row, col) =>
          (row < 8 && col < 8) || (row < 8 && col >= N - 8) || (row >= N - 8 && col < 8);
        if (inFinder(r, c)) {
          const ir = r >= N - 8 ? r - (N - 8) : r;
          const ic = c >= N - 8 ? c - (N - 8) : c;
          const br = r < 8 ? r : r - (N - 8);
          const bc = c < 8 ? c : c - (N - 8);
          if (br === 0 || br === 6 || bc === 0 || bc === 6) return true;
          if (br >= 2 && br <= 4 && bc >= 2 && bc <= 4) return true;
          return false;
        }
        // Timing patterns
        if (r === 6 || c === 6) return (r + c) % 2 === 0;
        // Data cells
        const seed = hash(value + r * N + c);
        return seed % 3 !== 0;
      })
    );
    return grid;
  }, [value]);

  const cell = size / 21;
  return (
    <View style={{ width: size, height: size, backgroundColor: '#fff' }}>
      {cells.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row' }}>
          {row.map((dark, c) => (
            <View
              key={c}
              style={{
                width: cell,
                height: cell,
                backgroundColor: dark ? '#111827' : '#fff',
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const GREEN = '#007647';
const DARK_GREEN = '#00703c';
const BG = '#f0f7f4';

const AccessRideApp = () => {
  const [tab, setTab] = useState('home');
  const [points, setPoints] = useState(245);
  const [streak, setStreak] = useState(5);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showReward, setShowReward] = useState(null);
  const [gpsAlertEnabled, setGpsAlertEnabled] = useState(false);
  const [alertRadius, setAlertRadius] = useState(100);
  const [showGpsSettings, setShowGpsSettings] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [issueType, setIssueType] = useState('');

  // ── Settings state ──────────────────────────────────────────────────────────
  const [showSettings, setShowSettings] = useState(false);
  const [settingsSection, setSettingsSection] = useState(null);
  const [colorMode, setColorMode] = useState('system');
  const [fontSize, setFontSize] = useState('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [profileName] = useState('Alex Johnson');
  const [profilePhone] = useState('+1 (905) 555-0142');
  const [profileEmail] = useState('alex.j@email.com');
  const [wheelchairVehicle, setWheelchairVehicle] = useState(true);
  const [textOnlyComms, setTextOnlyComms] = useState(false);
  const [voiceCall, setVoiceCall] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [rideAlerts, setRideAlerts] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(false);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [appLanguage, setAppLanguage] = useState('English');
  const [locationPerm, setLocationPerm] = useState('while_using');
  const [dataSharing, setDataSharing] = useState(true);

  const routes = [
    { id: 1, from: 'Downtown', to: 'Durham college North campus', accessible: true, time: '18 min', crowding: 'low', pts: 15, line: 'Route 915' },
    { id: 2, from: 'Downtown', to: 'Durham college North campus', accessible: false, time: '15 min', crowding: 'medium', pts: 5, line: 'Route 920' },
    { id: 3, from: 'Downtown', to: 'Durham college North campus', accessible: true, time: '22 min', crowding: 'high', pts: 15, line: 'Route 925' },
  ];

  const rewards = [
    { id: 1, name: 'BrewHouse Café', offer: '$2 off', pts: 150, icon: '☕', claimed: false },
    { id: 2, name: 'City Museum', offer: 'Free entry', pts: 200, icon: '🏛️', claimed: false },
    { id: 3, name: 'Transit Store', offer: '10% off', pts: 100, icon: '👕', claimed: true },
    { id: 4, name: 'Green Bistro', offer: '15% off', pts: 180, icon: '🥗', claimed: false },
    { id: 5, name: 'Book Nook', offer: '$5 off', pts: 120, icon: '📚', claimed: false },
  ];

  const achievements = [
    { id: 1, name: 'Early Bird', desc: '10 rides before 7 AM', icon: '🌅', progress: 6, total: 10 },
    { id: 2, name: 'City Explorer', desc: '15 different stations', icon: '🗺️', progress: 15, total: 15 },
    { id: 3, name: 'Accessibility Ally', desc: '5 accessibility reports', icon: '🦸', progress: 3, total: 5 },
    { id: 4, name: 'Transit Helper', desc: '7-day streak', icon: '⚡', progress: 5, total: 7 },
  ];

  const communityAlerts = [
    { id: 1, route: 'Route 915', issue: "Bus didn't arrive - snow buildup", time: '15 min ago', points: 20 },
    { id: 2, route: 'Route 920', issue: 'Wheelchair ramps out of service at Main Station', time: '1 hour ago', points: 20 },
  ];

  const selectRoute = (route) => {
    setSelectedRoute(route);
    if (route.accessible) setPoints(p => p + 15);
  };

  const redeem = (reward) => {
    if (points >= reward.pts && !reward.claimed) {
      setPoints(p => p - reward.pts);
      setShowReward(reward);
    }
  };

  const submitIssueReport = () => {
    if (issueType) {
      setPoints(p => p + 20);
      setShowReportIssue(false);
      setIssueType('');
    }
  };

  const crowdingStyle = (crowding) => {
    if (crowding === 'low') return { bg: '#dcfce7', text: '#15803d' };
    if (crowding === 'medium') return { bg: '#fef9c3', text: '#a16207' };
    return { bg: '#fee2e2', text: '#b91c1c' };
  };

  const crowdingEmoji = (crowding) => {
    if (crowding === 'low') return '🟢';
    if (crowding === 'medium') return '🟡';
    return '🔴';
  };

  // ─── HOME TAB ──────────────────────────────────────────────────────────────
  const HomeTab = () => (
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
        {communityAlerts.map(alert => (
          <View key={alert.id} style={s.alertBox}>
            <View style={[s.rowBetween, { marginBottom: 2 }]}>
              <Text style={s.alertRoute}>{alert.route}</Text>
              <Text style={s.mutedSm}>{alert.time}</Text>
            </View>
            <Text style={s.alertIssue}>{alert.issue}</Text>
            <Text style={{ fontSize: 11, color: '#c2410c', fontWeight: '600', marginTop: 4 }}>+{alert.points} pts for reporter</Text>
          </View>
        ))}
        <TouchableOpacity style={s.btnOrange} onPress={() => setShowReportIssue(true)}>
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

  // ─── ROUTES TAB ────────────────────────────────────────────────────────────
  const RoutesTab = () => (
    <ScrollView style={s.tabContent} showsVerticalScrollIndicator={false}>
      <View style={[s.row, { marginBottom: 16 }]}>
        <TouchableOpacity onPress={() => setTab('home')} style={{ marginRight: 10 }}>
          <Text style={{ color: '#6b7280', fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.pageTitle}>Route Options</Text>
      </View>

      <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
        <View style={[s.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <View style={[s.row, { flex: 1, alignItems: 'center' }]}>
            <View style={[s.dot, { backgroundColor: GREEN, flexShrink: 0 }]} />
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontWeight: '600', color: '#111827', fontSize: 13 }}>Downtown</Text>
              <Text style={s.mutedSm}>Main Station</Text>
            </View>
          </View>
          <Text style={{ color: '#9ca3af', fontSize: 16, marginHorizontal: 8 }}>→</Text>
          <View style={[s.row, { flex: 1, alignItems: 'center', justifyContent: 'flex-end' }]}>
            <View style={{ alignItems: 'flex-end', marginRight: 8 }}>
              <Text style={{ fontWeight: '600', color: '#111827', fontSize: 13 }}>Durham college{'\n'}North campus</Text>
              <Text style={s.mutedSm}>Campus Stop</Text>
            </View>
            <View style={[s.dot, { backgroundColor: GREEN, flexShrink: 0 }]} />
          </View>
        </View>
      </View>

      {routes.map(route => {
        const cs = crowdingStyle(route.crowding);
        const selected = selectedRoute?.id === route.id;
        return (
          <TouchableOpacity
            key={route.id}
            style={[s.card, s.cardWhite, { marginBottom: 10, borderWidth: selected ? 2 : 1, borderColor: selected ? GREEN : '#e5e7eb' }]}
            onPress={() => selectRoute(route)}
          >
            <View style={s.rowBetween}>
              <View>
                <View style={s.row}>
                  <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>{route.time}</Text>
                  {route.accessible && <Text style={{ fontSize: 18, marginLeft: 6 }}>♿</Text>}
                </View>
                <Text style={s.mutedSm}>{route.line} • Express</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: GREEN, fontWeight: '700' }}>+{route.pts} pts</Text>
                <Text style={[s.mutedSm, { marginTop: 2, textTransform: 'capitalize' }]}>{route.crowding} crowd</Text>
              </View>
            </View>
            <View style={[s.row, { marginTop: 10, flexWrap: 'wrap', gap: 6 }]}>
              {route.accessible && (
                <View style={[s.badge, { backgroundColor: '#dcfce7' }]}>
                  <Text style={{ color: '#15803d', fontSize: 11, fontWeight: '600' }}>Accessible (+15 pts)</Text>
                </View>
              )}
              <View style={[s.badge, { backgroundColor: cs.bg }]}>
                <Text style={{ color: cs.text, fontSize: 11, fontWeight: '600' }}>{crowdingEmoji(route.crowding)} {route.crowding}</Text>
              </View>
            </View>
            {selected && (
              <View style={{ marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#e5e7eb' }}>
                <TouchableOpacity style={s.btnGreen}>
                  <Text style={s.btnText}>Start Navigation</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
      <View style={{ height: 80 }} />
    </ScrollView>
  );

  // ─── REWARDS TAB ───────────────────────────────────────────────────────────
  const RewardsTab = () => (
    <ScrollView style={s.tabContent} showsVerticalScrollIndicator={false}>
      <View style={[s.row, { marginBottom: 16 }]}>
        <TouchableOpacity onPress={() => setTab('home')} style={{ marginRight: 10 }}>
          <Text style={{ color: '#6b7280', fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.pageTitle}>Local Business Rewards</Text>
      </View>

      <View style={[s.card, s.gradientGreen, { marginBottom: 12 }]}>
        <View style={s.rowBetween}>
          <View>
            <Text style={{ fontSize: 32, fontWeight: '700', color: '#fff' }}>{points}</Text>
            <Text style={{ color: '#bbf7d0', fontSize: 13 }}>Total Points</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 26, fontWeight: '700', color: '#fff' }}>⚡{streak}</Text>
            <Text style={{ color: '#bbf7d0', fontSize: 12 }}>Day Streak</Text>
          </View>
        </View>
        <View style={[s.row, { marginTop: 14, gap: 8 }]}>
          {[{ icon: '🏆', label: 'Level 5' }, { icon: '🎖️', label: '12 Badges' }, { icon: '📈', label: 'Top 15%' }].map((item, i) => (
            <View key={i} style={s.statBadge}>
              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              <Text style={{ fontSize: 11, color: '#fff', marginTop: 4 }}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {rewards.map(reward => (
        <View key={reward.id} style={[s.card, s.cardWhite, { marginBottom: 10, opacity: reward.claimed ? 0.6 : 1 }]}>
          <View style={s.row}>
            <Text style={{ fontSize: 34, marginRight: 12 }}>{reward.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: '#111827' }}>{reward.name}</Text>
              <Text style={{ color: GREEN, fontWeight: '600', fontSize: 13 }}>{reward.offer}</Text>
              <Text style={s.mutedSm}>{reward.pts} points required</Text>
            </View>
            <TouchableOpacity
              style={[
                s.redeemBtn,
                reward.claimed || points < reward.pts ? s.redeemBtnDisabled : s.redeemBtnActive,
              ]}
              onPress={() => redeem(reward)}
              disabled={reward.claimed || points < reward.pts}
            >
              <Text style={[s.redeemBtnText, (reward.claimed || points < reward.pts) && { color: '#9ca3af' }]}>
                {reward.claimed ? 'Claimed' : points >= reward.pts ? 'Redeem' : 'Locked'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <View style={{ height: 80 }} />
    </ScrollView>
  );

  // ─── ACHIEVEMENTS TAB ──────────────────────────────────────────────────────
  const AchievementsTab = () => (
    <ScrollView style={s.tabContent} showsVerticalScrollIndicator={false}>
      <View style={[s.row, { marginBottom: 16 }]}>
        <TouchableOpacity onPress={() => setTab('home')} style={{ marginRight: 10 }}>
          <Text style={{ color: '#6b7280', fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.pageTitle}>Achievements & Badges</Text>
      </View>

      {achievements.map(achievement => {
        const pct = (achievement.progress / achievement.total) * 100;
        const done = achievement.progress >= achievement.total;
        return (
          <View key={achievement.id} style={[s.card, s.cardWhite, { marginBottom: 10, borderWidth: done ? 2 : 1, borderColor: done ? GREEN : '#e5e7eb' }]}>
            <View style={[s.row, { marginBottom: 10 }]}>
              <Text style={{ fontSize: 34, marginRight: 12, opacity: done ? 1 : 0.4 }}>{achievement.icon}</Text>
              <View style={{ flex: 1 }}>
                <View style={s.row}>
                  <Text style={{ fontWeight: '700', color: '#111827', marginRight: 6 }}>{achievement.name}</Text>
                  {done && <Text style={{ color: '#22c55e' }}>✓</Text>}
                </View>
                <Text style={s.mutedSm}>{achievement.desc}</Text>
              </View>
            </View>
            <View style={s.rowBetween}>
              <Text style={s.mutedSm}>Progress</Text>
              <Text style={{ fontWeight: '700', color: done ? GREEN : '#6b7280', fontSize: 13 }}>{achievement.progress}/{achievement.total}</Text>
            </View>
            <View style={s.progressTrack}>
              <View style={[s.progressBar, { width: `${pct}%`, backgroundColor: done ? GREEN : '#9ca3af' }]} />
            </View>
          </View>
        );
      })}
      <View style={{ height: 80 }} />
    </ScrollView>
  );

  // ─── REPORT ISSUE MODAL ────────────────────────────────────────────────────
  const IssueOption = ({ value, label, sub, icon }) => (
    <TouchableOpacity
      style={[s.radioRow, issueType === value && { borderColor: GREEN, backgroundColor: '#f0fdf4' }]}
      onPress={() => setIssueType(value)}
    >
      <View style={[s.radioCircle, issueType === value && { borderColor: GREEN }]}>
        {issueType === value && <View style={s.radioDot} />}
      </View>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={{ fontWeight: '500', color: '#111827', fontSize: 14 }}>{label}</Text>
        <Text style={s.mutedSm}>{sub}</Text>
      </View>
      <Text style={{ fontSize: 20 }}>{icon}</Text>
    </TouchableOpacity>
  );

  // ─── GPS SETTINGS MODAL ────────────────────────────────────────────────────
  const RadiusOption = ({ value, label }) => (
    <TouchableOpacity
      style={[s.radioRow, alertRadius === value && { borderColor: GREEN, backgroundColor: '#f0fdf4' }]}
      onPress={() => setAlertRadius(value)}
    >
      <View style={[s.radioCircle, alertRadius === value && { borderColor: GREEN }]}>
        {alertRadius === value && <View style={s.radioDot} />}
      </View>
      <Text style={{ flex: 1, fontWeight: '500', color: '#111827', marginLeft: 10 }}>{value} meters</Text>
      <Text style={s.mutedSm}>{label}</Text>
    </TouchableOpacity>
  );

  const AlertTypeRow = ({ icon, label }) => (
    <View style={[s.radioRow, { borderColor: '#e5e7eb' }]}>
      <Text style={{ fontSize: 20, marginRight: 10 }}>{icon}</Text>
      <Text style={{ flex: 1, fontWeight: '500', color: '#111827', fontSize: 13 }}>{label}</Text>
      <Switch value={true} trackColor={{ true: GREEN }} />
    </View>
  );

  // ─── HOW IT WORKS MODAL ────────────────────────────────────────────────────
  const DiagramStep = ({ num, title, desc, detail }) => (
    <View>
      <View style={s.stepRow}>
        <View style={s.stepCircle}>
          <Text style={s.stepNum}>{num}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700', color: '#111827', marginBottom: 4 }}>{title}</Text>
          <Text style={[s.mutedSm, { marginBottom: 6 }]}>{desc}</Text>
          <View style={s.detailBox}>
            <Text style={{ fontSize: 11, color: '#374151' }}>{detail}</Text>
          </View>
        </View>
      </View>
      <View style={{ alignItems: 'center', marginVertical: 8 }}>
        <Text style={{ color: GREEN, fontSize: 20 }}>↓</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar backgroundColor={GREEN} barStyle="light-content" />

      {/* Header */}
      <View style={s.header}>
        <View style={s.rowBetween}>
          <View>
            <Text style={s.headerTitle}>AccessRide</Text>
            <Text style={s.headerSub}>Inclusive Transit Companion</Text>
          </View>
          <TouchableOpacity style={s.howBtn} onPress={() => { setShowSettings(true); setSettingsSection(null); }}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '500' }}>⚙️ Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={{ flex: 1, backgroundColor: BG }}>
        {tab === 'home' && <HomeTab />}
        {tab === 'routes' && <RoutesTab />}
        {tab === 'rewards' && <RewardsTab />}
        {tab === 'achievements' && <AchievementsTab />}
      </View>

      {/* Bottom Nav */}
      <View style={s.bottomNav}>
        {[
          { key: 'home', icon: '🏠', label: 'Home' },
          { key: 'routes', icon: '🚇', label: 'Routes' },
          { key: 'rewards', icon: '🎁', label: 'Rewards' },
          { key: 'achievements', icon: '🏆', label: 'Badges' },
        ].map(item => (
          <TouchableOpacity
            key={item.key}
            style={[s.navItem, tab === item.key && s.navItemActive]}
            onPress={() => setTab(item.key)}
          >
            <Text style={{ fontSize: 20 }}>{item.icon}</Text>
            <Text style={[s.navLabel, tab === item.key && { color: '#fff' }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Report Issue Modal */}
      <Modal visible={showReportIssue} transparent animationType="fade" onRequestClose={() => setShowReportIssue(false)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowReportIssue(false)}>
          <TouchableOpacity style={s.modalBox} activeOpacity={1}>
            <Text style={s.modalTitle}>Report an Issue</Text>
            <View style={[s.infoBanner, { backgroundColor: '#f0fdf4' }]}>
              <Text style={{ fontSize: 13, color: '#166534', marginBottom: 4 }}>Help your community by reporting issues</Text>
              <Text style={{ fontSize: 11, color: '#15803d' }}>Earn +20 points and progress toward the "Transit Helper" badge</Text>
            </View>
            <IssueOption value="bus-missed" label="Bus didn't arrive" sub="Snow, delays, or cancellations" icon="🚫" />
            <IssueOption value="wheelchair ramps-out" label="Wheelchair ramps out of service" sub="Accessibility barrier" icon="♿" />
            <IssueOption value="crowding" label="Heavy crowding" sub="Difficult to board" icon="👥" />
            <IssueOption value="bike-rack-full" label="Bike rack is full" sub="No space available on the rack" icon="🚲" />
            <IssueOption value="ramp-unsafe" label="Ramp landing not safe to descend" sub="Hazardous ramp condition reported" icon="⚠️" />
            <IssueOption value="other" label="Other issue" sub="Report another problem" icon="📝" />
            <View style={[s.row, { marginTop: 16, gap: 10 }]}>
              <TouchableOpacity style={[s.btnHalf, s.btnGray]} onPress={() => setShowReportIssue(false)}>
                <Text style={s.btnGrayText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.btnHalf, issueType ? s.btnGreen : s.btnGrayDisabled]}
                onPress={submitIssueReport}
                disabled={!issueType}
              >
                <Text style={[s.btnText, !issueType && { color: '#9ca3af' }]}>Submit Report</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Reward Modal */}
      <Modal visible={!!showReward} transparent animationType="fade" onRequestClose={() => setShowReward(null)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowReward(null)}>
          <TouchableOpacity style={[s.modalBox, { alignItems: 'center' }]} activeOpacity={1}>
            <Text style={{ fontSize: 56, marginBottom: 12 }}>{showReward?.icon}</Text>
            <Text style={s.modalTitle}>Reward Claimed!</Text>
            <Text style={{ color: '#6b7280', marginBottom: 4 }}>{showReward?.name}</Text>
            <Text style={{ color: GREEN, fontWeight: '700', fontSize: 17, marginBottom: 16 }}>{showReward?.offer}</Text>
            <View style={[s.qrBox]}>
              <View style={s.qrInner}>
                <QRCode value={`ACCESSRIDE:${showReward?.name}:${showReward?.offer}:${Date.now()}`} size={160} />
                <Text style={[s.mutedSm, { marginTop: 8, textAlign: 'center' }]}>QR Code</Text>
              </View>
              <Text style={[s.mutedSm, { textAlign: 'center', marginTop: 6 }]}>Show this at {showReward?.name} to redeem</Text>
            </View>
            <TouchableOpacity style={[s.btnGreen, { backgroundColor: '#7c3aed', width: '100%', marginTop: 10 }]} onPress={() => setShowReward(null)}>
              <Text style={s.btnText}>Done</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* GPS Settings Modal */}
      <Modal visible={showGpsSettings} transparent animationType="fade" onRequestClose={() => setShowGpsSettings(false)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowGpsSettings(false)}>
          <ScrollView style={[s.modalBox, { maxHeight: '85%' }]}>
            <TouchableOpacity activeOpacity={1}>
              <Text style={[s.modalTitle, { marginBottom: 14 }]}>Stop Approach Alert Settings</Text>
              <View style={[s.infoBanner, { backgroundColor: '#eff6ff', marginBottom: 16 }]}>
                <View style={s.row}>
                  <Text style={{ fontSize: 22, marginRight: 10 }}>📍</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '600', color: '#1e3a5f', marginBottom: 4 }}>Radius-Based GPS Alert</Text>
                    <Text style={{ fontSize: 12, color: '#1d4ed8' }}>Tracks your location and sends alerts at customizable distances when approaching your stop</Text>
                  </View>
                </View>
              </View>
              <Text style={s.fieldLabel}>Alert Distance</Text>
              <RadiusOption value={150} label="Early warning" />
              <RadiusOption value={100} label="Recommended" />
              <RadiusOption value={50} label="Last minute" />
              <Text style={[s.fieldLabel, { marginTop: 14 }]}>Alert Types</Text>
              <AlertTypeRow icon="📳" label="Vibration Alert" />
              <AlertTypeRow icon="🔊" label="Sound Cue" />
              <AlertTypeRow icon="💬" label="Visual Popup" />
              <View style={[s.infoBanner, { backgroundColor: '#f0fdf4', marginTop: 14 }]}>
                <Text style={{ fontWeight: '600', color: '#111827', marginBottom: 6 }}>✨ Universal Design Benefits</Text>
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
                <TouchableOpacity style={[s.btnHalf, s.btnGray]} onPress={() => setShowGpsSettings(false)}>
                  <Text style={s.btnGrayText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.btnHalf, s.btnGreen]} onPress={() => { setGpsAlertEnabled(true); setShowGpsSettings(false); }}>
                  <Text style={s.btnText}>Enable Alerts</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </TouchableOpacity>
      </Modal>

      {/* Settings Modal */}
      <Modal visible={showSettings} transparent animationType="slide" onRequestClose={() => setShowSettings(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => { if (settingsSection) setSettingsSection(null); else setShowSettings(false); }} />
          <View style={{ backgroundColor: BG, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' }}>
            {/* Settings Header */}
            <View style={{ backgroundColor: GREEN, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              {settingsSection ? (
                <TouchableOpacity onPress={() => setSettingsSection(null)}>
                  <Text style={{ color: '#fff', fontSize: 16 }}>← Back</Text>
                </TouchableOpacity>
              ) : <View style={{ width: 50 }} />}
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
                {settingsSection === 'appearance' ? '🎨 Appearance'
                  : settingsSection === 'account' ? '👤 Account & Security'
                  : settingsSection === 'accessibility' ? '♿ Accessibility'
                  : settingsSection === 'language' ? '🌐 Language & Region'
                  : settingsSection === 'privacy' ? '🔒 Privacy'
                  : settingsSection === 'support' ? '💬 Support'
                  : '⚙️ Settings'}
              </Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '300' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ paddingHorizontal: 16, paddingTop: 16 }} showsVerticalScrollIndicator={false}>

              {/* ── MAIN MENU ── */}
              {!settingsSection && (
                <View style={{ paddingBottom: 40 }}>
                  {[
                    { key: 'appearance', icon: '🎨', label: 'Appearance', sub: 'Dark mode, font size, contrast' },
                    { key: 'account', icon: '👤', label: 'Account & Security', sub: 'Profile, password, account' },
                    { key: 'accessibility', icon: '♿', label: 'Accessibility', sub: 'Mobility, screen reader, alerts' },
                    { key: 'language', icon: '🌐', label: 'Language & Region', sub: `${appLanguage}` },
                    { key: 'privacy', icon: '🔒', label: 'Privacy', sub: 'Location, data sharing' },
                    { key: 'support', icon: '💬', label: 'Support', sub: 'How to use the app' },
                  ].map(item => (
                    <TouchableOpacity key={item.key} style={[s.card, s.cardWhite, { marginBottom: 10, flexDirection: 'row', alignItems: 'center' }]} onPress={() => setSettingsSection(item.key)}>
                      <Text style={{ fontSize: 26, marginRight: 14 }}>{item.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '700', color: '#111827', fontSize: 15 }}>{item.label}</Text>
                        <Text style={s.mutedSm}>{item.sub}</Text>
                      </View>
                      <Text style={{ color: '#9ca3af', fontSize: 18 }}>›</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* ── APPEARANCE ── */}
              {settingsSection === 'appearance' && (
                <View style={{ paddingBottom: 40 }}>
                  <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                    <Text style={[s.fieldLabel, { marginBottom: 12 }]}>🌓 Dark Mode</Text>
                    {[['light', '☀️ Light'], ['dark', '🌙 Dark'], ['system', '📱 System Default']].map(([val, label]) => (
                      <TouchableOpacity key={val} style={[s.radioRow, colorMode === val && { borderColor: GREEN, backgroundColor: '#f0fdf4' }]} onPress={() => setColorMode(val)}>
                        <View style={[s.radioCircle, colorMode === val && { borderColor: GREEN }]}>
                          {colorMode === val && <View style={s.radioDot} />}
                        </View>
                        <Text style={{ flex: 1, fontWeight: '500', color: '#111827', marginLeft: 10 }}>{label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                    <Text style={[s.fieldLabel, { marginBottom: 12 }]}>🔡 Font Size</Text>
                    {[['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']].map(([val, label]) => (
                      <TouchableOpacity key={val} style={[s.radioRow, fontSize === val && { borderColor: GREEN, backgroundColor: '#f0fdf4' }]} onPress={() => setFontSize(val)}>
                        <View style={[s.radioCircle, fontSize === val && { borderColor: GREEN }]}>
                          {fontSize === val && <View style={s.radioDot} />}
                        </View>
                        <Text style={{ flex: 1, fontWeight: '500', color: '#111827', marginLeft: 10 }}>{label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.fieldLabel}>⬛ High-Contrast Mode</Text>
                        <Text style={s.mutedSm}>Improves visibility for accessibility</Text>
                      </View>
                      <Switch value={highContrast} onValueChange={setHighContrast} trackColor={{ true: GREEN }} />
                    </View>
                  </View>
                </View>
              )}

              {/* ── ACCOUNT & SECURITY ── */}
              {settingsSection === 'account' && (
                <View style={{ paddingBottom: 40 }}>
                  <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                    <Text style={[s.fieldLabel, { marginBottom: 10 }]}>👤 Profile Information</Text>
                    {[['Name', profileName], ['Phone', profilePhone], ['Email', profileEmail]].map(([label, val]) => (
                      <View key={label} style={{ marginBottom: 12 }}>
                        <Text style={[s.mutedSm, { marginBottom: 4 }]}>{label}</Text>
                        <View style={{ backgroundColor: '#f9fafb', borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={{ color: '#111827', fontSize: 14 }}>{val}</Text>
                          <Text style={{ color: GREEN, fontSize: 13, fontWeight: '600' }}>Edit</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity style={[s.card, s.cardWhite, { marginBottom: 10, flexDirection: 'row', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 20, marginRight: 12 }}>🔑</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '600', color: '#111827' }}>Change Password</Text>
                      <Text style={s.mutedSm}>Update your account password</Text>
                    </View>
                    <Text style={{ color: '#9ca3af', fontSize: 18 }}>›</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.card, { marginBottom: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff5f5', borderWidth: 1, borderColor: '#fecaca' }]}>
                    <Text style={{ fontSize: 20, marginRight: 12 }}>🗑️</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '600', color: '#b91c1c' }}>Delete Account</Text>
                      <Text style={[s.mutedSm, { color: '#ef4444' }]}>Permanently remove your data</Text>
                    </View>
                    <Text style={{ color: '#fca5a5', fontSize: 18 }}>›</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* ── ACCESSIBILITY ── */}
              {settingsSection === 'accessibility' && (
                <View style={{ paddingBottom: 40 }}>
                  <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                    <Text style={[s.fieldLabel, { marginBottom: 10 }]}>🦽 Mobility Preferences</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '500', color: '#111827', fontSize: 14 }}>Wheelchair Accessible Vehicle</Text>
                        <Text style={s.mutedSm}>Only show accessible transport options</Text>
                      </View>
                      <Switch value={wheelchairVehicle} onValueChange={setWheelchairVehicle} trackColor={{ true: GREEN }} />
                    </View>
                  </View>
                  <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                    <Text style={[s.fieldLabel, { marginBottom: 10 }]}>💬 Communication Preferences</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '500', color: '#111827', fontSize: 14 }}>Text-Only Communication</Text>
                        <Text style={s.mutedSm}>Receive all updates via text/SMS</Text>
                      </View>
                      <Switch value={textOnlyComms} onValueChange={setTextOnlyComms} trackColor={{ true: GREEN }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '500', color: '#111827', fontSize: 14 }}>Voice Call Preferred</Text>
                        <Text style={s.mutedSm}>Receive alerts via voice call</Text>
                      </View>
                      <Switch value={voiceCall} onValueChange={setVoiceCall} trackColor={{ true: GREEN }} />
                    </View>
                  </View>
                  <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.fieldLabel}>👁️ Screen Reader Optimization</Text>
                        <Text style={s.mutedSm}>Enhance compatibility with screen readers</Text>
                      </View>
                      <Switch value={screenReader} onValueChange={setScreenReader} trackColor={{ true: GREEN }} />
                    </View>
                  </View>
                  <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                    <Text style={[s.fieldLabel, { marginBottom: 10 }]}>🔔 Notifications</Text>
                    {[
                      ['Ride Status Alerts', 'Updates on your booked rides', rideAlerts, setRideAlerts],
                      ['Promotions & Updates', 'News and special offers', promoAlerts, setPromoAlerts],
                      ['Emergency Alerts', 'Critical safety notifications', emergencyAlerts, setEmergencyAlerts],
                    ].map(([label, sub, val, setter]) => (
                      <View key={label} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontWeight: '500', color: '#111827', fontSize: 14 }}>{label}</Text>
                          <Text style={s.mutedSm}>{sub}</Text>
                        </View>
                        <Switch value={val} onValueChange={setter} trackColor={{ true: GREEN }} />
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* ── LANGUAGE & REGION ── */}
              {settingsSection === 'language' && (
                <View style={{ paddingBottom: 40 }}>
                  <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                    <Text style={[s.fieldLabel, { marginBottom: 12 }]}>🌐 App Language</Text>
                    {['English', 'Français', 'Español', 'العربية', 'हिन्दी', '中文'].map(lang => (
                      <TouchableOpacity key={lang} style={[s.radioRow, appLanguage === lang && { borderColor: GREEN, backgroundColor: '#f0fdf4' }]} onPress={() => setAppLanguage(lang)}>
                        <View style={[s.radioCircle, appLanguage === lang && { borderColor: GREEN }]}>
                          {appLanguage === lang && <View style={s.radioDot} />}
                        </View>
                        <Text style={{ flex: 1, fontWeight: '500', color: '#111827', marginLeft: 10 }}>{lang}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* ── PRIVACY ── */}
              {settingsSection === 'privacy' && (
                <View style={{ paddingBottom: 40 }}>
                  <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                    <Text style={[s.fieldLabel, { marginBottom: 12 }]}>📍 Location Permissions</Text>
                    {[['always', '🔒 Always'], ['while_using', '📱 While Using App'], ['never', '🚫 Never']].map(([val, label]) => (
                      <TouchableOpacity key={val} style={[s.radioRow, locationPerm === val && { borderColor: GREEN, backgroundColor: '#f0fdf4' }]} onPress={() => setLocationPerm(val)}>
                        <View style={[s.radioCircle, locationPerm === val && { borderColor: GREEN }]}>
                          {locationPerm === val && <View style={s.radioDot} />}
                        </View>
                        <Text style={{ flex: 1, fontWeight: '500', color: '#111827', marginLeft: 10 }}>{label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.fieldLabel}>📊 Data Sharing Preferences</Text>
                        <Text style={s.mutedSm}>Share anonymized usage data to improve the app</Text>
                      </View>
                      <Switch value={dataSharing} onValueChange={setDataSharing} trackColor={{ true: GREEN }} />
                    </View>
                  </View>
                </View>
              )}

              {/* ── SUPPORT ── */}
              {settingsSection === 'support' && (
                <View style={{ paddingBottom: 40 }}>
                  <TouchableOpacity style={[s.card, s.cardWhite, { marginBottom: 10, flexDirection: 'row', alignItems: 'center' }]} onPress={() => { setShowSettings(false); setShowDiagram(true); }}>
                    <Text style={{ fontSize: 24, marginRight: 14 }}>📖</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '700', color: '#111827', fontSize: 15 }}>How to Use the App</Text>
                      <Text style={s.mutedSm}>Step-by-step guide to AccessRide features</Text>
                    </View>
                    <Text style={{ color: '#9ca3af', fontSize: 18 }}>›</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.card, s.cardWhite, { marginBottom: 10, flexDirection: 'row', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 24, marginRight: 14 }}>📧</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '700', color: '#111827', fontSize: 15 }}>Contact Support</Text>
                      <Text style={s.mutedSm}>support@accessride.ca</Text>
                    </View>
                    <Text style={{ color: '#9ca3af', fontSize: 18 }}>›</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.card, s.cardWhite, { marginBottom: 10, flexDirection: 'row', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 24, marginRight: 14 }}>⭐</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '700', color: '#111827', fontSize: 15 }}>Rate the App</Text>
                      <Text style={s.mutedSm}>Share your experience on the App Store</Text>
                    </View>
                    <Text style={{ color: '#9ca3af', fontSize: 18 }}>›</Text>
                  </TouchableOpacity>
                  <View style={[s.card, { backgroundColor: '#f0fdf4', marginBottom: 10, alignItems: 'center' }]}>
                    <Text style={[s.mutedSm, { color: '#15803d' }]}>AccessRide v2.4.1 • © 2025 AccessRide Inc.</Text>
                  </View>
                </View>
              )}

            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>

      {/* How It Works Modal */}
      <Modal visible={showDiagram} transparent animationType="fade" onRequestClose={() => setShowDiagram(false)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowDiagram(false)}>
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
                    <Text style={{ fontWeight: '700', color: '#111827', marginBottom: 4 }}>🎁 Redeem at Local Businesses</Text>
                    <Text style={[s.mutedSm, { marginBottom: 6 }]}>Exchange points for real rewards from community partners</Text>
                    <View style={s.detailBox}><Text style={{ fontSize: 11, color: '#374151' }}>Rewards: Free coffee, restaurant discounts, museum passes, local shop coupons</Text></View>
                  </View>
                </View>
              </View>
              <View style={[s.infoBanner, { backgroundColor: '#f0fdf4', marginTop: 20 }]}>
                <Text style={{ fontWeight: '700', color: '#111827', marginBottom: 10 }}>✨ Core Features</Text>
                <View style={s.grid2}>
                  {[
                    ['🧠', 'Smart reminders'], ['📍', 'GPS stop alerts'],
                    ['♿', 'Accessibility-first'], ['🚨', 'Community reports'],
                    ['⚡', 'Daily streaks'], ['🎯', 'Weekly challenges'],
                    ['🏆', 'Achievement badges'], ['🤝', 'Local partnerships'],
                  ].map(([icon, label], i) => (
                    <View key={i} style={[s.row, { width: '48%', marginBottom: 8 }]}>
                      <Text style={{ fontSize: 16, marginRight: 6 }}>{icon}</Text>
                      <Text style={{ fontSize: 12, color: '#374151' }}>{label}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <TouchableOpacity style={[s.btnGreen, { marginTop: 16, marginBottom: 16 }]} onPress={() => setShowDiagram(false)}>
                <Text style={s.btnText}>Got it!</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </ScrollView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

// ─── STYLES ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
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
});

export default AccessRideApp;
