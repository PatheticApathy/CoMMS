// Server Action
'use server'

import { Jobsite } from "@/material-api-types"

export default async function GetContacts() {
  const api_host = process.env.API
  if (!api_host) {
    return { message: "this not set" }
  }
  try {
    const resp = await fetch(`http://${api_host}/sites/all`, {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    })

    if (!resp.ok) {
      return { message: "bad request" }
    }

    const jawa = await resp.json() as Jobsite[]
    return jawa
  } catch (err) {
    console.error(err)
    return { message: err }
  }
}
