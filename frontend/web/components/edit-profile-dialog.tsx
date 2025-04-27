/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { toast } from "sonner"
import { GetUserRow, UpdateProfileParams } from "@/user-api-types"
import { IdentityContext, getToken } from "@/components/identity-provider"
import { useContext } from "react"
import Image from "next/image"
import FormFileInput from "./form-maker/form-dropzone"

const formSchema = z.object({
  username: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  phone: z.string(),
  picture: z.instanceof(FileList).optional(),
})


async function changeProfile(url: string, { arg }: { arg: UpdateProfileParams }) {
  return fetch(url, {
    method: 'PUT',
    headers: { 'Authorization': getToken() },
    body: JSON.stringify(arg)
  })
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

const AddPicture = async (url: string, { arg }: { arg: { type: string, file: Blob } }) => await fetch(url, { headers: { 'Content-Type': `image/${arg.type}` }, method: 'POST', body: arg.file });

export function EditProfile() {
  const identity = useContext(IdentityContext)
  const { trigger, error, isMutating } = useSWRMutation('/api/user/update', changeProfile, { throwOnError: false })
  const { trigger: download } = useSWRMutation('api/picture', AddPicture)
  const { data: user, error: error3 } = useSWR<GetUserRow[], string>(identity ? `/api/user/search?id=${identity.id}` : undefined, fetcher)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: user && user[0] ? {
      username: user[0].username,
      firstname: user[0].firstname.Valid ? user[0].firstname.String : "",
      lastname: user[0].lastname.Valid ? user[0].lastname.String : "",
      email: user[0].email,
      phone: user[0].phone,
      picture: undefined,
    } :
      {
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        picture: undefined,
      }
    ,
  })

  if (error3) return <p>Error loading Profile.</p>;
  if (!user) return <p>Loading...</p>;


  if (isMutating) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }
  if (error) { return (<p className='flex items-center justify-center w-screen h-screen'>Error occured lol</p>) }

  async function profileSubmit(values: z.infer<typeof formSchema>) {

    const values2: UpdateProfileParams = {
      username: {
        Valid: Boolean(values.username),
        String: values.username
      },
      firstname: {
        Valid: Boolean(values.firstname),
        String: values.firstname
      },
      lastname: {
        Valid: Boolean(values.lastname),
        String: values.lastname
      },
      email: {
        Valid: Boolean(values.email),
        String: values.email
      },
      phone: {
        Valid: Boolean(values.phone),
        String: values.phone
      },
      profilepicture: {
        Valid: true,
        String: "/test.png"
      },
      ID: identity ? identity.id : 0,
    }

    try {
      console.log(values.picture)
      if (values.picture && values.picture?.length > 0) {
        toast.message("Sending picture")
        const extension = values.picture[0].name.split('.').pop()
        if (!extension) {
          toast.error("Invalid file extension")
          return
        }
        const resp = await download({ type: extension, file: values.picture[0] })
        if (!resp.ok) {
          console.log("Resp 1: ", resp)
          const message = await resp.json() as { message : string }
          console.log("Message: ", message)
          toast.error(message.message || "Error has occurred")
          return
        }
        const name = await resp.json() as { name: string }
        values2.profilepicture.String = `/${name.name}`
      }

      console.log(`File name is ${values2.profilepicture.String}`)
      const resp = await trigger(values2)
      if (!resp.ok) {
        console.log("Resp 2: ", resp)
        toast.error(await resp.text() || "Error has occurred")
        return
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.message || "Error has occurred")
    }
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
                <Image alt='Profile picture' src={user[0].profilepicture.Valid ? user[0].profilepicture.String : '/test.png'} width={120} height={120}></Image>
              </div>
            <FormFileInput name="picture" placeholder="Add picture" description="" form={form}/>
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
