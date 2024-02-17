import { ScrollView, Text, View } from 'react-native';
import Input from '../Input';
import { useEffect, useState } from 'react';
import { useEventForm } from '@/lib/store';

type FormData = {
  name?: string;
  location?: string;
  description?: string;
};

type FormProps = {
  initialData?: FormData;
  getData?: (data: any) => void;
};

function EventDetails(props: FormProps) {
  const event = useEventForm();
  const [data, setData] = useState<FormData>(props.initialData ? props.initialData : {});

  useEffect(() => {
    if (props.getData) {
      props.getData(data);
    }

    event.append({ ...data });
  }, [data.name, data.location, data.description]);

  useEffect(() => {
    if (event.value.id.length > 0) {
      setData({
        name: event.value.name,
        location: event.value.location,
        description: event.value.description,
      });
    }
  }, []);

  return (
    <ScrollView className="flex-1">
      <View className="w-full my-2">
        <Input
          value={data.name}
          disableClearOnBlur
          label="Event Name"
          onChangeText={(text) => {
            setData((prev) => ({ ...prev, name: text }));
          }}
        />
      </View>
      <View className="w-full my-2">
        <Input
          value={data.location}
          disableClearOnBlur
          label="Event Location"
          onChangeText={(text) => {
            setData((prev) => ({ ...prev, location: text }));
          }}
        />
      </View>
      <View className="w-full my-2">
        <Input
          value={data.description}
          disableClearOnBlur
          multiline={true}
          numberOfLines={4}
          label="Event Description"
          onChangeText={(text) => {
            setData((prev) => ({ ...prev, description: text }));
          }}
        />
      </View>
    </ScrollView>
  );
}

export default EventDetails;
