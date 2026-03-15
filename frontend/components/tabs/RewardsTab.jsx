import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useStyles, GREEN } from '../_styles';

const RewardsTab = ({ points, streak, rewards, redeem, setTab }) => {
  const { s, theme } = useStyles();
  const c = theme.colors;

  return (
    <ScrollView style={s.tabContent} showsVerticalScrollIndicator={false}>
      <View style={[s.row, { marginBottom: 16 }]}>
        <TouchableOpacity 
          onPress={() => setTab('home')} 
          style={{ marginRight: 10 }}
          accessibilityLabel="Go back to Home"
          accessibilityRole="button"
        >
          <Text style={{ color: c.textSecondary, fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.pageTitle}>Local Business Rewards</Text>
      </View>

      <View style={[s.card, s.gradientGreen, { marginBottom: 12 }]}>
        <View style={s.rowBetween}>
          <View>
            <Text style={{ fontSize: 32, fontWeight: '700', color: '#fff' }}>{points}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Total Points</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 26, fontWeight: '700', color: '#fff' }}>⚡{streak}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Day Streak</Text>
          </View>
        </View>
        <View style={[s.row, { marginTop: 14, gap: 8 }]}>
          {[{ icon: '🏆', label: 'Level 5' }, { icon: '🎖️', label: '12 Badges' }, { icon: '📈', label: 'Top 15%' }].map((item, i) => (
            <View key={i} style={s.statBadge}>
              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              <Text style={{ fontSize: 11, color: '#fff', marginTop: 4 }}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {rewards.map(reward => (
        <View key={reward.id} style={[s.card, s.cardWhite, { marginBottom: 10, opacity: reward.claimed ? 0.6 : 1 }]}>
          <View style={s.row}>
            <Text style={{ fontSize: 34, marginRight: 12 }}>{reward.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: c.text }}>{reward.name}</Text>
              <Text style={{ color: GREEN, fontWeight: '600', fontSize: 13 }}>{reward.offer}</Text>
              <Text style={s.mutedSm}>{reward.pts} points required</Text>
            </View>
            <TouchableOpacity
              style={[
                s.redeemBtn,
                reward.claimed || points < reward.pts ? s.redeemBtnDisabled : s.redeemBtnActive,
              ]}
              onPress={() => redeem(reward)}
              disabled={reward.claimed || points < reward.pts}
              accessibilityLabel={`${reward.claimed ? 'Claimed' : points >= reward.pts ? 'Redeem' : 'Locked'}: ${reward.name}, ${reward.offer}`}
              accessibilityRole="button"
            >
              <Text style={[s.redeemBtnText, (reward.claimed || points < reward.pts) && { color: c.textSecondary }]}>
                {reward.claimed ? 'Claimed' : points >= reward.pts ? 'Redeem' : 'Locked'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default RewardsTab;
