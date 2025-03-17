import { Material } from "@/material-api-types"
import { DataTable } from "../table-maker/data-table";
import { MaterialRow } from "./material-columns";
import { MaterialTableColumns } from "./material-columns";
import { KeyedMutator } from "swr";

export default function MTable({ materials, route }: { materials: Material[], route: string }) {

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

  return (
    <div className="mx-auto py-10">
      <DataTable columns={MaterialTableColumns(route)} data={rows} />
    </div>
  )
}
