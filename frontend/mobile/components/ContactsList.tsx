import { Coworker } from "@/user-api-types";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native";
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Colors } from '@/constants/Colors';

export interface UserListInput {
  coworkers: Coworker[]

}

const Item = ({ coworkers }: { coworkers: Coworker }) => {

  const color_scheme = useColorScheme()
  const color_text = color_scheme === 'dark' ? Colors.dark_text : Colors.light_text
  const color = color_scheme === 'dark' ? Colors.dark_box : Colors.light_box
  const color_lighter = color_scheme === 'dark' ? Colors.dark_box_lighter : Colors.light_box_darker

  return (
  <View style={{ ...style.segment, ...color }}>
    <Text style={{ ...style.title, ...color_text, ...color_lighter }}>{coworkers.username}</Text>
    <Text style={{ ...style.text, ...color_text }}>{coworkers.firstname.Valid ? (coworkers.firstname.String + " " + (coworkers.lastname.Valid ? coworkers.lastname.String : "")) : "No name"}</Text>
    <Text style={{ ...style.text, ...color_text }}>{coworkers.email}</Text>
    <Text style={{ ...style.text, ...color_text }}>{coworkers.phone}</Text>
  </View>
  )
}

export default function CoworkerList({ coworkers }: UserListInput) {
  return (<FlatList
    data={coworkers}
    renderItem={(iteminfo) => <Item coworkers={iteminfo.item} />}
    keyExtractor={coworkers => String(coworkers.username)}
  />
  )
}



const style = StyleSheet.create({
  text: {
    fontSize: 30
  },
  title: {
    fontSize: 40,
    borderRadius: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  segment: {
    padding: 10,
    marginBottom: 10,
    gap: 10,
    justifyContent: 'space-between',
    borderRadius: 20,
  }

})
