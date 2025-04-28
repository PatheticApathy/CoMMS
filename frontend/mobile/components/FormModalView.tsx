import { ReactNode } from "react";
import { View, Text } from "react-native";

export default function FormModalView({ title, children }: { title: string, children: ReactNode }) {
  return (
    <View style={{ backgroundColor: '#333333', flexDirection: 'column', alignItems: 'center', height: '100%', paddingTop: '20%' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 40, color: 'white' }}>{title}</Text>
      {children}
    </View>
  )
}
