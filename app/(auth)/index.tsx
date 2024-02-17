import Alert from '@/components/Alert';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { ClientResponse } from '@/lib/models';
import { useUser } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

function AuthLogin() {
  const user = useUser();
  const router = useRouter();
  const [hidden, setHidden] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<{ email?: string; password?: string }>({});
  const [response, setResponse] = useState<ClientResponse | null>(null);

  useEffect(() => {
    if (user.value.id.length > 0) {
      router.replace('/(admin)/screens/');
    }
  }, [user.value.id]);

  const Submit = async () => {
    if (!form.email || form.email.length === 0) {
      setResponse({ status: 'warn', message: '[ClientError]: Email is required!' });
      return;
    }

    if (!form.password || form.password.length === 0) {
      setResponse({ status: 'warn', message: '[ClientError]: Password is required!' });
      return;
    }

    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setLoading(false);
      console.log(error);
      return;
    }

    if (data.user && data.user.email) {
      const profile = await supabase.from('profiles').select('username').eq('id', data.user.id);

      if (profile.error) {
        setLoading(false);
        console.log(profile.error);
        user.write({ id: data.user.id, email: data.user.email, username: null });
        return;
      }

      if (profile.data && profile.data.length > 0) {
      } else {
        user.write({ id: data.user.id, email: data.user.email, username: null });
      }
    }

    setLoading(false);
  };

  return (
    <View className="w-full">
      {response ? (
        <View className="w-full mb-2">
          <Alert
            color={response.status}
            message={response.message}
            onPress={() => setResponse(null)}
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
          }}
          icon={<MaterialIcons name="password" size={20} color={'#cbd5e1'} />}
          pressable={
            <Pressable className="w-auto p-2" onPress={() => setHidden(!hidden)}>
              <Ionicons name={hidden ? 'eye' : 'eye-off'} size={20} color={'#cbd5e1'} />
            </Pressable>
          }
        />
      </View>
      <View className="w-full my-2">
        <Button loading={loading} fullsize onPress={Submit} size="lg" label="Login" />
      </View>
      <Pressable
        onPress={() => {
          router.replace('/(auth)/register');
        }}
        className="w-full my-1 p-2 flex flex-row flex-wrap justify-center items-center">
        <Text>Don't have an account? </Text>
        <Text className="text-blue-500">Sign Up</Text>
        <Text className="ml-1">instead!</Text>
      </Pressable>
    </View>
  );
}

export default AuthLogin;
