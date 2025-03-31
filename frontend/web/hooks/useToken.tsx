'use client'
import { Token } from "@/user-api-types"
import { redirect } from "next/navigation"
import React, { useEffect, useState, createContext, useContext } from "react"


const AuthContext = createContext<{ token: string | null }>({ token: null })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getToken())
  }, [])

  return (
    <AuthContext.Provider value={{ token }}>
      {children}
    </AuthContext.Provider>
  )
}
export function useToken() {
  return useContext(AuthContext)
}

export function useIdentity() {
  const [identity, setIdentity] = useState<Token | null>(null);
  useEffect(() => {
    const fetchIdentity = async () => {
      const user_identity = await getIdentity();
      setIdentity(user_identity)
    }
    fetchIdentity()
  }, [])
  return identity
}

export function setToken(token: string) {
  localStorage.setItem('token', token)
}
export function delTokenNIdentity() {
  localStorage.removeItem('token')
  sessionStorage.removeItem('identity')
}

async function getIdentity() {
  //check if token already exist
  const identity = sessionStorage.getItem('identity')
  if (!identity) {
    //if it does not, fetch a new one
    const token = localStorage.getItem('token')

    //if no token, redirect to login
    if (!token) { redirect('/login') }

    //Get token
    const resp = await fetch('/api/user/decrypt', {
      method: 'POST',
      body: token
    })

    if (!resp.ok) {
      throw new Error(await resp.text())
    }
    const identity = await resp.json() as Promise<Token>
    sessionStorage.setItem('identity', JSON.stringify(identity))
    return identity
  } else {
    return JSON.parse(identity) as Token
  }
}


export function getToken() {
  const token = localStorage.getItem('token')
  if (!token) { redirect('/login') }
  return token
}
