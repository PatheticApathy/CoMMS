import { Material } from "@/material-api-types"
import { DataTable } from "../table-maker/data-table";
import { MaterialRow } from "./material-columns";
import { MaterialTableColumns } from "./material-columns";
import { IdentityContext } from "@/components/identity-provider";
import { useContext } from "react";



export default function MTable({ materials, route }: { materials: Material[], route: string | undefined }) {

  const identity = useContext(IdentityContext)


  const rows = materials.map((material): MaterialRow => {
    return {
      id: material.id,
      job_site: material.job_site,
      last_checked_out: material.last_checked_out.Valid ? material.last_checked_out.Time : undefined,
      location_lat: material.location_lat.Valid ? material.location_lat.Float64 : undefined,
      location_lng: material.location_lng.Valid ? material.location_lng.Float64 : undefined,
      name: material.name.Valid ? material.name.String : undefined,
      quantity: material.quantity,
      status: material.status,
      type: material.type.Valid ? material.type.String : undefined,
      unit: material.unit,
      picture: material.picture.Valid ? material.picture.String : undefined
    }
  })

  if (!identity) {
    return (
      <div className="mx-auto py-10">
        Please log in again
      </div>
    )
  }
  return (
    <div className="flex flex-col h-full w-full px-4">
      <DataTable columns={MaterialTableColumns(route, identity)} data={rows} />
    </div>
  )
}
