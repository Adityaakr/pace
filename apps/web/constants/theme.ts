/**
 * PACE DAO Design System
 * Based on Figma: Fitness App Community design
 * Font: Lato | Primary: #192126, #BBF246
 */

export const Colors = {
  // Primary
  primary: '#192126',
  accent: '#BBF246',

  // Secondary
  grayMedium: '#8B8F92',
  grayDark: '#5E6468',
  charcoal: '#384046',
  purple: '#A48AED',
  red: '#ED4747',
  gold: '#FCC46F',
  lightBlue: '#95CCE3',

  // Neutrals
  white: '#FFFFFF',
  background: '#F8F8F8',
  cardBackground: '#FFFFFF',
  border: '#E8E8E8',
  inputBackground: '#F2F3F4',
  black: '#000000',

  // Functional
  success: '#BBF246',
  warning: '#FCC46F',
  error: '#ED4747',
  info: '#95CCE3',

  // Text
  textPrimary: '#192126',
  textSecondary: '#8B8F92',
  textTertiary: '#5E6468',
  textOnDark: '#FFFFFF',
  textOnAccent: '#192126',

  // Tab Bar
  tabBarBackground: '#192126',
  tabBarActive: '#BBF246',
  tabBarInactive: '#8B8F92',
};

export const Fonts = {
  regular: 'Lato_400Regular',
  bold: 'Lato_700Bold',
  black: 'Lato_900Black',
  // Mappings for the Figma naming:
  // ExtraBold -> Lato_900Black
  // Bold -> Lato_700Bold
  // SemiBold -> Lato_700Bold
  // Medium -> Lato_400Regular
  // Regular -> Lato_400Regular
};

export const Typography = {
  // Large headings
  h1: {
    fontFamily: 'Lato_900Black',
    fontSize: 32,
    lineHeight: 40,
    color: Colors.textPrimary,
  },
  h2: {
    fontFamily: 'Lato_900Black',
    fontSize: 24,
    lineHeight: 32,
    color: Colors.textPrimary,
  },
  h3: {
    fontFamily: 'Lato_700Bold',
    fontSize: 20,
    lineHeight: 28,
    color: Colors.textPrimary,
  },
  // Subheadings
  subtitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  // Body text
  body: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  bodySmall: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  // Labels
  label: {
    fontFamily: 'Lato_700Bold',
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textSecondary,
  },
  // Button text
  button: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    lineHeight: 24,
  },
  // Caption
  caption: {
    fontFamily: 'Lato_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textSecondary,
  },
  // Large number display (for stats)
  stat: {
    fontFamily: 'Lato_900Black',
    fontSize: 28,
    lineHeight: 36,
    color: Colors.textPrimary,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 40,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 50,
  round: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;
