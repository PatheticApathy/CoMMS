import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

export function getToken() {
    return storage.getString('token')
}

export function setToken(token: string) {
    storage.set('token', token)
}

export function delToken() {
    storage.delete('token')
}


/*export async function getToken() {
    await SecureStore.getItemAsync('token')
}
export async function setToken(token: string) {
    await SecureStore.setItemAsync('token', token)
}
export async function delToken() {
    await SecureStore.deleteItemAsync('token')
}*/