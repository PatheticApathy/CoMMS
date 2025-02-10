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
import { User } from "@/user-api-types"
import { ReactNode } from "react";


export default async function ContactsTable() {
  const api_host = process.env.API
  const resp = await fetch(`http://localhost:8082/user/all`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",

  })
  if (!resp.ok) {
    console.error("Error, got status code %s", resp.status);
  }

  const data = await resp.json() as User[];

  let rows: ReactNode = data.map((user) => (
    <TableRow>
      <TableCell className="font-medium">{user.id}</TableCell>
      <TableCell>{user.username }</TableCell>
      <TableCell>{user.firstname.valid ? user.firstname.string : "N/A"}</TableCell>
      <TableCell>{user.lastname.valid ? user.lastname.string : "N/A"}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell className="text-right">{user.phone}</TableCell>
    </TableRow>
  ));
  return (
    <Table>
      <TableCaption>Users</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">ID</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Phone #</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows}
      </TableBody>
    </Table>
  )
}
