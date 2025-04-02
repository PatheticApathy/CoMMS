import { FormField, FormItem, FormDescription, FormMessage, FormControl } from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import { Input } from "../ui/input"
export default function FormInput({ name, placeholder, description, form }: { name: string, placeholder: string, description: string, form: UseFormReturn<any> }) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
