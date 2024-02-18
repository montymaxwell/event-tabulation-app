import Button from '@/components/Button';
import { Candidate } from '@/lib/models';
import { useEventForm } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, Image, Text, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Criteria from './criterias';

function EventDashboard() {
  const event = useEventForm();
  const router = useRouter();

  // return (
  //   <View className="flex-1 p-5">
  //     <View className="flex-auto">
  //       {event.value.id.length > 0 ? (
  //         <>
  //           <View className="w-full mb-3">
  //             <Text className="text-lg font-bold text-slate-600">{event.value.name}</Text>
  //           </View>
  //           <FlatList
  //             data={event.value.candidateList}
  //             keyExtractor={(item) => item.position}
  //             renderItem={({ item, index }: { item: Candidate; index: number }) => (
  //               <Pressable
  //                 onPress={() => {
  //                   // router.push({
  //                   //   pathname: '/(user)/scoring/[candidate]',
  //                   //   params: { candidate: index },
  //                   // });
  //                 }}
  //                 className="w-full my-3 flex flex-row flex-wrap items-center p-3 rounded-lg bg-slate-100/70 active:bg-slate-200/50">
  //                 <View className="w-auto border-r pr-3 border-white">
  //                   <View className="w-12 h-12 flex flex-row justify-center items-center">
  //                     {item.image !== null ? (
  //                       <Image
  //                         width={48}
  //                         height={48}
  //                         className="w-full h-full rounded-full"
  //                         source={{ uri: item.image }}
  //                       />
  //                     ) : (
  //                       <View className="w-auto px-3 py-2.5 rounded-full bg-indigo-500">
  //                         <FontAwesome5 name="user-tie" size={24} color="#fff" />
  //                       </View>
  //                     )}
  //                   </View>
  //                 </View>
  //                 <View className="flex-auto mx-3">
  //                   <Text className="text-xs">Candidate No. {item.position}</Text>
  //                   <Text className="text-lg">{item.name}</Text>
  //                 </View>
  //               </Pressable>
  //             )}
  //           />
  //         </>
  //       ) : (
  //         <></>
  //       )}
  //     </View>
  //     <View className="w-full flex flex-row flex-wrap">
  //       <Button label="Delete" color="red" />
  //       <View className="flex-auto ml-2">
  //         <Button
  //           onPress={() => {
  //             router.push({ pathname: '/(admin)/event/[id]', params: { id: event.value.id } });
  //           }}
  //           label="Edit"
  //           fullsize
  //         />
  //       </View>
  //     </View>
  //   </View>
  // );

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

  return (
    <View className="flex-1 p-5">
      {/* <View className="flex-auto"></View> */}
      {/* <View className="w-full flex flex-row flex-wrap justify-between">
        <Button onPress={StopEvent} label="End Event" />
        <Button onPress={EventRoom} label="Start Event" />
      </View> */}
      <Criteria />
    </View>
  );
}

export default EventDashboard;
