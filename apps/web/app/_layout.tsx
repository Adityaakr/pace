import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useFonts, Lato_400Regular, Lato_700Bold, Lato_900Black } from '@expo-google-fonts/lato';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PrivyProvider } from '@/providers/PrivyProvider';

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // Dynamically import PrivyElements only on native
  const PrivyElements = isNative ? require('@privy-io/expo/ui').PrivyElements : null;

  const stackContent = (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="onboarding" 
        options={{ 
          headerShown: false,
          gestureEnabled: false,
        }} 
      />
      <Stack.Screen 
        name="login" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
          gestureEnabled: false,
        }} 
      />
      <Stack.Screen
        name="modal"
        options={{ 
          presentation: 'modal', 
          headerShown: false,
        }}
      />
    </Stack>
  );

  return (
    <PrivyProvider>
      {isNative && PrivyElements ? (
        <PrivyElements>
          {stackContent}
        </PrivyElements>
      ) : (
        stackContent
      )}
      <StatusBar style="dark" />
    </PrivyProvider>
  );
}
