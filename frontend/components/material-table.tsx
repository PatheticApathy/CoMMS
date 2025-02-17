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
import MaterialSheet from "./material-sheet";

export default function MTable({ materials }: { materials: Material[] }) {
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
          <TableHead className="">Job Site</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          materials.map((material) => (
            <TableRow>
              <TableCell className="font-medium hover:text-cyan-200"><MaterialSheet material={material}>{material.id}</MaterialSheet></TableCell>
              <TableCell className="hover:text-cyan-200"><MaterialSheet material={material}>{material.name.Valid ? material.name.String : "N/A"}</MaterialSheet></TableCell>
              <TableCell className="hover:text-cyan-200">{material.last_checked_out}</TableCell>
              <TableCell className="hover:text-cyan-200">{`${material.quantity}  ${material.unit}`}</TableCell>
              <TableCell className="hover:text-cyan-200">{material.status}</TableCell>
              <TableCell className="hover:text-cyan-200">{material.type.Valid ? material.type.String : "N/A"}</TableCell>
              <TableCell className=" hover:text-cyan-200">{material.job_site.Valid ? material.job_site.Int64 : "N/A"}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}
