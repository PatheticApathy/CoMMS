import { NetworkInfo }from 'react-native-network-info';
import { StyleSheet, Button, TextInput } from 'react-native';
import { Link } from 'expo-router';
import React from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from 'react-hook-form';
import useSWRMutation from 'swr/mutation'
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SignUpUser } from "@/user-api-types"
import { setToken, getToken } from "@/components/securestore"
import { useRouter } from 'expo-router'

const formSchema = z.object({
    username: z.string().nonempty(),
    password: z.string().nonempty(),
    confirm_password: z.string().nonempty(),
    email: z.string().nonempty(),
    phone: z.string().nonempty(),
})
    .refine(
        (values) => {
            return values.password === values.confirm_password
        },
        {
            message: "The passwords do not match.",
            path: ["confirm_password"]
        }
    )

async function signUp(url: string, { arg }: { arg: SignUpUser }) {
    return fetch(url, {
        method: 'POSt',
        body: JSON.stringify(arg)
    }).then(res => res.text())
}

export default function SignupForm() {

    const router = useRouter()

    const { data, trigger, error, isMutating } = useSWRMutation('http://192.168.1.0:8082/user/signup', signUp, { throwOnError: false })

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            confirm_password: "",
            email: "",
            phone: "",
        },
    })

    if (data) {
        setToken(data)
    }

    let token = getToken()
    if (token) {
        router.navigate('/home')
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        trigger(values)
    }

    return (
        <ThemedView>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={styles.title}>Signup</ThemedText>
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
                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => ( 
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor='white'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry={true}
                        />
                    )}
                    name="confirm_password"
                />
                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => ( 
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
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
                            placeholder="Phone"
                            placeholderTextColor='white'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="phone"
                />
            </ThemedView>
            <ThemedView style={styles.button}>
                    <Button title="Sign Up" onPress={handleSubmit(onSubmit)}></Button>
                <ThemedText style={styles.logInText}>Already Have an Account?</ThemedText>
                <Link href="/login" asChild style={styles.logInLink}>
                    <ThemedText style={styles.logInLink}>Log In!</ThemedText>
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
        height: 150,
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
        top: 40
    },
    input: {
        height: 40,
        margin: 6,
        borderWidth: 1,
        padding: 10,
        borderColor: 'white',
        color: 'white'
    },
    logInText: {
        alignSelf: 'center'
    },
    logInLink: {
        alignSelf: 'center',
        color: 'lightblue'
    }
});