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
import { Colors, Fonts, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Badge } from '@/components/ui/Badge';

const { width } = Dimensions.get('window');

const CLUBS = [
  { name: 'Tokyo Pacers', members: 142, city: 'Tokyo', color: Colors.red },
  { name: 'London Striders', members: 89, city: 'London', color: Colors.lightBlue },
  { name: 'NYC Runners', members: 235, city: 'New York', color: Colors.purple },
  { name: 'Berlin Speed', members: 67, city: 'Berlin', color: Colors.gold },
];

const CHALLENGES = [
  {
    name: 'Marathon\nPrep',
    icon: 'trophy' as const,
    gradient: [Colors.accent, '#A8E030'] as const,
    iconColor: Colors.primary,
  },
  {
    name: 'Club vs\nClub',
    icon: 'people' as const,
    gradient: [Colors.primary, '#2A3540'] as const,
    iconColor: Colors.accent,
  },
  {
    name: 'Speed\nChallenge',
    icon: 'flash' as const,
    gradient: [Colors.gold, '#E8B060'] as const,
    iconColor: Colors.white,
  },
  {
    name: 'Endurance\nTest',
    icon: 'heart' as const,
    gradient: [Colors.red, '#D63A3A'] as const,
    iconColor: Colors.white,
  },
];

const FRANCHISES = [
  { city: 'Tokyo', country: 'Japan', runners: '2.4K', status: 'Active' },
  { city: 'London', country: 'UK', runners: '1.8K', status: 'Active' },
  { city: 'Dubai', country: 'UAE', runners: '890', status: 'New' },
  { city: 'Sydney', country: 'Australia', runners: '1.2K', status: 'Active' },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore</Text>
        </View>

        {/* Featured Banner */}
        <TouchableOpacity activeOpacity={0.9} style={styles.bannerContainer}>
          <LinearGradient
            colors={[Colors.primary, '#2A3540']}
            style={styles.banner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.bannerContent}>
              <Badge text="Featured" color={Colors.accent} textColor={Colors.primary} size="md" />
              <Text style={styles.bannerTitle}>Global Marathon{'\n'}Season 2026</Text>
              <View style={styles.bannerAction}>
                <Text style={styles.bannerActionText}>See more</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.accent} />
              </View>
            </View>
            <View style={styles.bannerGraphic}>
              <Text style={styles.bannerEmoji}>🏃‍♂️🏃‍♀️</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Nearby Clubs Grid */}
        <View style={styles.sectionSpacing}>
          <SectionHeader title="Nearby Clubs" actionText="View All" />
          <View style={styles.clubGrid}>
            {CLUBS.map((club, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                style={styles.clubCard}
              >
                <View style={[styles.clubAvatar, { backgroundColor: `${club.color}20` }]}>
                  <Ionicons name="people" size={22} color={club.color} />
                </View>
                <Text style={styles.clubName}>{club.name}</Text>
                <Text style={styles.clubMeta}>
                  {club.members} runners · {club.city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Challenges */}
        <View style={styles.sectionSpacing}>
          <SectionHeader title="Challenges" actionText="See All" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {CHALLENGES.map((challenge, index) => (
              <TouchableOpacity key={index} activeOpacity={0.8}>
                <LinearGradient
                  colors={[...challenge.gradient]}
                  style={styles.challengeCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons
                    name={challenge.icon}
                    size={32}
                    color={challenge.iconColor}
                    style={styles.challengeIcon}
                  />
                  <Text
                    style={[
                      styles.challengeName,
                      {
                        color:
                          challenge.iconColor === Colors.primary
                            ? Colors.primary
                            : Colors.white,
                      },
                    ]}
                  >
                    {challenge.name}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Browse Franchises */}
        <View style={styles.sectionSpacing}>
          <SectionHeader title="Franchise Map" actionText="Open Map" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {FRANCHISES.map((franchise, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                style={styles.franchiseCard}
              >
                <View style={styles.franchiseHeader}>
                  <Ionicons name="location" size={18} color={Colors.accent} />
                  <Badge
                    text={franchise.status}
                    color={
                      franchise.status === 'New'
                        ? `${Colors.gold}30`
                        : `${Colors.accent}30`
                    }
                    textColor={
                      franchise.status === 'New' ? Colors.gold : Colors.primary
                    }
                  />
                </View>
                <Text style={styles.franchiseCity}>{franchise.city}</Text>
                <Text style={styles.franchiseCountry}>{franchise.country}</Text>
                <View style={styles.franchiseFooter}>
                  <Ionicons name="people-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.franchiseRunners}>{franchise.runners} runners</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontFamily: Fonts.black,
    fontSize: 28,
    color: Colors.textPrimary,
  },
  sectionSpacing: {
    marginTop: Spacing.xxl,
  },
  horizontalScroll: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },

  // Banner
  bannerContainer: {
    paddingHorizontal: Spacing.xl,
  },
  banner: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    flexDirection: 'row',
    minHeight: 160,
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bannerTitle: {
    fontFamily: Fonts.black,
    fontSize: 22,
    color: Colors.white,
    lineHeight: 28,
  },
  bannerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bannerActionText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.accent,
  },
  bannerGraphic: {
    justifyContent: 'center',
    paddingLeft: Spacing.md,
  },
  bannerEmoji: {
    fontSize: 48,
  },

  // Clubs Grid
  clubGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  clubCard: {
    width: (width - Spacing.xl * 2 - Spacing.md) / 2,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  clubAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  clubName: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  clubMeta: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // Challenges
  challengeCard: {
    width: 130,
    height: 140,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  challengeIcon: {
    alignSelf: 'flex-end',
  },
  challengeName: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    lineHeight: 18,
  },

  // Franchises
  franchiseCard: {
    width: 160,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
    gap: 4,
  },
  franchiseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  franchiseCity: {
    fontFamily: Fonts.black,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  franchiseCountry: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  franchiseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  franchiseRunners: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
