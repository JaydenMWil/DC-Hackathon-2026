import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resolveTheme } from './themes';

const STORAGE_KEYS = {
  colorMode: '@appearance_colorMode',
  fontSize: '@appearance_fontSize',
  highContrast: '@appearance_highContrast',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const osScheme = useColorScheme(); // 'light' | 'dark' | null
  const [colorMode, setColorModeState] = useState('system');
  const [fontSize, setFontSizeState] = useState('medium');
  const [highContrast, setHighContrastState] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // ── Load saved preferences on mount ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [savedColor, savedFont, savedContrast] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.colorMode),
          AsyncStorage.getItem(STORAGE_KEYS.fontSize),
          AsyncStorage.getItem(STORAGE_KEYS.highContrast),
        ]);
        if (savedColor) setColorModeState(savedColor);
        if (savedFont) setFontSizeState(savedFont);
        if (savedContrast !== null) setHighContrastState(savedContrast === 'true');
      } catch (e) {
        console.warn('Failed to load theme preferences', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // ── Persist-on-change setters ────────────────────────────────────────────
  const setColorMode = useCallback(async (val) => {
    setColorModeState(val);
    try { await AsyncStorage.setItem(STORAGE_KEYS.colorMode, val); } catch {}
  }, []);

  const setFontSize = useCallback(async (val) => {
    setFontSizeState(val);
    try { await AsyncStorage.setItem(STORAGE_KEYS.fontSize, val); } catch {}
  }, []);

  const setHighContrast = useCallback(async (val) => {
    setHighContrastState(val);
    try { await AsyncStorage.setItem(STORAGE_KEYS.highContrast, String(val)); } catch {}
  }, []);

  // ── Resolve the complete theme ───────────────────────────────────────────
  const theme = resolveTheme(colorMode, osScheme || 'light', fontSize, highContrast);

  const value = {
    theme,
    colorMode,
    fontSize,
    highContrast,
    setColorMode,
    setFontSize,
    setHighContrast,
    loaded,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
