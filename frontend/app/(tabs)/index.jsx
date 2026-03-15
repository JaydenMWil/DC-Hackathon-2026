import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch,
  TextInput,
  RefreshControl,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

// ─── Local imports ───────────────────────────────────────────────────────────
import { useStyles, GREEN, BG } from '../../components/_styles';
import { ThemeProvider, useTheme } from '../../components/ThemeContext';
import { QRCode, crowdingStyle, crowdingEmoji, rewards, achievements } from '../../components/_helpers';
import * as Haptics from 'expo-haptics';
import HomeTab from '../../components/tabs/HomeTab';
import RoutesTab from '../../components/tabs/RoutesTab';
import RewardsTab from '../../components/tabs/RewardsTab';
import AchievementsTab from '../../components/tabs/AchievementsTab';
import SchedulesTab from '../../components/tabs/SchedulesTab';
import SettingsModal from '../../components/SettingsModal';
import api from '../../components/api';
import useProximityTracker from '../../components/hooks/useProximityTracker';
import ProximityAlertOverlay from '../../components/ProximityAlertOverlay';

const AccessRideApp = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

const MainApp = () => {
  const { s, theme } = useStyles();
  const {
    colorMode, setColorMode,
    fontSize, setFontSize,
    highContrast, setHighContrast
  } = useTheme();

  const insets = useSafeAreaInsets();
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
  const [reportStep, setReportStep] = useState('SELECT_TYPE');
  const [issueDetails, setIssueDetails] = useState('');
  const [issueRoute, setIssueRoute] = useState('');

  // ── Proximity Alert state ──────────────────────────────────────────────────
  const [vibrationAlert, setVibrationAlert] = useState(true);
  const [soundCueAlert, setSoundCueAlert] = useState(true);
  const [visualPopupAlert, setVisualPopupAlert] = useState(true);
  const [proximityAlertVisible, setProximityAlertVisible] = useState(false);
  const [proximityAlertData, setProximityAlertData] = useState(null);
  const [hasEarnedFirstAlertBonus, setHasEarnedFirstAlertBonus] = useState(false);

  // ── Settings state ──────────────────────────────────────────────────────────
  const [showSettings, setShowSettings] = useState(false);
  const [settingsSection, setSettingsSection] = useState(null);
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

  // ── Live routes state ───────────────────────────────────────────────────────
  const [location, setLocation] = useState(null);
  const [liveRoutes, setLiveRoutes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterAccessible, setFilterAccessible] = useState(false);
  const [filterLimited, setFilterLimited] = useState(false);

  // ── Proximity Tracker Hook ────────────────────────────────────────────────
  const {
    isTracking,
    trackedBus,
    distanceM,
    startTracking,
    stopTracking
  } = useProximityTracker({
    userLocation: location,
    alertRadius,
    vibrationOn: vibrationAlert,
    soundOn: soundCueAlert,
    visualOn: visualPopupAlert,
    onAlertTriggered: (data) => {
      setProximityAlertData(data);
      setProximityAlertVisible(true);
      // Award bonus points for first-time use
      if (!hasEarnedFirstAlertBonus) {
        setPoints(p => p + 10);
        setHasEarnedFirstAlertBonus(true);
      }
    }
  });

  // ── Data fetching ─────────────────────────────────────────────────────────
  const fetchLiveRoutes = async (loc) => {
    const coords = loc || location;
    if (!coords) return;

    try {
      const data = await api.getBusesNearby(coords.coords.latitude, coords.coords.longitude);
      setLiveRoutes(data.buses || []);
    } catch (err) {
      // Error is handled/alerted inside api.js, but we can log additionally if needed
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLiveRoutes();
    setRefreshing(false);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      fetchLiveRoutes(loc);
    })();
  }, []);

  useEffect(() => {
    let interval;
    if (tab === 'routes') {
      interval = setInterval(() => {
        fetchLiveRoutes();
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [tab, location]);

  const filteredRoutes = useMemo(() => {
    let r = [...liveRoutes];
    if (filterAccessible) r = r.filter(x => x.accessible);
    if (filterLimited) r = r.slice(0, 5);
    return r;
  }, [liveRoutes, filterAccessible, filterLimited]);

  // ── Community alerts ──────────────────────────────────────────────────────
  const [communityAlerts, setCommunityAlerts] = useState([]);

  const fetchCommunityAlerts = () => {
    api.getReports()
      .then(data => {
        const formatted = data.map(item => ({
          id: item.issue_id,
          route: item.route_name || item.bus_name || item.stop_name || 'General',
          issue: `${item.issue_type === 'bus-missed' ? "Bus didn't arrive" : item.issue_type === 'wheelchair ramps-out' ? "Wheelchair ramps out of service" : item.issue_type === 'crowding' ? "Heavy crowding" : item.issue_type === 'bike-rack-full' ? "Bike rack is full" : item.issue_type === 'ramp-unsafe' ? "Ramp landing not safe to descend" : "Other issue"}${item.details ? ' - ' + item.details : ''}`,
          time: new Date(item.timestamp + 'Z').toLocaleString(undefined, { hour: 'numeric', minute: 'numeric', hour12: true }),
          points: 20
        }));
        setCommunityAlerts(formatted);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchCommunityAlerts();
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────────
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

  const handleReportNext = () => {
    if (reportStep === 'SELECT_TYPE' && issueType) {
      setReportStep('ENTER_DETAILS');
    } else if (reportStep === 'ENTER_DETAILS') {
      setReportStep('CONFIRM');
    }
  };

  const submitIssueReport = () => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/reports/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        issue_type: issueType,
        details: issueDetails,
        route_name: issueRoute,
        bus_name: issueRoute,
        stop_name: null
      })
    })
      .then(res => res.json())
      .then(data => {
        setPoints(p => p + 20);
        setReportStep('SUCCESS');
        fetchCommunityAlerts();
      })
      .catch(err => console.error("Error submitting report", err));
  };

  const handleOpenReport = () => {
    if (selectedRoute) {
      setIssueRoute(selectedRoute.route_name || selectedRoute.line || '');
    }
    setShowReportIssue(true);
  };

  const closeReportModal = () => {
    setShowReportIssue(false);
    setTimeout(() => {
      setReportStep('SELECT_TYPE');
      setIssueType('');
      setIssueDetails('');
      setIssueRoute('');
    }, 300);
  };

  const handleTabPress = (key) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setTab(key);
  };

  // ── Report Issue Modal Helpers ────────────────────────────────────────────
  const IssueOption = ({ value, label, sub, icon }) => (
    <TouchableOpacity
      style={[s.radioRow, issueType === value && { borderColor: GREEN, backgroundColor: theme.isDark ? 'rgba(0,118,71,0.2)' : '#f0fdf4' }]}
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

  // ── GPS Settings Modal Helpers ────────────────────────────────────────────
  const RadiusOption = ({ value, label }) => (
    <TouchableOpacity
      style={[s.radioRow, alertRadius === value && { borderColor: GREEN, backgroundColor: theme.isDark ? 'rgba(0,118,71,0.2)' : '#f0fdf4' }]}
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

  // ─── HOW IT WORKS MODAL ────────────────────────────────────────────────────
  const DiagramStep = ({ num, title, desc, detail }) => (
    <View>
      <View style={s.stepRow}>
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
      </View>
      <View style={{ alignItems: 'center', marginVertical: 8 }}>
        <Text style={{ color: GREEN, fontSize: 20 }}>↓</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.headerBg }}>
      <SafeAreaView style={[s.safeArea, { backgroundColor: 'transparent' }]} edges={['right', 'left']}>
      <StatusBar style={theme.isDark ? "light" : "light"} translucent={true} backgroundColor="transparent" />
      
        {/* Header */}
        <View style={[s.header, { paddingTop: insets.top + 14 }]}>
          <View style={s.rowBetween}>
          <View>
            <Text style={s.headerTitle}>AccessRide</Text>
            <Text style={s.headerSub}>Inclusive Transit Companion</Text>
          </View>
          <TouchableOpacity 
            style={s.howBtn} 
            onPress={() => { setShowSettings(true); setSettingsSection(null); }}
            accessibilityLabel="Settings"
            accessibilityRole="button"
          >
            <Text style={{ color: theme.colors.textOnGreen, fontSize: 13, fontWeight: '500' }}>⚙️ Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        {tab === 'home' && (
          <HomeTab 
            points={points} 
            communityAlerts={communityAlerts} 
            gpsAlertEnabled={gpsAlertEnabled} 
            alertRadius={alertRadius} 
            handleOpenReport={handleOpenReport} 
            setShowGpsSettings={setShowGpsSettings}
            isTracking={isTracking}
            distanceM={distanceM}
            trackedBus={trackedBus}
          />
        )}
        {tab === 'routes' && (
          <RoutesTab 
            location={location} 
            filteredRoutes={filteredRoutes} 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            selectedRoute={selectedRoute} 
            selectRoute={selectRoute} 
            filterAccessible={filterAccessible} 
            filterLimited={filterLimited} 
            setTab={setTab} 
            setFilterAccessible={setFilterAccessible} 
            setFilterLimited={setFilterLimited}
            isTracking={isTracking}
            trackedBus={trackedBus}
            onStartTracking={startTracking}
            onStopTracking={stopTracking}
          />
        )}
        {tab === 'schedules' && <SchedulesTab setTab={setTab} />}
        {tab === 'rewards' && <RewardsTab points={points} streak={streak} rewards={rewards} redeem={redeem} setTab={setTab} />}
        {tab === 'achievements' && <AchievementsTab achievements={achievements} setTab={setTab} />}
      </View>
      </SafeAreaView>

      {/* Bottom Nav - outside SafeAreaView so it stretches to device bottom */}
      <View style={[s.bottomNav, { paddingBottom: insets.bottom + 10 }]}>
        {[
          { key: 'home', icon: '🏠', label: 'Home' },
          { key: 'routes', icon: '🚇', label: 'Routes' },
          { key: 'schedules', icon: '📅', label: 'Schedules' },
          { key: 'rewards', icon: '🎁', label: 'Rewards' },
          { key: 'achievements', icon: '🏆', label: 'Badges' },
        ].map(item => (
          <TouchableOpacity
            key={item.key}
            style={[s.navItem, tab === item.key && s.navItemActive]}
            onPress={() => handleTabPress(item.key)}
            accessibilityLabel={`${item.label} tab`}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === item.key }}
          >
            <Text style={{ fontSize: 20 }}>{item.icon}</Text>
            <Text style={[s.navLabel, tab === item.key && { color: theme.colors.textOnGreen }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Report Issue Modal */}
      <Modal visible={showReportIssue} transparent animationType="fade" onRequestClose={closeReportModal}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={closeReportModal}>
          <TouchableOpacity style={s.modalBox} activeOpacity={1}>
            {reportStep === 'SELECT_TYPE' && (
              <>
                <Text style={s.modalTitle}>Report an Issue</Text>
                <View style={[s.infoBanner, { backgroundColor: theme.isDark ? 'rgba(22,101,52,0.2)' : '#f0fdf4' }]}>
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
                  <TouchableOpacity style={[s.btnHalf, s.btnGray]} onPress={closeReportModal}>
                    <Text style={s.btnGrayText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.btnHalf, issueType ? s.btnGreen : s.btnGrayDisabled]}
                    onPress={handleReportNext}
                    disabled={!issueType}
                  >
                    <Text style={[s.btnText, !issueType && { color: '#9ca3af' }]}>Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {reportStep === 'ENTER_DETAILS' && (
              <>
                <Text style={s.modalTitle}>Provide Details</Text>
                
                <Text style={s.fieldLabel}>Which Route?</Text>
                <View style={[s.row, { flexWrap: 'wrap', gap: 6, marginBottom: 8 }]}>
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
                  <TouchableOpacity style={[s.btnHalf, s.btnGray]} onPress={() => setReportStep('SELECT_TYPE')}>
                    <Text style={s.btnGrayText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[s.btnHalf, (issueType && issueRoute) ? s.btnGreen : s.btnGrayDisabled]} 
                    onPress={handleReportNext}
                    disabled={!issueType || !issueRoute}
                  >
                    <Text style={[s.btnText, (!issueType || !issueRoute) && { color: '#9ca3af' }]}>Review</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {reportStep === 'CONFIRM' && (
              <>
                <Text style={s.modalTitle}>Confirm Report</Text>
                <Text style={[s.mutedSm, { marginBottom: 16 }]}>Please review your report before submitting.</Text>
                <View style={{ backgroundColor: '#f9fafb', padding: 14, borderRadius: 10, marginBottom: 16 }}>
                  <Text style={[s.mutedSm, { marginBottom: 4 }]}>Issue Type</Text>
                  <Text style={{ fontWeight: '600', color: '#111827', marginBottom: 8 }}>
                    {issueType === 'bus-missed' ? "Bus didn't arrive" : issueType === 'wheelchair ramps-out' ? "Wheelchair ramps out of service" : issueType === 'crowding' ? "Heavy crowding" : issueType === 'bike-rack-full' ? "Bike rack is full" : issueType === 'ramp-unsafe' ? "Ramp landing not safe to descend" : "Other issue"}
                  </Text>
                  
                  <Text style={[s.mutedSm, { marginBottom: 4 }]}>Route</Text>
                  <Text style={{ fontWeight: '600', color: '#111827', marginBottom: 8 }}>{issueRoute}</Text>

                  <Text style={[s.mutedSm, { marginBottom: 4 }]}>Details</Text>
                  <Text style={{ color: '#374151', fontSize: 13 }}>
                    {issueDetails || 'No additional details provided.'}
                  </Text>
                </View>
                <View style={[s.row, { gap: 10 }]}>
                  <TouchableOpacity style={[s.btnHalf, s.btnGray]} onPress={() => setReportStep('ENTER_DETAILS')}>
                    <Text style={s.btnGrayText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.btnHalf, s.btnGreen]} onPress={submitIssueReport}>
                    <Text style={s.btnText}>Submit Report</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {reportStep === 'SUCCESS' && (
              <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                <Text style={{ fontSize: 56, marginBottom: 12 }}>🎉</Text>
                <Text style={[s.modalTitle, { textAlign: 'center' }]}>Report Submitted!</Text>
                <Text style={[s.mutedSm, { textAlign: 'center', marginBottom: 16 }]}>Thank you for helping keep the community informed.</Text>
                <View style={[s.infoBanner, { backgroundColor: theme.isDark ? 'rgba(22,101,52,0.2)' : '#dcfce7', width: '100%', alignItems: 'center' }]}>
                  <Text style={{ color: theme.colors.successText, fontWeight: '700', fontSize: 18 }}>+20 Points</Text>
                  <Text style={{ color: theme.colors.successText, fontSize: 12, marginTop: 4 }}>Added to your balance</Text>
                </View>
                <TouchableOpacity style={[s.btnGreen, { width: '100%', marginTop: 20 }]} onPress={closeReportModal}>
                  <Text style={s.btnText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Reward Modal */}
      <Modal visible={!!showReward} transparent animationType="fade" onRequestClose={() => setShowReward(null)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowReward(null)}>
          <TouchableOpacity style={[s.modalBox, { alignItems: 'center' }]} activeOpacity={1}>
            <Text style={{ fontSize: 56, marginBottom: 12 }}>{showReward?.icon}</Text>
             <Text style={s.modalTitle}>Reward Claimed!</Text>
            <Text style={{ color: theme.colors.textSecondary, marginBottom: 4 }}>{showReward?.name}</Text>
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
              <View style={[s.infoBanner, { backgroundColor: theme.isDark ? 'rgba(30,58,95,0.2)' : '#eff6ff', marginBottom: 16 }]}>
                 <View style={s.row}>
                  <Text style={{ fontSize: 22, marginRight: 10 }}>📍</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '600', color: theme.isDark ? '#93c5fd' : '#1e3a5f', marginBottom: 4 }}>Radius-Based GPS Alert</Text>
                    <Text style={{ fontSize: 12, color: theme.isDark ? '#60a5fa' : '#1d4ed8' }}>Tracks your location and sends alerts at customizable distances when approaching your stop</Text>
                  </View>
                </View>
              </View>
              <Text style={s.fieldLabel}>Alert Distance</Text>
              <RadiusOption value={150} label="Early warning" />
              <RadiusOption value={100} label="Recommended" />
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
               <View style={[s.infoBanner, { backgroundColor: theme.isDark ? 'rgba(22,101,52,0.2)' : '#f0fdf4', marginTop: 14 }]}>
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
        <SettingsModal
          showSettings={showSettings} setShowSettings={setShowSettings}
          settingsSection={settingsSection} setSettingsSection={setSettingsSection}
          profileName={profileName} profilePhone={profilePhone} profileEmail={profileEmail}
          wheelchairVehicle={wheelchairVehicle} setWheelchairVehicle={setWheelchairVehicle}
          textOnlyComms={textOnlyComms} setTextOnlyComms={setTextOnlyComms}
          voiceCall={voiceCall} setVoiceCall={setVoiceCall}
          screenReader={screenReader} setScreenReader={setScreenReader}
          rideAlerts={rideAlerts} setRideAlerts={setRideAlerts}
          promoAlerts={promoAlerts} setPromoAlerts={setPromoAlerts}
          emergencyAlerts={emergencyAlerts} setEmergencyAlerts={setEmergencyAlerts}
          appLanguage={appLanguage} setAppLanguage={setAppLanguage}
          locationPerm={locationPerm} setLocationPerm={setLocationPerm}
          dataSharing={dataSharing} setDataSharing={setDataSharing}
          setShowDiagram={setShowDiagram}
        />
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
                    <Text style={{ fontWeight: '700', color: theme.colors.text, marginBottom: 4 }}>🎁 Redeem at Local Businesses</Text>
                    <Text style={[s.mutedSm, { marginBottom: 6 }]}>Exchange points for real rewards from community partners</Text>
                    <View style={s.detailBox}><Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>Rewards: Free coffee, restaurant discounts, museum passes, local shop coupons</Text></View>
                  </View>
                </View>
              </View>
               <View style={[s.infoBanner, { backgroundColor: theme.isDark ? 'rgba(22,101,52,0.2)' : '#f0fdf4', marginTop: 20 }]}>
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
              <TouchableOpacity style={[s.btnGreen, { marginTop: 16, marginBottom: 16 }]} onPress={() => setShowDiagram(false)}>
                <Text style={s.btnText}>Got it!</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </ScrollView>
        </TouchableOpacity>
      </Modal>
      {/* Proximity Alert Overlay */}
      <ProximityAlertOverlay
        visible={proximityAlertVisible}
        bus={proximityAlertData?.bus}
        distance={proximityAlertData?.distance}
        onDismiss={() => setProximityAlertVisible(false)}
        onStopTracking={stopTracking}
      />
    </View>
  );
};

export default AccessRideApp;
