import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../logic/ThemeContext';
export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Hide the native splash screen as soon as we're ready
    SplashScreen.hideAsync();
    setAppReady(true);
  }, []);

  if (!appReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <View style={styles.container}>
          <Slot />
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
