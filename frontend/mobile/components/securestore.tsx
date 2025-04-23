import * as SecureStore from 'expo-secure-store';
import { Token } from "@/user-api-types"
import { createContext, ReactNode, useEffect, useState } from "react"
import { Redirect, router } from 'expo-router';
import { Notify } from './notify';
import { Headers } from '@/constants/header-options';

export const IdentityContext = createContext<Token | undefined>(undefined)

export function getToken() {
  const tkn = SecureStore.getItem('token')
  if (!tkn) {
    Notify.error("No token found");
    router.push("/login")
    return;
  }
  return tkn.trim().trimEnd()

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
  const token = getToken()
  const curr = SecureStore.getItem('identity')
  if (!token) { router.push('/login') }

  useEffect(() => {
    if (curr) {
      //get current token 
      const tkn = JSON.parse(curr) as Token
      if (!tkn || !('username' in tkn)) {
        SecureStore.deleteItemAsync('identity')
        return router.push('/login')
      }
      setIdentity(tkn)
    } else {
      fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/decrypt`, {
        headers: Headers,
        method: 'POST',
        body: String(token)
      }).then((resp => {
        if (!resp.ok) {
          Notify.error('Error trying to validate token please login again')
          return
        }

        //if it does not, fetch a new one
        //if no token, redirect to login
        resp.json().then((id) => {
          if (id && 'password' in id && 'username' in id) { // Replace 'property1' and 'property2' with actual Token properties
            setIdentity(id as Token);
          } else {
            Notify.error('Invalid token data received');
            router.push('/login');
          }
        })
      })).catch(err => {
        Notify.error(err.message)
      })

    }
  }, [curr, token])

  if (identity) { SecureStore.setItem('identity', JSON.stringify(identity)) }
  return (
    <IdentityContext.Provider value={identity}>
      {children}
    </IdentityContext.Provider>
  )
}
