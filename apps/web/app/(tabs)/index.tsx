import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, BorderRadius, Spacing } from '@/constants/theme';
import { usePrivy } from '@/providers/PrivyProvider';
import { useWalletStore } from '@/stores';

const { width } = Dimensions.get('window');
const PADDING = 20;

export default function HomeScreen() {
  const router = useRouter();
  const { authenticated } = usePrivy();
  const isConnected = useWalletStore((state) => state.isConnected);

  const handleLoginPress = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ===== Greeting Header ===== */}
        <View style={styles.header}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.greeting}>Good Morning</Text>
              <Ionicons name="flame" size={14} color={Colors.gold} />
            </View>
            <Text style={styles.userName}>Runner</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.loginBtn} 
              onPress={handleLoginPress}
              activeOpacity={0.8}
            >
              <Text style={styles.loginBtnText}>Login</Text>
              <Ionicons name="log-in-outline" size={18} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== Search Bar (inline, matching Figma: 350x48 rounded) ===== */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={Colors.grayMedium} />
          <Text style={styles.searchPlaceholder}>Search clubs, challenges...</Text>
        </View>

        {/* ===== Your $PACE Balance ===== */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Your $PACE</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Full-width balance card - matching Figma's 350x174 hero card */}
          <TouchableOpacity activeOpacity={0.9} style={styles.cardPadding}>
            <LinearGradient
              colors={[Colors.primary, '#2A3540']}
              style={styles.balanceCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.balanceIconContainer}>
                <Text style={styles.balanceIcon}>◆</Text>
              </View>

              <Text style={styles.balanceAmount}>12,450</Text>
              <Text style={styles.balanceLabel}>$PACE Balance</Text>

              <View style={styles.balanceFooter}>
                <Ionicons name="trending-up" size={14} color={Colors.accent} />
                <Text style={styles.balanceChange}>+5.2% this week</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ===== Today's Plan ===== */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Today's Plan</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.planList}>
            {/* Plan Card 1: Weekly 50K Challenge */}
            <TouchableOpacity activeOpacity={0.9} style={styles.planCard}>
              <LinearGradient
                colors={[Colors.accent, '#A8E030']}
                style={styles.planImage}
              >
                <Ionicons name="trophy" size={32} color={Colors.primary} />
              </LinearGradient>
              <View style={styles.planContent}>
                <View style={styles.planTopRow}>
                  <Text style={styles.planTitle} numberOfLines={1}>Weekly 50K Challenge</Text>
                  <View style={[styles.planBadge, { backgroundColor: `${Colors.accent}25` }]}>
                    <Text style={[styles.planBadgeText, { color: Colors.primary }]}>ACTIVE</Text>
                  </View>
                </View>
                <Text style={styles.planSubtitle}>Run 50km this week with your club</Text>
                <View style={styles.planProgressRow}>
                  <View style={styles.planProgressTrack}>
                    <View style={[styles.planProgressFill, { width: '45%', backgroundColor: Colors.accent }]} />
                  </View>
                  <Text style={[styles.planProgressLabel, { color: Colors.accent }]}>22.5 km</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Plan Card 2: 7-Day Run Streak */}
            <TouchableOpacity activeOpacity={0.9} style={styles.planCard}>
              <LinearGradient
                colors={[Colors.gold, '#E8B060']}
                style={styles.planImage}
              >
                <Ionicons name="flame" size={32} color={Colors.white} />
              </LinearGradient>
              <View style={styles.planContent}>
                <View style={styles.planTopRow}>
                  <Text style={styles.planTitle} numberOfLines={1}>7-Day Run Streak</Text>
                  <View style={[styles.planBadge, { backgroundColor: `${Colors.gold}25` }]}>
                    <Text style={[styles.planBadgeText, { color: Colors.gold }]}>DAY 5</Text>
                  </View>
                </View>
                <Text style={styles.planSubtitle}>Keep your streak alive!</Text>
                <View style={styles.planProgressRow}>
                  <View style={styles.planProgressTrack}>
                    <View style={[styles.planProgressFill, { width: '71%', backgroundColor: Colors.gold }]} />
                  </View>
                  <Text style={[styles.planProgressLabel, { color: Colors.gold }]}>5/7 days</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Plan Card 3: Grow Your Club */}
            <TouchableOpacity activeOpacity={0.9} style={styles.planCard}>
              <LinearGradient
                colors={[Colors.lightBlue, '#7AB8D4']}
                style={styles.planImage}
              >
                <Ionicons name="people" size={32} color={Colors.white} />
              </LinearGradient>
              <View style={styles.planContent}>
                <View style={styles.planTopRow}>
                  <Text style={styles.planTitle} numberOfLines={1}>Grow Your Club</Text>
                  <View style={[styles.planBadge, { backgroundColor: `${Colors.lightBlue}25` }]}>
                    <Text style={[styles.planBadgeText, { color: Colors.lightBlue }]}>VIBE MINING</Text>
                  </View>
                </View>
                <Text style={styles.planSubtitle}>Invite 5 more runners to earn $PACE</Text>
                <View style={styles.planProgressRow}>
                  <View style={styles.planProgressTrack}>
                    <View style={[styles.planProgressFill, { width: '60%', backgroundColor: Colors.lightBlue }]} />
                  </View>
                  <Text style={[styles.planProgressLabel, { color: Colors.lightBlue }]}>3/5 invited</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== This Week Stats ===== */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>This Week</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsScroll}
          >
            <View style={styles.statCard}>
              <Ionicons name="footsteps" size={20} color={Colors.accent} />
              <Text style={styles.statValue}>32.5 km</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="flame" size={20} color={Colors.red} />
              <Text style={styles.statValue}>2,450</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={20} color={Colors.purple} />
              <Text style={styles.statValue}>4h 12m</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="speedometer" size={20} color={Colors.gold} />
              <Text style={styles.statValue}>5:32</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={{ fontSize: 16, color: Colors.accent }}>◆</Text>
              <Text style={styles.statValue}>+124</Text>
            </View>
          </ScrollView>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6FA',
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // ===== Header =====
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greeting: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  userName: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: Colors.textPrimary,
    lineHeight: 29,
    marginTop: 2,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  loginBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.primary,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.red,
  },

  // ===== Search - matches Figma: 350x48, #F2F3F4 bg, rounded =====
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: 16,
    height: 48,
    gap: 10,
    marginHorizontal: PADDING,
  },
  searchPlaceholder: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.grayMedium,
  },

  // ===== Sections =====
  section: {
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  sectionAction: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.accent,
  },

  // ===== Balance Card - Full width, matching Figma Popular Workout style =====
  cardPadding: {
    paddingHorizontal: PADDING,
  },
  balanceCard: {
    borderRadius: 20,
    padding: 20,
    height: 174,
    justifyContent: 'space-between',
  },
  balanceIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(187,242,70,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceIcon: {
    fontSize: 18,
    color: Colors.accent,
  },
  balanceAmount: {
    fontFamily: Fonts.bold,
    fontSize: 40,
    color: Colors.white,
    lineHeight: 48,
  },
  balanceLabel: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: -4,
  },
  balanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceChange: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.accent,
  },

  // ===== Plan Cards - Figma: 350x120, with 100x100 image =====
  planList: {
    paddingHorizontal: PADDING,
    gap: 12,
  },
  planCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 10,
    gap: 12,
    height: 120,
  },
  planImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  planTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  planTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 24,
    flex: 1,
  },
  planBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  planBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  planSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  planProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  planProgressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  planProgressFill: {
    height: 8,
    borderRadius: 4,
  },
  planProgressLabel: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    minWidth: 50,
    textAlign: 'right',
  },

  // ===== This Week Stats - compact row =====
  statsScroll: {
    paddingHorizontal: PADDING,
    gap: 10,
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
    minWidth: 90,
  },
  statValue: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.textPrimary,
  },
});
