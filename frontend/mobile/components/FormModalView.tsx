import { ReactNode } from "react";
import { View } from "react-native";

export default function FormModalView({ children }: { children: ReactNode }) {
  return (
    <View style={{ backgroundColor: '#333333', flexDirection: 'column', alignItems: 'center', height: '100%', paddingTop: '30%' }}>
      {children}
    </View>
  )
}
