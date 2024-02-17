import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import Alert from '@/components/Alert';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';
import { ClientResponse } from '@/lib/models';
import { useUser } from '@/lib/store';

function AuthRegister() {
  const user = useUser();
  const router = useRouter();

  const [hidden, setHidden] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [matched, setMatched] = useState<boolean | null>(null);
  const [response, setResponse] = useState<ClientResponse | null>(null);

  const [form, setForm] = useState<{ email?: string; password?: string; confirmPassword?: string }>(
    {}
  );

  useEffect(() => {
    if (user.value.id.length > 0) {
      router.replace('/(admin)/screens/');
    }
  }, [user.value.id]);

  const Matcher = (text1: string, text2: string) => {
    if (text1 === text2) {
      return true;
    } else return false;
  };

  const Submit = async () => {
    if (!form.email || form.email.length === 0 || !form.email.includes('@')) {
      setResponse({ status: 'warn', message: '[ClientError]: Email is required!' });
      return;
    }

    if (!form.password) {
      setResponse({
        status: 'warn',
        message: '[ClientError]: Password is required!',
      });
      return;
    }

    if (!form.confirmPassword) {
      setResponse({
        status: 'warn',
        message: '[ClientError]: Confirm Password is required!',
      });
      return;
    }

    if (!matched) {
      setResponse({
        status: 'warn',
        message: '[ClientError]: Passwords must match!',
      });
      return;
    }

    setLoading(true);
    const { error, data } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setLoading(false);
      console.log(error.status);
      if (error.status === 400) {
        setResponse({ status: 'error', message: '[AuthError]: User Already Registered!' });
      } else if (error.status === 422) {
        setResponse({
          status: 'error',
          message: '[AuthError]: Passwords must be 6 characters long or more.',
        });
      }

      return;
    }

    // if (data.user && data.user.email) {
    //   const profile = await supabase.from('profiles').select('username').eq('id', data.user.id);

    //   if (profile.error) {
    //     setLoading(false);
    //     console.log(profile.error);
    //     user.write({ id: data.user.id, email: data.user.email, username: null });
    //     return;
    //   }

    //   if (profile.data) {
    //     const { username } = profile.data[0];
    //     if (username) {
    //       user.write({ id: data.user.id, email: data.user.email, username });
    //     } else {
    //       user.write({ id: data.user.id, email: data.user.email, username: null });
    //     }
    //   }
    // }

    setResponse({ status: 'success', message: '[Auth]: Successfully Registered!' });
    setLoading(false);
    router.push('/(admin)/screens/');
  };

  return (
    <View className="w-full">
      {response !== null ? (
        <View className="w-full mb-2">
          <Alert
            color={response.status}
            message={response.message}
            onPress={() => {
              setResponse(null);
            }}
          />
        </View>
      ) : (
        <></>
      )}
      <View className="w-full my-2">
        <Input
          placeholder="Email"
          onChangeText={(text) => {
            setForm((prev) => ({ ...prev, email: text }));
          }}
          icon={<MaterialIcons name="email" size={20} color={'#cbd5e1'} />}
        />
      </View>
      <View className="w-full my-2">
        <Input
          placeholder="Password"
          securedTextEntry={hidden}
          onChangeText={(text) => {
            setForm((prev) => ({ ...prev, password: text }));
            if (text.length > 0) {
              if (form.confirmPassword) {
                setMatched(Matcher(text, form.confirmPassword));
              }

              return;
            }
            setMatched(null);
          }}
          error={matched !== null ? !matched : undefined}
          helperText={
            matched !== null
              ? matched
                ? 'Password Matched!'
                : 'Password does not match!'
              : undefined
          }
          icon={<MaterialIcons name="password" size={20} color={'#cbd5e1'} />}
          pressable={
            <Pressable className="w-auto p-2" onPress={() => setHidden(!hidden)}>
              <Ionicons name={hidden ? 'eye' : 'eye-off'} size={20} color={'#cbd5e1'} />
            </Pressable>
          }
        />
      </View>
      <View className="w-full my-2">
        <Input
          placeholder="Confirm Password"
          securedTextEntry={hidden}
          onChangeText={(text) => {
            setForm((prev) => ({ ...prev, confirmPassword: text }));
            if (text.length > 0) {
              if (form.password) {
                setMatched(Matcher(text, form.password));
              }

              return;
            }

            setMatched(null);
          }}
          error={matched !== null ? !matched : undefined}
          helperText={
            matched !== null
              ? matched
                ? 'Password Matched!'
                : 'Password does not match!'
              : undefined
          }
          icon={<MaterialIcons name="password" size={20} color={'#cbd5e1'} />}
          pressable={
            <Pressable className="w-auto p-2" onPress={() => setHidden(!hidden)}>
              <Ionicons name={hidden ? 'eye' : 'eye-off'} size={20} color={'#cbd5e1'} />
            </Pressable>
          }
        />
      </View>
      <View className="w-full my-2">
        <Button fullsize loading={loading} onPress={Submit} size="lg" label="Sign-Up" />
      </View>
      <Pressable
        onPress={() => {
          router.replace('/(auth)/');
        }}
        className="w-full my-1 p-2 flex flex-row flex-wrap justify-center items-center">
        <Text>Already have an account? </Text>
        <Text className="text-blue-500">Login</Text>
        <Text className="ml-1">instead!</Text>
      </Pressable>
    </View>
  );
}

export default AuthRegister;
