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

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { redirect } from 'next/navigation'
import useSWRMutation from 'swr/mutation'
import Loading from '@/components/loading'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { EditProfile } from "./edit-profile-dailog"

async function logOut(url, { arg }) {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg)
    }).then(res => res.json())
}

export function Profile() {

    const { data, trigger, error, isMutating } = useSWRMutation('api/user/logout', logOut, {throwOnError: false})

    if (isMutating) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }
    if (error) { return (<p className='flex items-center justify-center w-screen h-screen'>Error occured lol</p>) }
    if (data) {redirect('/')}

    async function logoutSubmit() {
        trigger()
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
                <div>Username: Username</div>
                <div>Name: FirstName LastName</div>
                <div>Email: email@place.com</div>
                <div>Phone: 1234567890</div>
                <DialogFooter>
                    <EditProfile />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}