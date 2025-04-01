/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormField, FormItem, FormDescription, FormMessage, FormControl } from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
export default function FormTextInput({ name, placeholder, description, form }: { name: string, placeholder: string, description: string, form: UseFormReturn<any> }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea placeholder={placeholder} className="resize-none" {...field} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
