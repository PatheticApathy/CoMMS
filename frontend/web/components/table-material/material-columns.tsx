import { ColumnDef } from "@tanstack/react-table"
import { Material } from "@/material-api-types"
import MaterialSheet from "./material-popup"
import { Button } from "../ui/button"
import { ArrowUpDown } from "lucide-react"
import { Token } from "@/user-api-types"

export type MaterialRow = {
  id: number
  job_site: number
  last_checked_out: string | undefined
  location_lat: number | undefined
  location_lng: number | undefined
  name: string | undefined
  quantity: number
  status: string
  type: string | undefined
  unit: string
  picture: string | undefined

}

export const MaterialTableColumns: ((route: string | undefined, token: Token | undefined) => ColumnDef<MaterialRow>[]) = (route, token) => ([
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "quantity",
    header: "Amount",
    cell: ({ row }) => {
      const unit = row.original.unit
      const quantity = row.original.quantity
      return <div>{`${quantity} ${unit}`}</div>
    }
  },
  {
    accessorKey: "status",
    header: "Status"
  },
  {
    accessorKey: "type",
    header: "Type"
  },
  {
    accessorKey: "job_site",
    header: () => <div className="">Job Site</div>
  },
  {
    id: "more",
    cell: ({ row }) => {
      const material_row = row.original
      const material: Material = {
        id: material_row.id,
        job_site: material_row.job_site,
        last_checked_out: material_row.last_checked_out ? {
          Time: material_row.last_checked_out,
          Valid: true
        } : {
          Time: "N/A",
          Valid: false
        },
        location_lat: material_row.location_lat ? {
          Float64: material_row.location_lat,
          Valid: true
        } : {
          Float64: 0,
          Valid: false
        },
        location_lng: material_row.location_lng ? {
          Float64: material_row.location_lng,
          Valid: true
        } : {
          Float64: 0,
          Valid: false
        },
        name: material_row.name ? {
          String: material_row.name,
          Valid: true
        } : {
          String: "No name provided",
          Valid: true
        },

        quantity: material_row.quantity,
        status: material_row.status,
        type: material_row.name ? {
          String: material_row.name,
          Valid: true
        } : {
          String: "No name provided",
          Valid: true
        },
        unit: material_row.unit,
        picture: material_row.picture ? {
          String: material_row.picture,
          Valid: true
        } : {
          String: "./file.svg",
          Valid: false
        },
      }


      return (
        <div className="justify-end" >
          <MaterialSheet material={material} route={route} token={token}>
            <Button variant={'ghost'}>More details</Button>
          </MaterialSheet>
        </div >

      )
    }
  },
])
