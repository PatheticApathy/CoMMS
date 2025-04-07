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
import { GetUserRow } from "@/user-api-types";
import { delTokenNIdentity, getToken, IdentityContext } from '@/components/identity-provider'
import { useContext } from "react"
import Image from "next/image"

const fetcher = async (url: string) => {
  const res = await fetch(url,
    {
      headers: { 'Authorization': getToken() }
    }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};


export function Profile() {

  const identity = useContext(IdentityContext)
  const { data: user, error: error3, isLoading } = useSWR<GetUserRow[], string>(identity ? `/api/user/search?id=${identity.id}` : null, fetcher);



  async function logoutSubmit() {
    delTokenNIdentity()
    redirect('/')
  }
  console.log(identity)

  if (error3 || !user) return <p>Error loading Profile.</p>;
  if (isLoading) return <p>Loading...</p>;
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
          <Image alt='Yapper' className="" src="/default-avatar-profile-icon-of-social-media-user-vector.jpg" width={120} height={120} />
        </div>
        <div>Username: {user[0].username}</div>
        <div>Name: {user[0].firstname.Valid ? user[0].firstname.String : "N/A"} {user[0].lastname.Valid ? user[0].lastname.String : "N/A"}</div>
        <div>Email: {user[0].email}</div>
        <div>Phone: {user[0].phone}</div>
        <DialogFooter>
          <EditProfile />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
