import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CheckoutLog, Material, MaterialLog } from "@/material-api-types";
import Image from "next/image";
import useSWR, { Fetcher } from "swr"
import Loading from "./loading";
import { Heading, Heading2 } from "lucide-react";
import { User } from "@/user-api-types";

const MaterialLogFetcher: Fetcher<MaterialLog[], string> = async (...args) => fetch(...args).then(res => res.json())
const CheckoutLogFetcher: Fetcher<CheckoutLog[], string> = async (...args) => fetch(...args).then(res => res.json())

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
              <>
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
              </>
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
              <>
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
                    }
                  })()
                }
              </>
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
export default function MaterialSheet({ material, children, }: Readonly<{
  material: Material,
  children: React.ReactNode;
}>) {

  const { data: material_logs, isLoading: material_loading, error: material_error } = useSWR(`/api/material/mlogs/recent?id=${material.id}`, MaterialLogFetcher)
  const { data: checkout_logs, isLoading: checkout_loading, error: checkout_error } = useSWR(`/api/material/checkout/recent?id=${material.id}`, CheckoutLogFetcher)


  console.log(checkout_logs)
  console.log(material_logs)
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
                  <div className="place-content-center">
                    {
                      DisplayCheckouts(checkout_logs, checkout_error, checkout_loading)
                    }
                  </div>
                </div>
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
