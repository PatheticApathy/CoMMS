import { Colors } from "@/constants/Colors";
import { ReactNode } from "react";
import { useColorScheme, View, Text } from "react-native";

export default function FormModalView({ title, children }: { title: string, children: ReactNode }) {
  const color_scheme = useColorScheme()
  const color = color_scheme === 'dark' ? Colors.dark : Colors.light

  return (
    <View style={{ flexDirection: 'column', alignItems: 'center', height: '100%', paddingTop: '20%', ...color }}>
      <Text style={{ fontWeight: 'bold', fontSize: 40, color: 'white' }}>{title}</Text>
      {children}
    </View>
  )
}
