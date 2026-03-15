import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  Dimensions,
  Alert,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

// ─── Local imports (Updated paths) ───────────────────────────────────────────
import { useStyles, GREEN, BG } from '../../logic/_styles';
import { ThemeProvider, useTheme } from '../../logic/ThemeContext';
import { QRCode, crowdingStyle, crowdingEmoji } from '../../logic/_helpers';
import { rewards, achievements, regularRouteStop, COMMUNITY_ALERTS_POINTS, ACCESSIBLE_ROUTE_POINTS, PROXIMITY_ALERT_BONUS } from '../../logic/data';
import * as Haptics from 'expo-haptics';
import HomeTab from '../../components/tabs/HomeTab';
import RoutesTab from '../../components/tabs/RoutesTab';
import RewardsTab from '../../components/tabs/RewardsTab';
import AchievementsTab from '../../components/tabs/AchievementsTab';
import SchedulesTab from '../../components/tabs/SchedulesTab';
import SmartRerouteModal from '../../components/modals/SmartRerouteModal';
import SettingsModal from '../../components/modals/SettingsModal';
import ReportIssueModal from '../../components/modals/ReportIssueModal';
import GpsSettingsModal from '../../components/modals/GpsSettingsModal';
import HowItWorksModal from '../../components/modals/HowItWorksModal';
import api from '../../logic/api';
import useProximityTracker from '../../components/hooks/useProximityTracker';
import ProximityAlertOverlay from '../../components/ProximityAlertOverlay';

const Index = () => {
  return <MainApp />;
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
  // Refs for scroll to top
  const homeRef = React.useRef(null);
  const routesRef = React.useRef(null);
  const schedulesRef = React.useRef(null);
  const rewardsRef = React.useRef(null);
  const achievementsRef = React.useRef(null);

  const tabRefs = {
    home: homeRef,
    routes: routesRef,
    schedules: schedulesRef,
    rewards: rewardsRef,
    achievements: achievementsRef,
  };
  const [streak, setStreak] = useState(5);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showReward, setShowReward] = useState(null);
  const [redeemConfirm, setRedeemConfirm] = useState(null);
  const [gpsAlertEnabled, setGpsAlertEnabled] = useState(false);
  const [alertRadius, setAlertRadius] = useState(100);
  const [showGpsSettings, setShowGpsSettings] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [issueType, setIssueType] = useState('');
  const [reportStep, setReportStep] = useState('SELECT_TYPE');
  const [issueDetails, setIssueDetails] = useState('');
  const [issueRoute, setIssueRoute] = useState('');

  // ── Smart Reminder state ──────────────────────────────────────────────────
  const [smartRemindersEnabled, setSmartRemindersEnabled] = useState(false);
  const [safetyBuffer, setSafetyBuffer] = useState(5); // minutes
  const [isSimulatingIssue, setIsSimulatingIssue] = useState(false);
  const [showRerouteModal, setShowRerouteModal] = useState(false);
  const [alternativeRoute, setAlternativeRoute] = useState(null);


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
  const [maxCrowding, setMaxCrowding] = useState([]); // Array of 'low', 'medium', 'high'

  // ── Schedules persistence state ─────────────────────────────────────────────
  const [savedSchedules, setSavedSchedules] = useState([]);
  const AS_KEY = 'ACCESS_RIDE_SCHEDULES';

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
        setPoints(p => p + PROXIMITY_ALERT_BONUS);
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

  // ── Smart Reminder Logic ──────────────────────────────────────────────────
  const walkingInfo = useMemo(() => {
    if (!location || !smartRemindersEnabled) return null;
    
    // Distance in meters (simplified Euclidean for mock)
    const dx = (location.coords.longitude - regularRouteStop.longitude) * 85000; // rough lon-to-meter
    const dy = (location.coords.latitude - regularRouteStop.latitude) * 111000; // rough lat-to-meter
    const distanceM = Math.sqrt(dx*dx + dy*dy);
    
    const walkingTimeMin = Math.round(distanceM / 80); // 80m/min pace
    const totalBufferMin = walkingTimeMin + safetyBuffer;
    
    // Mock bus at 8:10 AM
    return {
      distanceM,
      walkingTimeMin,
      totalBufferMin,
      timeToLeaveStr: `${totalBufferMin} minutes`
    };
  }, [location, smartRemindersEnabled, safetyBuffer]);

  // Handle Reroute Simulation
  useEffect(() => {
    if (isSimulatingIssue && smartRemindersEnabled) {
      // Find an alternative from live routes
      const alt = liveRoutes.find(r => r.route_name !== '915' && r.accessible) || liveRoutes[0];
      setAlternativeRoute(alt);
      setShowRerouteModal(true);
      setIsSimulatingIssue(false);
    }
  }, [isSimulatingIssue, smartRemindersEnabled, liveRoutes]);

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
    
    // Crowding Filter logic:
    // User requested that if none are selected, all should be shown.
    // Also if all 3 are selected, effectively show all.
    if (maxCrowding.length > 0 && maxCrowding.length < 3) {
      r = r.filter(x => maxCrowding.includes(x.crowding));
    }
    
    return r;
  }, [liveRoutes, filterAccessible, filterLimited, maxCrowding]);

  // ── Community alerts ──────────────────────────────────────────────────────
  const [communityAlerts, setCommunityAlerts] = useState([]);

  const fetchCommunityAlerts = () => {
    return api.getReports()
      .then(data => {
        const formatted = data.map(item => ({
          id: item.issue_id,
          route: item.route_name || item.bus_name || item.stop_name || 'General',
          issue: `${item.issue_type === 'bus-missed' ? "Bus didn't arrive" : item.issue_type === 'wheelchair ramps-out' ? "Wheelchair ramps out of service" : item.issue_type === 'crowding' ? "Heavy crowding" : item.issue_type === 'bike-rack-full' ? "Bike rack is full" : item.issue_type === 'ramp-unsafe' ? "Ramp landing not safe to descend" : "Other issue"}${item.details ? ' - ' + item.details : ''}`,
          time: new Date(item.timestamp + 'Z').toLocaleString(undefined, { hour: 'numeric', minute: 'numeric', hour12: true }),
          points: COMMUNITY_ALERTS_POINTS
        }));
        setCommunityAlerts(formatted);
      })
      .catch(() => {});
  };

  const onHomeRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCommunityAlerts();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (tab === 'home') {
      fetchCommunityAlerts();
      // Poll for new reports every 30 seconds
      const interval = setInterval(fetchCommunityAlerts, 30000);
      return () => clearInterval(interval);
    }
  }, [tab]);

  // ── Schedules Storage Effects ───────────────────────────────────────────────
  useEffect(() => {
    // Load on mount
    const loadScheds = async () => {
      try {
        const val = await AsyncStorage.getItem(AS_KEY);
        if (val) setSavedSchedules(JSON.parse(val));
      } catch (e) {
        console.error("Failed to load schedules", e);
      }
    };
    loadScheds();
  }, []);

  useEffect(() => {
    // Save on change
    const saveScheds = async () => {
      try {
        await AsyncStorage.setItem(AS_KEY, JSON.stringify(savedSchedules));
      } catch (e) {
        console.error("Failed to save schedules", e);
      }
    };
    saveScheds();
  }, [savedSchedules]);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const selectRoute = (route) => {
    setSelectedRoute(route);
    if (route.accessible) setPoints(p => p + ACCESSIBLE_ROUTE_POINTS);
  };

  const redeem = (reward) => {
    if (points >= reward.pts && !reward.claimed) {
      setRedeemConfirm(reward);
    }
  };

  const confirmRedeem = () => {
    if (redeemConfirm && points >= redeemConfirm.pts) {
      setPoints(p => p - redeemConfirm.pts);
      setShowReward(redeemConfirm);
      setRedeemConfirm(null);
    }
  };

  const handleReportNext = () => {
    if (reportStep === 'SELECT_TYPE' && issueType) {
      setReportStep('ENTER_DETAILS');
    } else if (reportStep === 'ENTER_DETAILS') {
      setReportStep('CONFIRM');
    } else if (reportStep === 'CONFIRM') {
      submitIssueReport();
    }
  };

  const submitIssueReport = () => {
    api.createReport({
      issue_type: issueType,
      details: issueDetails,
      route_name: issueRoute,
      bus_name: issueRoute,
      stop_name: null
    })
      .then(data => {
        setPoints(p => p + COMMUNITY_ALERTS_POINTS);
        setReportStep('SUCCESS');
        fetchCommunityAlerts();
      })
      .catch(err => {
        console.error("Error submitting report", err);
        Alert.alert("Submission Failed", "Could not send report. Please check your connection.");
      });
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
    
    if (tab === key) {
      // Repeat tap on active tab -> scroll to top
      const activeRef = tabRefs[key];
      if (activeRef?.current) {
        activeRef.current.scrollTo({ y: 0, animated: true });
      }
    } else {
      setTab(key);
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.headerBg }}>
      <SafeAreaView style={[s.safeArea, { backgroundColor: 'transparent' }]} edges={['right', 'left']}>
      <StatusBar style={theme.isDark ? "light" : "light"} translucent={true} backgroundColor="transparent" />
      
        {/* Header */}
        <View style={[s.header, { paddingTop: insets.top + 14 }]}>
          <View style={s.rowBetween}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={s.headerTitle} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.7}>AccessRide</Text>
            <Text style={s.headerSub} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.7}>Inclusive Transit Companion</Text>
          </View>
          <TouchableOpacity 
            style={s.howBtn} 
            onPress={() => { setShowSettings(true); setSettingsSection(null); }}
            accessibilityLabel="Settings"
            accessibilityRole="button"
          >
            <Text style={{ color: theme.colors.textOnGreen, fontSize: 13, fontWeight: '500' }} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.7}>⚙️ Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        {tab === 'home' && (
          <HomeTab 
            ref={homeRef}
            points={points} 
            communityAlerts={communityAlerts} 
            gpsAlertEnabled={gpsAlertEnabled} 
            alertRadius={alertRadius} 
            handleOpenReport={handleOpenReport} 
            setShowGpsSettings={setShowGpsSettings}
            isTracking={isTracking}
            distanceM={distanceM}
            trackedBus={trackedBus}
            // Smart Reminder props
            smartRemindersEnabled={smartRemindersEnabled}
            setSmartRemindersEnabled={setSmartRemindersEnabled}
            safetyBuffer={safetyBuffer}
            setSafetyBuffer={setSafetyBuffer}
            walkingInfo={walkingInfo}
            setIsSimulatingIssue={setIsSimulatingIssue}
            refreshing={refreshing}
            onRefresh={onHomeRefresh}
            setTab={setTab}
          />
        )}
        {tab === 'routes' && (
          <RoutesTab 
            ref={routesRef}
            location={location} 
            filteredRoutes={filteredRoutes} 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            selectedRoute={selectedRoute} 
            selectRoute={selectRoute} 
            filterAccessible={filterAccessible} 
            filterLimited={filterLimited} 
            maxCrowding={maxCrowding}
            setTab={setTab} 
            setFilterAccessible={setFilterAccessible} 
            setFilterLimited={setFilterLimited}
            setMaxCrowding={setMaxCrowding}
            isTracking={isTracking}
            trackedBus={trackedBus}
            onStartTracking={startTracking}
            onStopTracking={stopTracking}
          />
        )}
        {tab === 'schedules' && <SchedulesTab ref={schedulesRef} setTab={setTab} savedSchedules={savedSchedules} setSavedSchedules={setSavedSchedules} />}
        {tab === 'rewards' && <RewardsTab ref={rewardsRef} points={points} streak={streak} rewards={rewards} redeem={redeem} setTab={setTab} />}
        {tab === 'achievements' && <AchievementsTab ref={achievementsRef} achievements={achievements} setTab={setTab} />}
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
            <Text 
              style={[s.navLabel, tab === item.key && { color: theme.colors.textOnGreen }]} 
              adjustsFontSizeToFit 
              numberOfLines={1}
              minimumFontScale={0.7}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Report Issue Modal */}
      <ReportIssueModal
        visible={showReportIssue}
        step={reportStep}
        issueType={issueType}
        issueDetails={issueDetails}
        issueRoute={issueRoute}
        onClose={closeReportModal}
        onNext={handleReportNext}
        onBack={() => setReportStep(reportStep === 'CONFIRM' ? 'ENTER_DETAILS' : 'SELECT_TYPE')}
        setIssueType={setIssueType}
        setIssueDetails={setIssueDetails}
        setIssueRoute={setIssueRoute}
      />

      {/* GPS Settings Modal */}
      <GpsSettingsModal
        visible={showGpsSettings}
        alertRadius={alertRadius}
        vibrationAlert={vibrationAlert}
        soundCueAlert={soundCueAlert}
        visualPopupAlert={visualPopupAlert}
        onClose={() => setShowGpsSettings(false)}
        onEnableAlerts={() => { setGpsAlertEnabled(true); setShowGpsSettings(false); }}
        setAlertRadius={setAlertRadius}
        setVibrationAlert={setVibrationAlert}
        setSoundCueAlert={setSoundCueAlert}
        setVisualPopupAlert={setVisualPopupAlert}
      />

      {/* Reward Confirmation Modal */}
      <Modal visible={!!redeemConfirm} transparent animationType="fade" onRequestClose={() => setRedeemConfirm(null)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setRedeemConfirm(null)}>
          <View style={s.modalBox}>
            <Text style={[s.modalTitle, { textAlign: 'center' }]}>Confirm Redemption?</Text>
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <Text style={{ fontSize: 64, marginBottom: 12 }}>{redeemConfirm?.icon}</Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text }}>{redeemConfirm?.name}</Text>
              <Text style={{ color: theme.colors.textSecondary }}>{redeemConfirm?.offer}</Text>
            </View>
            
            <View style={[s.infoBanner, { backgroundColor: theme.isDark ? 'rgba(234,179,8,0.1)' : '#fefce8', alignItems: 'center', marginBottom: 20 }]}>
              <Text style={{ color: theme.isDark ? '#facc15' : '#a16207', fontWeight: '700', fontSize: 16 }}>
                Cost: {redeemConfirm?.pts} Points
              </Text>
              <Text style={{ color: theme.isDark ? '#eab308' : '#ca8a04', fontSize: 12, marginTop: 4 }}>
                Balance after: {points - (redeemConfirm?.pts || 0)} pts
              </Text>
            </View>

            <View style={[s.row, { gap: 10 }]}>
              <TouchableOpacity style={[s.btnHalf, theme.isDark ? s.btnPurple : s.btnGray]} onPress={() => setRedeemConfirm(null)}>
                <Text style={theme.isDark ? s.btnText : s.btnGrayText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btnHalf, s.btnGreen]} onPress={confirmRedeem}>
                <Text style={s.btnText}>Confirm & Claim</Text>
              </TouchableOpacity>
            </View>
          </View>
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
      <HowItWorksModal
        visible={showDiagram}
        onClose={() => setShowDiagram(false)}
      />

      {/* Proximity Alert Overlay */}
      <ProximityAlertOverlay
        visible={proximityAlertVisible}
        bus={proximityAlertData?.bus}
        distance={proximityAlertData?.distance}
        onDismiss={() => setProximityAlertVisible(false)}
        onStopTracking={stopTracking}
      />

      {/* Smart Reroute Modal */}
      <SmartRerouteModal
        visible={showRerouteModal}
        alternativeRoute={alternativeRoute}
        onClose={() => setShowRerouteModal(false)}
        onSwitch={() => {
          setTab('routes');
          setShowRerouteModal(false);
          setPoints(p => p + 10);
          if (alternativeRoute) selectRoute(alternativeRoute);
        }}
      />
    </View>
  );
};

export default Index;
