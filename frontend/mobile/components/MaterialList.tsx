import { Material } from "@/material-api-types";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native";

export interface MaterialListInput {
  materials: Material[]

}

const Item = ({ material }: { material: Material }) => (
  <View style={style.segment}>

    <Link style={style.title} href={{ pathname: '/material/[id]', params: { material: material.id } }}>{material.name.Valid ? material.name.String : "No name"}</Link>
    <Text style={style.text}> Type: {material.type.Valid ? material.type.String : "No name"}</Text>
    <Text style={style.text}>{material.status} with {material.quantity} {material.unit}</Text>
    <Text style={style.text}>{material.last_checked_out.Valid ? `Last checked out on: ${new Date(material.last_checked_out.Time).toISOString()}` : "Never checked out"}</Text>
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



const style = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 30
  },
  title: {
    color: 'white',
    fontSize: 40,
    backgroundColor: 'gray'
  },
  segment: {
    padding: 10,
    marginBottom: 10,
    gap: 10,
    backgroundColor: '#696969',
    justifyContent: 'space-between',
    borderRadius: 6,
  }

})
