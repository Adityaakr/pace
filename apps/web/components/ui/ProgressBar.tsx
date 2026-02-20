import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, BorderRadius } from '@/constants/theme';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  progress,
  color = Colors.accent,
  backgroundColor = Colors.border,
  height = 8,
  showLabel = false,
  label,
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor, height, borderRadius: height / 2 }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              width: `${clampedProgress}%`,
              height,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
      {showLabel && (
        <Text style={styles.label}>
          {label || `${Math.round(clampedProgress)}%`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  label: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: Colors.accent,
    minWidth: 36,
    textAlign: 'right',
  },
});
