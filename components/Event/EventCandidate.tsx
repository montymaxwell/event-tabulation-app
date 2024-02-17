import { useState } from 'react';
import { AntDesign, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { FlatList, Image, Modal, Pressable, Text, View } from 'react-native';

import { Candidate } from '@/lib/models';
import { useEventForm } from '@/lib/store';

function EventCandidate() {
  const [list, setList] = useEventForm((state) => [
    state.value.candidateList,
    (candidates: Array<Candidate>) => {
      state.append({ candidateList: candidates });
    },
  ]);

  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [itemIndex, setItemIndex] = useState<number | null>(null);

  const remove = () => {
    const mutableList = list;
    if (itemIndex !== null && mutableList[itemIndex] !== undefined) {
      setConfirmModal(false);
      mutableList.splice(itemIndex, 1);
      setItemIndex(null);
      setList([...mutableList]);
    }
  };

  return (
    <View className="w-full">
      <Modal transparent={true} visible={confirmModal}>
        <View className="w-full h-full flex justify-center items-center p-5 bg-black/70" style={{}}>
          <View className="w-full rounded-lg bg-white">
            <View className="w-full p-1 flex flex-row flex-wrap items-center justify-between">
              <Text className="text-lg p-2 text-slate-500">Delete Candidate</Text>
              <Pressable
                onPress={() => setConfirmModal(false)}
                className="w-auto p-2 rounded-lg active:bg-slate-100">
                <AntDesign name="close" size={18} color="#94a3b8" />
              </Pressable>
            </View>
            <View className="w-full p-5 my-2 border-y border-slate-200">
              {itemIndex !== null ? (
                <Text>Are you sure you want to delete candidate {list.at(itemIndex)!.name}?</Text>
              ) : (
                <></>
              )}
            </View>
            <View className="w-full flex flex-row flex-wrap">
              <Pressable
                onPress={() => setConfirmModal(false)}
                className="flex-auto p-3 rounded-l-lg active:bg-slate-100/80">
                <Text className="w-full text-lg text-center text-red-500">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={remove}
                className="flex-auto p-3 rounded-r-lg active:bg-slate-100/80">
                <Text className="w-full text-lg text-center text-green-500">Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={list}
        renderItem={({ item, index }) => (
          <View className="w-full my-3 flex flex-row flex-wrap items-center p-3 rounded-lg bg-slate-100/70">
            <View className="w-auto border-r pr-3 border-white">
              <View className="w-12 h-12 flex flex-row justify-center items-center">
                {item.image !== null ? (
                  <Image
                    width={48}
                    height={48}
                    className="w-full h-full rounded-full"
                    source={{ uri: item.image }}
                  />
                ) : (
                  <View className="w-auto px-3 py-2.5 rounded-full bg-indigo-500">
                    <FontAwesome5 name="user-tie" size={24} color="#fff" />
                  </View>
                )}
              </View>
            </View>
            <View className="flex-auto mx-3">
              <Text className="text-xs">Candidate No. {item.position}</Text>
              <Text className="text-lg">{item.name}</Text>
            </View>
            <Pressable>
              <Pressable
                onPress={() => {
                  setItemIndex(index);
                  setConfirmModal(true);
                }}
                className="w-auto p-3.5 flex justify-center items-center r rounded-lg active:bg-slate-200/60">
                <FontAwesome6 name="trash" size={14} color="#94a3b8" />
              </Pressable>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

export default EventCandidate;
