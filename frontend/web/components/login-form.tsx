"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { redirect } from 'next/navigation'
import useSWRMutation from 'swr/mutation'
import Loading from '@/components/loading'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LogInUser } from "@/user-api-types"
import { setToken } from "@/components/identity-provider"
import { toast } from "sonner"

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
})

async function logIn(url: string, { arg }: { arg: LogInUser }) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg)
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Invalid login')
    }
    return res.text()
  })
}

export default function LoginForm() {

  const { data, trigger, error, isMutating } = useSWRMutation('api/user/login', logIn, { throwOnError: false })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  if (isMutating) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }
  if (error) { toast.error("Login Failed") }
  if (data) {
    setToken(data)
    redirect('/dashboard')
  }

  //validate form data(data is safe at this point)
  async function onSubmit(values: z.infer<typeof formSchema>) {
    trigger(values)
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
        <div className="flex justify-center">
          <Button variant="yellow" disabled={isMutating} className="flex justify-center" type="submit">Login</Button>
        </div>
        <div className="flex justify-center">Don't Have an Account?</div>
        <Link href="/signup" className="flex jus &apos;tify-center hover:text-blue-500 hover:underline">Sign up!</Link>
      </form>
    </Form>
  )
}
