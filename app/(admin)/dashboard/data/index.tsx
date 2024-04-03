import { Score, useEventForm, useScore, useScores, useUser } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';

function EventData() {
  const user = useUser();
  const router = useRouter();
  const event = useEventForm();
  const [criteria, setCritera] = useState<number>(0);
  const scores = useScores();

  useEffect(() => {
    supabase
      .from('scores')
      .select('*')
      .eq('event', event.value.id)
      .then(({ error, data }) => {
        if (error) {
          console.log('error: ', error);
          return;
        }

        scores.write(data);
      });

    supabase
      .channel('scores')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'scores' },
        async (payload) => {
          console.log('realtime update');
          const newData = payload.new as any;
          const oldData = payload.old as any;

          console.log('Event Old: ', oldData);
          console.log('Event New: ', newData);

          const mutatedScores = (
            await supabase.from('scores').select('*').eq('event', newData.event)
          ).data;

          scores.write([...(mutatedScores as any)]);
        }
      )
      .subscribe();
  }, []);

  return (
    <View className="flex-1">
      <View className="w-full">
        <Text className="text-2xl font-bold text-slate-600">{event.value.name}</Text>
        <Text className="text-sm">Location: {event.value.location}</Text>
      </View>
      <View className="w-full my-3">
        <Text className="text-lg">
          Judges: {event.value.judges !== null ? Object.keys(event.value.judges as any).length : 0}
        </Text>
        <Text className="text-lg">Candidates: {event.value.candidateList.length}</Text>
      </View>
      <View className="w-full">
        <Text className="text-xl font-bold text-slate-600">Criterias</Text>
      </View>
      <ScrollView className="w-full">
        <Pressable
          onPress={() => setCritera(0)}
          className="w-full flex flex-row flex-wrap items-center py-4 px-5 my-2 rounded-lg bg-blue-500/70 active:bg-blue-500/50">
          <Text className="text-lg font-bold text-white">Minor Category</Text>
        </Pressable>
        <View className="flex-auto border-l mx-1.5 pl-2 border-blue-200/60">
          {criteria === 0 ? (
            <View className="w-full">
              <FlatList
                className=""
                data={event.value.category}
                renderItem={({ item, index }) => (
                  <Pressable
                    onPress={() => {
                      router.push({
                        pathname: '/(admin)/dashboard/data/category/[index]',
                        params: { index: index },
                      });
                    }}
                    className="w-full flex flex-row flex-wrap items-center p-3 my-2 rounded-lg bg-slate-100/70 active:bg-slate-200/50">
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
          ) : (
            <></>
          )}
        </View>
        <View className="w-full bg-white">
          <Pressable
            onPress={() => {
              router.push('/(admin)/dashboard/data/criterias/');
            }}
            className="w-full flex flex-row flex-wrap items-center py-4 px-5 my-2 rounded-lg bg-blue-500/70 active:bg-blue-500/50">
            <Text className="text-lg font-bold text-white">General Criteria</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              router.push('/(admin)/dashboard/data/top10');
            }}
            className="w-full flex flex-row flex-wrap items-center py-4 px-5 my-2 rounded-lg bg-blue-500/70 active:bg-blue-500/50">
            <Text className="text-lg font-bold text-white">Top 10</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              router.push('/(admin)/dashboard/data/top5');
            }}
            className="w-full flex flex-row flex-wrap items-center py-4 px-5 my-2 rounded-lg bg-blue-500/70 active:bg-blue-500/50">
            <Text className="text-lg font-bold text-white">Top 5</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

export default EventData;
