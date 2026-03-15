import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, SafeAreaView } from 'react-native';
import { useStyles, GREEN } from '../../core/_styles';
import { useTheme } from '../../core/ThemeContext';

const SettingsModal = ({
  showSettings, setShowSettings,
  settingsSection, setSettingsSection,
  profileName, profilePhone, profileEmail,
  wheelchairVehicle, setWheelchairVehicle,
  textOnlyComms, setTextOnlyComms,
  voiceCall, setVoiceCall,
  screenReader, setScreenReader,
  rideAlerts, setRideAlerts,
  promoAlerts, setPromoAlerts,
  emergencyAlerts, setEmergencyAlerts,
  appLanguage, setAppLanguage,
  locationPerm, setLocationPerm,
  dataSharing, setDataSharing,
  setShowDiagram,
}) => {
  const { s, theme } = useStyles();
  const {
    colorMode, setColorMode,
    fontSize, setFontSize,
    highContrast, setHighContrast
  } = useTheme();

  if (!showSettings) return null;

  const c = theme.colors;
  const f = theme.fonts;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.overlay }}>
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => { if (settingsSection) setSettingsSection(null); else setShowSettings(false); }} />
      <View style={{ backgroundColor: c.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' }}>
        {/* Settings Header */}
        <View style={{ backgroundColor: c.headerBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center' }}>
          {/* Left Side (Back) */}
          <View style={{ width: 70, alignItems: 'flex-start' }}>
            {settingsSection && (
              <TouchableOpacity onPress={() => setSettingsSection(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={{ color: '#fff', fontSize: 16 }}>← Back</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Center (Title) */}
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: c.textOnGreen, fontSize: f.title, fontWeight: '700', textAlign: 'center' }}>
              {settingsSection === 'appearance' ? 'Appearance'
                : settingsSection === 'account' ? 'Account & Security'
                  : settingsSection === 'accessibility' ? 'Accessibility'
                    : settingsSection === 'language' ? 'Language & Region'
                      : settingsSection === 'privacy' ? 'Privacy'
                        : settingsSection === 'support' ? 'Support'
                          : 'Settings'}
            </Text>
          </View>

          {/* Right Side (Close) */}
          <View style={{ width: 70, alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={() => setShowSettings(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={{ color: '#fff', fontSize: 22, fontWeight: '300' }}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={{ paddingHorizontal: 16, paddingTop: 16 }} showsVerticalScrollIndicator={false}>

          {/* ── MAIN MENU ── */}
          {!settingsSection && (
            <View style={{ paddingBottom: 40 }}>
              {[
                { key: 'appearance', icon: '🎨', label: 'Appearance', sub: 'Dark mode, font size, contrast' },
                { key: 'account', icon: '👤', label: 'Account & Security', sub: 'Profile, password, account' },
                { key: 'accessibility', icon: '♿', label: 'Accessibility', sub: 'Mobility, screen reader, alerts' },
                { key: 'language', icon: '🌐', label: 'Language & Region', sub: `${appLanguage}` },
                { key: 'privacy', icon: '🔒', label: 'Privacy', sub: 'Location, data sharing' },
                { key: 'support', icon: '💬', label: 'Support', sub: 'How to use the app' },
              ].map(item => (
                <TouchableOpacity key={item.key} style={[s.card, s.cardWhite, { marginBottom: 10, flexDirection: 'row', alignItems: 'center' }]} onPress={() => setSettingsSection(item.key)}>
                  <Text style={{ fontSize: f.iconLg, marginRight: 14 }}>{item.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '700', color: c.text, fontSize: f.button }}>{item.label}</Text>
                    <Text style={s.mutedSm}>{item.sub}</Text>
                  </View>
                  <Text style={{ color: c.textSecondary, fontSize: f.title }}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── APPEARANCE ── */}
          {settingsSection === 'appearance' && (
            <View style={{ paddingBottom: 40 }}>
              {/* Live Preview Card */}
              <View style={[s.card, s.cardWhite, { marginBottom: 16, borderLeftWidth: 4, borderLeftColor: GREEN }]}>
                <Text style={[s.fieldLabel, { fontSize: f.label, color: GREEN, marginBottom: 8, textTransform: 'uppercase' }]}>Themed Preview</Text>
                <View style={s.rowBetween}>
                  <View>
                    <Text style={[s.pageTitle, { fontSize: f.title }]}>Hello world!</Text>
                    <Text style={s.mutedSm}>This is how your app will look.</Text>
                  </View>
                  <View style={[s.dot, { backgroundColor: GREEN, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>⭐</Text>
                  </View>
                </View>
              </View>

              <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                <Text style={[s.fieldLabel, { marginBottom: 12 }]}>🌓 Dark Mode</Text>
                {[['light', '☀️ Light'], ['dark', '🌙 Dark'], ['system', '📱 System Default']].map(([val, label]) => (
                  <TouchableOpacity key={val} style={[s.radioRow, colorMode === val && { borderColor: GREEN, backgroundColor: c.radioSelected }]} onPress={() => setColorMode(val)}>
                    <View style={[s.radioCircle, colorMode === val && { borderColor: GREEN }]}>
                      {colorMode === val && <View style={s.radioDot} />}
                    </View>
                    <Text style={{ flex: 1, fontWeight: '500', color: c.text, marginLeft: 10 }}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                <Text style={[s.fieldLabel, { marginBottom: 12 }]}>🔡 Font Size</Text>
                {[['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']].map(([val, label]) => (
                  <TouchableOpacity key={val} style={[s.radioRow, fontSize === val && { borderColor: GREEN, backgroundColor: c.radioSelected }]} onPress={() => setFontSize(val)}>
                    <View style={[s.radioCircle, fontSize === val && { borderColor: GREEN }]}>
                      {fontSize === val && <View style={s.radioDot} />}
                    </View>
                    <Text style={{ flex: 1, fontWeight: '500', color: c.text, marginLeft: 10 }}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.fieldLabel}>⬛ High-Contrast Mode</Text>
                    <Text style={s.mutedSm}>Improves visibility for accessibility</Text>
                  </View>
                  <Switch value={highContrast} onValueChange={setHighContrast} trackColor={{ true: GREEN }} />
                </View>
              </View>
            </View>
          )}

          {/* ── ACCOUNT & SECURITY ── */}
          {settingsSection === 'account' && (
            <View style={{ paddingBottom: 40 }}>
              <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                <Text style={[s.fieldLabel, { marginBottom: 10 }]}>👤 Profile Information</Text>
                {[['Name', profileName], ['Phone', profilePhone], ['Email', profileEmail]].map(([label, val]) => (
                  <View key={label} style={{ marginBottom: 12 }}>
                    <Text style={[s.mutedSm, { marginBottom: 4 }]}>{label}</Text>
                    <View style={{ backgroundColor: c.inputBg, borderRadius: 10, borderWidth: 1, borderColor: c.inputBorder, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ color: c.text, fontSize: f.body }}>{val}</Text>
                      <Text style={{ color: GREEN, fontSize: f.subtitle, fontWeight: '600' }}>Edit</Text>
                    </View>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={[s.card, s.cardWhite, { marginBottom: 10, flexDirection: 'row', alignItems: 'center' }]}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>🔑</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', color: c.text }}>Change Password</Text>
                  <Text style={s.mutedSm}>Update your account password</Text>
                </View>
                <Text style={{ color: c.textSecondary, fontSize: f.title }}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.card, { marginBottom: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff5f5', borderWidth: 1, borderColor: '#fecaca' }]}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>🗑️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', color: c.dangerText }}>Delete Account</Text>
                  <Text style={[s.mutedSm, { color: c.dangerText }]}>Permanently remove your data</Text>
                </View>
                <Text style={{ color: c.dangerText, fontSize: f.title }}>›</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── ACCESSIBILITY ── */}
          {settingsSection === 'accessibility' && (
            <View style={{ paddingBottom: 40 }}>
              <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                <Text style={[s.fieldLabel, { marginBottom: 10 }]}>🦽 Mobility Preferences</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '500', color: c.text, fontSize: f.body }}>Wheelchair Accessible Vehicle</Text>
                    <Text style={s.mutedSm}>Only show accessible transport options</Text>
                  </View>
                  <Switch value={wheelchairVehicle} onValueChange={setWheelchairVehicle} trackColor={{ true: GREEN }} />
                </View>
              </View>
              <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                <Text style={[s.fieldLabel, { marginBottom: 10 }]}>💬 Communication Preferences</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '500', color: c.text, fontSize: f.body }}>Text-Only Communication</Text>
                    <Text style={s.mutedSm}>Receive all updates via text/SMS</Text>
                  </View>
                  <Switch value={textOnlyComms} onValueChange={setTextOnlyComms} trackColor={{ true: GREEN }} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '500', color: c.text, fontSize: f.body }}>Voice Call Preferred</Text>
                    <Text style={s.mutedSm}>Receive alerts via voice call</Text>
                  </View>
                  <Switch value={voiceCall} onValueChange={setVoiceCall} trackColor={{ true: GREEN }} />
                </View>
              </View>
              <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.fieldLabel}>👁️ Screen Reader Optimization</Text>
                    <Text style={s.mutedSm}>Enhance compatibility with screen readers</Text>
                  </View>
                  <Switch value={screenReader} onValueChange={setScreenReader} trackColor={{ true: GREEN }} />
                </View>
              </View>
              <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                <Text style={[s.fieldLabel, { marginBottom: 10 }]}>🔔 Notifications</Text>
                {[
                  ['Ride Status Alerts', 'Updates on your booked rides', rideAlerts, setRideAlerts],
                  ['Promotions & Updates', 'News and special offers', promoAlerts, setPromoAlerts],
                  ['Emergency Alerts', 'Critical safety notifications', emergencyAlerts, setEmergencyAlerts],
                ].map(([label, sub, val, setter]) => (
                  <View key={label} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '500', color: c.text, fontSize: f.body }}>{label}</Text>
                      <Text style={s.mutedSm}>{sub}</Text>
                    </View>
                    <Switch value={val} onValueChange={setter} trackColor={{ true: GREEN }} />
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── LANGUAGE & REGION ── */}
          {settingsSection === 'language' && (
            <View style={{ paddingBottom: 40 }}>
              <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                <Text style={[s.fieldLabel, { marginBottom: 12 }]}>🌐 App Language</Text>
                {['English', 'Français', 'Español', 'العربية', 'हिन्दी', '中文'].map(lang => (
                  <TouchableOpacity key={lang} style={[s.radioRow, appLanguage === lang && { borderColor: GREEN, backgroundColor: c.radioSelected }]} onPress={() => setAppLanguage(lang)}>
                    <View style={[s.radioCircle, appLanguage === lang && { borderColor: GREEN }]}>
                      {appLanguage === lang && <View style={s.radioDot} />}
                    </View>
                    <Text style={{ flex: 1, fontWeight: '500', color: c.text, marginLeft: 10, textAlign: 'left' }}>{lang}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* ── PRIVACY ── */}
          {settingsSection === 'privacy' && (
            <View style={{ paddingBottom: 40 }}>
              <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                <Text style={[s.fieldLabel, { marginBottom: 12 }]}>📍 Location Permissions</Text>
                {[['always', '🔒 Always'], ['while_using', '📱 While Using App'], ['never', '🚫 Never']].map(([val, label]) => (
                  <TouchableOpacity key={val} style={[s.radioRow, locationPerm === val && { borderColor: GREEN, backgroundColor: c.radioSelected }]} onPress={() => setLocationPerm(val)}>
                    <View style={[s.radioCircle, locationPerm === val && { borderColor: GREEN }]}>
                      {locationPerm === val && <View style={s.radioDot} />}
                    </View>
                    <Text style={{ flex: 1, fontWeight: '500', color: c.text, marginLeft: 10 }}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={[s.card, s.cardWhite, { marginBottom: 12 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.fieldLabel}>📊 Data Sharing Preferences</Text>
                    <Text style={s.mutedSm}>Share anonymized usage data to improve the app</Text>
                  </View>
                  <Switch value={dataSharing} onValueChange={setDataSharing} trackColor={{ true: GREEN }} />
                </View>
              </View>
            </View>
          )}

          {/* ── SUPPORT ── */}
          {settingsSection === 'support' && (
            <View style={{ paddingBottom: 40 }}>
              <TouchableOpacity style={[s.card, s.cardWhite, { marginBottom: 10, flexDirection: 'row', alignItems: 'center' }]} onPress={() => { setShowSettings(false); setShowDiagram(true); }}>
                <Text style={{ fontSize: f.iconLg, marginRight: 14 }}>📖</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: c.text, fontSize: f.button }}>How to Use the App</Text>
                  <Text style={s.mutedSm}>Step-by-step guide to AccessRide features</Text>
                </View>
                <Text style={{ color: c.textSecondary, fontSize: f.title }}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.card, s.cardWhite, { marginBottom: 10, flexDirection: 'row', alignItems: 'center' }]}>
                <Text style={{ fontSize: f.iconLg, marginRight: 14 }}>📧</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: c.text, fontSize: f.button }}>Contact Support</Text>
                  <Text style={s.mutedSm}>support@accessride.ca</Text>
                </View>
                <Text style={{ color: c.textSecondary, fontSize: f.title }}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.card, s.cardWhite, { marginBottom: 10, flexDirection: 'row', alignItems: 'center' }]}>
                <Text style={{ fontSize: f.iconLg, marginRight: 14 }}>⭐</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: c.text, fontSize: f.button }}>Rate the App</Text>
                  <Text style={s.mutedSm}>Share your experience on the App Store</Text>
                </View>
                <Text style={{ color: c.textSecondary, fontSize: f.title }}>›</Text>
              </TouchableOpacity>
              <View style={[s.card, { backgroundColor: c.successBg, marginBottom: 10, alignItems: 'center' }]}>
                <Text style={[s.mutedSm, { color: c.successText }]}>AccessRide v2.4.1 • © 2026 AccessRide Inc. Made with ❤️ by Jolin, Jayden, and Andrew</Text>
              </View>
            </View>
          )}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SettingsModal;
