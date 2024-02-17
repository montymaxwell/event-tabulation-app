import { Slot } from 'expo-router';
import { View, Image, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function AuthLayout() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Image
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        source={require('assets/images/background.png')}
      />
      <View className="w-full h-1/4"></View>
      <View className="w-auto my-3 justify-center items-center">
        <Image
          width={80}
          height={80}
          style={{
            width: 80,
            height: 80,
          }}
          source={require('assets/images/advent-md.png')}
        />
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View className="flex-auto flex justify-around items-center p-5">
          <Slot />
        </View>
      </ScrollView>
      <Text className="text-sm py-4 text-center font-bold text-gray-400">
        Designed by Juman Macorol
      </Text>
    </SafeAreaView>
  );
}

export default AuthLayout;
