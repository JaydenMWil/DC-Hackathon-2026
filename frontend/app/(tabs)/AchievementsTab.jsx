import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { s, GREEN } from './styles';

const AchievementsTab = ({ achievements, setTab }) => (
  <ScrollView style={s.tabContent} showsVerticalScrollIndicator={false}>
    <View style={[s.row, { marginBottom: 16 }]}>
      <TouchableOpacity onPress={() => setTab('home')} style={{ marginRight: 10 }}>
        <Text style={{ color: '#6b7280', fontSize: 16 }}>← Back</Text>
      </TouchableOpacity>
      <Text style={s.pageTitle}>Achievements & Badges</Text>
    </View>

    {achievements.map(achievement => {
      const pct = (achievement.progress / achievement.total) * 100;
      const done = achievement.progress >= achievement.total;
      return (
        <View key={achievement.id} style={[s.card, s.cardWhite, { marginBottom: 10, borderWidth: done ? 2 : 1, borderColor: done ? GREEN : '#e5e7eb' }]}>
          <View style={[s.row, { marginBottom: 10 }]}>
            <Text style={{ fontSize: 34, marginRight: 12, opacity: done ? 1 : 0.4 }}>{achievement.icon}</Text>
            <View style={{ flex: 1 }}>
              <View style={s.row}>
                <Text style={{ fontWeight: '700', color: '#111827', marginRight: 6 }}>{achievement.name}</Text>
                {done && <Text style={{ color: '#22c55e' }}>✓</Text>}
              </View>
              <Text style={s.mutedSm}>{achievement.desc}</Text>
            </View>
          </View>
          <View style={s.rowBetween}>
            <Text style={s.mutedSm}>Progress</Text>
            <Text style={{ fontWeight: '700', color: done ? GREEN : '#6b7280', fontSize: 13 }}>{achievement.progress}/{achievement.total}</Text>
          </View>
          <View style={s.progressTrack}>
            <View style={[s.progressBar, { width: `${pct}%`, backgroundColor: done ? GREEN : '#9ca3af' }]} />
          </View>
        </View>
      );
    })}
    <View style={{ height: 80 }} />
  </ScrollView>
);

export default AchievementsTab;
