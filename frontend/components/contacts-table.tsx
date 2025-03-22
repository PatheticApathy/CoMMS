"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useSWR from "swr";
import { UserJoin } from "@/user-api-types";

const fetcher = async (url: string): Promise<UserJoin[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

export default function ContactsTable({ searchQuery }: { searchQuery: string }) {
  const { data, error } = useSWR<UserJoin[]>("/api/user/join", fetcher);
  
  console.log(data);

  if (error) return <p>Error loading contacts.</p>;
  if (!data) return <p>Loading...</p>;

  const filteredData = (data ?? []).filter((user: UserJoin) => {
    const searchLower = searchQuery.toLowerCase();

    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phone.toLowerCase().includes(searchLower) ||
      (user.firstname.Valid && user.firstname.String.toLowerCase().includes(searchLower)) ||
      (user.lastname.Valid && user.lastname.String.toLowerCase().includes(searchLower)) ||
      (user.company_name.toLowerCase().includes(searchLower)) ||
      (user.jobsite_name.toLowerCase().includes(searchLower)) ||
      (user.role.Valid && user.role.String.toLowerCase().includes(searchLower))
    );
  });

  return (
    <Table>
      <TableCaption>Users</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Jobsite</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredData.map((user: UserJoin) => {
          return (
            <TableRow key={user.username}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.firstname?.Valid ? user.firstname.String : "N/A"}</TableCell>
              <TableCell>{user.lastname?.Valid ? user.lastname.String : "N/A"}</TableCell>
              <TableCell>{user.company_name}</TableCell>
              <TableCell>{user.jobsite_name}</TableCell>
              <TableCell>{user.role?.Valid ? user.role.String : "N/A"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}