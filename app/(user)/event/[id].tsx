import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { View, Image, Pressable, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { Candidate } from '@/lib/models';
import { useClient, useEventForm, useScore, useUser } from '@/lib/store';
import { supabase } from '@/lib/supabase';

function JudgeEvent() {
  const user = useUser();
  const client = useClient();
  const score = useScore();
  const router = useRouter();
  const event = useEventForm();
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    if (id.length > 0) {
      supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .then(async ({ error, data }) => {
          if (error) {
            console.log(error);
            return;
          }

          event.write(data[0]);

          if (!user.check()) {
            const { error, data } = await supabase
              .from('scores')
              .select('*')
              .eq('id', id)
              .eq('owner', client.id);

            if (error) {
              console.log(error);
              return;
            }

            if (data.length > 0) {
              score.write({
                id: data[0].id,
                tempID: client.id!,
                userID: null,
                candidates: data[0].candidates,
              });
            } else {
              score.write({
                id: event.value.id,
                tempID: client.id!,
                userID: null,
                candidates: [],
              });
            }

            return;
          } else {
            const { error, data } = await supabase
              .from('scores')
              .select('*')
              .eq('id', id)
              .eq('owner', user.value.id);

            if (error) {
              console.log(error);
              return;
            }

            if (data.length > 0) {
              score.write({
                id: data[0].id,
                tempID: '',
                userID: user.value.id,
                candidates: data[0].candidates,
              });
            } else {
              score.write({
                id: event.value.id,
                tempID: '',
                userID: user.value.id,
                candidates: [],
              });
            }
          }
        });
    }
  }, []);

  useEffect(() => {
    const userid = user.value.id;
    const owner = event.value.owner;
    if (userid.length > 0 && owner.length > 0 && userid === owner) {
      router.replace({ pathname: '/(admin)/dashboard/[event]', params: { event: id } });
    }
  }, [event.value]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Image className="w-full h-full absolute" source={require('assets/images/app-bg.png')} />
      <View className="w-full flex flex-row flex-wrap p-5">
        <Pressable
          onPress={() => {
            router.back();
          }}
          className="w-auto p-2.5 rounded-lg bg-white/20 active:bg-white/40">
          <MaterialIcons name="arrow-back-ios-new" size={18} color={'#fff'} />
        </Pressable>
      </View>
      <View className="flex-auto p-5 bg-white">
        {event.value.id.length > 0 ? (
          <>
            <View className="w-full mb-3">
              <Text className="text-lg font-bold text-slate-600">{event.value.name}</Text>
            </View>
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
          </>
        ) : (
          <></>
        )}
      </View>
    </SafeAreaView>
  );
}

export default JudgeEvent;
