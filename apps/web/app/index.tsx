// Root index - Auth gate that redirects to onboarding or tabs
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View, Text, Platform } from 'react-native';
import { storage } from '@/utils/storage';
import { usePrivy } from '@/providers/PrivyProvider';
import { useWalletStore } from '@/stores';

const HAS_SEEN_ONBOARDING_KEY = '@pace_dao:hasSeenOnboarding';

export default function Index() {
  const router = useRouter();
  const { authenticated, ready } = usePrivy();
  const isConnected = useWalletStore((state) => state.isConnected);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkAndNavigate = async () => {
      // Wait for Privy to be ready
      if (!ready) return;
      
      // Prevent multiple navigations
      if (hasNavigated) return;

            try {
              // Check if user has seen onboarding (only on mobile)
              const hasSeenOnboarding = await storage.getItem(HAS_SEEN_ONBOARDING_KEY);

              console.log('📱 Platform:', Platform.OS);
              console.log('👤 Authenticated:', authenticated);
              console.log('🔗 Connected:', isConnected);
              console.log('👀 Has seen onboarding:', hasSeenOnboarding);

              // If user is authenticated and connected, go to main app
              if (authenticated && isConnected) {
                console.log('✅ User authenticated, navigating to tabs');
                await storage.setItem(HAS_SEEN_ONBOARDING_KEY, 'true');
                router.replace('/(tabs)');
              }
              // If on mobile and hasn't seen onboarding, show it
              else if ((Platform.OS === 'ios' || Platform.OS === 'android') && !hasSeenOnboarding) {
                console.log('👋 First time user on mobile, showing onboarding');
                router.replace('/onboarding');
              }
              // Otherwise show onboarding
              else {
                console.log('👋 Showing onboarding');
                router.replace('/onboarding');
              }

              setHasNavigated(true);
            } catch (error) {
              console.error('Navigation error:', error);
              // Fallback to onboarding
              router.replace('/onboarding');
              setHasNavigated(true);
            } finally {
              setIsCheckingOnboarding(false);
            }
    };

    checkAndNavigate();
  }, [authenticated, isConnected, ready, hasNavigated]);

  // Show loading splash
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#192126' }}>
      <ActivityIndicator size="large" color="#BBF246" />
      <Text style={{ color: '#BBF246', marginTop: 16, fontSize: 16, fontWeight: '700' }}>
        PACE DAO
      </Text>
      <Text style={{ color: '#666', marginTop: 8, fontSize: 12 }}>
        Loading...
      </Text>
    </View>
  );
}
