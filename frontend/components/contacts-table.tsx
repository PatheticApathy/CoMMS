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
  DialogFooter,
} from "@/components/ui/dialog"
import useSWR from "swr";
import { User } from "@/user-api-types";

const fetcher = async (url: string): Promise<User[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

const fetcher2 = async  (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

export default function ContactsTable({ searchQuery }: { searchQuery: string }) {
  const { data, error } = useSWR<User[]>("/api/user/all", fetcher);

  const { data: user, error: error3 } = useSWR<User, string>( `api/user/username?username={user.username}`, fetcher2);

  if (error) return <p>Error loading contacts.</p>;
  if (!data) return <p>Loading...</p>;  

  const filteredData = (data ?? []).filter((user: User) => {
    const searchLower = searchQuery.toLowerCase();
  
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phone.toLowerCase().includes(searchLower) ||
      (user.firstname.Valid && user.firstname.String.toLowerCase().includes(searchLower)) ||
      (user.lastname.Valid && user.lastname.String.toLowerCase().includes(searchLower)) ||
      (user.company.Valid && user.company.String.toLowerCase().includes(searchLower)) ||
      (user.site.Valid && user.site.String.toLowerCase().includes(searchLower)) ||
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
          <TableHead>Site</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredData.map((user: User) => (
          <Dialog>
            <DialogTrigger asChild>
              <TableRow key={user.username}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.firstname?.Valid ? user.firstname.String : "N/A"}</TableCell>
                <TableCell>{user.lastname?.Valid ? user.lastname.String : "N/A"}</TableCell>
                <TableCell>{user.company?.Valid ? user.company.String : "N/A"}</TableCell>
                <TableCell>{user.site?.Valid ? user.site.String : "N/A"}</TableCell>
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
                <div>Name: {user.firstname.Valid? user.firstname.String : "N/A"} {user.lastname.Valid? user.lastname.String : "N/A"}</div>
                <div>Email: {user.email}</div>
                <div>Phone: {user.phone}</div>
            </DialogContent>
          </Dialog>
        ))}
      </TableBody>
    </Table>
  );
}