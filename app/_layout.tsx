import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { GlobalProvider, useGlobal } from '@/context/global-provider';
import { LanguageProvider, useLanguage } from '@/context/language-provider';
import Loader from '@/components/Loader';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

/**
 * When the app is reopened from background (e.g. after user closed it from Digital Thela or Add Produce),
 * navigate back to the home tab so the user sees the homepage again.
 */
function ResetToHomeOnReopen() {
  const router = useRouter();
  const { isLogged } = useGlobal();
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      const wasInBackground = appStateRef.current === 'background' || appStateRef.current === 'inactive';
      if (wasInBackground && nextState === 'active' && isLogged) {
        router.replace('/(tabs)/home');
      }
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, [isLogged, router]);

  return null;
}

function RootStack() {
  const { t } = useLanguage();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="crops"
        options={{
          headerShown: true,
          title: t.crops.header,
          headerStyle: {
            backgroundColor: '#49A760',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="damage-crop"
        options={{
          headerShown: true,
          title: t.damageCrop.header,
          headerStyle: {
            backgroundColor: '#FF6B6B',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="digital-thela"
        options={{
          headerShown: true,
          title: t.digitalThela.header,
          headerStyle: {
            backgroundColor: '#9C27B0',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Add your custom fonts here if needed
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LanguageProvider>
      <GlobalProvider>
        <ResetToHomeOnReopen />
        <Loader />
        <RootStack />
      </GlobalProvider>
    </LanguageProvider>
  );
}
