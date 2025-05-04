import { Colors } from "@/constants/Colors";
import { ReactNode } from "react";
import { useColorScheme, View } from "react-native";

export default function MainView({ children }: { children: ReactNode }) {
  const color_scheme = useColorScheme()
  const color = color_scheme === 'dark' ? Colors.dark : Colors.light

  return (
    <View style={{ flex: 1, alignItems: 'center', height: '100%', ...color }}>
      {children}
    </View>
  )
}
