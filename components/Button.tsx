import { Text, View, Pressable, ActivityIndicator } from 'react-native';

type ButtonProps = {
  label: string;
  loading?: boolean;
  fullsize?: boolean;
  color?: 'default' | 'dark' | 'red';
  icon?: React.ReactNode;
  onPress?: () => void;
  size?: 'sm' | 'lg';
};

const colors = {
  default: 'bg-blue-400 active:bg-blue-500',
  dark: 'bg-gray-700 active:bg-gray-800',
  red: 'bg-red-400 active:bg-red-500',
};

const sizes = {
  base: 128,
  sm: 94,
  lg: 256,
};

const padding = {
  base: 'px-3.5 py-2.5',
  sm: 'px-2.5 py-2',
  lg: 'px-3.5 py-3',
};

const icon_padding = {
  base: 'p-2 pr-4 mr-2',
  sm: 'p-1 pr-2 mr-1',
  lg: '',
};

const text = {
  lg: 'text-lg',
  sm: 'text-xs',
};

function Button(props: ButtonProps) {
  return (
    <Pressable
      disabled={props.loading}
      onPress={props.onPress}
      style={{
        minWidth: props.size ? sizes[props.size] : sizes.base,
        width: props.fullsize && props.fullsize ? '100%' : undefined,
      }}
      className={`rounded-lg items-center justify-center flex flex-row ${
        props.size ? padding[props.size] : padding.base
      } ${props.color ? colors[props.color] : colors.default}`}>
      {props.loading ? (
        props.loading ? (
          <View className="w-auto pl-2 py-1.5 pr-3 -ml-1 mr-2 border-r border-white/30">
            <ActivityIndicator color="white" />
          </View>
        ) : props.icon ? (
          <View
            className={`w-auto ${
              props.size ? icon_padding[props.size] : icon_padding.base
            } border-r border-white/30`}>
            {props.icon}
          </View>
        ) : (
          <></>
        )
      ) : props.icon ? (
        <View
          className={`w-auto ${
            props.size ? icon_padding[props.size] : icon_padding.base
          } pl-1 border-r border-white/30`}>
          {props.icon}
        </View>
      ) : (
        <></>
      )}
      <View className="w-auto mx-auto">
        <Text className={`${props.size ? (text as any)[props.size] : 'text-base'} text-white`}>
          {props.label}
        </Text>
      </View>
    </Pressable>
  );
}

export default Button;
