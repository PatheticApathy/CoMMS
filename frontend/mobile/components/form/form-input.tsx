/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, Controller } from "react-hook-form"
import { KeyboardTypeOptions, TextInput } from "react-native"
export default function FormInput({ value, placeholder, keyboardtype, OnChangeText }: { value: string, placeholder: string, keyboardtype: KeyboardTypeOptions | undefined, OnChangeText: (text: string) => void }) {
  //NOTE: ignore the styling error
  return (
    <TextInput
      style={{ margin: 20, color: 'black', backgroundColor: "white", padding: 10, flexDirection: 'col', width: '80%' }}
      placeholder={placeholder}
      onChangeText={(text) => { OnChangeText(text) }}
      value={value}
      keyboardType={keyboardtype || 'default'}
    />
  )
}
