import Button from '@/components/Button';
import { EventData } from '@/lib/models';
import { useEventForm, useUser } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

function UserHomeScreen() {
  const router = useRouter();
  const event = useEventForm();
  const user = useUser();
  const userID = useUser((state) => state.value.id);
  const [events, setEvents] = useState<Array<EventData>>([]);

  const getEvents = () => {
    event.reset();

    if (userID.length > 0) {
      supabase
        .from('events')
        .select('*')
        .neq('owner', userID)
        .eq('marked', false)
        .then(({ error, data }) => {
          if (error) {
            console.log(error);
            return;
          }

          setEvents(data);
        });
      return;
    }

    supabase
      .from('events')
      .select('*')
      .eq('marked', false)
      .then(({ error, data }) => {
        if (error) {
          console.log(error);
          return;
        }

        setEvents(data);
      });
  };

  useEffect(() => {
    getEvents();
  }, [user.value]);

  useFocusEffect(
    useCallback(() => {
      getEvents();
    }, [])
  );

  const JoinRoom = async () => {
    const room = supabase.channel(event.value.id);
  };

  return (
    <View className="flex-auto p-5">
      <View className="w-full p-3">
        <Text className="text-lg text-slate-500 font-bold">Available Events</Text>
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View className="w-full p-3 flex flex-row flex-wrap items-center">
            <View className="flex-auto">
              <Text className="text-base font-bold text-slate-600">{item.name}</Text>
            </View>
            <Button
              size="sm"
              label="Judge"
              onPress={() => {
                router.push({ pathname: '/(user)/event/[id]', params: { id: item.id } });
                JoinRoom().then();
              }}
              icon={<Ionicons name="enter" size={16} color={'#fff'} />}
            />
          </View>
        )}
      />
    </View>
  );
}

export default UserHomeScreen;
