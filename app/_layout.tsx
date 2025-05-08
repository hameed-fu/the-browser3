import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { Rubik_500Medium, Rubik_700Bold } from '@expo-google-fonts/rubik';
import { SplashScreen } from 'expo-router';
import { Platform } from 'react-native';
import { PlatformProvider } from '@/context/PlatformContext';
import { TokenProvider } from '@/context/TokenContext';
import { BookmarksProvider } from '@/context/BookmarksContext';
import { TVNavigationProvider } from '@/context/TVNavigationContext';
import { ThemeProvider } from '@/context/ThemeContext';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Bold': Inter_700Bold,
    'Rubik-Medium': Rubik_500Medium,
    'Rubik-Bold': Rubik_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <PlatformProvider>
        <TokenProvider>
          <BookmarksProvider>
            <TVNavigationProvider>
              <>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style={Platform.OS === 'web' ? 'auto' : 'light'} />
              </>
            </TVNavigationProvider>
          </BookmarksProvider>
        </TokenProvider>
      </PlatformProvider>
    </ThemeProvider>
  );
}