import { Material } from "@/material-api-types"
import { DataTable } from "../table-maker/data-table";
import { MaterialRow } from "./material-columns";
import { MaterialTableColumns } from "./material-columns";
import { toast } from "sonner";
import { TriggerWithArgs } from "swr/mutation";
import useSWRMutation from "swr/mutation";
import { number } from "zod";


//fetcher
const DeleteMaterial = async (url: string, { arg }: { arg: number }) => await fetch(url, { method: 'DELETE', body: String(arg) })
const CheckOut = async (url: string, { arg }: { arg: { user: number, item: number } }) => await fetch(url, { method: 'POST', body: String(arg) })

export default function MTable({ materials }: { materials: Material[] }) {

  const { trigger, isMutating } = useSWRMutation('/api/material/material/delete', DeleteMaterial, {
    onError(err) {
      console.log(err)
      toast.error(err.message || "Error has occured");

    },
    onSuccess(data) {
      data.json().then((resp: Material) => {
        console.log("Successfully deleted")
        toast.success(`Material ${resp.name.String} Deleted!`);
      })
    },

  })
  const { trigger: t2, isMutating: m2 } = useSWRMutation('/api/material/checkout/out', CheckOut, {
    onError(err) {
      console.log(err)
      toast.error(err.message || "Error has occured");

    },
    onSuccess(data) {
      data.json().then((resp: Material) => {
        console.log("Checked Out")
        toast.success(`Checked Out!`);
      })
    },

  })


  const rows = materials.map((material): MaterialRow => {
    return {
      id: material.id,
      job_site: material.job_site.Valid ? material.job_site.Int64 : undefined,
      last_checked_out: material.last_checked_out,
      location_lat: material.location_lat.Valid ? material.location_lat.Float64 : undefined,
      location_lng: material.location_lng.Valid ? material.location_lng.Float64 : undefined,
      name: material.name.Valid ? material.name.String : undefined,
      quantity: material.quantity,
      status: material.status,
      type: material.type.Valid ? material.type.String : undefined,
      unit: material.unit
    }
  })

  const DeleteMat = (id: number) => {
    trigger(id)
  }

  //TODO: make it switch to a check in for  function 
  const CheckOutMaterial = (user: number, item: number) => {
    t2({ user, item })
  }
  return (
    <div className="mx-auto py-10">
      <DataTable columns={MaterialTableColumns(DeleteMat, CheckOutMaterial)} data={rows} />
    </div>
  )
}
