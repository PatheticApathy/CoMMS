import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Material } from "@/material-api-types";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR, { Fetcher } from "swr"
import Loading from "./loading";

export default function MaterialSheet({ material, children, }: Readonly<{


  material: Material,
  children: React.ReactNode;
}>) {

  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent> {(() => {
        if (material) {
          return (
            <SheetHeader>
              <SheetTitle className="text-2xl">{material.name.Valid ? material.name.String : "No Name Found"}</SheetTitle>
              <SheetDescription className="flex flex-col gap-10 text-lg">
                <div>
                  <Image src={'/file.svg'} alt="No Picture of Item found" width={500} height={500}></Image>
                </div>
                {material.type.Valid ? `Type: ${material.type.String}` : "No type found"}
                <br />
                {`${material.status} with ${material.quantity} ${material.unit}`}
                <br />
                {material.last_checked_out ? `last checked out on ${material.last_checked_out}` : "Never checked out"}
                <br />
              </SheetDescription>
            </SheetHeader>
          )
        }
        else {
          return (<p className='flex items-center justify-center h-screen'>No additional data for material</p>)
        }
      }
      )()}
      </SheetContent>
    </Sheet>)
}
