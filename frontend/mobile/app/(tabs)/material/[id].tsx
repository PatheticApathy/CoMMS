import FileSVG from "@/components/file";
import { ScreenHeight } from "@/components/global-style";
import MainView from "@/components/MainView";
import { getHeaders } from "@/constants/header-options";
import { Material } from "@/material-api-types";
//import { Image } from 'expo-image';
import { useLocalSearchParams } from "expo-router";
import { Image, ActivityIndicator, StyleSheet, Text, ScrollView } from "react-native";
import useSWR, { Fetcher } from "swr";

const fetcher: Fetcher<Material[], string> = async (...args) => fetch(...args, {
  headers: await getHeaders()
}).then(res => res.json())

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
    />
  )
}

export default function MaterialPage() {
  const { id } = useLocalSearchParams()
  const { data: material, error, isLoading } = useSWR(`${process.env.EXPO_PUBLIC_API_URL}/api/material/material/search?id=${id}`, fetcher)

  if (error) { return <MainView>Error</MainView> }
  if (isLoading) { return <MainView ><ActivityIndicator style={{ justifyContent: 'center', height: ScreenHeight }} /></MainView> }
  if (!material) { return <MainView ><Text>No material to display</Text></MainView> }

  const ImageUrl = `${process.env.EXPO_PUBLIC_API_URL}/${material[0].picture.Valid ? material[0].picture.String : 'file.svg'}`

  if (ImageUrl.split('.').pop() == 'svg') { }

  return (
    <MainView>
      <ScrollView>
        <Text style={style.ItemTitle}>{material[0].name.Valid ? material[0].name.String : 'Material'}</Text>
        <RenderImage image_url={ImageUrl} />
      </ScrollView>
    </MainView>
  )
}


const style = StyleSheet.create({
  ItemTitle: {
    marginTop: '20%',
    fontSize: 30,
    color: 'green',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: '10%'
  },
})
