import { StyleSheet, Button, Image } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { delTokenNIdentity, IdentityContext } from '@/components/securestore';
import useSWR from 'swr';
import { GetUserRow } from '@/user-api-types';
import { useRouter } from 'expo-router';
import { getHeaders } from '@/constants/header-options';
import { useContext } from "react"

const fetcher = async (url: string) => {
  const headers = await getHeaders();
  const res = await fetch(url, { headers: headers });
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.json();
}

export default function ProfileComp() {
  
  const headers = getHeaders()

  const identity = useContext(IdentityContext)
  const router = useRouter()

  console.log(identity)

  if (identity)
    id = identity.id

  const { data: user } = useSWR<GetUserRow[], string>(identity ? `${process.env.EXPO_PUBLIC_API_URL}/api/user/search?id=${id}` : null, fetcher)


  if (!user) return <ThemedText>Loading...</ThemedText>;

  async function logoutSubmit() {
    delTokenNIdentity();
    router.navigate('/');
  }

  const headers = getHeaders();

  return (
    <ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>View Profile</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>View your profile here</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Image
          style={styles.pfpImage}
          source={user[0].profilepicture.Valid ? {uri: `${process.env.EXPO_PUBLIC_API_URL}/${user[0].profilepicture.String}`, headers: headers} : require('../assets/images/test.png')}
        />
        <ThemedView style={styles.profileTextContainer}>
          <ThemedText style={styles.profileText}>
            Username: {user[0].username}
          </ThemedText>
          <ThemedText style={styles.profileText}>
            Name: {user[0].firstname.Valid ? user[0].firstname.String : "N/A"} {user[0].lastname.Valid ? user[0].lastname.String : "N/A"}
          </ThemedText>
          <ThemedText style={styles.profileText}>
            Email: {user[0].email}
          </ThemedText>
          <ThemedText style={styles.profileText}>
            Phone: {user[0].phone}
          </ThemedText>
        </ThemedView>
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
    marginTop: -25,
    marginBottom: 8,
    marginLeft: 10,
    marginRight: 10,
  },
  buttons: {
    flexDirection: 'row',
    position: 'relative',
    top: 80,
    alignSelf: 'center'
  },
  editButton: {
    width: 110,
    marginLeft: 20,
  },
  logoutButton: {
    width: 110,
    marginRight: 20
  },
  profileTextContainer: {
    marginTop: 10
  },
  profileText: {
    fontSize: 20,
    marginTop: 15
  },
  pfpImage : {
    overflow: "hidden",
    width: 130,
    height: 130,
    borderRadius: 130/2
  }
});