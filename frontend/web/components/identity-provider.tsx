'use client';
import { Token } from "@/user-api-types"
import { redirect } from "next/navigation"
import { createContext, ReactNode, useEffect, useState } from "react"
import { toast } from "sonner"

const ExpirationDate =  /* (days * 60sec * 60min * 24hrs) */2 * 60 * 60 * 24

export const IdentityContext = createContext<Token | undefined>(undefined)


export function setToken(token: string) {
  document.cookie = `token=${encodeURI(token)}; Path=/; Max-Age=${ExpirationDate}`
}
export function delTokenNIdentity() {
  document.cookie.replace(/token=*/, "")
  sessionStorage.removeItem('identity')
}

export function getToken() {
  const cookies = document.cookie.split(";")
  if (!cookies) { redirect('/login') }
  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.startsWith("token=")) {
      const token = cookie.substring(6)
      return decodeURI(token)
    }
  }
  redirect('/login')
}

export default function IdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<Token | undefined>(undefined);
  const token = getToken()
  const curr = sessionStorage.getItem('identity')

  useEffect(() => {
    if (curr) {
      //get current token 
      const tkn = JSON.parse(curr) as Token
      if (!tkn) { redirect('/login') }
      setIdentity(tkn)
    } else {
      if (!token) { redirect('/login') }
      fetch('/api/user/decrypt', {
        method: 'POST',
        body: String(token)
      }).then((resp => {
        if (!resp.ok) {
          toast.error('Error trying to validate token please login again')
          return
        }

        //if it does not, fetch a new one
        //if no token, redirect to login
        resp.json().then((id) => {
          setIdentity(id)

        })
      })).catch(err => {
        toast.error(err.message)
      })

    }
  }, [curr, token])

  if (identity) { sessionStorage.setItem('identity', JSON.stringify(identity)) }
  return (
    <IdentityContext.Provider value={identity}>
      {children}
    </IdentityContext.Provider>
  )
}
