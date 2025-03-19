import { Material } from "@/material-api-types"
import { DataTable } from "../table-maker/data-table";
import { MaterialRow } from "./material-columns";
import { MaterialTableColumns } from "./material-columns";
import useSWR, { Fetcher } from "swr"
import { Token } from "@/user-api-types";
import { getToken } from "../localstorage";
import { toast } from "sonner";

const TokenFetcher: Fetcher<Token, string> = async (...args) => fetch(...args, { method: 'POST', body: getToken(), cache: 'force-cache' }).then(res => res.json())

export default function MTable({ materials, route }: { materials: Material[], route: string }) {

  const { data: token, error: token_error } = useSWR('/api/user/decrypt', TokenFetcher)

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

  if (token_error) {
    toast.error('Invalid credentials')
  }
  return (
    <div className="mx-auto py-10">
      <DataTable columns={MaterialTableColumns(route, token)} data={rows} />
    </div>
  )
}
