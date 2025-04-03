import React, { useCallback } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'


export default function DropZone({ file, fileAction }: { file: File, fileAction: (file: File | undefined) => void }) {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    fileAction(acceptedFiles[0])
  }, [file])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop, accept: {
      'image/png': ['.png', 'jpeg'],
      'image/gif': ['.gif'],
      'image/jpeg': ['.jpeg', '.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1
  })


  return (
    <section className='container'>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag and drop picture or click to select picture</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{file.name}</ul>
      </aside>
    </section>
  )
}
