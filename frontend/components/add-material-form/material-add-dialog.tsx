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
import { Tabs, TabsTrigger } from "../ui/tabs";
import { TabsContent, TabsList } from "@radix-ui/react-tabs";
import AddMaterialLogForm from "./material-add-log-form";
import { Material } from "@/material-api-types";


export default function AddMaterialFormDialouge({ materials, children }: Readonly<{ materials: Material[] | undefined, children: React.ReactNode; }>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:mx-w-[425px]">
        <Tabs defaultValue="Add Material" className="w-[400px]">
          <DialogHeader>
            <TabsList>
              <TabsTrigger value="Add Material"><DialogTitle>Add New Material</DialogTitle></TabsTrigger>
              <TabsTrigger value="Add Material Log"><DialogTitle>Add New Material Log</DialogTitle></TabsTrigger>
            </TabsList>
          </DialogHeader>
          <hr />
          <TabsContent value="Add Material">
            <DialogDescription>Add material to be managed. Once you are done, everyone who needs to see it can see it.</DialogDescription>
            <br />
            <div>
              <MaterialForm />
            </div>
          </TabsContent>
          <TabsContent value="Add Material Log">
            <DialogDescription >Add a log for an existing material</DialogDescription>
            <br />
            {(() => {
              if (!materials) {
                return
              }
              return (
                <div>
                  <AddMaterialLogForm materials={materials} />
                </div>
              )
            })()
            }
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog >
  )
}
