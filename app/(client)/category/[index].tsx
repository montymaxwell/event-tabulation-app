import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import Swipeable, { SwipeableProps } from 'react-native-gesture-handler/Swipeable';

import Layout from '../layout';
import Input from '@/components/Input';
import { Candidate } from '@/lib/models';
import { useEventForm, useScore } from '@/lib/store';
import CategoryScorable from './score';
import Button from '@/components/Button';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

function Category() {
  const event = useEventForm();
  const router = useRouter();
  const categoryIndex = Number(useLocalSearchParams<{ index: string }>().index);
  const score = useScore();

  const [page, setPage] = useState<Array<number>>([0, 5]);
  const renderable = event.value.candidateList.slice(page[0], page[1]);

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
      });

    router.back();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Layout>
        <>
          <View className="w-full my-3">
            <Text className="text-xl font-bold text-slate-600">
              {categoryIndex + 1}. {event.value.category[categoryIndex].name}
            </Text>
          </View>
          <ScrollView style={{ flex: 1 }}>
            {renderable.map((item, i) => (
              <CategoryScorable
                key={item.name + '-' + i}
                data={item}
                candidate={i + page[0]}
                category={categoryIndex}
              />
            ))}
          </ScrollView>
          <View className="w-full p-3 flex flex-row flex-wrap items-center">
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
              <></>
            )}
          </View>
          <View>
            <Button
              onPress={() => ScoringHandler()}
              label="Submit"
              icon={<FontAwesome name="send" size={12} color="#fff" />}
            />
          </View>
        </>
      </Layout>
    </GestureHandlerRootView>
  );
}

export default Category;
