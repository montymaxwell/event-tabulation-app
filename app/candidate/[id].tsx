import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View, Image, Pressable, ScrollView } from 'react-native';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';

import Input from '@/components/Input';
import Button from '@/components/Button';
import { Candidate } from '@/lib/models';
import { useEventForm } from '@/lib/store';
import * as ImagePicker from 'expo-image-picker';

function CandidateForm() {
  const router = useRouter();
  const event = useEventForm();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [gender, setGender] = useState<boolean | null>(null);

  const [candidate, setCandidate] = useState<Partial<Candidate>>({
    position: String(event.value.candidateList.length + 1),
    image: null,
  });

  const getImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!res.canceled) {
      setCandidate((prev) => ({ ...prev, image: res.assets[0].uri }));
    }
  };

  const HandleSubmit = () => {
    if (id === 'create') {
      if (!candidate.position || candidate.position.length === 0) {
        return;
      }

      if (!candidate.name || candidate.name.length === 0) {
        return;
      }

      if (!candidate.gender || candidate.gender.length === 0) {
        return;
      }

      event.append({ candidateList: [...event.value.candidateList, candidate as Candidate] });
      router.back();

      return;
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <Image className="w-full h-full absolute" source={require('assets/images/app-bg.png')} />
      <View className="w-full flex flex-row flex-wrap p-5">
        <Pressable
          onPress={() => {
            router.back();
          }}
          className="w-auto p-2.5 rounded-lg bg-white/20 active:bg-white/40">
          <MaterialIcons name="arrow-back-ios-new" size={18} color={'#fff'} />
        </Pressable>
      </View>
      <View className="flex-auto p-5 items-center bg-white">
        <View className="w-full mb-5">
          <Text className="text-xl font-bold text-slate-600">Candidate Information</Text>
        </View>
        <ScrollView className="w-full h-full">
          <View className="w-full h-full items-center">
            <Pressable
              onPress={getImage}
              className="group-isolate w-32 h-32 rounded-full bg-gray-100 active:bg-gray-200">
              {candidate.image !== null ? (
                <View className="w-full h-full rounded-full p-1 bg-blue-400">
                  <Image
                    width={128}
                    height={128}
                    style={{ width: '100%', height: '100%', borderRadius: 999 }}
                    source={{ uri: candidate.image }}
                  />
                </View>
              ) : (
                <></>
              )}
              <View className="w-auto bottom-2 right-0 p-2 absolute rounded-full bg-indigo-500 group-isolate-active:bg-indigo-600">
                <AntDesign name="plus" size={18} color={'#fff'} />
              </View>
            </Pressable>
            <View className="w-full mt-5">
              <View className="w-1/2">
                <Input
                  label="Position / No."
                  value={candidate.position}
                  keyboardType="number-pad"
                  onChangeText={(text) => {
                    setCandidate((prev) => ({ ...prev, position: text }));
                  }}
                />
              </View>
              <View className="w-full my-2">
                <Input
                  label="Name"
                  onChangeText={(text) => {
                    setCandidate((prev) => ({ ...prev, name: text }));
                  }}
                />
              </View>
              <View className="w-full my-2">
                <Input
                  label="Gender"
                  helperText={
                    gender !== null
                      ? !gender
                        ? 'Acceptable input is [male/female]'
                        : undefined
                      : undefined
                  }
                  error={gender !== null ? !gender : undefined}
                  onChangeText={(text) => {
                    if (text.length === 0) {
                      setGender(null);
                      return;
                    }

                    const input = text.toLowerCase();
                    if (input === 'male' || input === 'female') {
                      setCandidate((prev) => ({ ...prev, gender: input }));
                      setGender(true);
                    } else {
                      setGender(false);
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View className="w-full flex flex-row items-center py-3">
          {/* <Button
            color="red"
            label="Delete"
            icon={<FontAwesome name="trash" size={14} color={'#fff'} />}
          /> */}
          <View className="w-auto ml-auto">
            <Button
              onPress={HandleSubmit}
              label="Submit"
              icon={<FontAwesome name="send" size={14} color={'#fff'} />}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default CandidateForm;
