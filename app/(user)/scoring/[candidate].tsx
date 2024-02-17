import Input from '@/components/Input';
import { Criteria } from '@/lib/models';
import { useEventForm, useScore } from '@/lib/store';
import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View, Image, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Scorable from './score';
import { supabase } from '@/lib/supabase';
import Button from '@/components/Button';

function CandidateScoring() {
  const router = useRouter();
  const event = useEventForm();
  const score = useScore();

  const candidateIndex = Number(useLocalSearchParams<{ candidate: string }>().candidate);
  const candidate = event.value.candidateList[candidateIndex];
  const data = event.value.criteriaList;

  const ScoringHandler = async () => {
    // supabase
    //   .from('scores')
    //   .select('*')
    //   .eq('id', id)
    //   .then(async (find) => {
    //     if (find.error) {
    //       console.log('search: ', find.error);
    //       return;
    //     }
    //     console.log(find.data);
    //     if (find.data.length > 0) {
    //       const { error, data } = await supabase
    //         .from('scores')
    //         .update({ candidates: score.value.candidates })
    //         .eq('id', id)
    //         .select();
    //       if (error) {
    //         console.log('update: ', error);
    //         return;
    //       }
    //       score.append({ candidates: data[0].candidates });
    //     } else {
    //       const { error, data } = await supabase
    //         .from('scores')
    //         .insert({
    //           id: score.value.id,
    //           owner: score.value.userID !== null ? score.value.userID : score.value.tempID,
    //           candidates: score.value.candidates,
    //         })
    //         .select();
    //       if (error) {
    //         console.log('create: ', error);
    //         return;
    //       }
    //       score.append({ candidates: data[0].candidates });
    //     }
    //   });

    supabase
      .from('scores')
      .insert({
        id: event.value.id,
        owner: score.value.userID !== null ? score.value.userID : score.value.tempID,
        candidates: score.value.candidates,
      })
      .select()
      .then(async (create) => {
        if (create.error) {
          console.log('create: ', create.error);
          if (create.error.code === '23505') {
            const { error, data } = await supabase
              .from('scores')
              .update({ candidates: score.value.candidates })
              .eq('id', event.value.id)
              .select();
            if (error) {
              console.log('update: ', error);
              return;
            }
            score.append({ candidates: data[0].candidates });
          }
          return;
        }
        score.append({ candidates: create.data[0].candidates });
      });
  };

  return (
    <SafeAreaView className="flex-auto">
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
        <View className="w-full mb-3">
          <Text className="text-lg font-bold text-slate-500">Candidate</Text>
        </View>
        <View className="w-full flex flex-row flex-wrap mb-5">
          <View className="w-12 h-12 flex flex-row justify-center items-center">
            {candidate.image !== null ? (
              <Image
                width={48}
                height={48}
                className="w-full h-full rounded-full"
                source={{ uri: candidate.image }}
              />
            ) : (
              <View className="w-auto px-3 py-2.5 rounded-full bg-indigo-500">
                <FontAwesome5 name="user-tie" size={24} color="#fff" />
              </View>
            )}
          </View>
          <View className="flex-auto mx-3">
            <Text className="text-xs">Candidate No. {candidate.position}</Text>
            <Text className="text-lg">{candidate.name}</Text>
          </View>
        </View>
        {/* <FlatList
          className="w-full h-full"
          data={JSON.parse(event.value.criteriaList as any) as Array<Criteria>}
          renderItem={({ item, index }) => (
            <View className="w-full p-1.5 my-2 flex flex-row flex-wrap items-center rounded-lg bg-slate-100/70">
              <View className="items-center p-3.5 border-r border-white">
                <Text className="text-xs text-slate-500">Max</Text>
                <Text className="text-lg font-bold text-indigo-600">{item.maxScore}</Text>
              </View>
              <View className="flex-auto mx-3.5">
                <Text className="my-1">{item.name}</Text>
                <View className="w-full my-1">
                  <Input />
                </View>
              </View>
            </View>
          )}
        /> */}

        <ScrollView className="flex-auto">
          {data.map((item, i) => (
            <Scorable
              key={i}
              {...item}
              id={event.value.id}
              candidate={candidateIndex}
              criteria={i}
            />
          ))}
        </ScrollView>
        <View className="w-full flex flex-row flex-wrap justify-end p-3">
          <Button
            onPress={() => ScoringHandler()}
            label="Submit"
            icon={<FontAwesome name="send" size={12} color="#fff" />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default CandidateScoring;
