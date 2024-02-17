import { MaterialIcons } from '@expo/vector-icons';
import { Slot, useRouter } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function EventLayout() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Image className="w-full h-full absolute" source={require('assets/images/app-bg.png')} />
      <View className="w-full flex flex-row flex-wrap p-5">
        <Pressable
          onPress={() => {
            router.back();
          }}
          className="w-auto p-2.5 rounded-lg bg-white/20 active:bg-white/40">
          <MaterialIcons name="arrow-back-ios-new" size={18} color={'#fff'} />
        </Pressable>
      </View>
      <View className="flex-auto bg-white">
        <Slot />
      </View>
    </SafeAreaView>
  );
}

export default EventLayout;
