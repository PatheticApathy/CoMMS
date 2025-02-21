import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    DialogTitle,
    DialogDescription
  } from "@/components/ui/dialog"
  import React from "react";
  import MaterialForm from "./material-add-form";
  
  
  export default function AddMaterialFormDialouge({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:mx-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Material</DialogTitle>
            <DialogDescription>Add material to be managed. Once your done, everyone in who needs to see it can see it.</DialogDescription>
          </DialogHeader>
          <div>
            <MaterialForm />
          </div>
        </DialogContent>
      </Dialog>
    )
  }