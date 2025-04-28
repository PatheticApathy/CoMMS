import * as SecureStore from 'expo-secure-store';
import { Token } from "@/user-api-types"
import { createContext, ReactNode, useEffect, useState } from "react"
import { Redirect, router } from 'expo-router';
import { Notify } from './notify';
import { getHeaders } from '@/constants/header-options';

export const IdentityContext = createContext<Token | undefined>(undefined)

export async function getToken() {
  const tkn = await SecureStore.getItemAsync('token'); // Use `getItemAsync` and await the result
  if (!tkn) {
    Notify.error("No token found");
    router.push("/login");
    return null; // Return null if no token is found
  }
  return tkn.trim().trimEnd();
}
export async function setToken(token: string) {
  delTokenNIdentity()
  await SecureStore.setItemAsync('token', token)
}
export async function delTokenNIdentity() {
  await SecureStore.deleteItemAsync('token')
}

export default function IdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<Token | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeIdentity() {
      try {
        const token = await getToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const curr = await SecureStore.getItemAsync('identity');
        if (curr) {
          const tkn = JSON.parse(curr) as Token;
          if (!tkn || !('username' in tkn)) {
            await SecureStore.deleteItemAsync('identity');
            router.push('/login');
            return;
          }
          setIdentity(tkn);
        } else {
          const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/decrypt`, {
            headers: await getHeaders(),
            method: 'POST',
            body: String(token),
          });

          if (!response.ok) {
            Notify.error('Error trying to validate token, please login again');
            router.push('/login');
            return;
          }

          const id = await response.json();
          if (id && 'password' in id && 'username' in id) {
            setIdentity(id as Token);
            await SecureStore.setItemAsync('identity', JSON.stringify(id));
          } else {
            Notify.error('Invalid token data received');
            router.push('/login');
          }
        }
      } catch (err) {
        Notify.error(err instanceof Error ? err.message : 'An error occurred');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    initializeIdentity();
  }, []);

  if (loading) {
    return null; // Show a loading state if needed
  }

  return (
    <IdentityContext.Provider value={identity}>
      {children}
    </IdentityContext.Provider>
  );
}
