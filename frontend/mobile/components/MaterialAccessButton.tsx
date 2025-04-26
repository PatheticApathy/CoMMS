import { Pressable, Text, View } from "react-native";

export default function MaterialButton() {
  return (
    <View style={{ position: 'absolute', paddingLeft: '80%', paddingTop: '45%', zIndex: 1 }}>
      <Pressable style={{ backgroundColor: 'red', padding: 5 }}><Text>Activity</Text></Pressable>
    </View>
  )
}
