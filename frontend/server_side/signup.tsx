// Server Action
'use server'
import { SignupParams } from '@/user-api-types'
import { redirect } from 'next/navigation'

export default async function Signup(values: SignupParams) {
  const api_host = process.env.API
  if (!api_host) {
    return { message: "api host not set in .env file" }
  }
  try {
    const resp = await fetch(`http://${api_host}/user/signup`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(values),
    })

    if (!resp.ok) {
      const msg: string = await (await resp.blob()).text()
      return { message: msg }
    }
  } catch (err) {
    console.error(err)
    return { message: err }
  }

  redirect('/dashboard')
}

