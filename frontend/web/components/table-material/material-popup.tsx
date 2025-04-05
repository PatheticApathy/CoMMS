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
import { GetUserRow, Token } from "@/user-api-types";
import { Input } from "../ui/input";
import AddFileDialog from "../add-file-dialog";
import { FileWithPath } from "react-dropzone";
import { getToken } from "@/components/identity-provider";

//fetchers
const MaterialLogFetcher: Fetcher<MaterialLog[], string> = async (...args) => fetch(...args, { headers: { 'Authorization': getToken() }, cache: 'default' }).then(res => res.json())
const CheckoutLogFetcher: Fetcher<CheckoutLog[], string> = async (...args) => fetch(...args, { headers: { 'Authorization': getToken() }, cache: 'default' }).then(res => res.json())
const UsersFetcher: Fetcher<GetUserRow[], string> = async (...args) => fetch(...args, { headers: { 'Authorization': getToken() }, cache: 'default' }).then(res => res.json())
const CheckOut = async (url: string, { arg }: { arg: { checkout_picture: string, user_id: number, item_id: number, amount: number } }) => await fetch(url, { headers: { 'Authorization': getToken() }, method: 'POST', body: JSON.stringify(arg) })
const CheckIn = async (url: string, { arg }: { arg: { checkin_picture: string, user_id: number, item_id: number } }) => await fetch(url, { headers: { 'Authorization': getToken() }, method: 'PUT', body: JSON.stringify(arg) })
const QuantityChange = async (url: string, { arg }: { arg: ChangeQuantity }) => await fetch(url, { headers: { 'Authorization': getToken() }, method: 'PUT', body: JSON.stringify(arg) })
const DeleteMaterial = async (url: string, { arg }: { arg: number }) => await fetch(url, { headers: { 'Authorization': getToken() }, method: 'DELETE', body: String(arg) })
const PostPicture = async (url: string, { arg }: { arg: { type: string, file: Blob } }) => await fetch(url, { headers: { 'Content-Type': `image/${arg.type}` }, method: 'POST', body: arg.file });

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

const DisplayCheckouts = (checkout_logs: CheckoutLog[] | undefined, error: boolean, isLoading: boolean, users: GetUserRow[] | undefined) => {
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
                <h3>Chekout pertains to user: {users ? users.filter(user => user.id == log.user_id)[0].username : log.user_id}</h3>
                <br />
                {(() => {
                  const checkout = new Date(log.checkout_time);
                  return (
                    `Checked out on : ${checkout.toLocaleDateString()} ${checkout.toLocaleTimeString()}`
                  );
                })()
                }
                <br />
                {`Amount checked out ${Math.abs(log.amount)}`}
                <br />
                {
                  (() => {

                    if (log.checkin_time.Valid) {
                      const checkin = new Date(log.checkin_time.Time);
                      return (
                        `Checked back in on : ${checkin.toLocaleDateString()} ${checkin.toLocaleTimeString()}`
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
  const { data: usernames } = useSWR(checkout_logs ? `/api/user/search?${checkout_logs.map(log => `id=${log.user_id}`).join('&')}` : undefined, UsersFetcher)

  const { trigger: download } = useSWRMutation('/api/picture', PostPicture);
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
  const { trigger: checkout, isMutating: checking_out } = useSWRMutation('/api/material/checkout/out', CheckOut)

  const { trigger: checkin, isMutating: checking_in } = useSWRMutation('/api/material/checkout/in', CheckIn)

  const { trigger: send_amount } = useSWRMutation('/api/material/material/change', QuantityChange)

  const handle_checkout = async (files: readonly FileWithPath[]) => {
    try {
      toast.message("Sending picture")
      const extension = files ? files[0].name.split('.').pop() : undefined
      if (!extension) {
        toast.error("Invald file extension");
        return
      }
      const picture_resp = await download({ type: extension, file: files![0] })
      if (!picture_resp.ok) {
        const message = await picture_resp.json() as { message: string }
        toast.error(message.message || "Error has occured");
        return
      }
      //TODO: set last checkout picture to current picture of item
      const name = await picture_resp.json() as { name: string }
      const check_pick = `/ ${name.name}`

      //Make checkin/out request
      let check_resp = undefined
      if (check && (counter > 0)) {
        check_resp = await checkin({ checkin_picture: check_pick, user_id: token!.id, item_id: material.id })
      } else if (counter > 0) {
        check_resp = await checkout({ checkout_picture: check_pick, user_id: token!.id, item_id: material.id, amount: -counter })
      } else {
        toast.error("Must pick a non-negative value")
        return
      }

      if (!check_resp.ok) {
        toast.error(await check_resp.text() || "Error has occured");
        return
      }

      //Change corresponding amount on maaterial
      const resp = await send_amount({ quantity: counter, id: material.id })
      if (!resp.ok) {
        toast.error(await resp.text() || "Error has occured");
        return
      }

      const new_material: Material = await resp.json()
      mutate(`/ api / material / checkout / recent ? id = ${new_material.id}`)
      mutate(`/ api / material / mlogs / recent ? id = ${new_material.id}`)
      toast.message(`${new_material.name.Valid ? new_material.name.String : ""} checked ${check ? "in" : "out"}`)

    } catch (err) {
      toast.error(String(err) || "Error has occured");
    }

  }

  useEffect(() => {
    if (checkout_logs && token) {
      setCheck(Boolean(checkout_logs?.find((log) => !log.checkin_time.Valid && log.user_id == token.id)))
    }

  }, [checkout_logs, token])
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
                    <Image src={material.picture.Valid ? material.picture.String : '/file.svg'} alt="No Picture of Item found" width={500} height={500}></Image>
                  </div>
                  <div >
                    {material.type.Valid ? `Type: ${material.type.String}` : "No type found"}
                    <br />
                    {`${material.status} with ${material.quantity} ${material.unit} `}
                    <br />
                    {material.last_checked_out.Valid ? `last checked out on ${new Date(material.last_checked_out.Time).toLocaleString()} ` : "Never checked out"}
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
                            <>
                              <div className="flex flex-row flex-auto max-w-96">
                                <AddFileDialog submitAction={handle_checkout}><Button className="w-32" variant={check ? "default" : "secondary"}>{check ? "Checkin" : "Checkout"}</Button></AddFileDialog>
                                <div className="w-2/3 content-center"><Input value={counter} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  setcount(Number(e.target.value))
                                }} className="text-slate-300 text-center bg-gray-950" />
                                </div>
                              </div>
                              <div className="flex flex-row">
                                <Button className="w-32" variant={check ? "default" : "secondary"}>Add stock</Button>
                                <div className="w-2/3 content-center"><Input value={counter} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  setcount(Number(e.target.value))
                                }} className="text-slate-300 text-center bg-gray-950" />
                                </div>
                              </div>
                            </>
                          )
                        }
                      })()
                      }
                      < div className="place-content-center">
                        {
                          DisplayCheckouts(checkout_logs, checkout_error, checkout_loading, usernames)
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
