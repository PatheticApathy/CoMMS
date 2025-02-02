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


export default async function MTable() {
  const api_host = process.env.API
  const resp = await fetch(`http://localhost:8080/material/all`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",

  })
  if (!resp.ok) {
    console.error("Error, got status code %s", resp.status);
  }

  const data = await resp.json() as Material[];

  let rows: ReactNode = data.map((material) => (
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
