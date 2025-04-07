import { StyleSheet, Button, TextInput } from 'react-native';
import { Link, Redirect } from 'expo-router';
import React from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from 'react-hook-form';
import useSWRMutation from 'swr/mutation'
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LogInUser } from "@/user-api-types"
import { setToken, getToken } from "@/components/securestore"

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
  }).then(res => res.text())
}

export default function LoginForm() {

  const { data, trigger, error, isMutating } = useSWRMutation(`${process.env.EXPO_PUBLIC_API_URL}/api/user/login`, logIn, { throwOnError: false })
  console.log(`${process.env.EXPO_PUBLIC_API_URL}/api/user/login`)

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

  if (error) { console.log("Error: ", String(error)) }

  if (data) {
    setToken(data)
  }

  let token = getToken()
  if (token) {
    return <Redirect href={'/home'} />
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    trigger(values)
  }

  return (
    <ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>Login</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
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
      </ThemedView>
      <ThemedView style={styles.button}>
        <Button title="Login" onPress={handleSubmit(onSubmit)}></Button>
        <ThemedText style={styles.signUpText}>Don't Have an Account?</ThemedText>
        <Link href="/signup" asChild>
          <ThemedText style={styles.signUpLink}>Sign Up!</ThemedText>
        </Link>
      </ThemedView>
    </ThemedView>
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
    fontSize: 30,
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
    borderColor: 'white',
    color: 'white'
  },
  signUpText: {
    alignSelf: 'center'
  },
  signUpLink: {
    alignSelf: 'center',
    color: 'lightblue'
  }
});
