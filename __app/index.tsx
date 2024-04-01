import {
  View
} from 'react-native'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import StartScreen from '@/core/auth/components/StartScreen'

function Page() {
  return (
    <SafeAreaView className='flex-1 bg-slate-100'>
      <Stack.Screen options={{ title: 'Page Route' }} />
      <View className='flex-auto lg:flex-row lg:flex-nowrap'>
        <View className='flex-auto'></View>
        <View className='flex-auto bg-white'>
          <StartScreen/>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Page