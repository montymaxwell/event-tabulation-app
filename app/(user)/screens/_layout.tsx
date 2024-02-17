import { useUser } from '@/lib/store';
import { Slot, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function UserScreensLayout() {
  const router = useRouter();
  const user = useUser();

  const UserIcon = () => {
    if (user.value.id.length > 0) {
      user.reset();
    }
  };

  // useEffect(() => {
  //   if (user.value.id.length === 0) {
  //     router.replace('/(auth)/');
  //   }
  // }, [user.value.id]);

  return (
    <SafeAreaView className="flex-1">
      <Image
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        source={require('assets/images/app-bg.png')}
      />
      <View className="w-full flex flex-row justify-between items-center p-5">
        <Pressable className="w-auto p-1 rounded-lg bg-white/25">
          <Image
            width={40}
            height={40}
            style={{
              width: 40,
              height: 40,
            }}
            source={require('assets/images/advent-md-white.png')}
          />
        </Pressable>
        <Pressable
          onPress={UserIcon}
          className="w-auto px-2 py-3 rounded-lg bg-white/25 active:bg-white/50">
          <Text className="text-white">{user.value.email.split('@')[0]}</Text>
        </Pressable>
      </View>
      <View className="flex-auto bg-white">
        <Slot />
      </View>
    </SafeAreaView>
  );
}

export default UserScreensLayout;
