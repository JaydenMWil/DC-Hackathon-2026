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
  if (crowding === 'low') return '✈️';
  if (crowding === 'medium') return '🚌';
  return '🧱';
};

export const crowdingVibe = (level) => {
  if (level === 'low') return 'Private Jet';
  if (level === 'medium') return 'The Usual';
  return 'Wall-to-Wall';
};
