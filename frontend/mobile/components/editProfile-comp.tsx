import { StyleSheet, Button, Image, View, TextInput, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useSWRMutation from 'swr/mutation';
import useSWR from "swr"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { GetUserRow, Firstname, Lastname } from '@/user-api-types'
import { getToken, IdentityContext } from '@/components/securestore'
import { useContext } from "react"
import { Headers } from '@/constants/header-options'

const formSchema = z.object({
  username: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  phone: z.string(),
})

async function getProfileArgs(url: string, arg: string) {
  return fetch(url, {
    method: 'POST',
    headers: Headers,
    redirect: 'follow',
    body: arg
  }).then(res => res.json())
}

async function changeProfile(url: string, { arg }) {
  return fetch(url, {
      headers: Headers,
      method: 'PUT',
      body: JSON.stringify(arg)
  }).then(res => res.json())
}

const fetcher = async  (url: string) => {
  const res = await fetch(url, {
    headers: Headers
  })
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

let token = getToken()
let id = 1

export default function EditProfileComp() {

  const identity = useContext(IdentityContext)
  const router = useRouter()

  const { data: tokenData } = useSWR([`${process.env.EXPO_PUBLIC_API_URL}/api/user/decrypt`, token], ([url, token]) => getProfileArgs(url, token))
  if (tokenData)
    id = tokenData.id

  const { trigger } = useSWRMutation(`${process.env.EXPO_PUBLIC_API_URL}/api/user/update`, changeProfile, {throwOnError: false})

  const { data: user, mutate: userMutate } = useSWR<GetUserRow[], string>(identity ? `${process.env.EXPO_PUBLIC_API_URL}/api/user/search?id=${id}` : null, fetcher)

  if (!user) return <ThemedText>Loading...</ThemedText>;  

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user[0].username,
      firstname: user[0].firstname.Valid? user[0].firstname.String : "",
      lastname: user[0].lastname.Valid? user[0].lastname.String : "",
      email: user[0].email,
      phone: user[0].phone,
    },
  })

  async function profileSubmit(values: z.infer<typeof formSchema>) {
    const username: Firstname = {
      String: values.username,
      Valid: Boolean(values.username)
    }
    const firstname: Firstname = {
        String: values.firstname,
        Valid: Boolean(values.firstname)
    }
    const lastname: Lastname = {
        String: values.lastname,
        Valid: Boolean(values.lastname)
    }
    const email: Firstname = {
        String: values.email,
        Valid: Boolean(values.email)
    }
    const phone: Firstname = {
        String: values.phone,
        Valid: Boolean(values.phone)
    }
    const values2 = {
      username,
      firstname,
      lastname,
      email,
      phone,
      ID: identity ? id : 0,
    }
    trigger(values2)
    userMutate()
    router.navigate('/profile')
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1}} scrollEnabled={true}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>Edit Profile</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>Edit your profile here</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Image
          style={styles.pfpImage}
          source={require('../assets/images/test.png')}
        />
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder='Username'
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
            required: false,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder='First Name'
              placeholderTextColor='white'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}      
            />
          )}
          name="firstname"
        />
        <Controller
          control={control}
          rules={{
            required: false,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder='Last Name'
              placeholderTextColor='white'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}      
            />
          )}
          name="lastname"
        />
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder='Email'
              placeholderTextColor='white'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}      
            />
          )}
          name="email"
        />
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder='Phone'
              placeholderTextColor='white'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}      
            />
          )}
          name="phone"
        />
      </ThemedView>
      <ThemedView style={styles.buttons}>
        <ThemedView style={styles.profileButton}>
            <Link href="/profile" asChild>
                <Button title="Back to Profile"></Button>
            </Link>
        </ThemedView>
        <ThemedView style={styles.saveButton}>
          <Button title="Save Changes" onPress={handleSubmit(profileSubmit)}></Button>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    paddingTop: 75,
    height: 160,
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
    marginTop: -5,
    marginBottom: 8,
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    height: 40,
    margin: 5,
    borderWidth: 1,
    padding: 10,
    borderColor: 'white',
    color: 'white'
  },
  buttons: {
    flexDirection: 'row',
    position: 'relative',
    top: 15,
    alignSelf: 'center'
  },
  saveButton: {
    width: 140,
    marginLeft: 20
  },
  profileButton: {
    width: 140,
    marginRight: 20
  },
  pfpImage : {
    overflow: "hidden",
    width: 130,
    height: 130,
    borderRadius: 130/2
  }
});