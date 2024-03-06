import { useEffect, useState } from 'react';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
import { Pressable, View, Text, FlatList, Modal } from 'react-native';

import Alert from '../Alert';
import Input from '../Input';
import { ClientResponse, Criteria } from '@/lib/models';
import { useEventForm } from '@/lib/store';

function EventCategory() {
  const event = useEventForm();

  const [maxScore, setMaxScore] = useState<number>(10);
  const [currentData, setCurrentData] = useState<Partial<Criteria>>({ minScore: 1, maxScore });
  const [list, setList] = useState<Array<Criteria>>(event.value.category as any);
  const [alert, setAlert] = useState<ClientResponse | null>(null);

  const [itemIndex, setItemIndex] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<boolean>(false);

  useEffect(() => {
    event.append({ category: [...list] });
  }, [list]);

  const add = () => {
    if (maxScore === 0) {
      setAlert({ status: 'error', message: '[ClientError]: Maximum score limit reached!' });
      return;
    }

    if (!currentData.name || currentData.name.length === 0) {
      setAlert({ status: 'warn', message: '[ClientError]: Criteria Name must be filled' });
      return;
    }

    if (!currentData.minScore || currentData.minScore === 0) {
      setAlert({ status: 'warn', message: '[ClientError]: Min. Score must be filled' });
      return;
    }

    if (!currentData.maxScore || currentData.maxScore === 0) {
      setAlert({ status: 'warn', message: '[ClientError]: Max Score must be filled' });
      return;
    }

    if (currentData.maxScore > maxScore) {
      setAlert({ status: 'error', message: '[ClientError]: Maximum score exceeded the amount!' });
      return;
    }

    if (maxScore > 0) {
      setList((prev) => [...prev, currentData as Criteria]);
      setCurrentData({ minScore: 1, maxScore: maxScore });
    }
  };

  const remove = () => {
    const mutableList = list;
    if (itemIndex !== null && mutableList[itemIndex] !== undefined) {
      setConfirmModal(false);
      setMaxScore(maxScore + mutableList[itemIndex].maxScore);
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
              <Text className="text-lg p-2 text-slate-500">Delete Critera</Text>
              <Pressable
                onPress={() => setConfirmModal(false)}
                className="w-auto p-2 rounded-lg active:bg-slate-100">
                <AntDesign name="close" size={18} color="#94a3b8" />
              </Pressable>
            </View>
            <View className="w-full p-5 my-2 border-y border-slate-200">
              {itemIndex !== null ? (
                <Text>Are you sure you want to delete critera {list.at(itemIndex)!.name}?</Text>
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
      {alert !== null ? (
        <View className="w-full mb-2">
          <Alert
            color={alert.status}
            message={alert.message}
            onPress={() => {
              setAlert(null);
            }}
          />
        </View>
      ) : (
        <></>
      )}
      <View className="w-full flex flex-row flex-wrap my-2">
        <View className="w-full mb-5">
          <Text className="text-xl font-bold text-slate-600">Minor Category</Text>
        </View>
        <View className="flex-auto mr-2">
          <Input
            value={currentData.name}
            onChangeText={(text) => {
              setCurrentData((prev) => ({ ...prev, name: text }));
            }}
          />
        </View>
        <Pressable
          onPress={add}
          className="w-auto items-center justify-center p-3 px-4 rounded-lg bg-blue-400 active:bg-blue-500">
          <AntDesign name="plus" size={18} color={'#fff'} />
        </Pressable>
      </View>
      <View className="w-full flex flex-row flex-wrap my-2">
        <View className="w-1/2 pr-1">
          <Input
            inlineLabel="Min."
            placeholder="Score"
            keyboardType="number-pad"
            value={currentData.minScore ? String(currentData.minScore) : undefined}
            onChangeText={(text) => {
              setCurrentData((prev) => ({ ...prev, minScore: Number(text) }));
            }}
          />
        </View>
        <View className="w-1/2 pl-1">
          <Input
            inlineLabel="Max"
            placeholder="Score"
            keyboardType="number-pad"
            value={String(maxScore)}
            onChangeText={(text) => {
              setCurrentData((prev) => ({ ...prev, maxScore: Number(text) }));
            }}
          />
        </View>
      </View>
      <FlatList
        data={list}
        renderItem={({ item, index }) => (
          <View className="w-full p-1.5 my-2 flex flex-row flex-wrap items-center rounded-lg bg-slate-100/70">
            <View className="p-3.5 border-r border-white">
              <Text>{item.maxScore}</Text>
            </View>
            <View className="flex-auto mx-3.5">
              <Text>{item.name}</Text>
            </View>
            <Pressable
              onPress={() => {
                setItemIndex(index);
                setConfirmModal(true);
              }}
              className="w-auto p-3.5 flex justify-center items-center r rounded-lg active:bg-slate-200/60">
              <FontAwesome6 name="trash" size={14} color="#94a3b8" />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

export default EventCategory;
