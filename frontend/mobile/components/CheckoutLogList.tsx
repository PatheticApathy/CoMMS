import { CheckoutLog } from "@/material-api-types";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native";


export interface LogListElement extends CheckoutLog {
  user: string | undefined
}

export interface CheckoutLogListInput {
  checkout_logs: LogListElement[]

}

const Item = ({ log }: { log: LogListElement }) => (
  <>
    <View style={style.segment}>
      <Text>Chekout pertains to user: {log.user || log.user_id}</Text>
      <Text>
        {(() => {
          const checkout = new Date(log.checkout_time);
          return (
            `Checked out on : ${checkout.toLocaleDateString()} ${checkout.toLocaleTimeString()}`
          );
        })()
        }
      </Text>
      <Text>{`Amount checked out ${Math.abs(log.amount)}`}</Text>
      <Text>
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
)


export default function CheckoutLogList({ checkout_logs }: CheckoutLogListInput) {
  return <FlatList
    ListHeaderComponent={() => (<Text style={{ textAlign: 'center', color: 'white', fontSize: 22, fontWeight: 'bold' }}>Checkout Logs</Text>)}
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
    gap: 10,
    backgroundColor: '#696969',
    justifyContent: 'space-between',
    borderRadius: 6,
  }

})
