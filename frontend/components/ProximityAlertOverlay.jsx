import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { GREEN } from './_styles';

const { width: SCREEN_W } = Dimensions.get('window');

const ProximityAlertOverlay = ({
  visible,
  bus,
  distance,
  onDismiss,
  onStopTracking,
  autoDismissMs = 5000,
}) => {
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
    <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
      <Animated.View
        style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
      >
        {/* Pulsing ring */}
        <View style={styles.ringContainer}>
          <Animated.View
            style={[
              styles.pulseRing,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          <View style={styles.innerCircle}>
            <Text style={styles.busEmoji}>🚌</Text>
          </View>
        </View>

        <Text style={styles.title}>Bus Approaching!</Text>
        <Text style={styles.routeName}>{routeName}</Text>
        <Text style={styles.distance}>
          ~{distance != null ? distance : '?'}m away
        </Text>

        <Text style={styles.subtitle}>
          Your bus is within your alert radius
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.dismissBtn}
            onPress={handleDismiss}
            accessibilityLabel="Dismiss alert"
            accessibilityRole="button"
          >
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stopBtn}
            onPress={() => {
              handleDismiss();
              if (onStopTracking) onStopTracking();
            }}
            accessibilityLabel="Stop tracking this bus"
            accessibilityRole="button"
          >
            <Text style={styles.stopText}>Stop Tracking</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
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
    borderColor: GREEN,
  },
  innerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  busEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
    color: GREEN,
    marginBottom: 2,
  },
  distance: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  dismissBtn: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  dismissText: {
    fontWeight: '700',
    color: '#374151',
    fontSize: 14,
  },
  stopBtn: {
    flex: 1,
    backgroundColor: GREEN,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  stopText: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 14,
  },
});

export default ProximityAlertOverlay;
