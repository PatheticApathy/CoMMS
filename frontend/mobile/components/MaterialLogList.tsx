import { Colors } from "@/constants/Colors";
import { MaterialLog } from "@/material-api-types";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { FlatList } from "react-native";


export interface LogListElement extends MaterialLog {
}

export interface MaterialLogListInput {
  material_logs: LogListElement[]

}

const Item = ({ log }: { log: LogListElement }) => { 
  const color_scheme = useColorScheme()
  const color_text = color_scheme === 'dark' ? Colors.dark_text : Colors.light_text
  const color_box = color_scheme === 'dark' ? Colors.dark_box : Colors.light_box
  return (
  <View style={{...color_box, ...style.segment}}>
    <Text style={{ ...color_text }}>
      {(() => {
        const timestamp = new Date(log.timestamp)
        return (
          `Date: ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`
        )
      })()
      }
    </Text>
    <Text style={{ ...color_text }}>{`${log.status} with ${Math.abs(log.quantity_change)} ${log.quantity_change > 0 ? "Added" : "Removed"}`}</Text>
    <Text style={{ ...color_text }}>{log.note.Valid ? log.note.String : "Not Additional Notes"}</Text>
  </View>
)
}

export default function MaterialLogList({ material_logs }: MaterialLogListInput) {
  const color_scheme = useColorScheme()
  const color_text = color_scheme === 'dark' ? Colors.dark_text : Colors.light_text
  return <FlatList
    ListHeaderComponent={() => (<Text style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold', ...color_text }}>Material Logs</Text>)}
    data={material_logs}
    renderItem={(iteminfo) => <Item log={iteminfo.item} />}
    keyExtractor={material_log => String(material_log.id)}
  />
}



const style = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 35
  },
  title: {
    color: 'white',
    fontSize: 40,
    backgroundColor: 'gray',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  segment: {
    flexDirection: 'column',
    marginBottom: 10,
    margin: 25,
    padding: 25,
    gap: 10,
    justifyContent: 'space-between',
    borderRadius: 20,
  }

})
