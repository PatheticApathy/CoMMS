// Server Action
'use server'
import { redirect } from 'next/navigation'

export default async function Signup(values: any) {
  const api_host = process.env.API
  if (!api_host) {
    return { message: "this not set" }
  }
  try {
    const resp = await fetch(`http://${api_host}/signup`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(values),
    })

    if (!resp.ok) {
      return { message: "bad request" }
    }
  } catch (err) {
    console.error(err)
    return { message: err }
  }

  redirect('/dashboard')
}

