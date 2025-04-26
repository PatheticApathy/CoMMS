import { StyleSheet, Button, Image } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getToken, delTokenNIdentity, IdentityContext } from '@/components/securestore'
import useSWR from 'swr'
import { GetUserRow } from '@/user-api-types'
import { useRouter } from 'expo-router'
import { Headers } from '@/constants/header-options';
import { useContext } from "react"

async function getProfileArgs(url: string, arg: string) {
  return fetch(url, {
    method: 'POST',
    headers: Headers,
    redirect: 'follow',
    body: arg
  }).then(res => res.json())
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: Headers
  })
  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  return res.json();
}

let token = getToken()
let id = 1

export default function ProfileComp() {

  const identity = useContext(IdentityContext)
  const router = useRouter()

  const { data: tokenData } = useSWR([`${process.env.EXPO_PUBLIC_API_URL}/api/user/decrypt`, token], ([url, token]) => getProfileArgs(url, token))
  if (tokenData)
    id = tokenData.id

  const { data: user } = useSWR<GetUserRow[], string>(identity ? `${process.env.EXPO_PUBLIC_API_URL}/api/user/search?id=${id}` : null, fetcher)

  if (!user) return <ThemedText>Loading...</ThemedText>;

  async function logoutSubmit() {
    delTokenNIdentity()
    router.navigate('/')
  }

  return (
    <ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>View Profile</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>View your profile here</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Image
          source={{
            uri: 'https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg'
          }}
        />
        <ThemedText>
          Username: {user[0].username}
        </ThemedText>
        <ThemedText>
          Name: {user[0].firstname.Valid ? user[0].firstname.String : "N/A"} {user[0].lastname.Valid ? user[0].lastname.String : "N/A"}
        </ThemedText>
        <ThemedText>
          Email: {user[0].email}
        </ThemedText>
        <ThemedText>
          Phone: {user[0].phone}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.buttons}>
        <ThemedView style={styles.logoutButton}>
          <Button title="Logout" onPress={logoutSubmit}></Button>
        </ThemedView>
        <ThemedView style={styles.editButton}>
          <Link href="/editProfile" asChild>
            <Button title="Edit Profile"></Button>
          </Link>
        </ThemedView>
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
  buttons: {
    flexDirection: 'row',
    position: 'relative',
    top: 120,
    alignSelf: 'center'
  },
  editButton: {
    width: 110,
    marginLeft: 20
  },
  logoutButton: {
    width: 110,
    marginRight: 20
  }
});
