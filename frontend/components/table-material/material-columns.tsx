import { ColumnDef } from "@tanstack/react-table"
import { Material } from "@/material-api-types"
import MaterialSheet from "./material-popup"
import { Button } from "../ui/button"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/check-box"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TriggerWithArgs } from "swr/mutation"

export type MaterialRow = {
  id: number
  job_site: number | undefined
  last_checked_out: string
  location_lat: number | undefined
  location_lng: number | undefined
  name: string | undefined
  quantity: number
  status: string
  type: string | undefined
  unit: string

}

export const MaterialTableColumns: ((DeleteAction: (id: number) => void, CheckAction: (user_id: number, check: number) => void) => ColumnDef<MaterialRow>[]) = (DeleteAction, CheckAction) => ([

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
        job_site: material_row.job_site ? {
          Int64: material_row.job_site,
          Valid: true
        } : {
          Int64: 0,
          Valid: false
        },
        last_checked_out: material_row.last_checked_out,
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
        unit: material_row.unit
      }


      return (
        <MaterialSheet material={material}>
          <Button variant={'ghost'}>More details</Button>
        </MaterialSheet>

      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const material = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              ...
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(String(material.id))}
            >
              Copy Material ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => DeleteAction(material.id)}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => CheckAction(material.id, 0)}
            >
              Checkout
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
            </DropdownMenuItem>
            <DropdownMenuItem></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu >
      )
    }
  },

])
