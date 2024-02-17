import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type AlertProps = {
  message?: string;
  color?: 'error' | 'success' | 'warn';
  onPress?: () => void;
};

const colors = {
  error: {
    iconColor: '#fff',
    bg: 'bg-red-400',
    text: 'text-white',
  },
  success: {
    iconColor: '#fff',
    text: 'text-white',
    bg: 'bg-green-400',
  },
  warn: {
    iconColor: '#fff',
    text: 'text-white',
    bg: 'bg-orange-300',
  },
};

function Alert(props: AlertProps) {
  return (
    <View
      className={`w-full p-1 flex flex-row flex-wrap items-center rounded-lg ${
        props.color ? colors[props.color].bg : ''
      }`}>
      <View className="w-auto p-2.5">
        {props.color === 'warn' ? (
          <Ionicons name="warning" size={18} color={colors[props.color].iconColor} />
        ) : (
          <></>
        )}
        {props.color === 'error' ? (
          <MaterialIcons name="error" size={18} color={colors[props.color].iconColor} />
        ) : (
          <></>
        )}
        {props.color === 'success' ? (
          <Ionicons name="checkmark-circle" size={18} color={colors[props.color].iconColor} />
        ) : (
          <></>
        )}
      </View>
      {props.message ? (
        <Text className={`flex-auto ${props.color ? colors[props.color].text : ''}`}>
          {props.message}
        </Text>
      ) : (
        <></>
      )}
      <Pressable className="w-auto p-2.5 rounded-lg active:bg-white/20" onPress={props.onPress}>
        <AntDesign
          name="close"
          size={18}
          color={props.color ? colors[props.color].iconColor : undefined}
        />
      </Pressable>
    </View>
  );
}

export default Alert;
