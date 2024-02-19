import { get_overall } from '@/lib/actions/get_overall';
import { ScorableEvent, Score, useEventForm } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

function CriteriaSelection() {
  const event = useEventForm();
  const selection = Number(useLocalSearchParams<{ selection: string }>().selection);

  const [scores, setScores] = useState<Array<Score>>([]);

  const [ranking, setRanking] = useState<Array<number>>([]);
  const [genAveg, setGenAveg] = useState<Array<number>>([]);
  const [candidates, setCandidates] = useState<Array<any>>([]);

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

        setScores(data);

        const generalAvg: Array<{ owner: string; total: number }> = [];
        const scoreList: Array<number> = [];
        const candidateList: Array<any> = [];
        data.forEach((entry: Score, index: number) => {
          entry.candidates.forEach((c, i) => {
            if (candidateList[i] === undefined) {
              candidateList[i] = { candidate: c.candidate, judgeScores: [] };
            }

            candidateList[i].judgeScores.push({ id: entry.owner, scores: c.criterias });

            if (scoreList[i] === undefined) {
              scoreList[i] = 0;
            }

            scoreList[i] += c.criterias[selection];
          });
        });

        // console.log(JSON.stringify(candidateList, null, 2));

        setRanking(scoreList.sort((a, b) => a - b));
        setCandidates(candidateList);
        // console.log(JSON.stringify(candidateList, null, 2));
      });

    supabase
      .channel('scoring')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, (payload) => {
        // console.log('payload: ', JSON.stringify(payload.new, null, 2));
        const newData: Score = payload.new as any;

        // console.log('data: ', newData);
        // console.log('Scores: ', scores);

        // const index = scores.filter((v, i) => (v.owner === newData.owner ? i : -1));
        const mutatedScores = scores;
        mutatedScores.forEach((score, i) => {
          if (score.owner === newData.owner) {
            mutatedScores[i] = newData;
          }
        });

        setScores([...mutatedScores]);
        const scoreList: Array<number> = [];
        const candidateList: Array<any> = [];
        mutatedScores.forEach((entry: Score, index: number) => {
          entry.candidates.forEach((c, i) => {
            if (candidateList[i] === undefined) {
              candidateList[i] = { candidate: c.candidate, judgeScores: [] };
            }

            candidateList[i].judgeScores.push({ id: entry.owner, scores: c.criterias });

            if (scoreList[i] === undefined) {
              scoreList[i] = 0;
            }

            scoreList[i] += c.criterias[selection];
          });
        });

        setRanking(scoreList.sort((a, b) => a - b));
        setCandidates(candidateList);
      })
      .subscribe();
  }, []);

  if (scores.length === 0) {
    return <></>;
  }

  return (
    <View className="flex-auto p-5">
      <View>
        {/* <Text>{JSON.stringify(scores, null, 2)}</Text> */}
        {/* <Text>{selection}</Text> */}
      </View>
      {/* <FlatList
        data={scores}
        renderItem={({ item, index }) => (
          <View className="w-full p-2 my-2 bg-gray-200">
            <Text>Judge: {item.owner}</Text>
            <View>
              {item.candidates.map((candidate, i) => (
                <View key={i}>
                  <Text>
                    {candidate.candidate} : {ranking[i] / scores.length}
                  </Text>
                  <Text>{candidate.criterias[selection]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      /> */}
      <FlatList
        data={candidates}
        renderItem={({ item, index }) => {
          let total = 0;

          return (
            <View
              key={index}
              className="w-full p-5 my-2 rounded-lg border border-slate-200 bg-slate-100/60">
              <View className="flex-auto">
                <Text className="text-sm text-slate-500">Candidate</Text>
                <Text className="text-xl font-bold text-slate-600">{item.candidate}</Text>
              </View>
              {/* <Text>{JSON.stringify(item.judgeScores, null, 2)}</Text> */}
              {item.judgeScores.map((data: any, i: number) => {
                const avg = get_overall(data.scores);
                total += avg;

                return (
                  <>
                    <View key={'view-1-' + i} className="w-full my-2">
                      <Text className="text-xs">Judge ID</Text>
                      <Text className="text-sm font-bold">{data.id}</Text>
                    </View>
                    <View
                      key={'view-2-' + i}
                      className="w-full flex flex-row flex-wrap justify-between mt-3">
                      <Text className="text-xl text-blue-800">Judge Score</Text>
                      <Text className="text-xl font-bold text-indigo-500">
                        {data.scores[selection]}
                      </Text>
                    </View>
                    <View key={'view-3-' + i} className="w-full flex flex-row flex-wrap mt-1 mb-3">
                      <Text>General Score: {avg}</Text>
                    </View>
                  </>
                );
              })}
              <View key={index} className="w-full mt-5 items-end">
                <Text className="text-base text-gray-500">
                  {/* Average: {ranking[index]} | Ranking: #{ranking.indexOf(ranking[index]) + 1} */}
                  Criteria Average: {ranking[index]}
                </Text>
                <Text className="mt-1">General Average: {total / item.judgeScores.length}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

export default CriteriaSelection;
