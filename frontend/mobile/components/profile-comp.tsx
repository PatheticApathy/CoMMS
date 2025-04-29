import { StyleSheet, Button, Image, View, Text } from 'react-native';
import { Link } from 'expo-router';
import MainView from '@/components/MainView'
import { delTokenNIdentity, IdentityContext } from '@/components/securestore';
import useSWR from 'swr';
import { GetUserRow } from '@/user-api-types';
import { useRouter } from 'expo-router';
import { getHeaders } from '@/constants/header-options';
import { useContext } from "react"
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Colors } from '@/constants/Colors';

const fetcher = async (url: string) => {
  const headers = await getHeaders();
  const res = await fetch(url, { headers: headers });
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.json();
}

let id = 1

export default function ProfileComp() {
  
  const headers = getHeaders()

  const identity = useContext(IdentityContext)
  const router = useRouter()

  console.log(identity)

  if (identity)
    id = identity.id

  const { data: user } = useSWR<GetUserRow[], string>(identity ? `${process.env.EXPO_PUBLIC_API_URL}/api/user/search?id=${id}` : null, fetcher)


  if (!user) return <Text>Loading...</Text>;

  async function logoutSubmit() {
    delTokenNIdentity();
    router.navigate('/');
  }

  const color_scheme = useColorScheme()
  const color_text = color_scheme === 'dark' ? Colors.dark_text : Colors.light_text

  return (
    <MainView>
      <View style={styles.titleContainer}>
        <Text style={{ ...styles.title, ...color_text }}>View Profile</Text>
        <Text style={{ ...styles.subtitle, ...color_text }}>View your profile here</Text>
      </View>
      <View style={styles.stepContainer}>
        <Image
          style={styles.pfpImage}
          source={user[0].profilepicture.Valid ? {uri: `${process.env.EXPO_PUBLIC_API_URL}/${user[0].profilepicture.String}`, headers: headers} : require('../assets/images/test.png')}
        />
        <View style={styles.profileTextContainer}>
          <Text style={{ ...styles.profileText, ...color_text }}>
            Username: {user[0].username}
          </Text>
          <Text style={{ ...styles.profileText, ...color_text }}>
            Name: {user[0].firstname.Valid ? user[0].firstname.String : "N/A"} {user[0].lastname.Valid ? user[0].lastname.String : "N/A"}
          </Text>
          <Text style={{ ...styles.profileText, ...color_text }}>
            Email: {user[0].email}
          </Text>
          <Text style={{ ...styles.profileText, ...color_text }}>
            Phone: {user[0].phone}
          </Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <View style={styles.logoutButton}>
          <Button title="Logout" onPress={logoutSubmit}></Button>
        </View>
        <View style={styles.editButton}>
          <Link href="/editProfile" asChild>
            <Button title="Edit Profile"></Button>
          </Link>
        </View>
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