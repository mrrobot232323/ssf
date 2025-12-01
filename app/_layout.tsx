import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

import { AppProvider } from '@/context/AppContext';

// Prevent the splash screen from auto-hiding before fonts are loaded
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'welcome',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Load Uber Move fonts
  // Note: React Native requires .ttf or .otf files, not .woff2
  // Convert your .woff2 files to .ttf or .otf using an online converter
  // Load Uber Move fonts
  // Load Uber Move fonts
  // Note: We are loading .woff2 files as requested. 
  /*
  const [fontsLoaded, fontError] = useFonts({
    'UberMove-Regular': require('../assets/fonts/UberMove-Regular.woff2'),
    'UberMove-Bold': require('../assets/fonts/UberMove-Bold.woff2'),
    'UberMoveText-Medium': require('../assets/fonts/UberMoveText-Medium.woff2'),
  });
  */

  // TEMPORARY FIX: Bypass font loading until .ttf files are available
  const fontsLoaded = true;
  const fontError = null;

  // TEMPORARY FIX: Bypass font loading until .ttf files are available
  // const fontsLoaded = true;
  // const fontError = null;

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }

    if (fontError) {
      console.warn('Font loading error:', fontError);
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false, title: 'Login' }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppProvider>
  );
}
