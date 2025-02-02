//TODO: Need to handle possible render error
`use server`
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Material } from "@/material-api-types"
import { ReactNode } from "react";
import GetMaterials from "@/server_side/get_material";

export default async function MTable() {
  let materials = await GetMaterials()
  let rows: ReactNode = materials.map((material) => (
    <TableRow>
      <TableCell className="font-medium">{material.id}</TableCell>
      <TableCell>{material.name.valid ? material.name.string : "N/A"}</TableCell>
      <TableCell>{material.last_checked_out}</TableCell>
      <TableCell>{material.quantity}</TableCell>
      <TableCell>{material.status}</TableCell>
      <TableCell>{material.type.valid ? material.type.string : "N/A"}</TableCell>
      <TableCell className="text-right">{material.job_site ? material.job_site.valid : "N/A"}</TableCell>
    </TableRow>
  ));
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
        {rows}
      </TableBody>
    </Table>
  )
}
