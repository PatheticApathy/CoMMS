import { StyleSheet, Button, Image, View, TextInput, ScrollView, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import MainView from '@/components/MainView'
import useSWRMutation from 'swr/mutation';
import useSWR from "swr"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { GetUserRow, Firstname, Lastname } from '@/user-api-types'
import { IdentityContext } from '@/components/securestore'
import { useContext } from "react"
import { getHeaders } from '@/constants/header-options'
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Colors } from '@/constants/Colors';

const formSchema = z.object({
  username: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  phone: z.string(),
  picture: z.instanceof(Blob).optional()
})

async function changeProfile(url: string, { arg }) {
  const headers = await getHeaders()
  return fetch(url, {
      headers: headers,
      method: 'PUT',
      body: JSON.stringify(arg)
  }).then(res => res.json())
}

const fetcher = async  (url: string) => {
  const headers = await getHeaders()
  const res = await fetch(url, {
    headers: headers
  })
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

let id = 1

export default function EditProfileComp() {  

  const headers = getHeaders()

  const identity = useContext(IdentityContext)
  const router = useRouter()

  if (identity)
    id = identity.id

  const { trigger } = useSWRMutation(`${process.env.EXPO_PUBLIC_API_URL}/api/user/update`, changeProfile, {throwOnError: false})

  const { data: user, mutate: userMutate } = useSWR<GetUserRow[], string>(identity ? `${process.env.EXPO_PUBLIC_API_URL}/api/user/search?id=${id}` : null, fetcher)

  if (!user) return <Text>Loading...</Text>;  

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
      picture: undefined
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
    router.push("/profile")
  }

  const color_scheme = useColorScheme()
  const color_text = color_scheme === 'dark' ? Colors.dark_text : Colors.light_text
  const color_border = color_scheme === 'dark' ? Colors.dark_border : Colors.light_border

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1}} scrollEnabled={true}>
      <MainView>
        <View style={styles.titleContainer}>
          <Text style={{ ...styles.title, ...color_text }}>Edit Profile</Text>
          <Text style={{ ...styles.subtitle, ...color_text }}>Edit your profile here</Text>
        </View>
        <View style={styles.stepContainer}>
          <Image
            style={styles.pfpImage}
            source={user[0].profilepicture.Valid ? {uri: `uploads${user[0].profilepicture.String}`, headers: headers} : require('../assets/images/test.png')}
          />
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={{ ...styles.input, ...color_border, ...color_text }}
                placeholder='Username'
                placeholderTextColor = {color_scheme === 'dark' ? '#C9ADA7' : '#00272B'}
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
                style={{ ...styles.input, ...color_border, ...color_text }}
                placeholder='First Name'
                placeholderTextColor = {color_scheme === 'dark' ? '#C9ADA7' : '#00272B'}
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
                style={{ ...styles.input, ...color_border, ...color_text }}
                placeholder='Last Name'
                placeholderTextColor = {color_scheme === 'dark' ? '#C9ADA7' : '#00272B'}
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
                style={{ ...styles.input, ...color_border, ...color_text }}
                placeholder='Email'
                placeholderTextColor = {color_scheme === 'dark' ? '#C9ADA7' : '#00272B'}
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
                style={{ ...styles.input, ...color_border, ...color_text }}
                placeholder='Phone'
                placeholderTextColor = {color_scheme === 'dark' ? '#C9ADA7' : '#00272B'}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}      
              />
            )}
            name="phone"
          />
        </View>
        <View style={styles.buttons}>
          <View style={styles.profileButton}>
              <Link href="/profile" asChild>
                  <Button title="Back to Profile"></Button>
              </Link>
          </View>
          <View style={styles.saveButton}>
            <Button title="Save Changes" onPress={handleSubmit(profileSubmit)}></Button>
          </View>
        </View>
      </MainView>
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
    width: "80%"
  },
  input: {
    height: 40,
    margin: 5,
    borderWidth: 1,
    padding: 10,
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