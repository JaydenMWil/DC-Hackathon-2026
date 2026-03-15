import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform, Vibration } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

// ── Haversine distance (meters) ──────────────────────────────────────────────
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ── Simulated bus movement toward user ───────────────────────────────────────
const simulateApproach = (busLat, busLon, userLat, userLon, stepMeters = 50) => {
  const dist = haversine(busLat, busLon, userLat, userLon);
  if (dist <= stepMeters) return { lat: userLat, lon: userLon };

  const fraction = stepMeters / dist;
  return {
    lat: busLat + (userLat - busLat) * fraction,
    lon: busLon + (userLon - busLon) * fraction,
  };
};

/**
 * useProximityTracker
 *
 * Tracks a bus's position relative to the user and fires alert callbacks
 * when the bus enters the configured alert radius.
 *
 * @param {Object} options
 * @param {Object|null} options.userLocation  - expo-location result { coords: { latitude, longitude } }
 * @param {number}      options.alertRadius   - trigger distance in meters (50/100/150)
 * @param {boolean}     options.vibrationOn   - vibration toggle
 * @param {boolean}     options.soundOn       - sound cue toggle
 * @param {boolean}     options.visualOn      - visual popup toggle
 * @param {Function}    options.onAlertTriggered - callback when alert fires
 */
export default function useProximityTracker({
  userLocation,
  alertRadius = 100,
  vibrationOn = true,
  soundOn = true,
  visualOn = true,
  onAlertTriggered,
}) {
  const [isTracking, setIsTracking] = useState(false);
  const [trackedBus, setTrackedBus] = useState(null);
  const [busPosition, setBusPosition] = useState(null);
  const [distanceM, setDistanceM] = useState(null);
  const [alertFired, setAlertFired] = useState(false);

  const intervalRef = useRef(null);
  const soundRef = useRef(null);

  // ── Load / unload alert sound ──────────────────────────────────────────────
  useEffect(() => {
    let sound;
    const loadSound = async () => {
      try {
        const { sound: s } = await Audio.Sound.createAsync(
          require('../../assets/alert.mp3'),
          { shouldPlay: false }
        );
        sound = s;
        soundRef.current = s;
      } catch {
        // Sound file missing — degrade gracefully
        soundRef.current = null;
      }
    };
    loadSound();
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, []);

  // ── Fire alerts ────────────────────────────────────────────────────────────
  const fireAlerts = useCallback(
    async (bus, dist) => {
      // Vibration
      if (vibrationOn && Platform.OS !== 'web') {
        try {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } catch {
          Vibration.vibrate([0, 400, 200, 400]);
        }
      }

      // Sound
      if (soundOn && soundRef.current) {
        try {
          await soundRef.current.setPositionAsync(0);
          await soundRef.current.playAsync();
        } catch {
          // ignore playback errors
        }
      }

      // Visual callback
      if (visualOn && onAlertTriggered) {
        onAlertTriggered({ bus, distance: Math.round(dist) });
      }
    },
    [vibrationOn, soundOn, visualOn, onAlertTriggered]
  );

  // ── Start tracking ─────────────────────────────────────────────────────────
  const startTracking = useCallback(
    (bus) => {
      if (!userLocation) return;
      setTrackedBus(bus);
      setBusPosition({ lat: bus.lat, lon: bus.lon });
      setDistanceM(
        haversine(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          bus.lat,
          bus.lon
        )
      );
      setAlertFired(false);
      setIsTracking(true);
    },
    [userLocation]
  );

  // ── Stop tracking ──────────────────────────────────────────────────────────
  const stopTracking = useCallback(() => {
    setIsTracking(false);
    setTrackedBus(null);
    setBusPosition(null);
    setDistanceM(null);
    setAlertFired(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ── Polling loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isTracking || !busPosition || !userLocation) return;

    intervalRef.current = setInterval(() => {
      setBusPosition((prev) => {
        if (!prev) return prev;
        const userLat = userLocation.coords.latitude;
        const userLon = userLocation.coords.longitude;

        // Simulate the bus moving ~50m closer each tick (5s interval ≈ 36 km/h)
        const next = simulateApproach(prev.lat, prev.lon, userLat, userLon, 50);
        const dist = haversine(userLat, userLon, next.lat, next.lon);
        setDistanceM(dist);

        // Check if alert should fire
        if (dist <= alertRadius && !alertFired) {
          setAlertFired(true);
          fireAlerts(trackedBus, dist);
        }

        return next;
      });
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTracking, userLocation, alertRadius, alertFired, fireAlerts, trackedBus]);

  return {
    isTracking,
    trackedBus,
    busPosition,
    distanceM,
    alertFired,
    startTracking,
    stopTracking,
  };
}
