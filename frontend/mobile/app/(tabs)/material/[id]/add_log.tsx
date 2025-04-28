import ComboboxFormField from "@/components/form/comboboxFormField"
import FormInput from "@/components/form/form-input"
import MainView from "@/components/MainView"
import { Notify } from "@/components/notify"
import { getHeaders } from "@/constants/header-options"
import { AddMaterialLog, MaterialLog } from "@/material-api-types"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { Pressable, Text, View } from "react-native"
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
  const router = useRouter()
  const { id } = useLocalSearchParams() as { id: string }

  const [note, changeNote] = useState('')
  const [status, changeStatus] = useState('In Stock')
  const [quantity_change, changeQuantity] = useState('')


  const [pressed, setPressed] = useState(false)

  const status_opts = [
    { label: "In Stock", value: "In Stock" },
    { label: "Low Stock", value: "Low Stock" },
    { label: "Out of Stock", value: "Out of Stock" },
  ]

  const { trigger: add_log } = useSWRMutation(`${process.env.EXPO_PUBLIC_API_URL}/api/material/mlogs/add`, PostAddMaterialLog)

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
        router.back()
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
      <View style={{ width: '100%', height: '100%', alignContent: 'center', justifyContent: 'center' }}>
        <View style={{ paddingLeft: 35 }}>
          <FormInput keyboardtype={undefined} value={note} placeholder="Note" OnChangeText={changeNote} />
          <FormInput keyboardtype={undefined} value={quantity_change} placeholder="Quantity Change" OnChangeText={changeQuantity} />
        </View>
        <ComboboxFormField default_label={status} OnClickSet={changeStatus} options={status_opts} />
        {pressed ? <Pressable><Text>Sending</Text></Pressable> :
          <Pressable
            onPress={
              () => {
                setPressed(true)
                SendAddMaterialLogRequest()
                setPressed(false)
              }
            }>
            <Text style={{ textAlign: 'center' }}>Send Request</Text>
          </Pressable>
        }
      </View>
    </MainView >
  )
}
