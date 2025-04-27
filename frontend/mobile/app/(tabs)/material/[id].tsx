import CheckoutLogList from "@/components/CheckoutLogList";
import FileSVG from "@/components/file";
import { ScreenHeight } from "@/components/global-style";
import MainView from "@/components/MainView";
import MaterialButton from "@/components/MaterialAccessButton";
import MaterialLogList from "@/components/MaterialLogList";
import { Headers } from "@/constants/header-options";
import { ChangeQuantity, CheckoutLog, Material, MaterialLog } from "@/material-api-types";
import { GetUserRow } from "@/user-api-types";
import { useLocalSearchParams } from "expo-router";
import { Image, ActivityIndicator, StyleSheet, Text, ScrollView, View, FlatList } from "react-native";
import useSWR, { Fetcher } from "swr";
import useSWRMutation from "swr/dist/mutation";

const fetcher: Fetcher<Material[], string> = async (...args) => fetch(...args, {
  headers: Headers
}).then(res => res.json())
const MaterialLogFetcher: Fetcher<MaterialLog[], string> = async (...args) => fetch(...args, { headers: Headers, cache: 'default' }).then(res => res.json())
const CheckoutLogFetcher: Fetcher<CheckoutLog[], string> = async (...args) => fetch(...args, { headers: Headers, cache: 'default' }).then(res => res.json())
const UsersFetcher: Fetcher<GetUserRow[], string> = async (...args) => fetch(...args, { headers: Headers, cache: 'default' }).then(res => res.json())
const CheckOut = async (url: string, { arg }: { arg: { checkout_picture: string, user_id: number, item_id: number, amount: number } }) => await fetch(url, { headers: Headers, method: 'POST', body: JSON.stringify(arg) })
const CheckIn = async (url: string, { arg }: { arg: { checkin_picture: string, user_id: number, item_id: number } }) => await fetch(url, { headers: Headers, method: 'PUT', body: JSON.stringify(arg) })
const QuantityChange = async (url: string, { arg }: { arg: ChangeQuantity }) => await fetch(url, { headers: Headers, method: 'PUT', body: JSON.stringify(arg) })
const DeleteMaterial = async (url: string, { arg }: { arg: number }) => await fetch(url, { headers: Headers, method: 'DELETE', body: String(arg) })
const PostPicture = async (url: string, { arg }: { arg: { type: string, file: Blob } }) => await fetch(url, { headers: Headers, method: 'POST', body: arg.file });

const RenderImage = ({ image_url }: { image_url: string }) => {
  if (image_url.split('.').pop() == 'svg') { return <FileSVG /> }
  return (
    <Image
      alt="Could not find picture of material"
      source={{
        uri: image_url,
        headers: Headers,
      }}
      width={320}
      height={280}
      borderRadius={10}
    />
  )
}

const DisplayMaterialLogs = ({ material_logs, error, isLoading }: { material_logs: MaterialLog[] | undefined, error: boolean, isLoading: boolean }) => {
  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    console.log(error)
    return <Text style={{ color: 'red' }}>An error occured while trying to get material material logs</Text>;
  }
  if (material_logs) {
    return (
      <>
        <MaterialLogList material_logs={material_logs} />
      </>
    )
  } else {
    return (<div className="text-center">No Material Logs</div>)
  }
}

const DisplayCheckouts = ({ checkout_logs, error, isLoading, users }: { checkout_logs: CheckoutLog[] | undefined, error: boolean, isLoading: boolean, users: GetUserRow[] | undefined }) => {
  if (isLoading) {
    return <ActivityIndicator />
  }
  if (error) {
    return <View style={{ alignContent: 'center', justifyContent: 'center' }}><Text style={{ textOverflow: 'wrap', color: 'red' }}>An error occured while fetching checkout logs</Text></View>;
  }
  if (checkout_logs) {
    const checkouts_w_users = checkout_logs.map(
      log => {
        return {
          user: users?.find((user) => user.id === log.user_id)?.username,
          ...log
        }
      }
    )
    return (
      <View>
        <CheckoutLogList checkout_logs={checkouts_w_users} />
      </View>
    )
  } else {
    return <Text style={{ textAlign: 'center' }}>Never Checked out</Text>;
  }
}

export default function MaterialPage() {
  const { id } = useLocalSearchParams()
  const { data: material, error, isLoading } = useSWR(`${process.env.EXPO_PUBLIC_API_URL}/api/material/material/search?id=${id}`, fetcher)
  const { data: checkout_logs, isLoading: checkout_loading, error: checkout_error } = useSWR(material && material[0] ? `${process.env.EXPO_PUBLIC_API_URL}/api/material/checkout/recent?id=${material[0].id}` : null, CheckoutLogFetcher)
  const { data: material_logs, isLoading: material_loading, error: material_error } = useSWR(material && material[0] ? `${process.env.EXPO_PUBLIC_API_URL}/api/material/mlogs/recent?id=${material[0].id}` : null, MaterialLogFetcher)
  const { data: usernames } = useSWR(checkout_logs ? `${process.env.EXPO_PUBLIC_API_URL}/api/user/search?${checkout_logs.map(log => `id=${log.user_id}`).join('&')}` : undefined, UsersFetcher)
  const { trigger: download } = useSWRMutation(`${process.env.EXPO_PUBLIC_API_URL}/api/picture`, PostPicture);

  if (error) { return <MainView>Error</MainView> }
  if (isLoading) { return <MainView ><ActivityIndicator style={{ justifyContent: 'center', height: ScreenHeight }} /></MainView> }
  if (!material) { return <MainView ><Text>No material to display</Text></MainView> }
  const ImageUrl = `${process.env.EXPO_PUBLIC_API_URL}/${material[0].picture.Valid ? material[0].picture.String : 'file.svg'}`


  return (
    <MainView>
      <ScrollView style={{ flex: 2 }} nestedScrollEnabled={true}>
        <MaterialButton />
        <Text style={style.ItemTitle}>{material[0].name.Valid ? material[0].name.String : 'Material'}</Text>
        <RenderImage image_url={ImageUrl} />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <DisplayMaterialLogs material_logs={material_logs} error={material_error} isLoading={material_loading} />
          <DisplayCheckouts checkout_logs={checkout_logs} users={usernames} error={checkout_error} isLoading={checkout_loading} />
        </View>
      </ScrollView>
    </MainView>
  )
}


const style = StyleSheet.create({
  ItemTitle: {
    marginTop: '20%',
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: '10%'
  },
})
