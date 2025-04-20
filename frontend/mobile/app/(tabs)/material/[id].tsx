import { ScreenHeight } from "@/components/global-style";
import MainView from "@/components/MainView";
import { Headers } from "@/constants/header-options";
import { Material } from "@/material-api-types";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text } from "react-native";
import useSWR, { Fetcher } from "swr";

const fetcher: Fetcher<Material, string> = async (...args) => fetch(...args, {
  headers: Headers
}).then(res => res.json())

export default function MaterialPage() {
  const { material_id } = useLocalSearchParams()
  const { data: material, error, isLoading } = useSWR(`${process.env.EXPO_PUBLIC_API_URL}/api/material/material/search?id=${material_id}`, fetcher)

  if (error) { return <MainView>Error</MainView> }
  if (isLoading) { return <MainView ><ActivityIndicator style={{ justifyContent: 'center', height: ScreenHeight }} /></MainView> }
  return (
    <MainView>
      <Text>{material?.name.String}</Text>
    </MainView>
  )
} 
