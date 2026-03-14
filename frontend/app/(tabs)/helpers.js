import React, { useMemo } from 'react';
import { View } from 'react-native';

// ─── MINIMAL QR CODE GENERATOR ───────────────────────────────────────────────
export const QRCode = ({ value, size = 160 }) => {
  const cells = useMemo(() => {
    const hash = (str) => {
      let h = 5381;
      for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
      return Math.abs(h);
    };
    const N = 21;
    const grid = Array.from({ length: N }, (_, r) =>
      Array.from({ length: N }, (_, c) => {
        const inFinder = (row, col) =>
          (row < 8 && col < 8) || (row < 8 && col >= N - 8) || (row >= N - 8 && col < 8);
        if (inFinder(r, c)) {
          const br = r < 8 ? r : r - (N - 8);
          const bc = c < 8 ? c : c - (N - 8);
          if (br === 0 || br === 6 || bc === 0 || bc === 6) return true;
          if (br >= 2 && br <= 4 && bc >= 2 && bc <= 4) return true;
          return false;
        }
        if (r === 6 || c === 6) return (r + c) % 2 === 0;
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

// ─── HELPERS ─────────────────────────────────────────────────────────────────
export const crowdingStyle = (crowding) => {
  if (crowding === 'low') return { bg: '#dcfce7', text: '#15803d' };
  if (crowding === 'medium') return { bg: '#fef9c3', text: '#a16207' };
  return { bg: '#fee2e2', text: '#b91c1c' };
};

export const crowdingEmoji = (crowding) => {
  if (crowding === 'low') return '🟢';
  if (crowding === 'medium') return '🟡';
  return '🔴';
};

// ─── STATIC DATA ────────────────────────────────────────────────────────────
export const rewards = [
  { id: 1, name: 'BrewHouse Café', offer: '$2 off', pts: 150, icon: '☕', claimed: false },
  { id: 2, name: 'City Museum', offer: 'Free entry', pts: 200, icon: '🏛️', claimed: false },
  { id: 3, name: 'Transit Store', offer: '10% off', pts: 100, icon: '👕', claimed: true },
  { id: 4, name: 'Green Bistro', offer: '15% off', pts: 180, icon: '🥗', claimed: false },
  { id: 5, name: 'Book Nook', offer: '$5 off', pts: 120, icon: '📚', claimed: false },
];

export const achievements = [
  { id: 1, name: 'Early Bird', desc: '10 rides before 7 AM', icon: '🌅', progress: 6, total: 10 },
  { id: 2, name: 'City Explorer', desc: '15 different stations', icon: '🗺️', progress: 15, total: 15 },
  { id: 3, name: 'Accessibility Ally', desc: '5 accessibility reports', icon: '🦸', progress: 3, total: 5 },
  { id: 4, name: 'Transit Helper', desc: '7-day streak', icon: '⚡', progress: 5, total: 7 },
];
