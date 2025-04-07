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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useSWRMutation from 'swr/mutation'
import Loading from '@/components/loading'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import useSWR from "swr"
import { Firstname, Lastname, GetUserRow, UpdateProfileParams } from "@/user-api-types"
import { IdentityContext, getToken } from "@/components/identity-provider"
import { useContext } from "react"
import Image from "next/image"

const formSchema = z.object({
  username: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  phone: z.string(),
})


async function changeProfile(url: string, { arg }: { arg: UpdateProfileParams }) {
  return fetch(url, {
    method: 'PUT',
    headers: { 'Authorization': getToken() },
    body: JSON.stringify(arg)
  }).then(res => res.json())
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: { 'Authorization': getToken() }
  })
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

export function EditProfile() {
  const identity = useContext(IdentityContext)
  const { trigger, error, isMutating } = useSWRMutation('/api/user/update', changeProfile, { throwOnError: false })
  const { data: user, error: error3 } = useSWR<GetUserRow[], string>(identity ? `/api/user/search?id=${identity.id}` : undefined, fetcher)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: user && user[0] ? {
      username: user[0].username,
      firstname: user[0].firstname.Valid ? user[0].firstname.String : "",
      lastname: user[0].lastname.Valid ? user[0].lastname.String : "",
      email: user[0].email,
      phone: user[0].phone,
    } :
      {
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
      }
    ,
  })

  if (error3) return <p>Error loading Profile.</p>;
  if (!user) return <p>Loading...</p>;


  if (isMutating) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }
  if (error) { return (<p className='flex items-center justify-center w-screen h-screen'>Error occured lol</p>) }

  async function profileSubmit(values: z.infer<typeof formSchema>) {
    const username = {
      String: values.username,
      Valid: Boolean(values.username)
    }
    const firstname: Firstname = {
      String: values.firstname,
      Valid: Boolean(values.firstname)
    }
    const lastname: Lastname = {
      String: values.lastname,
      Valid: Boolean(values.lastname)
    }
    const email = {
      String: values.email,
      Valid: Boolean(values.email)
    }
    const phone = {
      String: values.phone,
      Valid: Boolean(values.phone)
    }

    const values2: UpdateProfileParams = {
      username,
      firstname,
      lastname,
      email,
      phone,
      ID: identity ? identity.id : 0,
    }
    trigger(values2)
  }

  return (
    <Form{...form}>
      <Dialog>
        <DialogTrigger>
          <Button type="button">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Edit your profile here. Click Save Changes when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(profileSubmit)} className="space-y-8">
            <div className="rounded-full overflow-hidden h-28 w-28">
              <Image alt='Profile picture' src="/default-avatar-profile-icon-of-social-media-user-vector.jpg" width={120} height={120} />
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id="username" type="text" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id="firstname" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id="lastname" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id="email" type="email" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id="phone" type="text" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  )
}
