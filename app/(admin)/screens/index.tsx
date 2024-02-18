import Button from '@/components/Button';
import { EventData } from '@/lib/models';
import { useEventForm, useUser } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

function AdminHomeScreen() {
  const userID = useUser((state) => state.getID());
  const router = useRouter();
  const event = useEventForm();

  const [events, setEvents] = useState<Array<EventData>>([]);

  useFocusEffect(
    useCallback(() => {
      event.reset();

      if (userID.length > 0) {
        supabase
          .from('events')
          .select('*')
          .eq('owner', userID)
          .then(({ error, data }) => {
            if (error) {
              console.log(error);
              return;
            }

            setEvents(data);
          });
      }
    }, [])
  );

  return (
    <View className="flex-1 p-5">
      <View className="w-full mb-3 flex flex-row items-center">
        <Text className="text-base font-bold mr-auto text-slate-400">My Events</Text>
        <Button
          size="sm"
          label="Event"
          icon={<AntDesign name="plus" size={14} color={'#fff'} />}
          onPress={() => {
            router.push({ pathname: '/(admin)/event/[id]', params: { id: 'create' } });
          }}
        />
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View className="w-full my-2 py-3 flex flex-row flex-wrap items-center">
            <Text className="mr-auto">{item.name}</Text>
            <Button
              size="sm"
              label="Manage"
              onPress={() => {
                router.push({ pathname: '/(admin)/dashboard/[event]', params: { event: item.id } });
                event.write(item);
              }}
              icon={<FontAwesome6 name="user-gear" size={12} color="#fff" />}
            />
          </View>
        )}
      />
    </View>
  );
}

export default AdminHomeScreen;
