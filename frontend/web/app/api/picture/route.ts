import * as fs from 'fs/promises'
import { NextResponse } from 'next/server'
import * as path from 'path'

export async function POST(
  req: Request,
) {
  const extension = req.headers.get('Content-Type')?.split("/").pop()
  const picture = await (await req.blob()).arrayBuffer()
  console.log(extension)
  const file_name = `${new Date().toISOString()}-material.${extension}`
  try {
    await fs.writeFile(path.join(`${process.cwd()}/public/${file_name}`), Buffer.from(picture))
    console.log(`Succesfully created ${file_name}`)
    return NextResponse.json({ name: file_name }, { status: 200 });
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "Picture invalid" }, { status: 500 });
  }
}
