import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Fonts, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  backgroundColor?: string;
  size?: 'small' | 'large';
  style?: ViewStyle;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconColor = Colors.accent,
  backgroundColor = Colors.cardBackground,
  size = 'small',
  style,
}: MetricCardProps) {
  const isLarge = size === 'large';

  return (
    <View style={[styles.card, { backgroundColor }, isLarge && styles.cardLarge, style]}>
      {icon && (
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Ionicons name={icon} size={isLarge ? 24 : 20} color={iconColor} />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, isLarge && styles.valueLarge]}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
    minWidth: 140,
  },
  cardLarge: {
    minWidth: '100%',
    padding: Spacing.xl,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontFamily: Fonts.black,
    fontSize: 22,
    color: Colors.textPrimary,
  },
  valueLarge: {
    fontSize: 28,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
