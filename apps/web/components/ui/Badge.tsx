import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Fonts, BorderRadius, Spacing } from '@/constants/theme';

interface BadgeProps {
  text: string;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
  size?: 'sm' | 'md';
}

export function Badge({
  text,
  color = Colors.accent,
  textColor = Colors.primary,
  style,
  size = 'sm',
}: BadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color },
        size === 'md' && styles.badgeMd,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: textColor },
          size === 'md' && styles.textMd,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  text: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textMd: {
    fontSize: 12,
  },
});
