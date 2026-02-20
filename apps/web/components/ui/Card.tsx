import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Shadows, Spacing } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'dark' | 'accent' | 'colored';
  backgroundColor?: string;
  padding?: number;
}

export function Card({
  children,
  style,
  variant = 'default',
  backgroundColor,
  padding = Spacing.lg,
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        backgroundColor ? { backgroundColor } : undefined,
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  default: {
    backgroundColor: Colors.cardBackground,
  },
  dark: {
    backgroundColor: Colors.primary,
  },
  accent: {
    backgroundColor: Colors.accent,
  },
  colored: {
    backgroundColor: Colors.cardBackground,
  },
});
