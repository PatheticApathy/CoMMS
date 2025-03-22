import { StyleSheet, Button, TextInput } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function LoginForm() {
    return (
        <ThemedView>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={styles.title}>Login</ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor='white'
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor='white'
                />
            </ThemedView>
            <ThemedView style={styles.button}>
                <Link href="/home" asChild>
                    <Button title="Login"></Button>
                </Link>
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