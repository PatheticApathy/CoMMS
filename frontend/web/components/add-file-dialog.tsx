import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FileWithPath, useDropzone } from "react-dropzone"



export default function AddFileDialog({ children, submitAction }: { children: React.ReactNode, submitAction: (files: readonly FileWithPath[]) => Promise<void> }) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept:
    {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', 'jpg'],
      'image/svg+xml': ['.svg']
    }
  });

  const acceptedFileItems = acceptedFiles.map((file) => {
    return (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>
    )
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You must add a picture of material</AlertDialogTitle>
        </AlertDialogHeader>
        <section className="container">
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop pictures here, or click to select files</p>
            <em>(Only *.jpeg and *.png images will be accepted)</em>
          </div>
          <aside>
            <h4>Accepted files</h4>
            <ul>{acceptedFileItems}</ul>
          </aside>
        </section>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={async () => { await submitAction(acceptedFiles) }}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
