// Import required polyfills first
import 'fast-text-encoding';
import 'react-native-get-random-values';
import '@ethersproject/shims';

// CRITICAL: Polyfill crypto for uuid package BEFORE any other imports
// This must be synchronous and complete before uuid module loads
if (!global.crypto) {
  global.crypto = {};
}

// Polyfill getRandomValues (used by uuid v9+)
if (!global.crypto.getRandomValues) {
  const { getRandomValues } = require('expo-crypto');
  global.crypto.getRandomValues = getRandomValues;
}

// Polyfill randomUUID (used by uuid)
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
}

// Polyfill webcrypto subtle for other crypto operations
if (!global.crypto.subtle) {
  global.crypto.subtle = {};
}

// Then import the expo router
import 'expo-router/entry';
