import {
  Sheet,
  SheetClose,
  SheetFooter,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ChangeQuantity, CheckoutLog, Material, MaterialLog } from "@/material-api-types";
import Image from "next/image";
import useSWR, { Fetcher, mutate } from "swr"
import useSWRMutation from "swr/mutation";
import Loading from "@/components/loading";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Token } from "@/user-api-types";

//fetchers
const MaterialLogFetcher: Fetcher<MaterialLog[], string> = async (...args) => fetch(...args, { cache: 'default' }).then(res => res.json())
const CheckoutLogFetcher: Fetcher<CheckoutLog[], string> = async (...args) => fetch(...args, { cache: 'default' }).then(res => res.json())
const CheckOut = async (url: string, { arg }: { arg: { user_id: number, item_id: number, amount: number } }) => await fetch(url, { method: 'POST', body: JSON.stringify(arg) })
const CheckIn = async (url: string, { arg }: { arg: { user_id: number, item_id: number } }) => await fetch(url, { method: 'PUT', body: JSON.stringify(arg) })
const QuantityChange = async (url: string, { arg }: { arg: ChangeQuantity }) => await fetch(url, { method: 'PUT', body: JSON.stringify(arg) })
const DeleteMaterial = async (url: string, { arg }: { arg: number }) => await fetch(url, { method: 'DELETE', body: String(arg) })

const DisplayMaterialLogs = (material_logs: MaterialLog[] | undefined, error: Boolean, isLoading: Boolean,) => {
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
                {`${log.status} with ${Math.abs(log.quantity_change)} ${log.quantity_change > 0 ? "Added" : "Removed"}`}
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

const DisplayCheckouts = (checkout_logs: CheckoutLog[] | undefined, error: Boolean, isLoading: Boolean,) => {
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
              <div key={log.id}>
                <h3>Chekout pertains to user id: {log.user_id}</h3>
                <br />
                {(() => {
                  const checkout = new Date(log.checkout_time);
                  return (
                    `Checked out on : ${checkout.toLocaleDateString()} ${checkout.toLocaleTimeString()}`
                  );
                })()
                }
                <br />
                {`Amount checked out ${log.amount}`}
                <br />
                {
                  (() => {

                    if (log.checkin_time.Valid) {
                      const checkin = new Date(log.checkin_time.Time);
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

export default function MaterialSheet({ material, route, children, token }: Readonly<{
  material: Material,
  children: React.ReactNode;
  route: string | undefined
  token: Token | undefined
}>) {

  const [check, setCheck] = useState(false)
  const [counter, setcount] = useState(0)
  const { data: checkout_logs, isLoading: checkout_loading, error: checkout_error } = useSWR(`/api/material/checkout/recent?id=${material.id}`, CheckoutLogFetcher)
  const { data: material_logs, isLoading: material_loading, error: material_error } = useSWR(`/api/material/mlogs/recent?id=${material.id}`, MaterialLogFetcher)

  const { trigger } = useSWRMutation('/api/material/material/delete', DeleteMaterial, {
    onError(err) {
      console.error(err)
      toast.error(err.message || "Error has occured");

    },
    onSuccess(resp) {
      if (!resp.ok) {
        toast.error(resp.text() || "Error has occured");
        return
      }
      resp.json().then((resp: Material) => {
        mutate(route)
        console.log("Successfully deleted")
        toast.success(`Material ${resp.name.String} Deleted!`);
      })
    },

  })
  const { trigger: checkout, isMutating: checking_out } = useSWRMutation('/api/material/checkout/out', CheckOut, {
    onError(err) {
      console.error(err)
      toast.error(err.message || "Error has occured");

    },
    onSuccess(resp) {
      if (!resp.ok) {
        toast.error(resp.text() || "Error has occured");
        return
      }
      resp.json().then((_: Material) => {
        console.log("Checked Out")
        mutate(`/api/material/checkout/recent?id=${material.id}`)
        mutate(`/api/material/mlogs/recent?id=${material.id}`)
        toast.success(`Checked Out!`);
      })
    },
  })

  const { trigger: checkin, isMutating: checking_in } = useSWRMutation('/api/material/checkout/in', CheckIn, {
    onError(err) {
      console.error(err)
      toast.error(err.message || "Error has occured");

    },
    onSuccess(resp) {
      if (!resp.ok) {
        toast.error(resp.text() || "Error has occured");
        return
      }
      resp.json().then((_: Material) => {
        console.log("Checked In")
        mutate(`/api/material/checkout/recent?id=${material.id}`)
        mutate(`/api/material/mlogs/recent?id=${material.id}`)
        toast.success(`Checked In!`);
      })
    },
  })

  const { trigger: send_amount } = useSWRMutation('/api/material/material/change', QuantityChange, {
    onError(err) {
      console.error(err)
      toast.error(err.message || "Error has occured");

    },
    onSuccess(resp) {
      if (!resp.ok) {
        toast.error(resp.text() || "Error has occured");
        return
      }
      resp.json().then((_: Material) => {
        console.log("Quantity changed")

        if (check) {
          if (counter < 0) {
            checkin({ user_id: token!.id, item_id: material.id })
          } else {
            toast.error("Checkout amount must be negative");
          }
        } else {
          if (counter > 0) {
            checkout({ user_id: token!.id, item_id: material.id, amount: counter })
          } else {
            toast.error("Checkin amount must be greater than 0");
          }
        }
      })
    },
  })

  useEffect(() => {
    if (checkout_logs && token) {
      setCheck(Boolean(checkout_logs?.find((log) => !log.checkin_time.Valid && log.user_id == token.id)))
    }

  })
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <div className="overflow-auto">
          {(() => {
            if (material && token) {
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
                    {material.last_checked_out.Valid ? `last checked out on ${new Date(material.last_checked_out.Time).toLocaleString()}` : "Never checked out"}
                    <hr />
                    <div className="place-content-center">
                      {
                        DisplayMaterialLogs(material_logs, material_error, material_loading)
                      }
                    </div>
                    <hr />
                    <div className="flex flex-col content-center gap-4">
                      {(() => {
                        if (checking_out || checking_in) {
                          return <Loading />
                        } else {
                          return (
                            <div className="flex flex-row flex-auto">
                              <Button onClick={() => { send_amount({ quantity: counter, id: material.id }) }} variant={check ? "default" : "secondary"} className="w-2/3" >{check ? "Checkin" : "Checkout"}</Button>
                              <div className="flex flex-row text-center w-1/3 ">
                                <div className="w-1/4"><Button onClick={() => setcount(counter + 1)}>+</Button></div>
                                <div className="w-2/4 text content-center"><h1 className="text-slate-300 text-center ml-3">{counter}</h1></div>
                                <div><Button className="w-1/4" onClick={() => setcount(counter - 1)}>-</Button></div>
                              </div>
                            </div>
                          )
                        }
                      })()
                      }
                      < div className="place-content-center">
                        {
                          DisplayCheckouts(checkout_logs, checkout_error, checkout_loading)
                        }
                      </div>
                    </div>
                  </div >
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
            } else {
              return (
                <>
                  <SheetTitle className="text-2xl">{material.name.Valid ? material.name.String : "No Name Found"}</SheetTitle>
                  <p className='flex items-center justify-center h-screen'>No additional data for material or invalid credentials. Try logging in again</p>
                </>
              )
            }
          })()}
        </div>
      </SheetContent >
    </Sheet >)
}
