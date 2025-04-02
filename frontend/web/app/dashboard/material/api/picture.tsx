import { NextApiRequest, NextApiResponse } from "next";
import * as fs from 'fs'
import * as path from 'path'

export type Picture = {
  file: File
  name: string
}

export default async function picture_handler(
  req: NextApiRequest,
  resp: NextApiResponse
) {
  if (req.method == 'POST') {
    const picture = req.body as Picture
    const file = await picture.file.text()
    const file_name = `${new Date().toISOString()}-${picture.name}`
    fs.writeFile(path.join(__dirname, `./public/${file_name}`), file, 'utf-8', (err) => {
      if (err) {
        console.error(err)
      }
      console.log(`Succesfully created ${file_name}`)
    })

    resp.status(200).send(file_name);

  } else {
    resp.status(400).send('Bad request');
  }
}
