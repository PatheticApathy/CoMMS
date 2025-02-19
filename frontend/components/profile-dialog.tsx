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
import useSWRMutation from 'swr/mutation'
import Loading from '@/components/loading'
import { EditProfile } from "./edit-profile-dialog"
import useSWR from "swr";
import { User } from "@/user-api-types";
import { getCookie } from "./cookie-functions"

async function logOut(url: string, { arg }) {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg)
    }).then(res => res.json())
}

const fetcher = async  (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
};

export function Profile() {

    let id = getCookie("id")

    const { data, trigger, error, isMutating } = useSWRMutation('api/user/loggout', logOut, {throwOnError: false})

    const { data: user, error: error2 } = useSWR<User, string>( `api/user/search?id=${id}`, fetcher);

    if (error2) return <p>Error loading Profile.</p>;
    if (!user) return <p>Loading...</p>;        

    if (isMutating) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }
    console.log("Error: ", error)
    console.log("Data: ", data)
    if (error) { return (<p className='flex items-center justify-center w-screen h-screen'>Error occured lol</p>) }
    if (data) {redirect('/')}   

    async function logoutSubmit() {
        trigger()
        document.cookie = `username=`
        document.cookie = `id=`
        document.cookie = `expires=Thu, 01 Jan 1970 00:00:00 UTC`
        document.cookie = `path=/`
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