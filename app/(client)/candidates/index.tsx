import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { View, Text, Image, Pressable, FlatList } from 'react-native';

import Layout from '../layout';
import { Candidate } from '@/lib/models';
import { useEventForm } from '@/lib/store';
import { useState } from 'react';

function Candidates() {
  const event = useEventForm();
  const router = useRouter();

  const [page, setPage] = useState<Array<number>>([0, 5]);
  const renderable = event.value.candidateList.slice(page[0], page[1]);

  return (
    <Layout>
      {event.value.id.length > 0 ? (
        <>
          <View className="w-full mb-3">
            <Text className="text-lg font-bold text-slate-600">{event.value.name}</Text>
          </View>
          <FlatList
            data={renderable}
            keyExtractor={(item) => item.position}
            renderItem={({ item, index }: { item: Candidate; index: number }) => (
              <Pressable
                onPress={() => {
                  console.log(page[0] + index);

                  router.push({
                    pathname: '/(user)/scoring/[candidate]',
                    params: { candidate: page[0] + index },
                  });
                }}
                className="w-full my-3 flex flex-row flex-wrap items-center p-3 rounded-lg bg-slate-100/70 active:bg-slate-200/50">
                <View className="w-auto border-r pr-3 border-white">
                  <View className="w-12 h-12 flex flex-row justify-center items-center">
                    {item.image !== null ? (
                      <Image
                        width={48}
                        height={48}
                        className="w-full h-full rounded-full"
                        source={{ uri: item.image }}
                      />
                    ) : (
                      <View className="w-auto px-3 py-2.5 rounded-full bg-indigo-500">
                        <FontAwesome5 name="user-tie" size={24} color="#fff" />
                      </View>
                    )}
                  </View>
                </View>
                <View className="flex-auto mx-3">
                  <Text className="text-xs">Candidate No. {item.position}</Text>
                  <Text className="text-lg">{item.name}</Text>
                </View>
              </Pressable>
            )}
          />
          <View className="w-full flex flex-row flex-wrap items-center">
            {page[0] > 4 ? (
              <Pressable
                onPress={() => setPage((prev) => [prev[0] - 5, prev[1] - 5])}
                className="w-auto py-2.5 px-5 rounded-lg active:bg-slate-100/70">
                <Text className="text-base text-blue-400">Previous</Text>
              </Pressable>
            ) : (
              <></>
            )}
            {page[1] <= event.value.candidateList.length - 1 ? (
              <Pressable
                onPress={() => setPage((prev) => [prev[0] + 5, prev[1] + 5])}
                className="w-auto ml-auto py-2.5 px-5 rounded-lg active:bg-slate-100/70">
                <Text className="text-base text-blue-400">Next</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => router.back()}
                className="w-auto ml-auto py-2.5 px-5 rounded-lg active:bg-slate-100/70">
                <Text className="text-base text-blue-400">Done</Text>
              </Pressable>
            )}
          </View>
        </>
      ) : (
        <></>
      )}
    </Layout>
  );
}

export default Candidates;
