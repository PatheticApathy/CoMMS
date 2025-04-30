import { Material } from "@/material-api-types";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native";
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Colors } from '@/constants/Colors';

export interface MaterialListInput {
  materials: Material[]

}

const Item = ({ material }: { material: Material }) => {
  
  const color_scheme = useColorScheme()
  const color_text = color_scheme === 'dark' ? Colors.dark_text : Colors.light_text
  const color = color_scheme === 'dark' ? Colors.dark_box : Colors.light_box
  const color_lighter = color_scheme === 'dark' ? Colors.dark_box_lighter : Colors.light_box_darker

  return (
  <View style={{ ...style.segment, ...color }}>
    <Link style={{ ...style.title, ...color_text, ...color_lighter }} href={{ pathname: '/(tabs)/material/[id]', params: { id: material.id } }}>{material.name.Valid ? material.name.String : "No name"}</Link>
    <Text style={{ ...style.text, ...color_text }}>Type: {material.type.Valid ? material.type.String : "No name"}</Text>
    <Text style={{ ...style.text, ...color_text }}>{material.status} with {material.quantity} {material.unit}</Text>
    <Text style={{ ...style.text, ...color_text }}>{material.last_checked_out.Valid ? `Last checked out on: ${new Date(material.last_checked_out.Time).toISOString()}` : "Never checked out"}</Text>
  </View>
)
}

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
    fontSize: 30
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 15,
  },
  segment: {
    padding: 10,
    marginBottom: 10,
    gap: 10,
    justifyContent: 'space-between',
    borderRadius: 20,
  }

})
