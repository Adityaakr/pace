// Privy Provider - Wallet authentication wrapper
import React, { useEffect, useState } from 'react';
import { Platform, Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import { useWalletStore, useUserStore } from '@/stores';
import { userService } from '@/services';

const privyAppId = Constants.expoConfig?.extra?.privyAppId || process.env.EXPO_PUBLIC_PRIVY_APP_ID;

// Only import Privy on native platforms (it doesn't work on web)
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

// Privy configuration
const privyConfig = {
  appearance: {
    theme: 'dark' as const,
    accentColor: '#BBF246',
    logo: undefined,
  },
  loginMethods: ['email', 'wallet'],
  embeddedWallets: {
    createOnLogin: 'users-without-wallets' as const,
  },
};

// Simple Web Login Modal for testing
function WebLoginModal({ visible, onClose, onLogin }: { visible: boolean; onClose: () => void; onLogin: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email');
      return;
    }
    setLoading(true);
    await onLogin(email);
    setLoading(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={webStyles.modalOverlay}>
        <View style={webStyles.modalContent}>
          <Text style={webStyles.modalTitle}>Connect to PACE DAO</Text>
          <Text style={webStyles.modalSubtitle}>Enter your email to test the app</Text>
          
          <TextInput
            style={webStyles.input}
            placeholder="your@email.com"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TouchableOpacity
            style={[webStyles.button, loading && webStyles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#192126" />
            ) : (
              <Text style={webStyles.buttonText}>Connect</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={webStyles.cancelButton} onPress={onClose}>
            <Text style={webStyles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <Text style={webStyles.note}>
            Note: This is a simplified web login for testing.{'\n'}
            Use native app (iOS/Android) for full Privy wallet features.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

// Component to sync Privy state with our stores (only on native)
function PrivySync({ children }: { children: React.ReactNode }) {
  if (!isNative) {
    return <>{children}</>;
  }

  // Dynamic import of Privy hooks only on native
  const { usePrivy } = require('@privy-io/expo');
  const { user: privyUser, authenticated, ready } = usePrivy();
  const setAddress = useWalletStore((state) => state.setAddress);
  const setConnected = useWalletStore((state) => state.setConnected);
  const setUser = useUserStore((state) => state.setUser);
  const setLoading = useUserStore((state) => state.setLoading);

  useEffect(() => {
    const syncUser = async () => {
      if (!ready) return;

      if (authenticated && privyUser) {
        // Get wallet address from Privy
        const wallet = privyUser.wallet || privyUser.linkedAccounts?.find((acc: any) => acc.type === 'wallet');
        const walletAddress = wallet?.address;

        if (walletAddress) {
          // Update wallet store
          setAddress(walletAddress);
          setConnected(true);

          // Get or create user in Supabase
          try {
            setLoading(true);
            const user = await userService.getOrCreateUser(
              walletAddress,
              privyUser.email?.address || `Runner ${walletAddress.slice(0, 6)}`
            );
            setUser(user);
          } catch (error) {
            console.error('Failed to sync user with Supabase:', error);
          } finally {
            setLoading(false);
          }
        }
      } else {
        // User not authenticated, clear stores
        setAddress(null);
        setConnected(false);
        setUser(null);
      }
    };

    syncUser();
  }, [authenticated, privyUser, ready, setAddress, setConnected, setUser, setLoading]);

  return <>{children}</>;
}

// Web-only auth context
let webAuthState = {
  authenticated: false,
  user: null as any,
  ready: true,
  loginModalVisible: false,
  loginCallback: null as ((email: string) => void) | null,
};

const webAuthListeners = new Set<() => void>();

function notifyWebAuthListeners() {
  webAuthListeners.forEach(listener => listener());
}

// Main Privy Provider wrapper
export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const [, forceUpdate] = useState(0);
  const setAddress = useWalletStore((state) => state.setAddress);
  const setConnected = useWalletStore((state) => state.setConnected);
  const setUser = useUserStore((state) => state.setUser);
  const setLoading = useUserStore((state) => state.setLoading);

  useEffect(() => {
    const listener = () => forceUpdate(n => n + 1);
    webAuthListeners.add(listener);
    return () => webAuthListeners.delete(listener);
  }, []);

  // On web, provide simple auth context
  if (!isNative) {
    const handleWebLogin = async (email: string) => {
      // Create a mock wallet address from email
      const mockAddress = '0x' + Buffer.from(email).toString('hex').slice(0, 40).padEnd(40, '0');
      
      webAuthState.authenticated = true;
      webAuthState.user = { email, id: mockAddress };
      webAuthState.loginModalVisible = false;
      
      // Update stores
      setAddress(mockAddress);
      setConnected(true);

      // Create user in Supabase
      try {
        setLoading(true);
        const user = await userService.getOrCreateUser(mockAddress, email);
        setUser(user);
      } catch (error) {
        console.error('Failed to create user:', error);
      } finally {
        setLoading(false);
      }

      notifyWebAuthListeners();
    };

    return (
      <>
        <WebLoginModal
          visible={webAuthState.loginModalVisible}
          onClose={() => {
            webAuthState.loginModalVisible = false;
            notifyWebAuthListeners();
          }}
          onLogin={handleWebLogin}
        />
        {children}
      </>
    );
  }

  // On native, load Privy dynamically
  if (!privyAppId) {
    throw new Error('Missing EXPO_PUBLIC_PRIVY_APP_ID environment variable');
  }

  const { PrivyProvider: PrivyProviderSDK } = require('@privy-io/expo');
  
  return (
    <PrivyProviderSDK appId={privyAppId} config={privyConfig}>
      <PrivySync>{children}</PrivySync>
    </PrivyProviderSDK>
  );
}

// Re-export usePrivy for convenience (with platform check)
export function usePrivy() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!isNative) {
      const listener = () => forceUpdate(n => n + 1);
      webAuthListeners.add(listener);
      return () => webAuthListeners.delete(listener);
    }
  }, []);

  if (!isNative) {
    // Return web auth state
    return {
      user: webAuthState.user,
      authenticated: webAuthState.authenticated,
      ready: webAuthState.ready,
      login: async () => {
        webAuthState.loginModalVisible = true;
        notifyWebAuthListeners();
      },
      logout: async () => {
        webAuthState.authenticated = false;
        webAuthState.user = null;
        // Clear stores
        useWalletStore.getState().disconnect();
        useUserStore.getState().setUser(null);
        notifyWebAuthListeners();
      },
    };
  }
  
  const { usePrivy: usePrivyNative } = require('@privy-io/expo');
  return usePrivyNative();
}

const webStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#192126',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#192126',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#BBF246',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#192126',
  },
  cancelButton: {
    padding: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    color: '#666',
  },
  note: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
});
