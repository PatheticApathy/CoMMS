import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Material } from "@/material-api-types";
import { useEffect, useState } from "react";
import useSWR, { Fetcher } from "swr"
import Loading from "./loading";

export default function MaterialSheet({ id, children, }: Readonly<{


  id: number,
  children: React.ReactNode;
}>) {
  const fetcher: Fetcher<Material, string> = (...args) => fetch(...args).then(resp => resp.json());
  const { data, isLoading, error } = useSWR(`/api/material/material/search?id=${id}`, fetcher)
  const [material, setMaterial] = useState<Material | undefined>(undefined)

  useEffect(() => {
    setMaterial(data)
  }, [data])

  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent> {(() => {
        if (isLoading) { return (<div className='flex items-center justify-center h-screen'>Loading <Loading /></div>) }
        if (error) { return (<p className='flex items-center justify-center h-screen'>Error occured lol</p>) }
        if (material) {
          return (
            <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
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
