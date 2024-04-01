import Button from '@/components/Button';
import { Candidate } from '@/lib/models';
import { useEventForm } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, Image, Text, FlatList, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Criteria from './criterias';
import { useState } from 'react';
import EventData from './data';

function EventDashboard() {
  const event = useEventForm();
  const router = useRouter();

  const [confirmModal, setConfirmModal] = useState<boolean>(false);

  const EventRoom = async () => {
    console.log(supabase.getChannels());
    const room = supabase.channel(event.value.id);

    room
      .on('presence', { event: 'sync' }, () => {
        const state = room.presenceState();
        console.log('sync: ', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('join: ', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('leave: ', key, leftPresences);
      })
      .subscribe();

    room.track({});
  };

  const StopEvent = async () => {
    const room = supabase.channel(event.value.id);
    supabase.removeChannel(room);
  };

  const remove = () => {
    supabase
      .from('events')
      .update({ marked: true })
      .eq('id', event.value.id)
      .then(({ error, data }) => {
        if (error) {
          console.log(error);
          return;
        }

        router.back();
      });
  };

  return (
    <View className="flex-1 p-5">
      <Modal transparent={true} visible={confirmModal}>
        <View className="w-full h-full flex justify-center items-center p-5 bg-black/70" style={{}}>
          <View className="w-full rounded-lg bg-white">
            <View className="w-full p-1 flex flex-row flex-wrap items-center justify-between">
              <Text className="text-lg p-2 text-slate-500">Delete Critera</Text>
              <Pressable
                onPress={() => setConfirmModal(false)}
                className="w-auto p-2 rounded-lg active:bg-slate-100">
                <AntDesign name="close" size={18} color="#94a3b8" />
              </Pressable>
            </View>
            <View className="w-full p-5 my-2 border-y border-slate-200">
              <Text>Are you sure you want to delete event?</Text>
            </View>
            <View className="w-full flex flex-row flex-wrap">
              <Pressable
                onPress={() => setConfirmModal(false)}
                className="flex-auto p-3 rounded-l-lg active:bg-slate-100/80">
                <Text className="w-full text-lg text-center text-red-500">Cancel</Text>
              </Pressable>
              {/* <View className="border-r border-slate-300"></View> */}
              <Pressable
                onPress={remove}
                className="flex-auto p-3 rounded-r-lg active:bg-slate-100/80">
                <Text className="w-full text-lg text-center text-green-500">Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* <Criteria /> */}
      <EventData />
      <View className='w-full flex flex-row flex-wrap my-5 justify-end'>
        <Pressable onPress={() => { router.push('/(admin)/dashboard/document') }} className='w-auto px-5 py-2.5 rounded-lg bg-slate-200 active:bg-slate-300'>
          <Text className='text-base text-slate-600'>Generate Results</Text>
        </Pressable>
      </View>
      <View className="w-full flex flex-row flex-wrap">
        <Button
          onPress={() => {
            setConfirmModal(true);
          }}
          label="Delete"
          color="red"
        />
        <View className="flex-auto ml-2">
          <Button
            onPress={() => {
              router.push({ pathname: '/(admin)/event/[id]', params: { id: event.value.id } });
            }}
            label="Edit"
            fullsize
          />
        </View>
      </View>
    </View>
  );
}

export default EventDashboard;
