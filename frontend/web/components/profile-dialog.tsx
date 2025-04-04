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
import { getToken, delToken } from '@/components/localstorage'

async function getProfileArgs(url: string, arg: string) {
    return fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: arg
    }).then(res => res.json())
}

/*async function deleteUsers(url: string) {
    return fetch(url, {
        method: 'DELETE',
    }).then(res=>res.json())
}*/

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
};

export function Profile() {

    let token = getToken()
    let id = 1

    const { data: tokenData, error: error2 } = useSWR(['/api/user/decrypt', token], ([url, token]) => getProfileArgs(url, token))
    if (tokenData)
        id = tokenData.id

    /*for (let i = 12; i < 100; i++)
    {
        const { mutate: deleteMutate } = useSWR(`api/user/delete?id=${i}`, deleteUsers)
        deleteMutate()
    }*/


    const { data: user, error: error3 } = useSWR<User, string>( `/api/user/search?id=${id}`, fetcher);

    if (error3) return <p>Error loading Profile.</p>;
    if (!user) return <p>Loading...</p>;        

    async function logoutSubmit() {
        delToken()
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
                    <DropdownMenuItem onClick={ logoutSubmit }>
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
                <div>Name: {user.firstname.Valid? user.firstname.String : "N/A"} {user.lastname.Valid? user.lastname.String : "N/A"}</div>
                <div>Email: {user.email}</div>
                <div>Phone: {user.phone}</div>
                <DialogFooter>
                    <EditProfile />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}