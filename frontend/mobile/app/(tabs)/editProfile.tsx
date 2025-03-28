import { StyleSheet, Button, Image, View, TextInput, ScrollView } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Profile() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1}} scrollEnabled={true}>
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
        <TextInput
          style={styles.input}
          defaultValue='Username'      
        />
        <TextInput
          style={styles.input}
          defaultValue='Firstname'      
        />
        <TextInput
          style={styles.input}
          defaultValue='Lastname'      
        />
        <TextInput
          style={styles.input}
          defaultValue='Example@place.com'      
        />
        <TextInput
          style={styles.input}
          defaultValue='8888888888'      
        /> 
      </ThemedView>
      <ThemedView style={styles.buttons}>
        <ThemedView style={styles.profileButton}>
            <Link href="/profile" asChild>
                <Button title="Back to Profile"></Button>
            </Link>
        </ThemedView>
        <ThemedView style={styles.saveButton}>
            <Link href="/profile" asChild>
                <Button title="Save Changes"></Button>
            </Link>
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
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: 'white',
    color: 'white'
  },
  buttons: {
    flexDirection: 'row',
    position: 'relative',
    top: 50,
    alignSelf: 'center'
  },
  saveButton: {
    width: 140,
    marginLeft: 20
  },
  profileButton: {
    width: 140,
    marginRight: 20
  }
});