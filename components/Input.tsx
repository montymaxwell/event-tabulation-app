import { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { View, TextInput, Pressable, Text, KeyboardType } from 'react-native';

type InputProps = {
  value?: string;
  label?: string;
  error?: boolean;
  multiline?: boolean;
  helperText?: string;
  placeholder?: string;
  inlineLabel?: string;
  numberOfLines?: number;
  icon?: React.ReactNode;
  securedTextEntry?: boolean;
  pressable?: React.ReactNode;
  disableClearOnBlur?: boolean;
  keyboardType?: KeyboardType;
  onChangeText?: (text: string) => void;
};

const variant = {
  default: 'focus:border-2 focus:border-blue-300',
  red: 'border-red-300',
  green: 'border-green-300',
};

function Input(props: InputProps) {
  const [data, setData] = useState<string>(props.value ? props.value : '');
  const [isDeletable, setDeletable] = useState<boolean>(data !== '');

  useEffect(() => {
    setData(props.value ? props.value : '');
  }, [props.value]);

  useEffect(() => {
    if (props.onChangeText) {
      props.onChangeText(data);
    }

    if (data.length > 0) {
      setDeletable(true);
    } else {
      setDeletable(false);
    }
  }, [data]);

  const ClearText = () => {
    if (isDeletable === true) {
      setData('');
      setDeletable(false);

      if (props.onChangeText) {
        props.onChangeText('');
      }
    }
  };

  return (
    <View className="flex-auto">
      {props.label ? (
        <View className="w-full mx-1 mb-1">
          <Text className="text-slate-700">{props.label}</Text>
        </View>
      ) : (
        <></>
      )}
      <View
        className={`flex flex-row flex-wrap p-1 items-center border rounded-lg border-slate-400 ${
          props.error ? (props.error ? variant['red'] : variant['green']) : variant['default']
        }`}>
        {props.inlineLabel ? (
          <View className="w-auto p-2.5 rounded-lg bg-slate-200/70">
            <Text>{props.inlineLabel}</Text>
          </View>
        ) : (
          <></>
        )}
        {props.icon ? <View className="w-auto p-2 rounded-lg">{props.icon}</View> : <></>}
        <TextInput
          placeholder={props.placeholder}
          value={data}
          keyboardType={props.keyboardType}
          multiline={props.multiline}
          numberOfLines={props.numberOfLines}
          style={{
            textAlignVertical: 'top',
          }}
          secureTextEntry={props.securedTextEntry}
          className="flex-auto text-lg my-1.5 mx-1"
          onFocus={() => {
            if (data.length > 0) {
              setDeletable(true);
            }
          }}
          onEndEditing={() => {
            if (props.securedTextEntry) {
            }
          }}
          onBlur={() => {
            if (props.securedTextEntry !== undefined && props.securedTextEntry) {
              setDeletable(false);
            }

            if (props.disableClearOnBlur !== undefined && props.disableClearOnBlur === true) {
              setDeletable(false);
            }
          }}
          onChangeText={(text) => {
            setData(text);
          }}
        />

        {props.pressable ? props.pressable : <></>}
        {isDeletable ? (
          <Pressable
            onPress={() => {
              ClearText();
            }}
            className="w-auto p-2 rounded-lg active:bg-gray-200/60">
            <AntDesign name="close" size={20} />
          </Pressable>
        ) : (
          <></>
        )}
      </View>
      {props.helperText ? (
        <View className="w-full mt-2 flex flex-row justify-between">
          <Text
            className={`text-xs ${props.error && props.error ? 'text-red-400' : 'text-green-400'}`}>
            {props.helperText}
          </Text>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}

export default Input;
