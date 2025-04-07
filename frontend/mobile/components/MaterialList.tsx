import { Material } from "@/material-api-types";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { FlatList } from "react-native";

export interface MaterialListInput {
  materials: Material[]

}

const Item = ({ material }: { material: Material }) => (
  <View>
    <Link href={{ pathname: '/materials/[material]', params: { material: material.id } }}>{material.name.Valid ? material.name.String : "No name"}</Link>
    <Text>{material.type.Valid ? material.type.String : "No name"}</Text>
    <Text>{material.status}{material.quantity}{material.unit}</Text>
    <Text>{material.last_checked_out.Valid ? new Date(material.last_checked_out.Time).toISOString() : "Never checked out"}</Text>
  </View>
)

export default function MaterialList({ materials }: MaterialListInput) {
  return (<FlatList
    data={materials}
    renderItem={(iteminfo) => <Item material={iteminfo.item} />}
    keyExtractor={material => String(material.id)}
  />
  )
}
