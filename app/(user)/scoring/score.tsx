import Input from '@/components/Input';
import { Criteria } from '@/lib/models';
import { useEventForm, useScore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

function Scorable(props: Criteria & { id: string; criteria: number; candidate: number }) {
  const score = useScore();
  const event = useEventForm();
  const [state, setState] = useState<string | null>(null);

  const [current, setCurrent] = useState<number | null>(null);

  const ScoreHandler = (value: number) => {
    if (state !== null) return;
    setCurrent(value);

    if (score.value.id === event.value.id) {
      const candidates = score.value.candidates;

      if (candidates[props.candidate] === undefined) {
        candidates[props.candidate] = {
          candidate: event.value.candidateList[props.candidate].name,
          criterias: [],
        };
      }

      if (candidates[props.candidate].criterias[props.criteria] === undefined) {
        candidates[props.candidate].criterias[props.criteria] = value;
      }

      candidates[props.candidate].criterias[props.criteria] = value;
      score.append({ candidates: [...candidates] });
    }
  };

  useEffect(() => {
    if (score.value.id === event.value.id) {
      const candidates = score.value.candidates;

      if (candidates[props.candidate]) {
        if (candidates[props.candidate].criterias[props.criteria]) {
          setCurrent(candidates[props.candidate].criterias[props.criteria]);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (current === null) return;

    if (event.value.id.length > 0) {
      const candidates = score.value.candidates;

      if (candidates[props.candidate] === undefined) {
        candidates[props.candidate] = {
          candidate: event.value.candidateList[props.candidate].name,
          criterias: [],
        };
      }

      if (candidates[props.candidate].criterias[props.criteria] === undefined) {
        candidates[props.candidate].criterias[props.criteria] = current;
      }

      candidates[props.candidate].criterias[props.criteria] = current;
      score.append({ candidates: [...candidates] });
    }
  }, [current]);

  return (
    <View className="w-full p-1.5 my-2 flex flex-row flex-wrap items-center rounded-lg bg-slate-100/70">
      <View className="items-center p-3.5 border-r border-white">
        <Text className="text-xs text-slate-500">Max</Text>
        <Text className="text-lg font-bold text-indigo-600">{props.maxScore}</Text>
      </View>
      <View className="flex-auto mx-3.5">
        <Text className="my-1">{props.name}</Text>
        <View className="w-full my-1">
          <Input
            value={current !== null ? String(current) : undefined}
            error={state !== null ? true : undefined}
            helperText={state !== null ? state : ''}
            keyboardType="number-pad"
            onChangeText={(text) => {
              const num = Number(text);
              setCurrent(num);

              if (num > props.maxScore) {
                setState(`The score limit is ${props.maxScore}`);
              } else if (num < props.minScore) {
                setState(`The minmum score is ${props.minScore}`);
              } else {
                setState(null);
                // ScoreHandler(Number(text));
              }

              if (num < props.minScore) {
                setCurrent(props.minScore);
              } else if (num > props.maxScore) {
                setCurrent(props.maxScore);
              }
            }}
          />
        </View>
      </View>
    </View>
  );
}

export default Scorable;
