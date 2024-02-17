import { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

import Button from '@/components/Button';
import { useEventForm, useUser } from '@/lib/store';
import EventDetails from '@/components/Event/EventDetails';
import EventCriteria from '@/components/Event/EventCriteria';
import EventCandidate from '@/components/Event/EventCandidate';

const minStep = 0;
const maxStep = 2;

function EventForm() {
  const user = useUser();
  const event = useEventForm();

  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (id !== 'create') {
    }
  }, []);

  const Submit = async () => {
    if (id === 'create') {
      const form = event.value;

      if (user.value.id.length > 0) {
        if (form.name.length === 0) {
          return;
        }

        if (form.location.length === 0) {
          return;
        }

        if (form.description.length === 0) {
          return;
        }

        if (form.criteriaList.length === 0) {
          return;
        }

        if (form.candidateList.length === 0) {
          return;
        }

        const { error, data } = await supabase.from('events').insert({
          owner: user.value.id,
          name: form.name,
          location: form.location,
          description: form.description,
          criteriaList: form.criteriaList,
          candidateList: form.candidateList,
        });

        if (error) {
          console.log(error);
          return;
        }

        event.reset();
        router.replace('/(admin)/screens/');
      }

      return;
    }

    const { id, ...eventdata } = event.value;
    const { error, data } = await supabase
      .from('events')
      .update(eventdata)
      .eq('id', event.value.id);
    if (error) {
      console.log(error);
      return;
    }

    event.reset();
    router.replace('/(admin)/screens/');
  };

  return (
    <View className="w-full h-full">
      <View className="flex-auto p-5">
        {step === 0 ? <EventDetails /> : <></>}
        {step === 1 ? <EventCriteria /> : <></>}
        {step === 2 ? (
          <View className="flex-1">
            <View className="w-full flex flex-row flex-wrap justify-end items-center">
              <Button
                onPress={() => {
                  router.push({ pathname: '/candidate/[id]', params: { id: 'create' } });
                }}
                label="Candidate"
                icon={<AntDesign name="plus" size={18} color={'#fff'} />}
              />
            </View>
            <View className="flex-auto">
              <EventCandidate />
            </View>
          </View>
        ) : (
          <></>
        )}
      </View>
      <View className="w-full px-5 pt-2 pb-5 flex flex-row flex-wrap items-center bg-white">
        {step > minStep ? (
          <Pressable
            onPress={() => {
              if (step > minStep) {
                setStep((prev) => prev - 1);
              }
            }}
            className="w-auto py-2 px-3.5 rounded-lg active:bg-gray-50">
            <Text className="text-lg text-blue-500">Previous</Text>
          </Pressable>
        ) : (
          <></>
        )}
        {step < maxStep ? (
          <Pressable
            onPress={() => {
              if (step < maxStep) {
                setStep((prev) => prev + 1);
              }
            }}
            className="w-auto py-2 px-3.5 ml-auto rounded-lg active:bg-gray-50">
            <Text className="text-lg text-blue-500">Next</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              Submit().then();
            }}
            className="w-auto py-2 px-3.5 ml-auto rounded-lg active:bg-gray-50">
            <Text className="text-lg text-blue-500">Submit</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default EventForm;
