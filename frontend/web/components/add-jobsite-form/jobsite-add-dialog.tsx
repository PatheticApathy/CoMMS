import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CompanyForm from "../add-company-form/company-add-form";
import JobsiteForm from "./jobsite-add-form";


export default function AddJobsiteFormDialouge({ children }: Readonly<{ children: React.ReactNode; }>) {
  const [showFirstTable, setShowFirstTable] = useState(true);
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:mx-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Jobsite/Company</DialogTitle>
          <DialogDescription>Add jobsite/company to be managed..</DialogDescription>
        </DialogHeader>
        <Button variant="yellow" onClick={() => setShowFirstTable(!showFirstTable)} className="mb-4">
        Switch Form
        </Button>
        <div className="">
          {showFirstTable ? <JobsiteForm /> : <CompanyForm />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
