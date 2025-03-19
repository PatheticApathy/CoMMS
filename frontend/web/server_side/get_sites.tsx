// Server Action
'use server'

import { Jobsite } from "@/material-api-types"

export default async function GetJobsites(/*id: number*/) : Promise<Jobsite | {message: any}> {
  const api_host = process.env.API
  if (!api_host) {
    return { message: "this not set" }
  }
  try {
    const resp = await fetch(`http://${api_host}/users/JobSites/all`, {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    })

    if (!resp.ok) {
      return { message: "bad request" }
    }

    const jobsites = await resp.json()

    return jobsites

  } catch (err) {
    console.error(err)
    return { message: err }
  }
}