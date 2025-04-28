import { ReactNode } from "react";
import { View } from "react-native";

export default function MainView({ children }: { children: ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#333333', alignItems: 'center', height: '100%' }}>
      {children}
    </View>
  )
}
