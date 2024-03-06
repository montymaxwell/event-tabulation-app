import { Candidate } from '@/lib/models';
import { useEventForm } from '@/lib/store';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Pressable, View, Text, Image } from 'react-native';
import Layout from '../layout';

function Candidates() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const event = useEventForm();

  return (
    <Layout>
      {/* <View className="w-full">
        <FlatList
          data={event.value.candidateList}
          keyExtractor={(item) => item.position}
          renderItem={({ item, index }: { item: Candidate; index: number }) => (
            <Pressable
              onPress={() => {
                router.push({
                  pathname: '/(user)/scoring/[candidate]',
                  params: { candidate: index },
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
      </View> */}
      <View className="w-full">
        <View>
          <Text>{}</Text>
        </View>
      </View>
    </Layout>
  );
}

export default Candidates;
