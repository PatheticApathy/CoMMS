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
import { Token, User, UserJoin } from "@/user-api-types";
import { getToken } from "@/hooks/useToken";
import { useEffect } from "react";

const fetcher = async (url: string): Promise<UserJoin[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

const fetcher2 = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

const fetcher3 = async (url: string): Promise<User> => {
  const res = await fetch(url)
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

const token = getToken()

export default function ContactsTable({ searchQuery, tableData, tableAction }: { searchQuery: string, tableData: UserJoin[],tableAction: (data: UserJoin[]) => void }) {
  const { data: user, error: error1 } = useSWR<User, string>( `/api/user/username?username={user.username}`, fetcher2);
  useEffect(() => {
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
    tableAction(filteredData)
  }
  , [tableData,tableAction])

  if (!token) { return (<p className='flex items-center justify-center w-screen h-screen'>Invalid Token</p>) }

  const { data: tokenData, error: error2 } = useSWR(['/api/user/decrypt', token], ([url, token]) => getProfileArgs(url, token))
  const { data: currentuser, error: error3 } = useSWR<User, string>(tokenData ? `/api/user/search?id=${tokenData?.id}` : null, fetcher3);
  const { data, error } = useSWR<UserJoin[]>(tokenData && currentuser ? `/api/user/coworkers?user=${tokenData.id}&company=${currentuser?.company_id.Int64}&site=${currentuser?.jobsite_id.Int64}` : null, fetcher);
  
  console.log(tokenData ? `/api/user/coworkers?user=${tokenData.id}&company=${currentuser?.company_id.Int64}&site=${currentuser?.jobsite_id.Int64}` : null)
  if (error || error2 || error3) return <p>Invalid User.</p>;
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
                <TableCell>{user.company_name}</TableCell>
                <TableCell>{user.jobsite_name}</TableCell>
                <TableCell>{user.role?.Valid ? user.role.String : "N/A"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
              </TableRow>
            </DialogTrigger>
            <DialogContent className="w-[400px]">
              <DialogHeader>
                <DialogTitle>Profile</DialogTitle>
                <DialogDescription>View {user.username}'s Profile</DialogDescription>
              </DialogHeader>
              <div className="rounded-full overflow-hidden h-28 w-28">
                <img className="" src="https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"></img>
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
