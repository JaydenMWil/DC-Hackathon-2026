import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useStyles, GREEN } from '../logic/_styles';

const { width: SCREEN_W } = Dimensions.get('window');

const ProximityAlertOverlay = ({
  visible,
  bus,
  distance,
  onDismiss,
  onStopTracking,
  autoDismissMs = 5000,
}) => {
  const { s, theme } = useStyles();
  const c = theme.colors;

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Entrance animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulse ring animation
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      // Auto-dismiss
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoDismissMs);

      return () => {
        clearTimeout(timer);
        pulse.stop();
      };
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
      pulseAnim.setValue(1);
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  if (!visible) return null;

  const routeName =
    bus?.route_long_name && bus.route_long_name !== 'Unknown Route'
      ? bus.route_long_name
      : bus?.route_name
      ? `Route ${bus.route_name}`
      : 'Bus';

  return (
    <Animated.View style={[localStyles.overlay, { backgroundColor: c.overlay, opacity: opacityAnim }]}>
      <Animated.View
        style={[s.modalBox, { alignItems: 'center', width: '100%', maxWidth: 380, transform: [{ scale: scaleAnim }] }]}
      >
        {/* Pulsing ring */}
        <View style={localStyles.ringContainer}>
          <Animated.View
            style={[
              localStyles.pulseRing,
              { borderColor: GREEN, transform: [{ scale: pulseAnim }] },
            ]}
          />
          <View style={[localStyles.innerCircle, { backgroundColor: GREEN }]}>
            <Text style={localStyles.busEmoji}>🚌</Text>
          </View>
        </View>

        <Text style={[s.modalTitle, { textAlign: 'center' }]}>Bus Approaching!</Text>
        <Text style={[localStyles.routeName, { color: GREEN }]}>{routeName}</Text>
        <Text style={[localStyles.distance, { color: c.text }]}>
          ~{distance != null ? distance : '?'}m away
        </Text>

        <Text style={[localStyles.subtitle, { color: c.textSecondary }]}>
          Your bus is within your alert radius
        </Text>

        <View style={s.row}>
          <TouchableOpacity
            style={[s.btnHalf, s.btnPurple]}
            onPress={handleDismiss}
            accessibilityLabel="Dismiss alert"
            accessibilityRole="button"
          >
            <Text style={s.btnText} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.7}>Dismiss</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btnHalf, s.btnGreen]}
            onPress={() => {
              handleDismiss();
              if (onStopTracking) onStopTracking();
            }}
            accessibilityLabel="Stop tracking this bus"
            accessibilityRole="button"
          >
            <Text style={s.btnText} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.7}>Stop Tracking</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const localStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    padding: 24,
  },
  ringContainer: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  pulseRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(0,118,71,0.15)',
    borderWidth: 3,
  },
  innerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  busEmoji: {
    fontSize: 32,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  distance: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ProximityAlertOverlay;
