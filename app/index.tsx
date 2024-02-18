import { Image, Text, View } from 'react-native';
import Button from '@/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@/lib/store';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { set_client_account } from '@/lib/actions/client_account';

function Index() {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    // AsyncStorage.clear();
    user.init();
    set_client_account();

    // console.log(user.value);
  }, []);

  const JudgeButton = () => {
    router.push('/(user)/screens/');
  };

  const HostButton = () => {
    if (!user.check()) {
      router.push('/(auth)/');
      return;
    }

    router.push('/(admin)/screens/');
  };

  return (
    <SafeAreaView className="flex-1">
      <Image
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        source={require('assets/images/background.png')}
      />
      <View className="w-full h-1/4"></View>
      <View className="flex-auto justify-around items-center bg-white">
        <View className="w-auto justify-center items-center">
          <Image
            width={90}
            height={90}
            style={{
              width: 90,
              height: 90,
              marginLeft: 10,
            }}
            source={require('assets/images/advent-md.png')}
          />
          <Text className="text-3xl -mt-3 text-blue-900 font-bold">Advent</Text>
          <Text className="text-sm font-bold text-gray-400">Event Tabulation App</Text>
        </View>
        <View>
          <View className="my-2">
            <Button
              onPress={JudgeButton}
              label="Continue as Judge"
              icon={<FontAwesome6 name="user-tie" size={14} color="#fff" />}
            />
          </View>
          <View className="items-center border-t mt-3 mb-2 border-gray-200">
            <Text className="-mt-2.5 px-1.5 bg-white text-gray-400">Or</Text>
          </View>
          <View className="my-2">
            <Button
              onPress={HostButton}
              label="Host an event"
              color="dark"
              icon={<FontAwesome name="user-circle" size={14} color="#fff" />}
            />
          </View>
        </View>
        <Text className="text-sm font-bold text-gray-400">Designed by Juman Macorol</Text>
      </View>
    </SafeAreaView>
  );
}

export default Index;
