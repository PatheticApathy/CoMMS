//TODO: Need to handle possible render error
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SheetTrigger } from "@/components/ui/sheet";
import { Material } from "@/material-api-types"
import { ReactNode } from "react";
import MaterialSheet from "./material-sheet";

export default function MTable({ data }: { data: Material[] | undefined }) {
  return (
    <Table>
      <TableCaption>Materials</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Last Checked Out</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Job Site</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          (() => {
            if (!data) {
              return (<div className="justify-self-center">No Data to display</div>)
            } else {
              return (
                data.map((material) => (
                  <TableRow>
                    <TableCell className="font-medium hover:text-cyan-200"><MaterialSheet id={material.id}>{material.id}</MaterialSheet></TableCell>
                    <TableCell className="hover:text-cyan-200"><MaterialSheet id={material.id}>{material.name.Valid ? material.name.String : "N/A"}</MaterialSheet></TableCell>
                    <TableCell className="hover:text-cyan-200">{material.last_checked_out}</TableCell>
                    <TableCell className="hover:text-cyan-200">{material.quantity}</TableCell>
                    <TableCell className="hover:text-cyan-200">{material.status}</TableCell>
                    <TableCell className="hover:text-cyan-200">{material.type.Valid ? material.type.String : "N/A"}</TableCell>
                    <TableCell className="text-right hover:text-cyan-200">{material.job_site.Valid ? material.job_site.Int64 : "N/A"}</TableCell>
                  </TableRow>
                )))
            }
          }
          )()
        }
      </TableBody>
    </Table>
  )
}
