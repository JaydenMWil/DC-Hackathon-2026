// ─── STATIC DATA & MOCKS ───────────────────────────────────────────────────

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

export const allRoutes = [
  { id: '915', name: '915 Taunton', freq: 'Every 15 min', accessible: true, icon: '🚌' },
  { id: '405', name: '405 Oshawa', freq: 'Every 20 min', accessible: true, icon: '🚌' },
  { id: '900', name: '900 Pulse', freq: 'Every 10 min', accessible: true, icon: '⚡' },
  { id: 'GO-B', name: 'GO Bus - Durham', freq: 'Every 30 min', accessible: true, icon: '🚆' },
];

export const regularRouteStop = { latitude: 43.9444, longitude: -78.8917 };

export const COMMUNITY_ALERTS_POINTS = 20;
export const ACCESSIBLE_ROUTE_POINTS = 15;
export const PROXIMITY_ALERT_BONUS = 10;
