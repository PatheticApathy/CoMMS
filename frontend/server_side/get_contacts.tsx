// Server Action
'use server'

export default async function GetContacts(values: any) {
  const api_host = process.env.API
  if (!api_host) {
    return { message: "this not set" }
  }
  try {
    const resp = await fetch(`http://${api_host}/users/all`, {
      headers: { "Content-Type": "application/json" },
      method: "GET",
      body: JSON.stringify(values),
    })

    if (!resp.ok) {
      return { message: "bad request" }
    }
  } catch (err) {
    console.error(err)
    return { message: err }
  }
}