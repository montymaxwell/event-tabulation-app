import Button from '@/components/Button';
import { useEventForm, useScores } from '@/lib/store';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

function Criteria() {
  const router = useRouter();
  const event = useEventForm();

  const scores = useScores((state) => state.value);
  const [average, setAverage] = useState<Array<{ candidate: string; score: number }>>([]);

  useEffect(() => {
    const scorelist: Array<{
      id: string;
      label: string;
      scores: Array<{ candidate: string; score: number }>;
    }> = [];

    scores.forEach((judge, i) => {
      if (scorelist[i] === undefined) {
        scorelist[i] = { id: judge.owner, label: judge.label, scores: [] };
      }

      judge.candidates.forEach((candidate, cand) => {
        // total per candidate
        scorelist[i].scores[cand] = { candidate: candidate.candidate, score: 0 };
        candidate.criterias.forEach((criteria, crit) => {
          // adding up the scores per criteria
          scorelist[i].scores[cand].score += criteria;
        });
      });
    });

    const candidates: Array<{ candidate: string; score: number }> = [];
    scorelist.forEach((v, i) => {
      v.scores.forEach((s, j) => {
        if (candidates[j] === undefined) {
          candidates[j] = { candidate: s.candidate, score: 0 };
        }

        candidates[j].score += s.score;

        if (i === scorelist.length - 1) {
          candidates[j].score =
            Math.round((candidates[j].score / scorelist.length + Number.EPSILON) * 100) / 100;
          // Math.round((arr[i].score / scores.value.length + Number.EPSILON) * 100) / 100;
        }
      });
    });

    candidates.sort((a, b) => a.score - b.score).reverse();
    console.log(JSON.stringify(candidates, null, 2));
    setAverage(candidates);
  }, []);

  if (event.value.id.length > 0) {
    return (
      <View className="flex-1 p-5">
        {/* <View className="w-full"></View> */}
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
          {event.value.criteriaList.map((criteria, index) => (
            <View
              key={index}
              className="w-full flex flex-row flex-wrap items-center py-2.5 px-3.5 my-2 rounded-lg bg-slate-100">
              <View className="flex-auto">
                <Text>{criteria.name}</Text>
              </View>
              <Button
                onPress={() => {
                  router.push({
                    pathname: '/(admin)/dashboard/data/criterias/[criteria]',
                    params: { criteria: index },
                  });
                }}
                size="sm"
                label="Scores"
              />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  } else return <></>;
}

export default Criteria;
