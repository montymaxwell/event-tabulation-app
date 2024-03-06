import { View, Text } from 'react-native';
import Input from '@/components/Input';
import { useEventForm, useScore } from '@/lib/store';
import { Candidate } from '@/lib/models';
import { useEffect, useState } from 'react';

function CategoryScorable({
  data,
  candidate,
  category,
}: {
  data: Candidate;
  candidate: number;
  category: number;
}) {
  const event = useEventForm();
  const score = useScore();

  const [state, setState] = useState<string | null>(null);
  const [current, setCurrent] = useState<number | null>(null);

  useEffect(() => {
    if (score.value.id === event.value.id) {
      const candidates = score.value.candidates;

      if (candidates[candidate]) {
        if (candidates[candidate].category[category]) {
          setCurrent(candidates[candidate].category[category]);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (current === null) return;

    if (event.value.id.length > 0) {
      const mutated = score.value.candidates;
      if (mutated[candidate] === undefined) {
        mutated[candidate] = {
          category: [],
          candidate: event.value.candidateList[candidate].name,
          criterias: [],
        };
      }

      if (mutated[candidate].category[category] === undefined) {
        mutated[candidate].category[category] = current;
      }

      mutated[candidate].category[category] = current;
      score.append({ candidates: [...mutated] });
    }
  }, [current]);

  return (
    <View className="w-full p-3">
      <Text className="text-lg">{data.name}</Text>
      <View className="w-full my-2">
        <Input
          value={current !== null ? String(current) : undefined}
          error={state !== null ? true : undefined}
          helperText={state !== null ? state : ''}
          keyboardType="number-pad"
          inlineLabel={`Max Score: ${String(event.value.category[category].maxScore)}`}
          onChangeText={(text) => {
            const num = Number(text);
            const cat = event.value.category[category];

            if (num > cat.maxScore) {
              setState(`The score limit is ${cat.maxScore}`);
            } else if (num < cat.minScore) {
              setState(`The minmum score is ${cat.minScore}`);
            } else {
              setState(null);
            }

            if (num < cat.minScore) {
              setCurrent(cat.minScore);
            } else if (num > cat.maxScore) {
              setCurrent(cat.maxScore);
            } else {
              setCurrent(num);
            }
          }}
        />
      </View>
    </View>
  );
}

export default CategoryScorable;
