import { CheckoutLog } from "@/material-api-types";
import { StyleSheet, Text, View } from "react-native";
import { FlatList, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors"


export interface LogListElement extends CheckoutLog {
  user: string | undefined
}

export interface CheckoutLogListInput {
  checkout_logs: LogListElement[]

}

const Item = ({ log }: { log: LogListElement }) => {
  const color_scheme = useColorScheme()
  const color_text = color_scheme === 'dark' ? Colors.dark_text : Colors.light_text
  const color_box = color_scheme === 'dark' ? Colors.dark_box : Colors.light_box
  return (
  <>
    <View style={{...color_box, ...style.segment}}>
    
      <Text style={{ ...color_text }}>Chekout pertains to user: {log.user || log.user_id}</Text>
      <Text style={{ ...color_text }}>
        {(() => {
          const checkout = new Date(log.checkout_time);
          return (
            `Checked out on : ${checkout.toLocaleDateString()} ${checkout.toLocaleTimeString()}`
          );
        })()
        }
      </Text>
      <Text style={{ ...color_text }}>{`Amount checked out ${Math.abs(log.amount)}`}</Text>
      <Text style={{ ...color_text }}>
        {
          (() => {

            if (log.checkin_time.Valid) {
              const checkin = new Date(log.checkin_time.Time);
              return (
                `Checked back in on : ${checkin.toLocaleDateString()} ${checkin.toLocaleTimeString()}`
              );
            } else {
              return ("Still checked out")
            }
          })()
        }
      </Text>
    </View>
  </>
)}


export default function CheckoutLogList({ checkout_logs }: CheckoutLogListInput) {
  const color_scheme = useColorScheme()
  const color_text = color_scheme === 'dark' ? Colors.dark_text : Colors.light_text
  return <FlatList
    ListHeaderComponent={() => (<Text style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold', ...color_text }}>Checkout Logs</Text>)}
    data={checkout_logs}
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
    margin: 25,
    padding: 25,
    gap: 10,
    justifyContent: 'space-between',
    borderRadius: 20,
  }

})
