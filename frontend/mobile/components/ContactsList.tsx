import { Coworker } from "@/user-api-types";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native";

export interface UserListInput {
  coworkers: Coworker[]

}

const Item = ({ coworkers }: { coworkers: Coworker }) => (
  <View style={style.segment}>

    <Text style={style.title}>{coworkers.username}</Text>
    <Text style={style.text}>{coworkers.firstname.Valid ? (coworkers.firstname.String + " " + (coworkers.lastname.Valid ? coworkers.lastname.String : "")) : "No name"}</Text>
    <Text style={style.text}>{coworkers.email}</Text>
    <Text style={style.text}>{coworkers.phone}</Text>
  </View>
)

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
