import { StyleSheet, Button, Image, View } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Profile() {
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
          Username: Username
        </ThemedText>
        <ThemedText>
          Name: Firstname Lastname
        </ThemedText>
        <ThemedText>
          Email: Example@place.com
        </ThemedText>
        <ThemedText>
          Phone: 8888888888
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.buttons}>
        <ThemedView style={styles.logoutButton}>
            <Link href="/" asChild>
                <Button title="Logout"></Button>
            </Link>
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