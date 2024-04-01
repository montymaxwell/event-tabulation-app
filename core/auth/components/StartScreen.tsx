import {
  Image,
  Pressable,
  Text,
  View
} from 'react-native'

function StartScreen() {
  return (
    <View className='flex-auto justify-center items-center'>
      <View className='my-2 items-center'>
        <Image
          width={90}
          height={90}
          source={require('assets/images/advent-md.png')}
        />
        <Text className='text-3xl font-bold -mt-2.5 text-blue-900'>Advent</Text>
      </View>
      <View className='my-2 items-center'>
        <Pressable className='w-40 my-2 py-3 px-6 bg-slate-300'>
          <Text className='text-center'>Judge</Text>
        </Pressable>
        <Pressable className='w-40 my-2 py-3 px-6 bg-slate-300'>
          <Text className='text-center'>Host</Text>
        </Pressable>
      </View>
      <View className='my-2 items-center'>

      </View>
    </View>
  )
}

export default StartScreen