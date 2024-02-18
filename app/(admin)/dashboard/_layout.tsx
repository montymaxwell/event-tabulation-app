import { useUser } from '@/lib/store';
import { MaterialIcons } from '@expo/vector-icons';
import { Slot, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function AdminLayout() {
  const router = useRouter();
  const user = useUser();

  const UserIcon = () => {
    if (user.value.id.length > 0) {
      user.reset();
    }
  };

  useEffect(() => {
    if (user.value.id.length === 0) {
      router.replace('/(auth)/');
    }
  }, [user.value.id]);

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

export default AdminLayout;
