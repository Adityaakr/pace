import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, BorderRadius, Spacing, Shadows } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function RunScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <View style={styles.container}>
      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <LinearGradient
          colors={['#E8ECF0', '#D4DAE0']}
          style={styles.mapPlaceholder}
        >
          {/* Map grid lines to simulate a map */}
          <View style={styles.mapGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={`h-${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 14}%` }]} />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={`v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 14}%` }]} />
            ))}
          </View>

          {/* Center marker */}
          <View style={styles.centerMarker}>
            <View style={styles.markerDot} />
            <View style={styles.markerPulse} />
          </View>

          {/* Map type selector */}
          <View style={styles.mapControls}>
            <TouchableOpacity style={styles.mapButton}>
              <Ionicons name="locate" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapButton}>
              <Ionicons name="layers-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {!isRunning && (
            <View style={styles.mapOverlayText}>
              <Ionicons name="map-outline" size={40} color={Colors.grayMedium} />
              <Text style={styles.mapHint}>Your route will appear here</Text>
            </View>
          )}
        </LinearGradient>
      </View>

      {/* Stats Panel */}
      <SafeAreaView edges={['bottom']} style={styles.statsPanel}>
        {/* Live Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {isRunning ? '2.45' : '0.00'}
            </Text>
            <Text style={styles.statLabel}>km</Text>
          </View>
          <View style={[styles.statItem, styles.statItemCenter]}>
            <Text style={styles.statValueLarge}>
              {isRunning ? '12:34' : '00:00'}
            </Text>
            <Text style={styles.statLabel}>duration</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {isRunning ? "5'07\"" : "--'--\""}
            </Text>
            <Text style={styles.statLabel}>pace /km</Text>
          </View>
        </View>

        {/* Additional stats when running */}
        {isRunning && (
          <View style={styles.extraStatsRow}>
            <View style={styles.extraStat}>
              <Ionicons name="flame" size={16} color={Colors.red} />
              <Text style={styles.extraStatText}>156 cal</Text>
            </View>
            <View style={styles.extraStat}>
              <Ionicons name="heart" size={16} color={Colors.red} />
              <Text style={styles.extraStatText}>142 bpm</Text>
            </View>
            <View style={styles.extraStat}>
              <Ionicons name="trending-up" size={16} color={Colors.accent} />
              <Text style={styles.extraStatText}>+24m elev</Text>
            </View>
          </View>
        )}

        {/* Control Buttons */}
        <View style={styles.controls}>
          {isRunning && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                setIsRunning(false);
                setIsPaused(false);
              }}
            >
              <Ionicons name="stop" size={24} color={Colors.red} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (!isRunning) {
                setIsRunning(true);
              } else {
                setIsPaused(!isPaused);
              }
            }}
          >
            <LinearGradient
              colors={
                isRunning && !isPaused
                  ? [Colors.gold, '#E8B060']
                  : [Colors.accent, '#A8E030']
              }
              style={styles.startButton}
            >
              <Ionicons
                name={
                  !isRunning
                    ? 'play'
                    : isPaused
                    ? 'play'
                    : 'pause'
                }
                size={32}
                color={Colors.primary}
              />
            </LinearGradient>
          </TouchableOpacity>

          {isRunning && (
            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="flag" size={24} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {!isRunning && (
          <Text style={styles.startHint}>Tap to start your run</Text>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    position: 'relative',
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  centerMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12,
    marginTop: -12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    borderWidth: 3,
    borderColor: Colors.primary,
    zIndex: 2,
  },
  markerPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.accent}30`,
  },
  mapControls: {
    position: 'absolute',
    right: Spacing.xl,
    top: 60,
    gap: Spacing.sm,
  },
  mapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  mapOverlayText: {
    position: 'absolute',
    bottom: '25%',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 8,
  },
  mapHint: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.grayMedium,
  },

  // Stats Panel
  statsPanel: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxl,
    ...Shadows.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statItemCenter: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontFamily: Fonts.black,
    fontSize: 28,
    color: Colors.textPrimary,
  },
  statValueLarge: {
    fontFamily: Fonts.black,
    fontSize: 36,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  extraStatsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginBottom: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  extraStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  extraStatText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: Colors.textSecondary,
  },

  // Controls
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  startButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  secondaryButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startHint: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
});
