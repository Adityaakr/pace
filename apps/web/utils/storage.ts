// Cross-platform storage utility
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

// Web fallback using localStorage
const webStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch {
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Silently fail
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Silently fail
    }
  },
};

// Export unified storage interface
export const storage = {
  getItem: (key: string) => {
    if (isWeb) {
      return webStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  },

  setItem: (key: string, value: string) => {
    if (isWeb) {
      return webStorage.setItem(key, value);
    }
    return AsyncStorage.setItem(key, value);
  },

  removeItem: (key: string) => {
    if (isWeb) {
      return webStorage.removeItem(key);
    }
    return AsyncStorage.removeItem(key);
  },
};
