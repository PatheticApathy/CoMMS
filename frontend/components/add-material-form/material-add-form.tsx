"use client"
import { Button } from "@/components//ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import useSWRMutation from "swr/mutation"
import { Input } from "@/components/ui/input"
import { ComboboxFormField } from "@/components/form-combobox"
import { Material, AddMaterial } from "@/material-api-types"
import { toast } from "sonner"

//Schema for form
const AddMaterialSchema = z.object({
  job_site: z.coerce.number().nonnegative({ message: "Job site must have nonnegative value" }),
  name: z.string().min(1, { message: "Name must be longer than one chracter" }),
  quantity: z.coerce.number().nonnegative({ message: "Quantity can't be negative" }),
  status: z.enum(["In Stock", "Out of Stock", "Low Stock"]),
  type: z.string().min(2, { message: "Type must be more than 2 charcaters" }),
  unit: z.string().min(1, { message: "Unit must be greater than 1" })
})

//fetcher
const PostAddMaterial = async (url: string, { arg }: { arg: AddMaterial }) => await fetch(url, { method: 'POST', body: JSON.stringify(arg) })

export default function MaterialForm() {

  //form controller
  const form = useForm<z.infer<typeof AddMaterialSchema>>({
    resolver: zodResolver(AddMaterialSchema),
    defaultValues: {
      job_site: 0,
      name: "",
      quantity: 0,
      status: "In Stock",
      type: "",
      unit: ""
    }
  })

  const jobsites = [
    { label: "Work", value: 1 },
    { label: "In", value: 2 },
    { label: "Progress", value: 3 },
  ]
  const status = [
    { label: "In Stock", value: "In Stock" },
    { label: "Low Stock", value: "Low Stock" },
    { label: "Out of Stock", value: "Out of Stock" },
  ]


  const { trigger, isMutating } = useSWRMutation('/api/material/material/add', PostAddMaterial, {
    onError(err) {
      console.log(err)
      toast.error(err.message || "Error has occured");

    },
    onSuccess(data) {
      data.json().then((resp: Material) => {
        console.log("success")
        toast.success(`Material ${resp.name.String} Added!`);
      })
    },
  })

  const SendAddMaterialRequest = (values: z.infer<typeof AddMaterialSchema>) => {
    const payload: AddMaterial = {
      job_site: {
        Valid: true,
        Int64: values.job_site
      },
      location_lat: {
        Valid: false,
        Float64: 0
      },
      location_lng: {
        Valid: false,
        Float64: 0
      },
      name: {
        Valid: true,
        String: values.name
      },
      quantity: values.quantity,
      status: values.status,
      type: {
        Valid: true,
        String: values.type
      },
      unit: values.unit
    }
    console.log(payload)
    trigger(payload)
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(SendAddMaterialRequest)}>
        <ComboboxFormField form_attr={{ name: "job_site", description: "All known jobsites for this location", form: form }} default_label="Choose a jobsite" options={jobsites} />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormDescription>Name of item</FormDescription>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormDescription>Quantity of item</FormDescription>
              <FormControl>
                <Input placeholder="Quantity" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ComboboxFormField form_attr={{ name: "status", description: "Initial status of item", form: form }} default_label={"In Stock"} options={status} />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormDescription>Type of item</FormDescription>
              <FormControl>
                <Input placeholder="type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormDescription>Unit of measurment of item</FormDescription>
              <FormControl>
                <Input placeholder="unit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Send Request</Button>
      </form>
    </Form>
  )
}