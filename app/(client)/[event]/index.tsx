import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useEventForm, useScore, useUser } from '@/lib/store';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Layout from '../layout';
import MinorCriteria from './MinorCriteria';
import GeneralCriteria from './GeneralCriteria';
import Button from '@/components/Button';
import { FontAwesome } from '@expo/vector-icons';

function Event() {
  const user = useUser();
  const score = useScore();
  const router = useRouter();
  const event = useEventForm();
  const params = useLocalSearchParams<{ event: string }>();

  const [criteria, setCritera] = useState<number>(0);

  const ScoringHandler = async () => {
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
            .update({ candidates: score.value.candidates, label: score.value.label })
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
              label: score.value.label,
            })
            .select();

          if (create.error) {
            console.log('Create Error: ', create.error);
            return;
          }

          score.append({ candidates: create.data[0].candidates });
        }

        router.back();
      });
  };

  useEffect(() => {
    const id = params.event;

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

          const owner = user.getID();
          const scores = await supabase
            .from('scores')
            .select('*')
            .eq('event', id)
            .eq('owner', owner);

          if (scores.error) {
            console.log(error);
            score.write({
              owner,
              id: data[0].id,
              candidates: [],
            });
            return;
          }

          if (scores.data.length > 0) {
            score.write({
              owner,
              id: data[0].id,
              candidates: scores.data[0].candidates,
            });
          } else {
            score.write({
              owner,
              id: data[0].id,
              candidates: [],
            });
          }

          const judges: { [id: string]: string } = data[0].judges !== null ? data[0].judges : {};
          if (data[0].judges === null) {
            judges[owner] = 'judge-1';
          } else if (data[0].judges[owner] === undefined) {
            judges[owner] = `judge-${Object.entries(data[0].judges).length + 1}`;
          }

          supabase.from('events').update({ judges }).eq('id', data[0].id).then();
          score.append({ label: judges[owner] });
        });
    }
  }, []);

  return (
    <Layout>
      <>
        <View className="w-full flex flex-row flex-wrap items-center justify-between">
          <Text>
            {event.value.name} | {event.value.location}
          </Text>
        </View>
        <View className="w-full my-3">
          <Text className="text-xl font-bold text-slate-600">Criterias</Text>
        </View>
        <View className="w-full">
          <Pressable
            onPress={() => setCritera(0)}
            className="w-full flex flex-row flex-wrap items-center py-4 px-5 my-2 rounded-lg bg-blue-500/70 active:bg-blue-500/50">
            <Text className="text-lg font-bold text-white">Minor Category</Text>
          </Pressable>
          <View className="flex-auto border-l mx-1.5 pl-2 border-blue-200/60">
            {criteria === 0 ? <MinorCriteria /> : <></>}
          </View>
        </View>
        <View className="w-full">
          <Pressable
            onPress={() => {
              // setCritera(1);
              router.push('/(client)/candidates/');
            }}
            className="w-full flex flex-row flex-wrap items-center py-4 px-5 my-2 rounded-lg bg-blue-500/70 active:bg-blue-500/50">
            <Text className="text-lg font-bold text-white">General Criteria</Text>
          </Pressable>
          {/* <View className="flex-auto border-l mx-1.5 pl-2 border-blue-200/60">
            {criteria === 1 ? <GeneralCriteria /> : <></>}
          </View> */}
        </View>
        <View className="w-full mt-auto flex flex-row flex-wrap justify-end p-3">
          <Button
            onPress={() => ScoringHandler()}
            label="Submit"
            icon={<FontAwesome name="send" size={12} color="#fff" />}
          />
        </View>
      </>
    </Layout>
  );
}

export default Event;
