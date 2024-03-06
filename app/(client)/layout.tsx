import { useScore } from '@/lib/store';
import { MaterialIcons } from '@expo/vector-icons';
import { Slot, useRouter } from 'expo-router';
import { Image, Pressable, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const score = useScore();

  return (
    <SafeAreaView className="flex-1">
      <Image className="w-full h-full absolute" source={require('assets/images/app-bg.png')} />
      <View className="w-full flex flex-row flex-wrap items-center justify-between p-5">
        <Pressable
          onPress={() => {
            router.back();
          }}
          className="w-auto p-2.5 rounded-lg bg-white/20 active:bg-white/40">
          <MaterialIcons name="arrow-back-ios-new" size={18} color={'#fff'} />
        </Pressable>
        <Text className="w-auto text-lg px-3 py-2 rounded-lg bg-white/20 text-white">
          {score.value.label ? score.value.label.replace('j', 'J') : 'Anonymous'}
        </Text>
      </View>
      <View className="flex-auto p-5 bg-white">{children}</View>
    </SafeAreaView>
  );
}

export default Layout;
