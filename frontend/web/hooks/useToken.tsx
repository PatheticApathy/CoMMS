'use client'
import { Token } from "@/user-api-types"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import useSWR, { Fetcher } from "swr"

const ExpirationDate =  /* (days * 60sec * 60min * 24hrs) */2 * 60 * 60 * 24

const fetchIdentity: Fetcher<Token,string> = async (...args) => fetch(... args, {method: 'POST', body: getToken()},).then(res => res.json())

export function useIdentity() { 

  const [identity, setIdentity] = useState<Token | undefined>(undefined);
  useEffect(() => {
  const identity = sessionStorage.getItem('identity')
  const {data: fetched_identity, error} = useSWR(identity ?  undefined: '/api/user/decrypt', fetchIdentity)
  if (identity) {
    const tkn = JSON.parse(identity) as Token
    setIdentity(tkn)
  } else {
    //if it does not, fetch a new one
    const token = document.cookie.split(";").find((row) => row.startsWith('token='))?.split("=")[1]

    //if no token, redirect to login
    if (!token) { redirect('/login') }
    if (error) { return undefined}
    sessionStorage.setItem('identity', JSON.stringify(fetched_identity))
    setIdentity(fetched_identity)
  }})
  return identity
}

export function setToken(token: string) {
  document.cookie = `token=${encodeURI(token)}; Path=/; Max-Age=${ExpirationDate}`
}
export function delTokenNIdentity() {
  document.cookie.replace(/token=*/, "")
  sessionStorage.removeItem('identity')
}

async function getIdentity() {
  //check if token already exist

  const identity = sessionStorage.getItem('identity')
  if (!identity) {
    //if it does not, fetch a new one
    const token = document.cookie.split(";").find((row) => row.startsWith('token='))?.split("=")[1]

    //if no token, redirect to login
    if (!token) { redirect('/login') }

    //Get token
    const resp = await fetch('/api/user/decrypt', {
      method: 'POST',
      body: decodeURI(token)
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
  const token = document.cookie.split("; ").find((row) => row.startsWith('token='))?.split("=")[1]
  if (!token) { redirect('/login') }
  return decodeURI(token)
}
