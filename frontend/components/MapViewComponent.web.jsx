import React from 'react';
import { View, Text } from 'react-native';

const MapView = ({ style, children }) => (
  <View style={[style, { backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' }]}>
    <Text style={{ color: '#4b5563', fontWeight: '600' }}>📍 Map View</Text>
    <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Interactive maps are available on mobile only.</Text>
  </View>
);

export const Marker = () => null;
export const Polyline = () => null;

export default MapView;
