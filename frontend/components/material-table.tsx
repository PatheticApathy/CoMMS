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


//TODO:// check token beofre accessing
export async function GetAllMaterials() {

  const api_host = process.env.API
  try {
    const resp = await fetch(`http://${api_host}/material/material/all`, {
      headers: { "Content-Type": "application/json" },
      method: "GET",

    })
    if (!resp.ok) {
      console.error("Error, got status code %s", resp.status);
      return { error: "Invalid response" }

    }

    const data = await resp.json() as Material[] | undefined;
    return data;
  } catch {
    return { error: "Connection error" }
  }
}

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
                    <TableCell className="font-medium">{material.id}</TableCell>
                    <TableCell>{material.name.Valid ? material.name.String : "N/A"}</TableCell>
                    <TableCell>{material.last_checked_out}</TableCell>
                    <TableCell>{material.quantity}</TableCell>
                    <TableCell>{material.status}</TableCell>
                    <TableCell>{material.type.Valid ? material.type.String : "N/A"}</TableCell>
                    <TableCell className="text-right">{material.job_site.Valid ? material.job_site.Int64 : "N/A"}</TableCell>
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
