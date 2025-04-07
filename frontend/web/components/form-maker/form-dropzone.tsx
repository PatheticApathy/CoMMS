/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormField, FormItem, FormDescription, FormMessage, FormControl } from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import { Input } from "../ui/input"
export default function FormFileInput({ name, placeholder, description, form }: { name: string, placeholder: string, description: string, form: UseFormReturn<any> }) {
  const fileref = form.register("picture")
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormControl>
            <Input type="file" placeholder={placeholder} className="resize-none" {...fileref} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
