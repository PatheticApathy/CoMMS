import { Headers } from "@/constants/header-options";
import { ChangeQuantity, CheckoutLog, Material } from "@/material-api-types";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import useSWRMutation from "swr/dist/mutation";
import { Notify } from "@/components/notify";
import { router } from "expo-router";
import { IdentityContext } from "@/components/securestore";
import FormPictueInput from "@/components/form/FormPictureInput";
import MainView from "@/components/MainView";
import useSWR, { Fetcher } from "swr";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import FormModalView from "@/components/FormModalView";

//TODO: handle case where checkout logs arent acquired
//TODO: Test api calls
//TODO: Make look less liek shit
const CheckOut = async (url: string, { arg }: { arg: { checkout_picture: string, user_id: number, item_id: number, amount: number } }) => await fetch(url, { headers: Headers, method: 'POST', body: JSON.stringify(arg) })
const CheckIn = async (url: string, { arg }: { arg: { checkin_picture: string, user_id: number, item_id: number } }) => await fetch(url, { headers: Headers, method: 'PUT', body: JSON.stringify(arg) })
const QuantityChange = async (url: string, { arg }: { arg: ChangeQuantity }) => await fetch(url, { headers: Headers, method: 'PUT', body: JSON.stringify(arg) })
const DeleteMaterial = async (url: string, { arg }: { arg: number }) => await fetch(url, { headers: Headers, method: 'DELETE', body: String(arg) })
const CheckoutLogFetcher: Fetcher<CheckoutLog[], string> = async (...args) => fetch(...args, { headers: Headers, cache: 'default' }).then(res => res.json())
const PostPicture = async (url: string, { arg }: { arg: { type: string, file: Blob } }) => await fetch(url, { headers: Headers, method: 'POST', body: arg.file });



export default function MaterialOptions() {
  const { id, quantity } = useLocalSearchParams()
  const token = useContext(IdentityContext)
  const material_id = Number(id)
  const material_quantity = Number(quantity)
  const identity = useContext(IdentityContext)
  const [check, setCheck] = useState(false)
  const [visible, setVisible] = useState(false)
  const [counter, setcount] = useState(0)
  const [add_counter, setaddcount] = useState(0)
  const [[picture, extension], setFile] = useState<[Blob | undefined, string]>([undefined, ""])

  const { data: checkout_logs, isLoading: checkout_loading, error: checkout_error } = useSWR(`${process.env.EXPO_PUBLIC_API_URL}/api/material/checkout/recent?id=${material_id}`, CheckoutLogFetcher)
  const { trigger: download } = useSWRMutation(`${process.env.EXPO_PUBLIC_API_URL}/api/picture`, PostPicture);
  const { trigger: checkout } = useSWRMutation('/api/material/checkout/out', CheckOut)
  const { trigger: checkin } = useSWRMutation('/api/material/checkout/in', CheckIn)
  const { trigger: send_amount } = useSWRMutation('/api/material/material/change', QuantityChange)

  const { trigger } = useSWRMutation('/api/material/material/delete', DeleteMaterial, {
    onError(err) {
      console.error(err)
      Notify.error(err.message || "Error has occured");

    },
    onSuccess(resp) {
      if (!resp.ok) {
        Notify.error("Error has occured while trying to delete this material");
        return
      }
      resp.json().then((resp: Material) => {
        console.log("Successfully deleted")
        Notify.success(`Material ${resp.name.String} Deleted!`);
        router.push('/(tabs)/material')
      })
    },

  })


  const handle_checkout = async () => {
    try {
      if (picture) {
        if (!extension) {
          Notify.error("Invald file extension");
          return
        }
        const picture_resp = await download({ type: extension, file: picture })
        if (!picture_resp.ok) {
          const message = await picture_resp.json() as { message: string }
          Notify.error(message.message || "Error has occured");
          return
        }
        const name = await picture_resp.json() as { name: string }
        const check_pick = `/${name.name}`

        //Make checkin/out request
        let check_resp = undefined
        if (check && (counter > 0)) {
          check_resp = await checkin({ checkin_picture: check_pick, user_id: identity!.id, item_id: material_id })
        } else if (counter > 0) {
          check_resp = await checkout({ checkout_picture: check_pick, user_id: identity!.id, item_id: material_id, amount: -counter })
        } else {
          Notify.error("Must pick a non-negative value")
          return
        }

        if (!check_resp.ok) {
          Notify.error(await check_resp.text() || "Error has occured");
          return
        }

        //Change corresponding amount on material
        const resp = await send_amount({ quantity: check ? material_quantity + counter : material_quantity - counter, id: material_id })
        if (!resp.ok) {
          Notify.error(await resp.text() || "Error has occured");
          return
        }

        const new_material: Material = await resp.json()
        Notify.success(`${new_material.name.Valid ? new_material.name.String : ""} checked ${check ? "in" : "out"}`)
        router.push(`/(tabs)/material/${material_id}`)
      } else {
        throw new Error("No picture provided for checkin/out")
      }
    } catch (err) {
      Notify.error(String(err) || "Error has occured");
    }

  }
  const CheckoutAction = () => {
    if (checkout_loading) {
      return (
        <View style={style.ActionTheme}>
          <ActivityIndicator />
        </View>
      )
    }
    if (checkout_error) {
      return (
        <View style={style.ActionTheme}>
          <Text>Cannot check in or out this material at this time</Text>
        </View>
      )
    }
    return (
      <>
        <Modal
          animationType='slide'
          transparent={true}
          visible={visible}
        >
          <View style={{ padding: '10%', marginTop: '85%', backgroundColor: 'green' }}>
            <Text>Please add a picture to finish your request</Text>
            <FormPictueInput OnPicture={setFile} />
            <Pressable style={{ backgroundColor: 'white' }} onPress={async () => await handle_checkout()}><Text>Submit Request</Text></Pressable>
            <Pressable onPress={() => setFile([undefined, ''])}><Text>Close</Text></Pressable>
            <Pressable onPress={() => setVisible(false)}><Text>Close</Text></Pressable>
          </View>
        </Modal>
        <View style={style.ActionTheme}>
          <Pressable style={{ flex: 1, backgroundColor: 'white' }} onPress={() => setVisible(true)}><Text>{check ? 'Checkin' : 'Checkout'}</Text></Pressable>
          <TextInput style={{ flex: 2, backgroundColor: 'blue' }} inputMode='decimal' value={String(counter)} onChangeText={(n) => setcount(n)} />
        </View>
      </>
    )
  }

  const handle_add_amount = async () => {
    try {
      //add corresponding amount on material
      const resp = await send_amount({ quantity: material_quantity + add_counter, id: material_id })
      if (!resp.ok) {
        Notify.error(await resp.text() || "Error has occured");
        return
      }

      const new_material: Material = await resp.json()
      Notify.success(`${new_material.name.Valid ? new_material.name.String : ""} stock changed to ${new_material.quantity}`)
      router.push(`/(tabs)/material/${material_id}`)

    } catch (err) {
      Notify.error(String(err) || "Error has occured");
    }

  }

  useEffect(() => {
    if (checkout_logs && token) {
      setCheck(Boolean(checkout_logs?.find((log) => !log.checkin_time.Valid && log.user_id == token.id)))
    }

  }, [checkout_logs, token])

  //NOTE: Ignore the type errors for the text input. Can't convert string to float wihthout breaking some rules 
  return (
    <MainView>
      <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
        <View style={style.ActionTheme}>
          <Pressable style={{ flex: 1, backgroundColor: 'white' }} onPress={async () => await handle_add_amount()}><Text>Add Stock:</Text></Pressable>
          <TextInput style={{ flex: 2, backgroundColor: 'blue' }} inputMode='decimal' value={String(add_counter)} onChangeText={(n) => setaddcount(n)} />
        </View>
        <CheckoutAction />
      </View>
    </MainView>
  )
}

const style = StyleSheet.create({
  ActionTheme: {
    width: '75%',
    flexDirection: 'row',
    padding: 10
  }
})
