import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import MapView, { Marker } from '../MapViewComponent';
import { s, GREEN } from '../_styles';

const SchedulesTab = ({ setTab }) => {
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
  const [savedSchedules, setSavedSchedules] = useState([]);

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

  const saveSchedule = () => {
    const newSchedule = {
      id: editingScheduleId || Date.now().toString(),
      label: schedLabel,
      origin: schedOrigin,
      dest: schedDest,
      day: schedDay,
      time: `${schedHour}:${schedMinute} ${schedAmPm}`,
    };
    if (editingScheduleId) {
      setSavedSchedules(prev => prev.map(item => item.id === editingScheduleId ? newSchedule : item));
    } else {
      setSavedSchedules(prev => [...prev, newSchedule]);
    }
    setShowScheduleModal(false);
    setEditingScheduleId(null);
    setSchedLabel(''); setSchedOrigin(''); setSchedDest('');
    setSchedDay('Weekdays'); setSchedHour('08'); setSchedMinute('00'); setSchedAmPm('AM');
    setSearchQuery(''); setSelectedPin(null); setMapStops([]);
  };

  return (
    <>
      <ScrollView style={s.tabContent}>
        <View style={[s.rowBetween, { marginBottom: 14 }]}>
          <Text style={s.pageTitle}>📅 My Schedules</Text>
          <TouchableOpacity 
            style={s.btnGreen} 
            onPress={() => { setEditingScheduleId(null); setShowScheduleModal(true); }}
            accessibilityLabel="Create new schedule"
            accessibilityRole="button"
          >
            <Text style={[s.btnText, { paddingHorizontal: 12 }]}>+ New</Text>
          </TouchableOpacity>
        </View>
        {savedSchedules.length === 0 ? (
          <View style={[s.cardWhite, s.card, { padding: 30, alignItems: 'center' }]}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>📅</Text>
            <Text style={{ fontWeight: '600', color: '#111827', marginBottom: 4 }}>No schedules yet</Text>
            <Text style={s.mutedSm}>Tap "+ New" to create your first schedule.</Text>
          </View>
        ) : savedSchedules.map(sched => (
          <View key={sched.id} style={[s.cardWhite, s.card, { padding: 16, marginBottom: 10 }]}>
            <Text style={{ fontWeight: '700', color: '#111827', fontSize: 15 }}>{sched.label}</Text>
            <Text style={[s.mutedSm, { marginTop: 4 }]}>{sched.origin} → {sched.dest}</Text>
            <Text style={[s.mutedSm]}>{sched.day} at {sched.time}</Text>
          </View>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Schedule Modal */}
      <Modal visible={showScheduleModal} transparent animationType="fade" onRequestClose={() => setShowScheduleModal(false)}>
        <KeyboardAvoidingView behavior="padding" style={s.overlay}>
          <TouchableOpacity style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} activeOpacity={1} onPress={() => { Keyboard.dismiss(); setShowScheduleModal(false); }} />
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 40 }} style={{ width: '100%', maxWidth: 480 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={s.modalBox} activeOpacity={1}>
              <Text style={s.modalTitle}>{editingScheduleId ? 'Edit Schedule' : 'New Schedule'}</Text>

              <Text style={[s.fieldLabel, { marginTop: 10 }]}>Schedule Name</Text>
              <TextInput
                style={[s.textInput, { height: 48, marginBottom: 16 }]}
                value={schedLabel}
                onChangeText={setSchedLabel}
                placeholder="E.g. Morning Commute"
              />

              <Text style={s.fieldLabel}>Origin</Text>
              <TouchableOpacity
                style={[s.textInput, { height: 48, marginBottom: 16, justifyContent: 'center' }]}
                onPress={() => setSelectingFor('origin')}
                accessibilityLabel="Select Origin location"
                accessibilityRole="button"
              >
                <Text style={{ color: selectingFor === 'origin' ? GREEN : '#111827', fontWeight: selectingFor === 'origin' ? '700' : '400' }}>
                  {schedOrigin || "Select Origin"}
                </Text>
              </TouchableOpacity>

              <Text style={s.fieldLabel}>Destination</Text>
              <TouchableOpacity
                style={[s.textInput, { height: 48, marginBottom: 16, justifyContent: 'center' }]}
                onPress={() => setSelectingFor('dest')}
              >
                <Text style={{ color: selectingFor === 'dest' ? GREEN : '#111827', fontWeight: selectingFor === 'dest' ? '700' : '400' }}>
                  {schedDest || "Select Destination"}
                </Text>
              </TouchableOpacity>

              {/* Interactive Search & Map Area */}
              <View style={{ marginBottom: 20, backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e5e7eb' }}>
                <Text style={[s.fieldLabel, { fontSize: 13 }]}>Find {selectingFor === 'origin' ? 'Origin' : 'Destination'} 📍</Text>

                <TextInput
                  style={[s.textInput, { height: 44, marginBottom: 8 }]}
                  placeholder="Type an address to search..."
                  value={searchQuery}
                  onChangeText={handleSearchTyping}
                />

                {/* Autocomplete Dropdown */}
                {showSearchDropdown && searchResults.length > 0 && (
                  <View style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', maxHeight: 150, marginBottom: 8, overflow: 'hidden' }}>
                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                      {searchResults.map((result, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={{ padding: 12, borderBottomWidth: idx < searchResults.length - 1 ? 1 : 0, borderBottomColor: '#f3f4f6' }}
                          onPress={() => selectSearchResult(result)}
                        >
                          <Text style={{ fontWeight: '600', color: '#111827' }}>{result.properties.name || result.properties.street || "Location"}</Text>
                          <Text style={{ fontSize: 11, color: '#6b7280' }}>
                            {[result.properties.city, result.properties.state].filter(Boolean).join(', ')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Map View */}
                <View style={{ height: 200, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#d1d5db' }}>
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
                    <View style={{ position: 'absolute', bottom: 8, left: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: 8 }}>
                      <Text style={{ fontSize: 11, fontWeight: '600', textAlign: 'center' }}>Tap a bus stop pin to select it.</Text>
                      <Text style={{ fontSize: 10, textAlign: 'center', color: '#6b7280' }}>Green pins = ♿ Accessible</Text>
                    </View>
                  )}
                </View>
              </View>

              <Text style={s.fieldLabel}>Day</Text>
              <View style={[s.row, { gap: 8, marginBottom: 16, flexWrap: 'wrap' }]}>
                {['Weekdays', 'Weekends', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[s.badge, schedDay === d ? { backgroundColor: GREEN } : { backgroundColor: '#e5e7eb' }]}
                    onPress={() => setSchedDay(d)}
                  >
                    <Text style={{ color: schedDay === d ? '#fff' : '#374151', fontWeight: '600' }}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={s.fieldLabel}>Time</Text>
              <View style={[s.row, { gap: 8, marginBottom: 24 }]}>
                <View style={{ flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                  <TextInput
                    style={{ height: 48, backgroundColor: '#f9fafb', textAlign: 'center', fontSize: 18, fontWeight: '600' }}
                    value={schedHour}
                    onChangeText={h => setSchedHour(h.replace(/[^0-9]/g, ''))}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
                <Text style={{ fontSize: 24, fontWeight: '700' }}>:</Text>
                <View style={{ flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                  <TextInput
                    style={{ height: 48, backgroundColor: '#f9fafb', textAlign: 'center', fontSize: 18, fontWeight: '600' }}
                    value={schedMinute}
                    onChangeText={m => setSchedMinute(m.replace(/[^0-9]/g, ''))}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
                <View style={[s.row, { backgroundColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden' }]}>
                  <TouchableOpacity
                    style={{ paddingHorizontal: 16, paddingVertical: 14, backgroundColor: schedAmPm === 'AM' ? GREEN : 'transparent' }}
                    onPress={() => setSchedAmPm('AM')}
                  >
                    <Text style={{ fontWeight: '700', color: schedAmPm === 'AM' ? '#fff' : '#6b7280' }}>AM</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ paddingHorizontal: 16, paddingVertical: 14, backgroundColor: schedAmPm === 'PM' ? GREEN : 'transparent' }}
                    onPress={() => setSchedAmPm('PM')}
                  >
                    <Text style={{ fontWeight: '700', color: schedAmPm === 'PM' ? '#fff' : '#6b7280' }}>PM</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[s.row, { gap: 10 }]}>
                <TouchableOpacity style={[s.btnHalf, s.btnGray]} onPress={() => setShowScheduleModal(false)}>
                  <Text style={s.btnGrayText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.btnHalf, s.btnGreen]} onPress={saveSchedule}>
                  <Text style={s.btnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

export default SchedulesTab;
