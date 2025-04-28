import ComboboxFormField from "@/components/form/comboboxFormField"
import FormInput from "@/components/form/form-input"
import MainView from "@/components/MainView"
import { Notify } from "@/components/notify"
import { getHeaders } from "@/constants/header-options"
import { AddMaterialLog, MaterialLog } from "@/material-api-types"
import { useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { Pressable, Text } from "react-native"
import useSWRMutation from "swr/dist/mutation"
import { z } from "zod"

//Schema for form
const AddMaterialLogSchema = z.object({
  material_id: z.coerce.number().nonnegative({ message: "Material id must be non-negative" }),
  note: z.string().min(1, { message: "Note must be longer than one character" }),
  quantity_change: z.coerce.number().nonnegative({ message: "Quantity can't be negative" }),
  status: z.enum(["In Stock", "Out of Stock", "Low Stock"]),
})


//fetcher
const PostAddMaterialLog = async (url: string, { arg }: { arg: AddMaterialLog }) => await fetch(url, {
  headers: await getHeaders(),
  method: 'POST', body: JSON.stringify(arg)
})

export default function AddMaterialLogForm() {

  //form controller
  const { id } = useLocalSearchParams()

  const [note, changeNote] = useState('')
  const [status, changeStatus] = useState('')
  const [quantity_change, changeQuantity] = useState('')


  const [pressed, setPressed] = useState(false)

  const status_opts = [
    { label: "In Stock", value: "In Stock" },
    { label: "Low Stock", value: "Low Stock" },
    { label: "Out of Stock", value: "Out of Stock" },
  ]

  const { trigger: add_log } = useSWRMutation('/api/material/mlogs/add', PostAddMaterialLog)

  const SendAddMaterialLogRequest = async () => {
    try {
      const validation = AddMaterialLogSchema.safeParse({
        material_id: id,
        note,
        quantity_change,
        status,
      })

      if (validation.success) {
        const value = validation.data
        const resp = await add_log({ ...value, note: { String: validation.data.note, Valid: validation.data.note !== '' ? true : false } })
        const log = await resp.json() as MaterialLog
        Notify.success(`Material Log for material id: ${log.material_id} Added!`);
      } else {
        console.log(JSON.stringify(validation.error.format(), null, 2))
        Notify.error(validation.error.issues.map((issue) => {
          return issue.message
        }).join('\n'))
      }

    } catch (err) {
      Notify.error(String(err) || "Error has occured");
    }
  }

  return (
    <MainView>
      <FormInput keyboardtype={undefined} value={note} placeholder="Note" OnChangeText={changeNote} />
      <FormInput keyboardtype={undefined} value={quantity_change} placeholder="Quantity Change" OnChangeText={changeQuantity} />
      <ComboboxFormField default_label={status} OnClickSet={changeStatus} options={status_opts} />
      {pressed ? <Pressable><Text>Sending</Text></Pressable> : <Pressable onPress={SendAddMaterialLogRequest}><Text>Send Request</Text></Pressable>}
    </MainView >
  )
}
