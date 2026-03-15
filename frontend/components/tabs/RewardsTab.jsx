import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useStyles, GREEN } from '../../logic/_styles';
import { rewards } from '../../logic/data';

const RewardsTab = React.forwardRef(({ points, streak, rewards, redeem, setTab }, ref) => {
  const { s, theme } = useStyles();
  const c = theme.colors;

  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);

  // Level logic
  const currentLevel = 5;
  const nextLevel = 6;
  const pointsForNext = 500;
  const progressPct = Math.min(100, (points / pointsForNext) * 100);

  return (
    <ScrollView ref={ref} style={s.tabContent} showsVerticalScrollIndicator={false}>
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
          <TouchableOpacity 
            style={s.statBadge}
            onPress={() => setShowLevelModal(true)}
            accessibilityLabel="Level 5. Tap for progress details."
            accessibilityRole="button"
          >
            <Text style={{ fontSize: 20 }}>🏆</Text>
            <Text style={{ fontSize: 11, color: '#fff', marginTop: 4 }}>Level 5</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={s.statBadge}
            onPress={() => setTab('achievements')}
            accessibilityLabel="12 Badges earned. Tap to view achievements."
            accessibilityRole="button"
          >
            <Text style={{ fontSize: 20 }}>🎖️</Text>
            <Text style={{ fontSize: 11, color: '#fff', marginTop: 4 }}>12 Badges</Text>
          </TouchableOpacity>
          
          {[{ icon: '📈', label: 'Top 15%' }].map((item, i) => (
            <TouchableOpacity 
              key={i} 
              style={s.statBadge}
              onPress={() => setShowLeaderboardModal(true)}
              accessibilityLabel="Top 15 percent of users. Tap for community standing."
              accessibilityRole="button"
            >
              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              <Text style={{ fontSize: 11, color: '#fff', marginTop: 4 }}>{item.label}</Text>
            </TouchableOpacity>
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

      {/* Level Info Modal */}
      <Modal 
        visible={showLevelModal} 
        transparent 
        animationType="slide" 
        onRequestClose={() => setShowLevelModal(false)}
      >
        <View style={s.overlay}>
          <TouchableOpacity 
            style={[StyleSheet.absoluteFill, { backgroundColor: c.overlay }]} 
            activeOpacity={1} 
            onPress={() => setShowLevelModal(false)} 
          />
          <View style={[s.modalBox, { padding: 0, overflow: 'hidden' }]}>
            {/* Gradient Header Mockup */}
            <View style={[s.gradientGreen, { padding: 24, alignItems: 'center' }]}>
              <Text style={{ fontSize: 50, marginBottom: 10 }}>🏆</Text>
              <Text style={[s.modalTitle, { color: '#fff', marginBottom: 0 }]}>Level {currentLevel} Scholar</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' }}>
                {points} / {pointsForNext} pts to Level {nextLevel}
              </Text>
            </View>

            <View style={{ padding: 24 }}>
              <View style={[s.progressTrack, { height: 12, borderRadius: 6, backgroundColor: c.border }]}>
                <View style={[s.progressBar, { width: `${progressPct}%`, height: 12, borderRadius: 6, backgroundColor: GREEN }]} />
              </View>
              
              <Text style={[s.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Upcoming Perks (Level {nextLevel})</Text>
              
              <View style={{ gap: 12 }}>
                {[
                  { icon: '💎', title: '1.2x Point Multiplier', desc: 'Earn points faster on every ride' },
                  { icon: '🌟', title: 'Early Access', desc: 'Redeem exclusive local rewards 24h early' },
                  { icon: '🎫', title: 'Free Monthly Pass', desc: 'Enter draw for monthly transit passes' }
                ].map((perk, i) => (
                  <View key={i} style={[s.row, { backgroundColor: c.inputBg, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: c.border }]}>
                    <Text style={{ fontSize: 24, marginRight: 12 }}>{perk.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '700', color: c.text, fontSize: 14 }}>{perk.title}</Text>
                      <Text style={[s.mutedSm, { marginTop: 2 }]}>{perk.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <TouchableOpacity 
                style={[s.btnGreen, { marginTop: 30 }]} 
                onPress={() => setShowLevelModal(false)}
              >
                <Text style={s.btnText}>Keep Riding!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Leaderboard Info Modal */}
      <Modal 
        visible={showLeaderboardModal} 
        transparent 
        animationType="slide" 
        onRequestClose={() => setShowLeaderboardModal(false)}
      >
        <View style={s.overlay}>
          <TouchableOpacity 
            style={[StyleSheet.absoluteFill, { backgroundColor: c.overlay }]} 
            activeOpacity={1} 
            onPress={() => setShowLeaderboardModal(false)} 
          />
          <View style={[s.modalBox, { padding: 0, overflow: 'hidden' }]}>
            {/* Deep Green Premium Header */}
            <View style={{ backgroundColor: '#064e3b', padding: 24, alignItems: 'center' }}>
              <View style={{ backgroundColor: '#065f46', width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 40 }}>📈</Text>
              </View>
              <Text style={[s.modalTitle, { color: '#fff', marginBottom: 4 }]}>Community Legend</Text>
              <View style={{ backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 }}>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>SILVER TIER</Text>
              </View>
            </View>

            <View style={{ padding: 24 }}>
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: c.text, textAlign: 'center' }}>
                  "You're in the top 15% of all AccessRide users!"
                </Text>
                <Text style={[s.mutedSm, { marginTop: 8, textAlign: 'center' }]}>
                  Your contributions are making transit better for everyone.
                </Text>
              </View>

              <View style={s.divider} />

              <View style={{ marginVertical: 20, gap: 16 }}>
                {[
                  { label: 'Riders Helped', value: '1,248', icon: '🤲' },
                  { label: 'Verified Reports', value: '42', icon: '✅' },
                  { label: 'Community Karma', value: '850', icon: '✨' }
                ].map((stat, i) => (
                  <View key={stat.label} style={[s.rowBetween, { backgroundColor: c.inputBg, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: c.border }]}>
                    <View style={s.row}>
                      <Text style={{ fontSize: 20, marginRight: 12 }}>{stat.icon}</Text>
                      <Text style={{ fontWeight: '600', color: c.text }}>{stat.label}</Text>
                    </View>
                    <Text style={{ fontWeight: '800', color: GREEN, fontSize: 16 }}>{stat.value}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity 
                style={[s.btnGreen, { backgroundColor: '#064e3b' }]} 
                onPress={() => setShowLeaderboardModal(false)}
              >
                <Text style={s.btnText}>Awesome!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
});

export default RewardsTab;
