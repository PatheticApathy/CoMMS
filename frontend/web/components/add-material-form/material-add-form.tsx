/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Button } from "@/components//ui/button"
import {
  Form,
} from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import useSWRMutation from "swr/mutation"
import { mutate } from "swr"
import { ComboboxFormField } from "@/components/form-maker/form-combobox"
import { Material, AddMaterial } from "@/material-api-types"
import FormInput from "../form-maker/form-input"
import { toast } from "sonner"
import FormFileInput from "../form-maker/form-dropzone"
import { getToken } from "@/components/identity-provider"
import AddMaterialMap from "./material-add-map"

// Schema for form
const AddMaterialSchema = z.object({
  job_site: z.coerce.number().nonnegative({ message: "Job site must have nonnegative value" }),
  name: z.string().min(1, { message: "Name must be longer than one character" }),
  quantity: z.coerce.number().nonnegative({ message: "Quantity can't be negative" }),
  status: z.enum(["In Stock", "Out of Stock", "Low Stock"]),
  type: z.string().min(2, { message: "Type must be more than 2 characters" }),
  unit: z.string().min(1, { message: "Unit must be greater than 1" }),
  picture: z.instanceof(FileList).optional(),
  location_lat: z.coerce.number(),
  location_lng: z.coerce.number()
});

// Fetcher
const PostAddMaterial = async (url: string, { arg }: { arg: AddMaterial }) => await fetch(url, { headers: { 'Authorization': getToken() }, method: 'POST', body: JSON.stringify(arg) });
const PostPicture = async (url: string, { arg }: { arg: { type: string, file: Blob } }) => await fetch(url, { headers: { 'Content-Type': `image/${arg.type}` }, method: 'POST', body: arg.file });

export default function MaterialForm({ route }: { route: string | undefined }) {
  // Form controller
  const form = useForm<z.infer<typeof AddMaterialSchema>>({
    resolver: zodResolver(AddMaterialSchema),
    defaultValues: {
      job_site: 0,
      name: "",
      quantity: 0,
      status: "In Stock",
      type: "",
      unit: "",
      picture: undefined
    }
  });

  const status = [
    { label: "In Stock", value: "In Stock" },
    { label: "Low Stock", value: "Low Stock" },
    { label: "Out of Stock", value: "Out of Stock" },
  ];

  const { trigger, isMutating } = useSWRMutation('/api/material/material/add', PostAddMaterial);
  const { trigger: download, isMutating: isDownloading } = useSWRMutation('/api/picture', PostPicture);

  const SendAddMaterialRequest = async (values: z.infer<typeof AddMaterialSchema>) => {
    const payload: AddMaterial = {
      job_site: values.job_site,
      location_lat: {
        Valid: true,
        Float64: values.location_lat
      },
      location_lng: {
        Valid: true,
        Float64: values.location_lng
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
      unit: values.unit,
      picture: { Valid: true, String: "/file.svg" }
    };

    try {

      if (values.picture && values.picture?.length > 0) {
        toast.message("Sending picture")
        const extension = values.picture[0].name.split('.').pop()
        if (!extension) {
          toast.error("Invald file extension");
          return
        }
        const resp = await download({ type: extension, file: values.picture[0] })
        if (!resp.ok) {
          const message = await resp.json() as { message: string }
          toast.error(message.message || "Error has occurred");
          return
        }
        const name = await resp.json() as { name: string }
        payload.picture.String = `/${name.name}`
      }

      console.log(`File name is ${payload.picture.String}`)
      const resp = await trigger(payload)
      if (!resp.ok) {
        toast.error(await resp.text() || "Error has occurred");
        return
      }
      const data = await resp.json() as Material
      toast.success(`Material ${data.name.String} Added!`);
      mutate(route)

    } catch (err: any) {
      console.log(err);
      toast.error(err.message || "Error has occurred");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(SendAddMaterialRequest)}>
        {isMutating || isDownloading ? <Button variant={'ghost'}>Sending</Button> : <Button type="submit">Send Request</Button>}
        <FormInput name="name" placeholder="Name" description="" form={form} />
        <FormInput name="quantity" placeholder="Quantity" description="Quantity" form={form} />
        <ComboboxFormField form_attr={{ name: "status", description: "Initial status of item", form: form }} default_label={"In Stock"} options={status} />
        <FormInput name="type" placeholder="Type" description="" form={form} />
        <FormInput name="unit" placeholder="Unit" description="" form={form} />
        <FormFileInput name="picture" placeholder="Add picture" description="" form={form} />
        <div style={{ height: "200px", width: "100%" }}>
        <AddMaterialMap form={form} />
        </div>
      </form>
    </Form>
  );
}
