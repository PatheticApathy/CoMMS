"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupParams } from '@/user-api-types'
import { redirect } from 'next/navigation'

const formSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
  confirm_password: z.string().nonempty(),
  email: z.string().nonempty(),
  phone_number: z.string().nonempty(),
})

async function Signup(values: SignupParams) {
  const api_host = process.env.API;
  if (!api_host) {
    return { message: "api host not set in .env file" }
  }
  try {
    const resp = await fetch(`http://${api_host}/user/signup`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(values),
    })

    if (!resp.ok) {
      const msg: string = await (await resp.blob()).text()
      return { message: msg }
    }
  } catch (err) {
    console.error(err)
    return { message: err }
  }

  redirect('/dashboard')
}

export default function SignupForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirm_password: "",
      email: "",
      phone_number: "",
    },
  })

  //validate form data(data is safe at this point)
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Making server request")
    const message = await Signup({
      email: values.email,
      passwod: values.password,
      username: values.username,
      phone: values.phone_number,
    })

    console.log("Request finished")
    alert(message.message)
  }

  return (
    <Form{...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Username" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Password" type="password" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Confirm Password" type="password" required {...field} />
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
                <Input placeholder="Email" type="email" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Phone Number" type="number" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button className="flex justify-center" type="submit">Signup</Button>
        </div>
        <div className="flex justify-center">Already Have an Account?</div>
        <Link href="/login" className="flex justify-center hover:text-blue-500 hover:underline">Login!</Link>
      </form>
    </Form>
  )
}
