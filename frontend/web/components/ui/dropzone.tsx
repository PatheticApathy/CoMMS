import React from 'react'
import { useDropzone } from 'react-dropzone'


export default function DropZone({ file, fileAction }: { file: File, fileAction: (file: File | undefined) => void }) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone()


  return (
    <section className='container'>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag and drop picture or click to select picture</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{file}</ul>
      </aside>
    </section>
  )
}
