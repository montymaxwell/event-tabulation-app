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
    //   .insert({
    //     event: event.value.id,
    //     owner: score.value.owner,
    //     candidates: score.value.candidates,
    //   })
    //   .select()
    //   .then(async (create) => {
    //     if (create.error) {
    //       console.log('create: ', create.error);
    //       if (create.error.code === '23505') {
    //         const { error, data } = await supabase
    //           .from('scores')
    //           .update({ candidates: score.value.candidates })
    //           .eq('event', event.value.id)
    //           .eq('owner', score.value.owner)
    //           .select();
    //         if (error) {
    //           console.log('update: ', error);
    //           return;
    //         }

    //         score.append({ candidates: data[0].candidates });
    //       }
    //       return;
    //     }

    //     score.append({ candidates: create.data[0].candidates });
    //   });

    supabase
      .from('scores')
      .select('*')
      .eq('event', event.value.id)
      .eq('owner', score.value.owner)
      .then(async (existing) => {
        if (existing.error) {
          console.log('Scores Error: ', existing.error);
          return;
        }

        if (existing.data.length > 0) {
          const update = await supabase
            .from('scores')
            .update({ candidates: score.value.candidates })
            .eq('event', event.value.id)
            .eq('owner', score.value.owner)
            .select();

          if (update.error) {
            console.log('Scores Update Error: ', update.error);
            return;
          }

          score.append({ candidates: update.data[0].candidates });
        } else {
          const create = await supabase
            .from('scores')
            .insert({
              event: event.value.id,
              owner: score.value.owner,
              candidates: score.value.candidates,
            })
            .select();

          if (create.error) {
            console.log('Create Error: ', create.error);
            return;
          }

          score.append({ candidates: create.data[0].candidates });
        }
      });

    router.back();
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
