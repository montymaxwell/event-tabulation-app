import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SplashScreen, Stack } from 'expo-router';
import { NativeWindStyleSheet } from 'nativewind';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
