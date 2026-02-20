import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '@/utils/storage';
import { Colors, Fonts, BorderRadius, Spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { usePrivy } from '@/providers/PrivyProvider';
import { useWalletStore } from '@/stores';

const { width, height } = Dimensions.get('window');
const HAS_SEEN_ONBOARDING_KEY = '@pace_dao:hasSeenOnboarding';
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

const ONBOARDING_PAGES = [
  {
    title: 'Your Pace.\nYour Community.\nYour ',
    highlight: 'DAO.',
    subtitle: 'Join the world\'s first decentralized run club franchise network.',
    icon: 'people-circle' as const,
    gradient: ['#2E3A46', '#192126'] as const,
  },
  {
    title: 'Run Together.\nEarn ',
    highlight: '$PACE.',
    subtitle: 'Track your runs, grow your club, and mine tokens through community building.',
    icon: 'flash' as const,
    gradient: ['#3A4A2E', '#192126'] as const,
  },
  {
    title: 'Own The\nBrand. Shape\nThe ',
    highlight: 'Future.',
    subtitle: 'Govern the global treasury, vote on franchises, and access VIP marathons worldwide.',
    icon: 'trophy' as const,
    gradient: ['#463A2E', '#192126'] as const,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const { authenticated, ready } = usePrivy();
  const isConnected = useWalletStore((state) => state.isConnected);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const iconScaleAnim = useRef(new Animated.Value(0)).current;
  
  const page = ONBOARDING_PAGES[currentPage];

  // Animate in on mount and page change
  useEffect(() => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    iconScaleAnim.setValue(0);
    
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(iconScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentPage]);

  const handleNext = async () => {
    if (currentPage < ONBOARDING_PAGES.length - 1) {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentPage(currentPage + 1);
      });
    } else {
      // Last page - initiate login
      await handleLogin();
    }
  };

  const handleSkip = () => {
    if (currentPage < ONBOARDING_PAGES.length - 1) {
      setCurrentPage(ONBOARDING_PAGES.length - 1);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      console.log('🔐 Navigating to login screen...');
      
      // Mark onboarding as seen
      await storage.setItem(HAS_SEEN_ONBOARDING_KEY, 'true');

      // Navigate to dedicated login screen
      router.push('/login');
      setIsLoggingIn(false);
    } catch (error) {
      console.error('❌ Navigation error:', error);
      setIsLoggingIn(false);
    }
  };

  // Navigate to app when authenticated
  useEffect(() => {
    if (authenticated && isConnected && ready) {
      console.log('✅ Onboarding: User authenticated, navigating to tabs');
      // Small delay to ensure smooth transition
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 300);
    }
  }, [authenticated, isConnected, ready]);

  const isLastPage = currentPage === ONBOARDING_PAGES.length - 1;

  // Swipe gesture handler
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50 && currentPage < ONBOARDING_PAGES.length - 1) {
          handleNext();
        } else if (gestureState.dx > 50 && currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Skip button */}
      {!isLastPage && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Hero area with animated icon */}
      <View style={styles.imageContainer}>
        <LinearGradient
          colors={page.gradient}
          style={styles.imagePlaceholder}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [
                  { scale: iconScaleAnim },
                ],
              },
            ]}
          >
            <View style={styles.iconCircle}>
              <Ionicons name={page.icon} size={80} color={Colors.accent} />
            </View>
            <Text style={styles.brandMark}>PACE</Text>
          </Animated.View>
        </LinearGradient>
      </View>

      {/* Content area */}
      <SafeAreaView edges={['bottom']} style={styles.content}>
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>
            {page.title}
            <Text style={styles.titleHighlight}>{page.highlight}</Text>
          </Text>
          <Text style={styles.subtitle}>{page.subtitle}</Text>
        </Animated.View>

        {/* Page indicators */}
        <View style={styles.indicators}>
          {ONBOARDING_PAGES.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                index === currentPage && styles.dotActive,
                index === currentPage && {
                  transform: [
                    {
                      scale: scaleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>

        {/* CTA Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={isLoggingIn ? 'Connecting...' : isLastPage ? 'Connect & Start' : 'Next'}
            onPress={handleNext}
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoggingIn || !ready}
          />
          
          {!isLastPage && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <Ionicons 
                name="arrow-back" 
                size={20} 
                color={currentPage === 0 ? Colors.grayLight : Colors.textSecondary} 
              />
              <Text style={[styles.backText, currentPage === 0 && styles.backTextDisabled]}>
                Back
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.white,
  },
  imageContainer: {
    height: height * 0.5,
    width: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    gap: 24,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(187, 242, 70, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(187, 242, 70, 0.3)',
  },
  brandMark: {
    fontFamily: Fonts.black,
    fontSize: 48,
    color: Colors.accent,
    letterSpacing: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    justifyContent: 'space-between',
    paddingTop: Spacing.xxxl,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: Fonts.black,
    fontSize: 32,
    lineHeight: 40,
    color: Colors.textPrimary,
  },
  titleHighlight: {
    fontFamily: Fonts.black,
    fontSize: 32,
    lineHeight: 40,
    color: Colors.textPrimary,
    backgroundColor: Colors.accent,
    paddingHorizontal: 4,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 32,
    backgroundColor: Colors.accent,
  },
  buttonContainer: {
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  backText: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  backTextDisabled: {
    color: Colors.grayLight,
  },
});
