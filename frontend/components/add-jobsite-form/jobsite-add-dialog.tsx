import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import React from "react";
import JobsiteForm from "./jobsite-add-form";


export default function AddJobsiteFormDialouge({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:mx-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Jobsite</DialogTitle>
          <DialogDescription>Add jobsite to be managed..</DialogDescription>
        </DialogHeader>
        <div>
          <JobsiteForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}
