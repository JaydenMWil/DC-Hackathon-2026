import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useStyles, GREEN } from '../../logic/_styles';
import { crowdingStyle, crowdingEmoji } from '../../logic/_helpers';
import { allRoutes } from '../../logic/data';

const RoutesTab = React.forwardRef(({ 
  location, 
  filteredRoutes, 
  refreshing, 
  onRefresh, 
  selectedRoute, 
  selectRoute, 
  filterAccessible, 
  filterLimited, 
  setTab, 
  setFilterAccessible, 
  setFilterLimited,
  isTracking,
  trackedBus,
  onStartTracking,
  onStopTracking
}, ref) => {
  const { s, theme } = useStyles();
  const c = theme.colors;

  return (
    <ScrollView 
      ref={ref}
      style={s.tabContent} 
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[GREEN]} />}
    >
      <View style={[s.row, { marginBottom: 16 }]}>
        <TouchableOpacity 
          onPress={() => setTab('home')} 
          style={{ marginRight: 10 }}
          accessibilityLabel="Go back to Home"
          accessibilityRole="button"
        >
          <Text style={{ color: c.textSecondary, fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.pageTitle}>Live Routes near you</Text>
      </View>

      {/* Filters */}
      <View style={[s.row, { marginBottom: 16, gap: 10 }]}>
        <TouchableOpacity 
          style={[s.filterChip, filterAccessible && s.filterChipActive]} 
          onPress={() => setFilterAccessible(!filterAccessible)}
          accessibilityLabel="Filter by Accessible routes"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: filterAccessible }}
        >
          <Text style={[s.filterChipText, filterAccessible && s.filterChipTextActive]}>♿ Accessible</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[s.filterChip, filterLimited && s.filterChipActive]} 
          onPress={() => setFilterLimited(!filterLimited)}
          accessibilityLabel="Show top 5 nearest routes"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: filterLimited }}
        >
          <Text style={[s.filterChipText, filterLimited && s.filterChipTextActive]}>📍 Top 5</Text>
        </TouchableOpacity>
      </View>

      <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
        <View style={[s.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <View style={[s.row, { flex: 1, alignItems: 'center' }]}>
            <View style={[s.dot, { backgroundColor: GREEN, flexShrink: 0 }]} />
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontWeight: '600', color: c.text, fontSize: 13 }}>Current Location</Text>
              <Text style={s.mutedSm}>{location ? `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}` : 'Detecting...'}</Text>
            </View>
          </View>
          <Text style={{ color: c.textSecondary, fontSize: 16, marginHorizontal: 8 }}>→</Text>
          <View style={[s.row, { flex: 1, alignItems: 'center', justifyContent: 'flex-end' }]}>
            <View style={{ alignItems: 'flex-end', marginRight: 8, flex: 1 }}>
              <Text style={{ fontWeight: '600', color: c.text, fontSize: 13, textAlign: 'right' }} numberOfLines={1}>Search Radius</Text>
              <Text style={s.mutedSm}>5 km</Text>
            </View>
            <View style={[s.dot, { backgroundColor: GREEN, flexShrink: 0 }]} />
          </View>
        </View>
      </View>

      {filteredRoutes.length === 0 ? (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <Text style={{ color: c.textSecondary }}>No live buses found nearby</Text>
        </View>
      ) : (
        filteredRoutes.map(route => {
          const cs = crowdingStyle(route.crowding);
          const selected = selectedRoute?.id === route.id;
          const beingTracked = isTracking && trackedBus?.id === route.id;
          return (
            <TouchableOpacity
              key={route.id}
              style={[
                s.card, 
                s.cardWhite, 
                { 
                  marginBottom: 10, 
                  borderWidth: selected || beingTracked ? 2 : 1, 
                  borderColor: beingTracked ? '#22c55e' : (selected ? GREEN : c.border) 
                }
              ]}
              onPress={() => selectRoute(route)}
              accessibilityLabel={`${route.route_long_name === 'Unknown Route' ? route.route_name : route.route_long_name}, arrival in ${route.eta}. ${route.accessible ? 'Accessible.' : ''}${beingTracked ? ' Currently tracking.' : ''}`}
              accessibilityRole="button"
              accessibilityState={{ selected: selected }}
            >
              {beingTracked && (
                <View style={{ position: 'absolute', top: -5, right: -5, zIndex: 10 }}>
                  <View style={[s.dot, { backgroundColor: '#22c55e', width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: c.card }]} />
                </View>
              )}
              <View style={s.rowBetween}>
                <View style={{ flex: 1 }}>
                  <View style={[s.row, { justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }]}>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: GREEN }}>{route.eta}</Text>
                    {route.accessible && <Text style={{ fontSize: 20 }}>♿</Text>}
                  </View>
                  <View style={{ marginBottom: 4 }}>
                    <Text style={{ fontSize: 20, fontWeight: '600', color: c.text }} numberOfLines={1}>
                      {route.route_long_name === 'Unknown Route' 
                        ? (isNaN(route.route_name) ? route.route_name : `Route ${route.route_name}`) 
                        : route.route_long_name}
                    </Text>
                  </View>
                  <Text style={s.mutedSm}>{route.route_name} • {(route.distance_m / 1000).toFixed(1)} km away</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: GREEN, fontWeight: '700' }}>+15 pts</Text>
                  <View style={[s.badge, { backgroundColor: cs.bg, marginTop: 4 }]}>
                    <Text style={{ color: cs.text, fontSize: 11, fontWeight: '600' }}>{crowdingEmoji(route.crowding)} {route.crowding}</Text>
                  </View>
                </View>
              </View>
              {selected && (
                <View style={{ marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: c.border, flexDirection: 'row', gap: 10 }}>
                  {!beingTracked ? (
                    <TouchableOpacity 
                      style={[s.btnGreen, { flex: 1 }]} 
                      onPress={() => onStartTracking(route)}
                    >
                      <Text style={s.btnText}>Start Tracking</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      style={[s.btnGreen, { flex: 1, backgroundColor: c.dangerText }]} 
                      onPress={() => onStopTracking()}
                    >
                      <Text style={s.btnText}>Stop Tracking</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })
      )}
      <View style={{ height: 80 }} />
    </ScrollView>
  );
});

export default RoutesTab;
