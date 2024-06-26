import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SplashScreen, Stack } from 'expo-router';
import { NativeWindStyleSheet } from 'nativewind';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

function RootLayout() {
  const [loaded] = useFonts({
    Roboto: require('assets/fonts/RobotoFlex.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }

    if (Platform.OS === 'web' && document) {
      const rnwStyleSheet = document.getElementById('react-native-stylesheet') as any
      if (rnwStyleSheet) {
        rnwStyleSheet.sheet.insertRule(`@media print {
          .results-view {
                background-color: white;
                height: 100%;
                width: 100%;
                position: fixed;
                top: 0;
                left: 0;
                margin: 0;
                padding: 15px;
                font-size: 14px;
                line-height: 18px;
            }
        }`, 0);
      }
    }

  }, [loaded]);

  if (!loaded) return null;

  return (
    <SafeAreaProvider className="w-full h-full">
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}

export default RootLayout;
