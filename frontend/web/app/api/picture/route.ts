import * as fs from 'fs/promises'
import { NextResponse } from 'next/server'
import * as path from 'path'

export type Picture = {
  contents: string
  name: string
}

export async function POST(
  req: Request,
) {
  const picture = await req.json()
  console.log(picture)
  const file_name = `${new Date().toISOString()}-${picture.name}`
  try {
    await fs.writeFile(path.join(`${process.cwd()}/public/${file_name}`), picture.contents, 'utf-8')
    console.log(`Succesfully created ${file_name}`)
    return NextResponse.json({ name: file_name }, { status: 200 });
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
