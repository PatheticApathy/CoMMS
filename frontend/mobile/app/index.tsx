import { StyleSheet, Button } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Welcome() {
  return (
    <ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>Welcome to CoMMS</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>The Construction Material Management System</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>
          The Construction Material Management System, or CoMMS, is a system through which employees of construction
          companies, or companies in fields that require similar material tracking, can keep track of materials throughout a job site. This system
          is designed to be used through this website for easy accessibility.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.button}>
        <Link href="/login" asChild>
          <Button title="Go to Login"></Button>
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
  }
});
