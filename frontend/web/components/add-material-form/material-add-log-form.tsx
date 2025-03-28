"use client"
import { Button } from "@/components//ui/button"
import {
  Form,
} from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import useSWRMutation from "swr/mutation"
import { ComboboxFormField } from "@/components/form-maker/form-combobox"
import { Material, AddMaterialLog, MaterialLog } from "@/material-api-types"
import FormInput from "../form-maker/form-input"
import { toast } from "sonner"
import useSWR, { Fetcher, mutate } from "swr"
import Loading from "../loading"
import FormTextInput from "../form-maker/form-textbox"


//Schema for form
const AddMaterialLogSchema = z.object({
  material_id: z.coerce.number().nonnegative({ message: "Material id must be non-negative" }),
  note: z.string().min(1, { message: "Note must be longer than one character" }),
  quantity_change: z.coerce.number().nonnegative({ message: "Quantity can't be negative" }),
  status: z.enum(["In Stock", "Out of Stock", "Low Stock"]),
})


//fetcher
const PostAddMaterialLog = async (url: string, { arg }: { arg: AddMaterialLog }) => await fetch(url, { method: 'POST', body: JSON.stringify(arg) })

export default function AddMaterialLogForm({ materials }: { materials: Material[] }) {

  //form controller
  const form = useForm<z.infer<typeof AddMaterialLogSchema>>({
    resolver: zodResolver(AddMaterialLogSchema),
    defaultValues: {
      material_id: -1,
      note: "",
      quantity_change: 0,
      status: "In Stock",
    }
  })

  const status = [
    { label: "In Stock", value: "In Stock" },
    { label: "Low Stock", value: "Low Stock" },
    { label: "Out of Stock", value: "Out of Stock" },
  ]


  const { trigger, isMutating } = useSWRMutation('/api/material/mlogs/add', PostAddMaterialLog, {
    onError(err) {
      console.log(err)
      toast.error(err.message || "Error has occured");
    },
    onSuccess(data) {
      if (!data.ok) {
        toast.error(data.text() || "Error has occured");
        return
      }
      data.json().then((log: MaterialLog) => {
        console.log("success")
        toast.success(`Material Log for material id: ${log.material_id} Added!`);
        mutate(`/api/material/mlogs/recent?id=${log.material_id}`)
      })
    },
  })


  const SendAddMaterialLogRequest = (values: z.infer<typeof AddMaterialLogSchema>) => {
    const payload: AddMaterialLog = {
      material_id: values.material_id,
      note: { String: values.note, Valid: true },
      quantity_change: values.quantity_change,
      status: values.status,
    }
    trigger(payload)
  }

  //material logs combobox
  const MatetrialLogComboBox = () => {
    const options = materials.map(material => ({
      label: material.name.Valid ? material.name.String : String(material.id),
      value: material.id,
    }));

    return <ComboboxFormField form_attr={{ name: "material_id", description: "Material to add log to", form: form }} default_label="Choose material to add log to" options={options} />
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(SendAddMaterialLogRequest)}>
        <MatetrialLogComboBox />
        <br />
        <FormTextInput name="note" placeholder="Note" description="Note to add" form={form} />
        <FormInput name="quantity_change" placeholder="Quantity change" description="Quantity changed if any" form={form} />
        <ComboboxFormField form_attr={{ name: "status", description: "Initial status of item", form: form }} default_label={"In Stock"} options={status} />
        {isMutating ? <Button variant={'ghost'}>Sending</Button> : <Button type="submit">Send Request</Button>}
      </form>
    </Form>
  );
}
