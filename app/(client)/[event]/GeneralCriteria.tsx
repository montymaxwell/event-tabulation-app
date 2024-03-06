import { useEventForm } from '@/lib/store';
import { FlatList, Pressable, Text, View } from 'react-native';

function GeneralCriteria() {
  const event = useEventForm();

  return (
    <View className="w-full">
      <FlatList
        className=""
        data={event.value.criteriaList}
        renderItem={({ item, index }) => (
          <Pressable className="w-full flex flex-row flex-wrap items-center p-3 my-2 rounded-lg bg-slate-100/70 active:bg-slate-200/50">
            <View className="w-auto items-center pr-3 border-r border-slate-200">
              <Text className="text-xs text-slate-400">Max Score</Text>
              <Text className="text-lg font-bold text-indigo-500">{item.maxScore}</Text>
            </View>
            <View className="flex-auto px-3">
              <Text className="w-auto text-base">{item.name}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

export default GeneralCriteria;
