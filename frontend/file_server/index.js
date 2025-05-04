const fs = require('fs/promises')
const express = require('express')
const crypto = require('crypto')
const path = require('path')

async function upload(req, resp) {
  const extension = req.get('Content-Type')?.split("/").pop()
  const picture = req.body
  console.log(extension)

  const hash = new Date().toISOString()
  const file_name = `${hash}-picture.${extension}`

  try {
    await fs.writeFile(path.join(`${process.cwd()}/public/${file_name}`), picture)
    console.log(`Succesfully created ${file_name}`)
    return resp.status(200).json({ name: file_name });
  } catch (err) {
    console.error(err)
    return resp.status(500).json({ message: "Picture invalid" });
  }
}


const app = express()


app.use(express.raw({ type: 'image/*', limit: '10mb' }))
app.use(express.static('public'))
app.post('/upload', upload)

console.log('starting server on port 8083')
app.listen(8083)

