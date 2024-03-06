import { useEventForm, useScores } from '@/lib/store';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, View, Text, ScrollView } from 'react-native';

function Category() {
  const scores = useScores();
  const event = useEventForm();

  const categoryIndex = Number(useLocalSearchParams().index);
  const [average, setAverage] = useState<Array<{ candidate: string; score: number }>>([]);

  useEffect(() => {
    const arr: Array<{ candidate: string; score: number }> = []; // using candidate as indexes
    scores.value.forEach((judge, i) => {
      judge.candidates.forEach((candidate, j) => {
        if (arr[j] === undefined) {
          arr[j] = { candidate: candidate.candidate, score: 0 };
        }
        arr[j].score += candidate.category[categoryIndex];
      });
    });

    arr.forEach((v, i) => {
      arr[i].score = Math.round((arr[i].score / scores.value.length + Number.EPSILON) * 100) / 100;
    });

    arr.sort((a, b) => a.score - b.score);

    setAverage(arr.reverse());
  }, []);

  return (
    <View className="w-full h-full p-5">
      <Text className="text-xl font-bold text-slate-600">
        {categoryIndex + 1}. {event.value.category[categoryIndex].name}
      </Text>
      <ScrollView className="flex-auto">
        <View className="w-full">
          {average.map((v, i) => (
            <View
              key={i}
              className="w-full p-3 my-1 flex flex-row flex-wrap justify-between items-center rounded-lg border border-slate-200 bg-slate-100/80">
              <Text className="text-base font-bold text-indigo-500">Rank #{i + 1}</Text>
              <Text className="text-base font-bold text-slate-600">{v.candidate}</Text>
              <Text className="text-base text-blue-800">Average Score: {v.score}</Text>
            </View>
          ))}
        </View>
        {scores.value.map((score, i) => {
          return (
            <View
              key={score.id}
              className="w-full p-3 my-2 rounded-lg border border-slate-200 bg-slate-100/80">
              <Text className="text-lg font-bold text-slate-500">
                {score.label.replace('j', 'J')}
              </Text>
              <Text className="text-xs text-gray-500">Judge ID: {score.owner}</Text>
              <View className="w-full p-3">
                {score.candidates.map((candidate, j) => {
                  if (j % 2 == 1) {
                    return (
                      <View
                        key={candidate + '-' + j}
                        className="w-full p-3 my-1 flex flex-row flex-wrap items-center justify-between bg-slate-200">
                        <Text>{candidate.candidate}</Text>
                        <Text>{candidate.category[categoryIndex]}</Text>
                      </View>
                    );
                  } else {
                    return (
                      <View
                        key={candidate + '-' + j}
                        className="w-full p-3 my-1 flex flex-row flex-wrap items-center justify-between">
                        <Text>{candidate.candidate}</Text>
                        <Text>{candidate.category[categoryIndex]}</Text>
                      </View>
                    );
                  }
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default Category;
