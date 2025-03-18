import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CheckoutLog, Material, MaterialLog } from "@/material-api-types";
import Image from "next/image";
import useSWR, { Fetcher, mutate } from "swr"
import useSWRMutation from "swr/mutation";
import Loading from "@/components/loading";
import { Button } from "../ui/button";
import { toast } from "sonner";

//fetchers
const MaterialLogFetcher: Fetcher<MaterialLog[], string> = async (...args) => fetch(...args, { cache: 'force-cache' }).then(res => res.json())
const CheckoutLogFetcher: Fetcher<CheckoutLog[], string> = async (...args) => fetch(...args, { cache: 'force-cache' }).then(res => res.json())
const CheckOut = async (url: string, { arg }: { arg: { user: number, item: number } }) => await fetch(url, { method: 'POST', body: String(arg) })
const DeleteMaterial = async (url: string, { arg }: { arg: number }) => await fetch(url, { method: 'DELETE', body: String(arg) })

const DisplayMaterialLogs = (material_logs: MaterialLog[] | undefined, error: boolean, isLoading: boolean,) => {
  if (isLoading) {
    return <div>Loading<Loading /></div>;
  }
  if (error) {
    return <div className="text-red-600">An error occured</div>;
  }
  if (material_logs) {
    return (
      <>
        <h2 className="text-center text-2xl font-bold text-white">Logs</h2>
        {
          material_logs.map((log) => {
            return (
              <div key={log.id}>
                <br />
                {(() => {
                  const timestamp = new Date(log.timestamp)
                  return (
                    `Date: ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`
                  )
                })()
                }
                <br />
                {`${log.status} with ${log.quantity_change} ${log.quantity_change > 0 ? "Added" : "Removed"}`}
                <br />
                {log.note.Valid ? log.note.String : "Not Additional Notes"}
              </div>
            )
          }
          )
        }
      </>
    )
  } else {
    return (<div className="text-center">No Material Logs</div>)
  }
}

const DisplayCheckouts = (checkout_logs: CheckoutLog[] | undefined, error: boolean, isLoading: boolean,) => {
  if (isLoading) {
    return <div>Loading<Loading /></div>;
  }
  if (error) {
    return <div className="text-red-600">An error occured</div>;
  }
  if (checkout_logs) {
    return (
      <>
        <h2 className="text-center text-2xl font-bold text-white">Checkouts</h2>
        {
          checkout_logs.map((log) => {
            return (
              <div key={log.user_id}>
                <h3>Chekout pertains to {log.user_id}</h3>
                <br />
                {(() => {
                  const checkout = new Date(log.checkout_time);
                  return (
                    `Checked out on : ${checkout.toLocaleDateString()} ${checkout.toLocaleTimeString()}`
                  );
                })()
                }
                <br />
                {
                  (() => {

                    if (log.checkin_time.Valid) {
                      const checkin = new Date(log.checkin_time.time);
                      return (
                        `Checked in on : ${checkin.toLocaleDateString()} ${checkin.toLocaleTimeString()}`
                      );
                    } else {
                      return ("Still checked out")
                    }
                  })()
                }
              </div>
            )
          }
          )
        }
      </>
    )
  } else {
    return <div className="text-center">Never Checked out</div>;
  }

}
export default function MaterialSheet({ material, route, children }: Readonly<{
  material: Material,
  route: string,
  children: React.ReactNode;
}>) {

  const { data: checkout_logs, isLoading: checkout_loading, error: checkout_error } = useSWR(`/api/material/checkout/recent?id=${material.id}`, CheckoutLogFetcher)
  const { data: material_logs, isLoading: material_loading, error: material_error } = useSWR(`/api/material/mlogs/recent?id=${material.id}`, MaterialLogFetcher)

  const { trigger, isMutating } = useSWRMutation('/api/material/material/delete', DeleteMaterial, {
    onError(err) {
      console.log(err)
      toast.error(err.message || "Error has occured");

    },
    onSuccess(data) {
      data.json().then((resp: Material) => {
        mutate(route)
        console.log("Successfully deleted")
        toast.success(`Material ${resp.name.String} Deleted!`);
      })
    },

  })
  const { trigger: t2, isMutating: _ } = useSWRMutation('/api/material/checkout/out', CheckOut, {
    onError(err) {
      console.log(err)
      toast.error(err.message || "Error has occured");

    },
    onSuccess(data) {
      data.json().then((_: Material) => {
        console.log("Checked Out")
        toast.success(`Checked Out!`);
      })
    },

  })


  //TODO: make it switch to a check in for  function 

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <div className="overflow-auto">
          {(() => {
            if (material) {
              return (
                <>
                  <SheetHeader className="flex-none border-b text-left">
                    <SheetTitle className="text-2xl">{material.name.Valid ? material.name.String : "No Name Found"}</SheetTitle>
                    <SheetDescription >
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-10 text-lg">
                    <Image src={'/file.svg'} alt="No Picture of Item found" width={500} height={500}></Image>
                  </div>
                  <div >
                    {material.type.Valid ? `Type: ${material.type.String}` : "No type found"}
                    <br />
                    {`${material.status} with ${material.quantity} ${material.unit}`}
                    <br />
                    {material.last_checked_out ? `last checked out on ${material.last_checked_out}` : "Never checked out"}
                    <hr />
                    <div className="place-content-center">
                      {
                        DisplayMaterialLogs(material_logs, material_error, material_loading)
                      }
                    </div>
                    <hr />
                    <div className="flex flex-col content-center gap-4">
                      <Button variant="secondary" className="justify-center " >Checkout</Button>
                      <div>
                        {
                          DisplayCheckouts(checkout_logs, checkout_error, checkout_loading)
                        }
                      </div>
                    </div>
                  </div>
                  <SheetFooter className="flex flex-col place-content-center">
                    <SheetClose asChild>
                      <Button variant={'destructive'} onClick={async () => {
                        trigger(material.id)
                      }
                      }>
                        Delete</Button>
                    </SheetClose>
                  </SheetFooter>
                </>
              )
            }
            else {
              return (<p className='flex items-center justify-center h-screen'>No additional data for material</p>)
            }
          }
          )()}
        </div>
      </SheetContent>
    </Sheet >)
}
