import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Keyboard
} from 'react-native';
import MapView, { Marker } from '../MapViewComponent';
import { useStyles, GREEN } from '../../logic/_styles';
import { useTheme } from '../../logic/ThemeContext';
import { allRoutes } from '../../logic/data';

const SchedulesTab = ({ setTab, savedSchedules = [], setSavedSchedules }) => {
  const { s, theme } = useStyles();
  const c = theme.colors;
  const f = theme.fonts;

  // ── Schedules state ────────────────────────────────────────────────────────
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [schedLabel, setSchedLabel] = useState('');
  const [schedOrigin, setSchedOrigin] = useState('');
  const [schedDest, setSchedDest] = useState('');
  const [schedDay, setSchedDay] = useState('Weekdays');
  const [schedHour, setSchedHour] = useState('08');
  const [schedMinute, setSchedMinute] = useState('00');
  const [schedAmPm, setSchedAmPm] = useState('AM');
  const [selectingFor, setSelectingFor] = useState('origin');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [mapStops, setMapStops] = useState([]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 43.65,
    longitude: -79.38,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);


  const suggestedRoutes = React.useMemo(() => {
    if (!schedDest) return [];
    const dest = schedDest.toLowerCase();
    // Simulate smart matching: "College" -> 915, "Oshawa" -> 405, etc.
    if (dest.includes('college')) return [allRoutes[0], allRoutes[2]];
    if (dest.includes('oshawa')) return [allRoutes[1], allRoutes[2]];
    return [allRoutes[2], allRoutes[3]];
  }, [schedDest]);

  // ── Schedule helpers ─────────────────────────────────────────────────────────
  const handleSearchTyping = (text) => {
    setSearchQuery(text);
    if (text.length > 2) {
      fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(text)}&limit=5`)
        .then(res => res.json())
        .then(data => { setSearchResults(data.features || []); setShowSearchDropdown(true); })
        .catch(() => {});
    } else {
      setShowSearchDropdown(false);
    }
  };

  const selectSearchResult = (result) => {
    const coords = result.geometry.coordinates;
    const name = result.properties.name || result.properties.street || 'Selected Location';
    const label = [name, result.properties.city].filter(Boolean).join(', ');
    if (selectingFor === 'origin') setSchedOrigin(label);
    else setSchedDest(label);
    setSelectedPin({ lat: coords[1], lon: coords[0], name });
    setMapRegion(r => ({ ...r, latitude: coords[1], longitude: coords[0] }));
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  const setStopFromMap = (stop) => {
    const label = stop.stop_name;
    if (selectingFor === 'origin') setSchedOrigin(label);
    else setSchedDest(label);
  };

  const resetModal = () => {
    setEditingScheduleId(null);
    setSchedLabel(''); setSchedOrigin(''); setSchedDest('');
    setSchedDay('Weekdays'); setSchedHour('08'); setSchedMinute('00'); setSchedAmPm('AM');
    setSearchQuery(''); setSelectedPin(null); setMapStops([]);
    setSelectedRouteId(null);
  };

  const saveSchedule = () => {
    const selectedRoute = allRoutes.find(r => r.id === selectedRouteId);
    const newSchedule = {
      id: editingScheduleId || Date.now().toString(),
      label: schedLabel,
      origin: schedOrigin,
      dest: schedDest,
      day: schedDay,
      time: `${schedHour}:${schedMinute} ${schedAmPm}`,
      route: selectedRoute ? selectedRoute.name : null,
      routeIcon: selectedRoute ? selectedRoute.icon : null
    };
    if (editingScheduleId) {
      setSavedSchedules(prev => prev.map(item => item.id === editingScheduleId ? newSchedule : item));
    } else {
      setSavedSchedules(prev => [...prev, newSchedule]);
    }
    setShowScheduleModal(false);
    resetModal();
  };

  const handleEdit = (sched) => {
    setEditingScheduleId(sched.id);
    setSchedLabel(sched.label);
    setSchedOrigin(sched.origin);
    setSchedDest(sched.dest);
    setSchedDay(sched.day);
    
    // Parse time "08:00 AM"
    const [time, ampm] = sched.time.split(' ');
    const [hh, mm] = time.split(':');
    setSchedHour(hh);
    setSchedMinute(mm);
    setSchedAmPm(ampm);

    // Find route ID from name
    const route = allRoutes.find(r => r.name === sched.route);
    setSelectedRouteId(route ? route.id : null);

    setShowScheduleModal(true);
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setSavedSchedules(prev => prev.filter(s => s.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  return (
    <>
      <ScrollView style={s.tabContent}>
        <View style={[s.rowBetween, { marginBottom: 14 }]}>
          <Text style={s.pageTitle}>📅 My Schedules</Text>
          <TouchableOpacity 
            style={s.btnGreen} 
            onPress={() => { resetModal(); setShowScheduleModal(true); }}
            accessibilityLabel="Create new schedule"
            accessibilityRole="button"
          >
            <Text style={[s.btnText, { paddingHorizontal: 12 }]}>+ New</Text>
          </TouchableOpacity>
        </View>
        {savedSchedules.length === 0 ? (
          <View style={[s.cardWhite, s.card, { padding: 30, alignItems: 'center' }]}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>📅</Text>
            <Text style={{ fontWeight: '600', color: c.text, marginBottom: 4 }}>No schedules yet</Text>
            <Text style={s.mutedSm}>Tap "+ New" to create your first schedule.</Text>
          </View>
        ) : savedSchedules.map(sched => (
          <View key={sched.id} style={[s.cardWhite, s.card, { padding: 16, marginBottom: 10 }]}>
            <View style={s.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', color: c.text, fontSize: 22 }}>{sched.label}</Text>
                <Text style={[s.mutedSm, { marginTop: 4 }]}>{sched.origin} → {sched.dest}</Text>
                <Text style={[s.mutedSm]}>{sched.day} at {sched.time}</Text>
              </View>
              {sched.route && (
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 24 }}>{sched.routeIcon || '🚌'}</Text>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: GREEN }}>{sched.route}</Text>
                </View>
              )}
            </View>
            
            <View style={[s.divider, { marginVertical: 12 }]} />
            
            <View style={[s.row, { gap: 12 }]}>
              <TouchableOpacity 
                style={[s.row, { flex: 1, justifyContent: 'center', backgroundColor: c.inputBg, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: c.border }]}
                onPress={() => handleEdit(sched)}
              >
                <Text style={{ fontSize: 14, color: c.text, fontWeight: '500' }}>✏️ Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[s.row, { flex: 1, justifyContent: 'center', backgroundColor: c.dangerBg, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: c.dangerBorder }]}
                onPress={() => handleDelete(sched.id)}
              >
                <Text style={{ fontSize: 14, color: c.dangerText, fontWeight: '500' }}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Schedule Modal */}
      <Modal visible={showScheduleModal} transparent animationType="fade" onRequestClose={() => setShowScheduleModal(false)}>
        <KeyboardAvoidingView behavior="padding" style={s.overlay}>
          <TouchableOpacity style={[StyleSheet.absoluteFill, { backgroundColor: c.overlay }]} activeOpacity={1} onPress={() => { Keyboard.dismiss(); setShowScheduleModal(false); }} />
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 40 }} style={{ width: '100%', maxWidth: 480 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={s.modalBox} activeOpacity={1}>
              <Text style={s.modalTitle}>{editingScheduleId ? 'Edit Schedule' : 'New Schedule'}</Text>

              <Text style={[s.fieldLabel, { marginTop: 10 }]}>Schedule Name</Text>
              <TextInput
                style={[s.textInput, { height: 48, marginBottom: 16 }]}
                value={schedLabel}
                onChangeText={setSchedLabel}
                placeholder="E.g. Morning Commute"
                placeholderTextColor={c.textSecondary}
              />

              <Text style={s.fieldLabel}>Origin</Text>
              <TouchableOpacity
                style={[s.textInput, { height: 48, marginBottom: 16, justifyContent: 'center' }]}
                onPress={() => setSelectingFor('origin')}
                accessibilityLabel="Select Origin location"
                accessibilityRole="button"
              >
                <Text style={{ color: selectingFor === 'origin' ? GREEN : c.text, fontWeight: selectingFor === 'origin' ? '700' : '400' }}>
                  {schedOrigin || "Select Origin"}
                </Text>
              </TouchableOpacity>

              <Text style={s.fieldLabel}>Destination</Text>
              <TouchableOpacity
                style={[s.textInput, { height: 48, marginBottom: 16, justifyContent: 'center' }]}
                onPress={() => setSelectingFor('dest')}
              >
                <Text style={{ color: selectingFor === 'dest' ? GREEN : c.text, fontWeight: selectingFor === 'dest' ? '700' : '400' }}>
                  {schedDest || "Select Destination"}
                </Text>
              </TouchableOpacity>

              {/* Interactive Search & Map Area */}
              <View style={{ marginBottom: 20, backgroundColor: c.inputBg, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: c.border }}>
                <Text style={[s.fieldLabel, { fontSize: 13 }]}>Find {selectingFor === 'origin' ? 'Origin' : 'Destination'} 📍</Text>

                <TextInput
                  style={[s.textInput, { height: 44, marginBottom: 8 }]}
                  placeholder="Type an address to search..."
                  placeholderTextColor={c.textSecondary}
                  value={searchQuery}
                  onChangeText={handleSearchTyping}
                />

                {/* Autocomplete Dropdown */}
                {showSearchDropdown && searchResults.length > 0 && (
                  <View style={{ backgroundColor: c.card, borderRadius: 8, borderWidth: 1, borderColor: c.border, maxHeight: 150, marginBottom: 8, overflow: 'hidden' }}>
                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                      {searchResults.map((result, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={{ padding: 12, borderBottomWidth: idx < searchResults.length - 1 ? 1 : 0, borderBottomColor: c.border }}
                          onPress={() => selectSearchResult(result)}
                        >
                          <Text style={{ fontWeight: '600', color: c.text }}>{result.properties.name || result.properties.street || "Location"}</Text>
                          <Text style={{ fontSize: 11, color: c.textSecondary }}>
                            {[result.properties.city, result.properties.state].filter(Boolean).join(', ')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Map View */}
                <View style={{ height: 200, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: c.border }}>
                  <MapView
                    style={{ flex: 1 }}
                    region={mapRegion}
                    onRegionChangeComplete={(reg) => {/* optional: reverse geocode on map drag */ }}
                  >
                    {/* The Searched Pin */}
                    {selectedPin && (
                      <Marker
                        coordinate={{ latitude: selectedPin.lat, longitude: selectedPin.lon }}
                        pinColor="blue"
                        title={selectedPin.name}
                        description="Searched Location"
                      />
                    )}

                    {/* The Closest Stops */}
                    {mapStops.map((stop) => (
                      <Marker
                        key={`stop-${stop.stop_id}`}
                        coordinate={{ latitude: stop.stop_lat, longitude: stop.stop_lon }}
                        pinColor={stop.wheelchair_boarding === 1 ? "green" : "red"}
                        title={stop.stop_name}
                        description={stop.wheelchair_boarding === 1 ? "♿ Accessible Stop" : "⚠️ Accessibility Unknown/No"}
                        onCalloutPress={() => setStopFromMap(stop)}
                      />
                    ))}
                  </MapView>

                  {/* Instructions Overlay */}
                  {mapStops.length > 0 && (
                    <View style={{ position: 'absolute', bottom: 8, left: 8, right: 8, backgroundColor: c.overlay, padding: 8, borderRadius: 8 }}>
                      <Text style={{ fontSize: 11, fontWeight: '600', textAlign: 'center', color: '#fff' }}>Tap a bus stop pin to select it.</Text>
                      <Text style={{ fontSize: 10, textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>Green pins = ♿ Accessible</Text>
                    </View>
                  )}
                </View>
               </View>

              {/* Suggested Routes Section */}
              {suggestedRoutes.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={s.fieldLabel}>Suggested Routes for this trip</Text>
                  <View style={{ gap: 8 }}>
                    {suggestedRoutes.map((route) => (
                      <TouchableOpacity
                        key={route.id}
                        onPress={() => setSelectedRouteId(route.id === selectedRouteId ? null : route.id)}
                        style={[
                          s.cardWhite, 
                          s.card, 
                          { 
                            padding: 12, 
                            borderWidth: 2, 
                            borderColor: selectedRouteId === route.id ? GREEN : c.border 
                          }
                        ]}
                      >
                        <View style={s.rowBetween}>
                          <View style={s.row}>
                            <Text style={{ fontSize: 24, marginRight: 12 }}>{route.icon}</Text>
                            <View>
                              <Text style={{ fontWeight: '700', color: c.text }}>{route.name}</Text>
                              <Text style={s.mutedSm}>{route.freq}</Text>
                            </View>
                          </View>
                          {route.accessible && <Text style={{ fontSize: 12, color: GREEN }}>♿ Accessible</Text>}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <Text style={s.fieldLabel}>Day</Text>
              <View style={[s.row, { gap: 8, marginBottom: 16, flexWrap: 'wrap' }]}>
                {['Weekdays', 'Weekends', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      s.badge, 
                      schedDay === d 
                        ? { backgroundColor: GREEN } 
                        : { backgroundColor: c.card, borderWidth: 1, borderColor: c.border }
                    ]}
                    onPress={() => setSchedDay(d)}
                  >
                    <Text style={{ color: schedDay === d ? '#fff' : c.text, fontWeight: '600' }}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={s.fieldLabel}>Time</Text>
              <View style={[s.row, { gap: 8, marginBottom: 24 }]}>
                <View style={{ flex: 1, borderWidth: 1, borderColor: c.border, borderRadius: 8, overflow: 'hidden' }}>
                  <TextInput
                    style={{ height: 48, backgroundColor: c.inputBg, color: c.text, textAlign: 'center', fontSize: 18, fontWeight: '600' }}
                    value={schedHour}
                    onChangeText={h => setSchedHour(h.replace(/[^0-9]/g, ''))}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
                <Text style={{ fontSize: 24, fontWeight: '700', color: c.text }}>:</Text>
                <View style={{ flex: 1, borderWidth: 1, borderColor: c.border, borderRadius: 8, overflow: 'hidden' }}>
                  <TextInput
                    style={{ height: 48, backgroundColor: c.inputBg, color: c.text, textAlign: 'center', fontSize: 18, fontWeight: '600' }}
                    value={schedMinute}
                    onChangeText={m => setSchedMinute(m.replace(/[^0-9]/g, ''))}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
                <View style={[s.row, { padding: 4, backgroundColor: c.card, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: c.border }]}>
                  <TouchableOpacity
                    style={{ 
                      paddingHorizontal: 16, 
                      paddingVertical: 10, 
                      borderRadius: 6,
                      backgroundColor: schedAmPm === 'AM' ? GREEN : 'transparent' 
                    }}
                    onPress={() => setSchedAmPm('AM')}
                  >
                    <Text style={{ fontWeight: '700', color: schedAmPm === 'AM' ? '#fff' : c.text }}>AM</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ 
                      paddingHorizontal: 16, 
                      paddingVertical: 10, 
                      borderRadius: 6,
                      backgroundColor: schedAmPm === 'PM' ? GREEN : 'transparent' 
                    }}
                    onPress={() => setSchedAmPm('PM')}
                  >
                    <Text style={{ fontWeight: '700', color: schedAmPm === 'PM' ? '#fff' : c.text }}>PM</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[s.row, { gap: 10 }]}>
                <TouchableOpacity style={[s.btnHalf, theme.isDark ? s.btnPurple : s.btnGray]} onPress={() => setShowScheduleModal(false)}>
                  <Text style={theme.isDark ? s.btnText : s.btnGrayText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.btnHalf, s.btnGreen]} onPress={saveSchedule}>
                  <Text style={s.btnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={!!deleteConfirmId} transparent animationType="fade" onRequestClose={() => setDeleteConfirmId(null)}>
        <View style={s.overlay}>
          <TouchableOpacity style={[StyleSheet.absoluteFill, { backgroundColor: c.overlay }]} activeOpacity={1} onPress={() => setDeleteConfirmId(null)} />
          <View style={s.modalBox}>
            <Text style={[s.modalTitle, { color: c.dangerText }]}>Confirm Delete</Text>
            <Text style={[s.bodyText, { marginBottom: 24, fontSize: 16, color: c.text }]}>
              Are you sure you want to delete this schedule? This action cannot be undone.
            </Text>

            <View style={[s.row, { gap: 12 }]}>
              <TouchableOpacity 
                style={[s.btnHalf, theme.isDark ? s.btnPurple : s.btnGray]} 
                onPress={() => setDeleteConfirmId(null)}
              > 
                <Text style={theme.isDark ? s.btnText : s.btnGrayText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[s.btnHalf, { backgroundColor: c.dangerText, paddingVertical: 12, borderRadius: 10, alignItems: 'center' }]} 
                onPress={confirmDelete}
              >
                <Text style={s.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SchedulesTab;
