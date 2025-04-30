/* eslint-disable @typescript-eslint/no-explicit-any */
import { Colors } from "@/constants/Colors"
import { View } from "react-native"
import { KeyboardTypeOptions, TextInput, useColorScheme } from "react-native"
export default function FormInput({ value, placeholder, keyboardtype, OnChangeText }: { value: string, placeholder: string, keyboardtype: KeyboardTypeOptions | undefined, OnChangeText: (text: string) => void }) {
  //NOTE: ignore the styling error
  const color_scheme = useColorScheme()
  const color_text = color_scheme === 'dark' ? Colors.dark_text : Colors.light_text

  return (
    <TextInput
      style={{
        margin: 20,
        padding: 10,
        flexDirection: 'col',
        borderWidth: 1, // Add this
        borderColor: '#000', // Add this (black border)
        borderRadius: 5, // Optional: for rounded cornerswidth: '80%', ...color_text 
        width: `80%`
      }}
      placeholder={placeholder}
      onChangeText={(text) => { OnChangeText(text) }}
      value={value}
      keyboardType={keyboardtype || 'default'}
    />
  )
}
