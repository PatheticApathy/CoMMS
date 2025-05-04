import { Headers } from "@/constants/header-options";
import { ChangeQuantity, CheckoutLog, Material } from "@/material-api-types";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TextInput, useColorScheme, View } from "react-native";
import useSWRMutation from "swr/dist/mutation";
import { Notify } from "@/components/notify";
import { Link, router } from "expo-router";
import { IdentityContext } from "@/components/securestore";
import FormPictueInput from "@/components/form/FormPictureInput";
import MainView from "@/components/MainView";
import useSWR, { Fetcher } from "swr";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Colors } from "@/constants/Colors";

//TODO: Test api calls
//TODO: Test delete calls
const CheckOut = async (url: string, { arg }: { arg: { checkout_picture: string, user_id: number, item_id: number, amount: number } }) => await fetch(url, { headers: Headers, method: 'POST', body: JSON.stringify(arg) })
const CheckIn = async (url: string, { arg }: { arg: { checkin_picture: string, user_id: number, item_id: number } }) => await fetch(url, { headers: Headers, method: 'PUT', body: JSON.stringify(arg) })
const QuantityChange = async (url: string, { arg }: { arg: ChangeQuantity }) => await fetch(url, { headers: Headers, method: 'PUT', body: JSON.stringify(arg) })
const DeleteMaterial = async (url: string, { arg }: { arg: number }) => await fetch(url, { headers: Headers, method: 'DELETE', body: String(arg) })
const CheckoutLogFetcher: Fetcher<CheckoutLog[], string> = async (...args) => fetch(...args, { headers: Headers, cache: 'default' }).then(res => res.json())
const PostPicture = async (url: string, { arg }: { arg: { type: string, file: Blob } }) => await fetch(url, { headers: Headers, method: 'POST', body: arg.file });

interface CheckoutActionTypes {
  visible: boolean
  checkout_loading: boolean
  checkout_error: any
  handle_checkout: () => Promise<void>
  setFile: (file: [Blob | undefined, string]) => void
  picture: [Blob | undefined, string]
  counter: string
  setCount: (count: string) => void
  check: boolean
  setVisible: (visible: boolean) => void
}

const CheckoutAction = ({ check, setCount, setVisible, setFile, handle_checkout, counter, picture, visible, checkout_loading, checkout_error }: CheckoutActionTypes) => {
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
  const color_scheme = useColorScheme()
  const color = color_scheme === 'dark' ? Colors.dark_box : Colors.light_box

  return (
    <>
      <Modal
        animationType='slide'
        transparent={true}
        visible={visible}
      >
        <View style={{ padding: '10%', marginTop: '50%', ...color }}>
          <Text>Quantity Change</Text>
          <TextInput style={{
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 5,
            width: `80%`
          }} inputMode='decimal' value={counter} onChangeText={setCount} />
          <FormPictueInput OnPicture={setFile} />
          <Pressable onPress={() => {
            setFile([undefined, ''])
            handle_checkout()
          }}><Text>Confirm</Text>
          </Pressable>
          <Pressable onPress={() => setVisible(false)}><Text>Close</Text></Pressable>
        </View>
      </Modal>
      <View style={style.ActionTheme}>
        <Pressable style={{ padding: 20, borderRadius: 10, flex: 1, backgroundColor: 'white' }} onPress={() => setVisible(true)}><Text>{check ? 'Checkin' : 'Checkout'}</Text></Pressable>
      </View>
    </>
  )
}



export default function MaterialOptions() {
  const identity = useContext(IdentityContext)
  const [check, setCheck] = useState(false)
  const [visible, setVisible] = useState(false)
  const [counter, setcount] = useState('0')
  const [add_counter, setaddcount] = useState('0')
  const [[picture, extension], setFile] = useState<[Blob | undefined, string]>([undefined, ""])
  const [waiting, setWaiting] = useState(false)
  const { id, quantity } = useLocalSearchParams()
  const token = useContext(IdentityContext)
  const material_id = Number(id)
  const material_quantity = Number(quantity)

  const { data: checkout_logs, isLoading: checkout_loading, error: checkout_error } = useSWR(`${process.env.EXPO_PUBLIC_API_URL}/api/material/checkout/recent?id=${material_id}`, CheckoutLogFetcher)
  const { trigger: download } = useSWRMutation(`${process.env.EXPO_PUBLIC_API_URL}/api/picture`, PostPicture);
  const { trigger: checkout } = useSWRMutation(`${process.env.EXPO_PUBLIC_API_URL}/api/material/checkout/out`, CheckOut)
  const { trigger: checkin } = useSWRMutation(`${process.env.EXPO_PUBLIC_API_URL}/api/material/checkout/in`, CheckIn)
  const { trigger: send_amount } = useSWRMutation(`${process.env.EXPO_PUBLIC_API_URL}/api/material/material/change`, QuantityChange)


  const { trigger } = useSWRMutation(`${process.env.EXPO_PUBLIC_API_URL}/api/material/material/delete`, DeleteMaterial, {
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
        router.navigate('/(tabs)/material')
      })
    },

  })


  const color_scheme = useColorScheme()
  const color_text = color_scheme === 'dark' ? Colors.dark_text : Colors.light_text
  const color = color_scheme === 'dark' ? Colors.dark_box : Colors.light_box
  const handle_checkout = async () => {

    setWaiting(true)
    try {
      if (picture) {
        if (!extension) {
          Notify.error("Invald file extension");
          return
        }
        const picture_resp = await download({ type: extension, file: picture })
        if (!picture_resp.ok) {
          const message = await picture_resp.json() as { message: string }
          setWaiting(false)
          Notify.error(message.message || "Error has occured");
          return
        }
        const name = await picture_resp.json() as { name: string }
        const check_pick = `/${name.name}`

        //Make checkin/out request
        const count = Number(counter)
        let check_resp = undefined
        if (check && (count > 0)) {
          check_resp = await checkin({ checkin_picture: check_pick, user_id: identity!.id, item_id: material_id })
        } else if (count > 0) {
          check_resp = await checkout({ checkout_picture: check_pick, user_id: identity!.id, item_id: material_id, amount: -counter })
        } else {
          Notify.error("Must pick a non-negative value")
          setWaiting(false)
          return
        }

        if (!check_resp.ok) {
          Notify.error(await check_resp.text() || "Error has occured");
          setWaiting(false)
          return
        }

        //Change corresponding amount on material
        const resp = await send_amount({ quantity: check ? material_quantity + count : material_quantity - count, id: material_id })
        if (!resp.ok) {
          Notify.error(await resp.text() || "Error has occured");
          setWaiting(false)
          return
        }

        const new_material: Material = await resp.json()
        Notify.success(`${new_material.name.Valid ? new_material.name.String : ""} checked ${check ? "in" : "out"}`)
        router.back()
      } else {
        throw new Error("No picture provided for checkin/out")
      }
      setWaiting(false)
    } catch (err) {
      Notify.error(String(err) || "Error has occured");
      setWaiting(false)
    }

  }

  const handle_add_amount = async () => {
    const add_count = Number(add_counter)
    try {
      //add corresponding amount on material
      const resp = await send_amount({ quantity: material_quantity + add_count, id: material_id })
      if (!resp.ok) {
        Notify.error(await resp.text() || "Error has occured");
        return
      }

      const new_material: Material = await resp.json()
      Notify.success(`${new_material.name.Valid ? new_material.name.String : ""} stock changed to ${new_material.quantity}`)
      router.back()

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
        {waiting ?
          <ActivityIndicator /> :
          <>
            <View style={style.ActionTheme}>
              <Pressable style={{ padding: 20, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, flex: 1, backgroundColor: 'white' }} onPress={handle_add_amount}><Text>Add Stock:</Text></Pressable>
              <TextInput style={{ padding: 20, borderBottomRightRadius: 10, borderTopRightRadius: 10, flex: 1, backgroundColor: '#FFE74C' }} inputMode='decimal' value={add_counter} onChangeText={setaddcount} />
            </View>
            <CheckoutAction
              check={check}
              counter={counter}
              setCount={setcount}
              setVisible={setVisible}
              picture={[picture, extension]}
              visible={visible}
              setFile={setFile}
              checkout_loading={checkout_loading}
              checkout_error={checkout_error}
              handle_checkout={handle_checkout}
            />
            <View style={style.ActionTheme}>
              <Pressable style={{ padding: 20, borderRadius: 10, flex: 1, backgroundColor: 'red' }} onPress={async () => await trigger(id)}><Text>Delete Material</Text></Pressable>
            </View>
            <Link href={{ pathname: "/(tabs)/material/[id]/add_log", params: { id: material_id } }}><Text>Add New Log</Text></Link>
          </>
        }
      </View>
    </MainView >
  )
}

const style = StyleSheet.create({
  ActionTheme: {
    width: '75%',
    flexDirection: 'row',
    padding: 10,
    margin: 30
  }
})
