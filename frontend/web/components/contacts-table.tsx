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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import useSWR from "swr";
import { GetUserRow, Token, User, UserJoin } from "@/user-api-types";
import { getToken, IdentityContext } from "@/components/identity-provider";
import { useContext, useEffect } from "react";
import Image from "next/image";

const fetcher = async (url: string): Promise<UserJoin[]> => {
  const res = await fetch(url, {
    headers: { 'Authorization': getToken()}
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

const fetcher3 = async (url: string): Promise<GetUserRow[]> => {
  const res = await fetch(url, {
    headers: { 'Authorization': getToken()}
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

async function getProfileArgs(url: string, arg: string) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: arg
  }).then(res => res.json() as Promise<Token>)
}

//const token = getToken()

export default function ContactsTable({ searchQuery, tableData, tableAction }: { searchQuery: string, tableData: UserJoin[], tableAction: (data: UserJoin[]) => void }) {
  const identity = useContext(IdentityContext)
  //const { data: tokenData, error: error2 } = useSWR(['/api/user/decrypt', token], ([url, token]) => getProfileArgs(url, token))
  const { data: currentuser, error: error2 } = useSWR<GetUserRow[], string>(identity ? `/api/user/search?id=${identity?.id}` : null, fetcher3);
  const { data, error } = useSWR<UserJoin[]>(identity && currentuser ? `/api/user/coworkers?user=${identity.id}&company=${currentuser[0]?.company_id.Int64}&site=${currentuser[0]?.jobsite_id.Int64}` : null, fetcher);

  useEffect(() => {
    const filteredData = (data ?? []).filter((user: UserJoin) => {
      const searchLower = searchQuery.toLowerCase();

      return (
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.toLowerCase().includes(searchLower) ||
        (user.firstname.Valid && user.firstname.String.toLowerCase().includes(searchLower)) ||
        (user.lastname.Valid && user.lastname.String.toLowerCase().includes(searchLower)) ||
        (user.company_name.String.toLowerCase().includes(searchLower)) ||
        (user.jobsite_name.String.toLowerCase().includes(searchLower)) ||
        (user.role.Valid && user.role.String.toLowerCase().includes(searchLower))
      );
    });
    tableAction(filteredData)
  }
    , [data, searchQuery])

  if (!identity) { return (<p className='flex items-center justify-center w-screen h-screen'>Invalid Token</p>) }


  if (error || error2) return <p>Invalid User.</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <Table>
      <TableCaption>Users</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Site</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((user: UserJoin) => (
          <Dialog key={user.id}>
            <DialogTrigger asChild>
              <TableRow>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.firstname?.Valid ? user.firstname.String : "N/A"}</TableCell>
                <TableCell>{user.lastname?.Valid ? user.lastname.String : "N/A"}</TableCell>
                <TableCell>{user.company_name.String}</TableCell>
                <TableCell>{user.jobsite_name.String}</TableCell>
                <TableCell>{user.role?.Valid ? user.role.String : "N/A"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
              </TableRow>
            </DialogTrigger>
            <DialogContent className="w-[400px]">
              <DialogHeader>
                <DialogTitle>Profile</DialogTitle>
                <DialogDescription>View {user.username}&apos;s Profile</DialogDescription>
              </DialogHeader>
              <div className="rounded-full overflow-hidden h-28 w-28">
                  <Image alt='Yapper' className="" src="/default-avatar-profile-icon-of-social-media-user-vector.jpg" width={120} height={120} />
              </div>
              <div>Username: {user.username}</div>
              <div>Name: {user.firstname.Valid ? user.firstname.String : "N/A"} {user.lastname.Valid ? user.lastname.String : "N/A"}</div>
              <div>Email: {user.email}</div>
              <div>Phone: {user.phone}</div>
            </DialogContent>
          </Dialog>
        ))}
      </TableBody>
    </Table>
  );
}
