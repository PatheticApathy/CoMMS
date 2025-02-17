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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { redirect } from 'next/navigation'
import useSWRMutation from 'swr/mutation'
import Loading from '@/components/loading'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

export function EditProfile() {
    return (
        <Dialog>
            <DialogTrigger>
                <Button>Edit Profile</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>Edit your profile here. Click Save Changes when you're done.</DialogDescription>
                </DialogHeader>
                <div className="rounded-full overflow-hidden h-28 w-28">
                    <img className="" src="https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"></img>
                </div>
                <Input id="username" defaultValue="Username" required></Input>
                <Input id="firstname" defaultValue="FirstName" type="text"></Input>
                <Input id="lastname" defaultValue="LastName" type="text"></Input>
                <Input id="email" defaultValue="email@place.com" type="email" required></Input>
                <Input id="phone" defaultValue="1234567890" type="number" required></Input>
                <DialogFooter>
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}