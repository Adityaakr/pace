import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, BorderRadius, Spacing } from '@/constants/theme';
import { useWalletStore, useUserStore } from '@/stores';
import { usePrivy } from '@/providers/PrivyProvider';

const { width } = Dimensions.get('window');
const PADDING = 20;
const BADGE_SIZE = (width - PADDING * 2 - 12 * 3) / 4;

// Achievement badges: all use Ionicons vector icons with colored containers
const BADGES_DATA: {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  bg: string;
  earned: boolean;
}[] = [
  { name: 'First 5K', icon: 'medal-outline', iconColor: '#D4880F', bg: '#FFF3D9', earned: true },
  { name: 'Marathon', icon: 'trophy-outline', iconColor: '#D4880F', bg: '#FFF3D9', earned: true },
  { name: 'Club Founder', icon: 'business-outline', iconColor: '#7B5FC7', bg: '#EDE5FF', earned: true },
  { name: '100 Votes', icon: 'checkmark-done-outline', iconColor: '#5BA3C0', bg: '#DFF0F8', earned: false },
  { name: 'Early Adopter', icon: 'star-outline', iconColor: '#D4880F', bg: '#FFF3D9', earned: true },
  { name: 'Ultra Runner', icon: 'fitness-outline', iconColor: '#C43C3C', bg: '#FFE5E5', earned: false },
  { name: 'VIP Access', icon: 'diamond-outline', iconColor: '#7B5FC7', bg: '#EDE5FF', earned: false },
  { name: '1000km', icon: 'globe-outline', iconColor: '#5BA3C0', bg: '#DFF0F8', earned: false },
];

const MENU_ITEMS: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
}[] = [];

export default function ProfileScreen() {
  const address = useWalletStore((state) => state.address);
  const user = useUserStore((state) => state.user);
  const { logout } = usePrivy();

  const formatAddress = (addr: string | null) => {
    if (!addr) return '0x0000...0000';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity>
            <Ionicons name="create-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Avatar + Info Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={[Colors.primary, '#2A3540']}
            style={styles.profileGradient}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>R</Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>Lv.16</Text>
              </View>
            </View>

            <Text style={styles.profileName}>{user?.display_name || 'Runner'}</Text>
            <Text style={styles.profileHandle}>@runner · {user?.club_id ? 'Tokyo Pacers' : 'No Club'}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user?.total_runs || 0}</Text>
                <Text style={styles.statLabel}>Runs</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user?.total_distance.toFixed(0) || 0} km</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={styles.streakRow}>
                  <Text style={styles.statValue}>{user?.streak || 0}</Text>
                  <Ionicons name="flame" size={16} color={Colors.accent} />
                </View>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* XP Progress */}
        <View style={styles.xpCard}>
          <View style={styles.xpHeader}>
            <View>
              <Text style={styles.xpTitle}>Pacer</Text>
              <Text style={styles.xpSubtitle}>Level {user?.level || 1} · {user?.xp || 0} XP</Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpBadgeText}>Strider</Text>
            </View>
          </View>
          <View style={styles.xpTrack}>
            <View style={styles.xpFill} />
          </View>
          <Text style={styles.xpDetail}>1,250 / 2,500 XP</Text>
        </View>

        {/* $PACE Holdings */}
        <View style={styles.holdingsCard}>
          <View style={styles.holdingsHeader}>
            <Text style={styles.holdingsTitle}>$PACE Holdings</Text>
            <TouchableOpacity>
              <Text style={styles.holdingsAction}>Manage</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.holdingsRow}>
            <View style={styles.holdingsItem}>
              <Text style={styles.holdingsValue}>{user?.pace_balance.toFixed(0) || 0}</Text>
              <Text style={styles.holdingsLabel}>Available</Text>
            </View>
            <View style={styles.holdingsItem}>
              <Text style={styles.holdingsValue}>0</Text>
              <Text style={styles.holdingsLabel}>Staked</Text>
            </View>
            <View style={styles.holdingsItem}>
              <Text style={[styles.holdingsValue, { color: Colors.accent }]}>+0</Text>
              <Text style={styles.holdingsLabel}>Earned (30d)</Text>
            </View>
          </View>
        </View>

        {/* ===== Achievements - professional icon badges ===== */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <Text style={styles.badgesCount}>
              {BADGES_DATA.filter((b) => b.earned).length}/{BADGES_DATA.length}
            </Text>
          </View>
          <View style={styles.badgesGrid}>
            {BADGES_DATA.map((badge, index) => (
              <View
                key={index}
                style={[styles.badgeItem, !badge.earned && styles.badgeItemLocked]}
              >
                {/* Colored circle container with Ionicons vector icon */}
                <View
                  style={[
                    styles.badgeIconCircle,
                    {
                      backgroundColor: badge.earned ? badge.bg : '#F0F0F0',
                    },
                  ]}
                >
                  <Ionicons
                    name={badge.icon}
                    size={24}
                    color={badge.earned ? badge.iconColor : '#B0B0B0'}
                  />
                </View>
                <Text
                  style={[styles.badgeName, !badge.earned && styles.badgeNameLocked]}
                  numberOfLines={1}
                >
                  {badge.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ===== Menu Items ===== */}
        <View style={styles.section}>
          <View style={styles.menuCard}>
            {/* Wallet Address */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBorder]}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="wallet-outline" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.menuItemLabel}>Wallet</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Text style={styles.menuItemValue}>{formatAddress(address)}</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.grayMedium} />
              </View>
            </TouchableOpacity>

            {/* My Club */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBorder]}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="people-outline" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.menuItemLabel}>My Club</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Text style={styles.menuItemValue}>{user?.club_id ? 'Tokyo Pacers' : 'None'}</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.grayMedium} />
              </View>
            </TouchableOpacity>

            {/* Settings */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemBorder]}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="settings-outline" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.menuItemLabel}>Settings</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Ionicons name="chevron-forward" size={18} color={Colors.grayMedium} />
              </View>
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={handleLogout}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="log-out-outline" size={20} color={Colors.red} />
                </View>
                <Text style={[styles.menuItemLabel, { color: Colors.red }]}>Disconnect Wallet</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F6FA' },
  scrollContent: { paddingBottom: 100 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: PADDING, paddingTop: 12, paddingBottom: 16,
  },
  headerTitle: { fontFamily: Fonts.bold, fontSize: 28, color: Colors.textPrimary },

  section: { marginTop: 24, paddingHorizontal: PADDING },
  sectionHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  sectionTitle: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.textPrimary },

  // Profile Card
  profileCard: { marginHorizontal: PADDING, borderRadius: 20, overflow: 'hidden' },
  profileGradient: { padding: 24, alignItems: 'center' },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: { fontFamily: Fonts.bold, fontSize: 32, color: Colors.primary },
  levelBadge: {
    position: 'absolute', bottom: -4, right: -4, backgroundColor: Colors.accent,
    borderRadius: 50, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 2, borderColor: Colors.primary,
  },
  levelBadgeText: { fontFamily: Fonts.bold, fontSize: 10, color: Colors.primary },
  profileName: { fontFamily: Fonts.bold, fontSize: 22, color: Colors.white },
  profileHandle: { fontFamily: Fonts.regular, fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  statsRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, width: '100%',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },
  statValue: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.white },
  statLabel: { fontFamily: Fonts.regular, fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },

  // XP Card
  xpCard: {
    marginHorizontal: PADDING, marginTop: 16, backgroundColor: Colors.white,
    borderRadius: 16, padding: 16, gap: 8,
  },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpTitle: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.textPrimary },
  xpSubtitle: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.textSecondary },
  xpBadge: {
    backgroundColor: `${Colors.accent}30`, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  xpBadgeText: { fontFamily: Fonts.bold, fontSize: 12, color: Colors.primary },
  xpTrack: { height: 10, backgroundColor: Colors.border, borderRadius: 5, overflow: 'hidden' },
  xpFill: { height: 10, width: '50%', backgroundColor: Colors.accent, borderRadius: 5 },
  xpDetail: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.textSecondary, textAlign: 'right' },

  // Holdings Card
  holdingsCard: {
    marginHorizontal: PADDING, marginTop: 12, backgroundColor: Colors.white,
    borderRadius: 16, padding: 16,
  },
  holdingsHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  holdingsTitle: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.textPrimary },
  holdingsAction: { fontFamily: Fonts.bold, fontSize: 13, color: Colors.accent },
  holdingsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  holdingsItem: { alignItems: 'center' },
  holdingsValue: { fontFamily: Fonts.bold, fontSize: 20, color: Colors.textPrimary },
  holdingsLabel: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.textSecondary, marginTop: 2 },

  // ===== Badges - Professional icon grid =====
  badgesCount: { fontFamily: Fonts.bold, fontSize: 14, color: Colors.textSecondary },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badgeItem: {
    width: BADGE_SIZE, alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 4,
  },
  badgeItemLocked: { opacity: 0.4 },
  badgeIconCircle: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  badgeName: { fontFamily: Fonts.bold, fontSize: 10, color: Colors.textPrimary, textAlign: 'center' },
  badgeNameLocked: { color: Colors.textSecondary },

  // ===== Menu =====
  menuCard: { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 16, paddingHorizontal: 16,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F2F3F4' },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconContainer: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#F2F3F4',
    alignItems: 'center', justifyContent: 'center',
  },
  menuItemLabel: { fontFamily: Fonts.bold, fontSize: 15, color: Colors.textPrimary },
  menuItemRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  menuItemValue: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.textSecondary },
});
