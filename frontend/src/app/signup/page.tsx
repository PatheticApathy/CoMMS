"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from '@/components/ui/button'
import {  FormMessage,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const formschema = z.object({
  email: z.string(),
  phoneNumber: z.string(),
  username: z.string(),
  password: z.string(),
})

export default function SignupForm() {

  const form = useForm<z.infer<typeof formschema>>({
    resolver: zodResolver(formschema),
    defaultValues: {
      email: '',
      phoneNumber: '',
      username: '',
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof formschema>) {
    console.log(values)
  }

  return (
    <Form {... form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="signup"
          render = {({ field }) => (
            <FormItem>
                <FormLabel>username</FormLabel>
                <FormLabel>password</FormLabel>
                <FormLabel>email</FormLabel>
                <FormLabel>phone number</FormLabel>
            <FormControl>
              <Input placeholder="" {...field}/>
            </FormControl>
            <FormDescription>
              Signup for our service
            </FormDescription>
            </FormItem>

            )}
          />
          <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}