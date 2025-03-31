"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  SidebarMenuButton,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { redirect } from 'next/navigation'
import { EditProfile } from "./edit-profile-dialog"
import useSWR from "swr";
import { User } from "@/user-api-types";
import { delTokenNIdentity, useIdentity } from '@/hooks/useToken'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};


export function Profile() {

  const identity = useIdentity()
  const { data: user, error: error3 } = useSWR<User, string>(identity ? `/api/user/search?id=${identity.id}` : null, fetcher);

  if (error3) return <p>Error loading Profile.</p>;
  if (!user) return <p>Loading...</p>;

  async function logoutSubmit() {
    delTokenNIdentity()
    redirect('/')
  }

  return (
    <Dialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton>
            Account
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          className="w-[--radix-popper-anchor-width]"
        >
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <span>Profile</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem onClick={logoutSubmit}>
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>View your profile here. Click Edit Profile to edit your profile.</DialogDescription>
        </DialogHeader>
        <div className="rounded-full overflow-hidden h-28 w-28">
          <img className="" src="https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"></img>
        </div>
        <div>Username: {user.username}</div>
        <div>Name: {user.firstname.Valid ? user.firstname.String : "N/A"} {user.lastname.Valid ? user.lastname.String : "N/A"}</div>
        <div>Email: {user.email}</div>
        <div>Phone: {user.phone}</div>
        <DialogFooter>
          <EditProfile />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
