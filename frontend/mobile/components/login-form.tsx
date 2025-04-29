import { StyleSheet, Button, TextInput, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import React from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from 'react-hook-form';
import useSWRMutation from 'swr/mutation'
import { LogInUser } from "@/user-api-types"
import { setToken } from "@/components/securestore"
import { Notify } from './notify';
import MainView from '@/components/MainView'

const formSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
})

async function logIn(url: string, { arg }: { arg: LogInUser }) {
  return fetch(url, {
    headers: {
      'CF-Access-Client-Id': process.env.EXPO_PUBLIC_API_CF_CLIENT_ID!,
      'CF-Access-Client-Secret': process.env.EXPO_PUBLIC_API_CF_ACCESS_CLIENT_SECRET!,
    },
    method: 'POST',
    body: JSON.stringify(arg)
  }).then((res) => res)
}

export default function LoginForm() {

  const { trigger } = useSWRMutation(`${process.env.EXPO_PUBLIC_API_URL}/api/user/login`, logIn)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await trigger(values)
      if (res.ok) {
        const token = await res.text();
        await setToken(token.trim())
        console.log(token)
        router.push('/home')
        return
      }
      Notify.error(await res.text());
    } catch (err) {
      Notify.error(String(err))
    }
  }

  //if (error) { <Text>{error.message}</Text> }
  return (
    <MainView>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Login</Text>
      </View>
      <View style={styles.stepContainer}>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor='white'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="username"
        />
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor='white'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
            />
          )}
          name="password"
        />
      </View>
      <View style={styles.button}>
        <Button title="Login" onPress={handleSubmit(onSubmit)}></Button>
        <Text style={styles.signUpText}>Don't Have an Account?</Text>
        <Link href="/signup" asChild>
          <Text style={styles.signUpLink}>Sign Up!</Text>
        </Link>
      </View>
    </MainView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    paddingTop: 75,
    height: 200,
    marginLeft: 5,
    marginRight: 5,
  },
  title: {
    paddingTop: 30,
    fontSize: 30,
    color: 'white',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
  },
  stepContainer: {
    gap: 8,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 10,
    width: '100%',
    marginRight: 10,
  },
  button: {
    alignSelf: 'center',
    width: 200,
    position: 'relative',
    top: 120
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: 'gray',
    color: 'gray',
  },
  signUpText: {
    alignSelf: 'center'
  },
  signUpLink: {
    alignSelf: 'center',
    color: 'lightblue'
  }
});
