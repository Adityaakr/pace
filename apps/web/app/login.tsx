// Simple login screen for web and fallback
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { storage } from '@/utils/storage';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { useWalletStore, useUserStore } from '@/stores';
import { userService } from '@/services';

const HAS_SEEN_ONBOARDING_KEY = '@pace_dao:hasSeenOnboarding';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const setAddress = useWalletStore((state) => state.setAddress);
  const setConnected = useWalletStore((state) => state.setConnected);
  const setUser = useUserStore((state) => state.setUser);
  const setUserLoading = useUserStore((state) => state.setLoading);

  const handleEmailLogin = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      console.log('📧 Logging in with email:', email);

      // Create a deterministic wallet address from email
      const mockAddress = '0x' + Buffer.from(email).toString('hex').slice(0, 40).padEnd(40, '0');
      
      // Update wallet store
      setAddress(mockAddress);
      setConnected(true);

      // Create user in Supabase
      setUserLoading(true);
      const user = await userService.getOrCreateUser(mockAddress, email);
      setUser(user);
      setUserLoading(false);

      // Mark onboarding as complete
      await storage.setItem(HAS_SEEN_ONBOARDING_KEY, 'true');

      console.log('✅ Login successful, navigating to app...');
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('❌ Login error:', error);
      alert('Login failed. Please try again.');
      setLoading(false);
      setUserLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Brand Section */}
        <View style={styles.brandSection}>
          <LinearGradient
            colors={['#2E3A46', '#192126']}
            style={styles.iconCircle}
          >
            <Ionicons name="flash" size={48} color={Colors.accent} />
          </LinearGradient>
          <Text style={styles.brandText}>PACE DAO</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            {Platform.OS === 'web' 
              ? 'Enter your email to test the app (Web version)'
              : 'Sign in with your email to continue'
            }
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={Colors.grayMedium} />
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={Colors.grayMedium}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleEmailLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.textPrimary} />
            ) : (
              <>
                <Text style={styles.buttonText}>Continue with Email</Text>
                <Ionicons name="arrow-forward" size={20} color={Colors.textPrimary} />
              </>
            )}
          </TouchableOpacity>

          {Platform.OS !== 'web' && (
            <>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.walletButton} disabled>
                <Ionicons name="wallet-outline" size={20} color={Colors.textSecondary} />
                <Text style={styles.walletButtonText}>Connect Wallet (Coming Soon)</Text>
              </TouchableOpacity>
            </>
          )}

          {Platform.OS === 'web' && (
            <Text style={styles.webNote}>
              💡 For full wallet features (MetaMask, WalletConnect), use the native app on iOS/Android
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
  },
  header: {
    paddingVertical: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  brandText: {
    fontFamily: Fonts.black,
    fontSize: 32,
    color: Colors.textPrimary,
    letterSpacing: 6,
  },
  form: {
    flex: 1,
  },
  title: {
    fontFamily: Fonts.black,
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxxl,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grayLight,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: Spacing.md,
    paddingLeft: Spacing.sm,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.md,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    opacity: 0.5,
  },
  walletButtonText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  webNote: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
    lineHeight: 18,
  },
});
