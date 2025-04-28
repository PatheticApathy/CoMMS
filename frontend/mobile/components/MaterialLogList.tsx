import { MaterialLog } from "@/material-api-types";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native";


export interface LogListElement extends MaterialLog {
}

export interface MaterialLogListInput {
  material_logs: LogListElement[]

}

const Item = ({ log }: { log: LogListElement }) => (
  <View style={style.segment}>
    <Text>
      {(() => {
        const timestamp = new Date(log.timestamp)
        return (
          `Date: ${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`
        )
      })()
      }
    </Text>
    <Text>{`${log.status} with ${Math.abs(log.quantity_change)} ${log.quantity_change > 0 ? "Added" : "Removed"}`}</Text>
    <Text>{log.note.Valid ? log.note.String : "Not Additional Notes"}</Text>
  </View>
)

export default function MaterialLogList({ material_logs }: MaterialLogListInput) {
  return <FlatList
    ListHeaderComponent={() => (<Text style={{ textAlign: 'center', color: 'white', fontSize: 22, fontWeight: 'bold' }}>Material Logs</Text>)}
    data={material_logs}
    renderItem={(iteminfo) => <Item log={iteminfo.item} />}
    keyExtractor={material_log => String(material_log.id)}
  />
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
    flexDirection: 'column',
    marginBottom: 10,
    gap: 10,
    backgroundColor: '#696969',
    justifyContent: 'space-between',
    borderRadius: 6,
  }

})
