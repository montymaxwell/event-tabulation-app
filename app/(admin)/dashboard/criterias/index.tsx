import Button from '@/components/Button';
import { useEventForm } from '@/lib/store';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

function Criteria() {
  const router = useRouter();
  const event = useEventForm();

  if (event.value.id.length > 0) {
    return (
      <View className="flex-1">
        {/* <View className="w-full"></View> */}
        <ScrollView>
          {event.value.criteriaList.map((criteria, index) => (
            <View
              key={index}
              className="w-full flex flex-row flex-wrap items-center py-2.5 px-3.5 my-2 rounded-lg bg-slate-100">
              <View className="flex-auto">
                <Text>{criteria.name}</Text>
              </View>
              <Button
                onPress={() => {
                  router.push({
                    pathname: '/(admin)/dashboard/criterias/[selection]',
                    params: { selection: index },
                  });
                }}
                size="sm"
                label="Scores"
              />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  } else return <></>;
}

export default Criteria;
