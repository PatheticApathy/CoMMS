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
import { Material, AddMaterial, AddMaterialLog } from "@/material-api-types"
import FormInput from "../form-maker/form-input"
import { toast } from "sonner"
import { Fetcher } from "swr"


//Schema for form
const AddMaterialLogSchema = z.object({
  material_id: z.coerce.number().nonnegative({ message: "Material id must be non-negative" }),
  note: z.string().min(1, { message: "Note must be longer than one character" }),
  quantity_change: z.coerce.number().nonnegative({ message: "Quantity can't be negative" }),
  status: z.enum(["In Stock", "Out of Stock", "Low Stock"]),
})


//fetcher
const PostAddMaterialLog = async (url: string, { arg }: { arg: AddMaterialLog }) => await fetch(url, { method: 'POST', body: JSON.stringify(arg) }).then((resp) => resp.ok ? resp.json() : resp.text())
const GetMaterials: Fetcher<Material[], string> = async (...args) => fetch(...args, { method: 'GET', cache: 'force-cache' },).then(res => res.json())

export default function AddCheckoutLog() {

  //form controller
  const form = useForm<z.infer<typeof AddMaterialLogSchema>>({
    resolver: zodResolver(AddMaterialLogSchema),
    defaultValues: {
      material_id: 0,
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

  const SendAddMaterialLogRequest = (values: z.infer<typeof AddMaterialLogSchema>) => {
    const payload: AddMaterialLog = {
      material_id: values.material_id,
      note: { String: values.note, Valid: true },
      quantity_change: values.quantity_change,
      status: values.status,
    }
    console.log(payload)
    trigger(payload)
  }

  const { trigger, isMutating } = useSWRMutation('/api/mlogs/add', PostAddMaterialLog, {
    onError(err) {
      console.log(err)
      toast.error(err.message || "Error has occured");
    },
    onSuccess(data) {
      if (!data.ok) {
        return
      }
      data.json().then((resp: Material) => {
        console.log("success")
        toast.success(`Material ${resp.name.String} Added!`);
      })
    },
  })
}
