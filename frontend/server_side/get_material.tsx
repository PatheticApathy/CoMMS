// Server Action
'use server'
import MTable from '@/components/material-table'
import { Material } from '@/material-api-types'

export default async function GetMaterials() {
  const api_host = process.env.API
  const resp = await fetch(`http://localhost:8080/material/get/all`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",

  })
  if (!resp.ok) {
    console.log(resp.body)
  }
  return await resp.json() as Promise<Material[]>
}

