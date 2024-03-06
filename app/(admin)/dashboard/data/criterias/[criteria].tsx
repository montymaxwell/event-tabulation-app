import { useEventForm, useScores } from '@/lib/store';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, View, Text, ScrollView } from 'react-native';

function getAverage(arr: Array<any>) {
  let sumTotal = 0;
  arr.forEach((v) => {
    sumTotal += v.score;
  });

  return sumTotal / arr.length;
}

function Criteria() {
  const scores = useScores();
  const event = useEventForm();

  const criteriaIndex = Number(useLocalSearchParams().criteria);
  const [average, setAverage] = useState<Array<{ candidate: string; score: number }>>([]);
  const [totalAverage, setTotalAverage] = useState<number>(0);

  useEffect(() => {
    // const judgeTotal: Array<number> = [];
    // const arr: Array<{
    //   id: string;
    //   label: string;
    //   scores: Array<{ candidate: string; score: number }>;
    // }> = []; // using candidate as indexes
    // scores.value.forEach((judge, i) => {
    //   console.log(i);
    //   judge.candidates.forEach((candidate, j) => {
    //     if (arr[i] === undefined) {
    //       arr[i] = { id: judge.owner, label: judge.label, scores: [] };
    //     }
    //     if (arr[i].scores[j] === undefined) {
    //       arr[i].scores[j] = { candidate: candidate.candidate, score: 0 };
    //     }
    //     let score = 0;
    //     candidate.criterias.forEach((v) => {
    //       score += v || 0;
    //     });
    //     arr[i].scores[j].score = score;
    //   });
    // });
    // let av: Array<{ candidate: string; score: number }> = [];
    // arr.forEach((judge, i) => {
    //   judge.scores.forEach((score, j) => {
    //     // av[i].candidate = arr[i].scores[j].candidate;
    //     av[i].score += arr[i].scores[j].score;
    //   });
    // });
    // console.log(JSON.stringify(av, null, 2));
    // let av = 0;
    // arr.forEach((v) => {
    //   av += v.score;
    // });
    // arr.forEach((v) => {});
    // setTotalAverage(av / scores.value.length);
    // arr.sort((a, b) => a.score - b.score);
    // setAverage(arr.reverse());
  }, []);

  return (
    <View className="w-full h-full p-5">
      <Text className="text-xl font-bold text-slate-600">
        {criteriaIndex + 1}. {event.value.criteriaList[criteriaIndex].name}
      </Text>
      <ScrollView className="flex-auto">
        {/* <View className="w-full">
          {average.map((v, i) => (
            <View
              key={i}
              className="w-full p-3 my-1 flex flex-row flex-wrap justify-between items-center rounded-lg border border-slate-200 bg-slate-100/80">
              <Text>Rank #{i + 1}</Text>
              <Text>{v.candidate}</Text>
              <Text className="text-blue-800">Average Score: {v.score}</Text>
            </View>
          ))}
        </View> */}
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
                        <Text>{candidate.criterias[criteriaIndex]}</Text>
                      </View>
                    );
                  } else {
                    return (
                      <View
                        key={candidate + '-' + j}
                        className="w-full p-3 my-1 flex flex-row flex-wrap items-center justify-between">
                        <Text>{candidate.candidate}</Text>
                        <Text>{candidate.criterias[criteriaIndex]}</Text>
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

export default Criteria;
