/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, Controller } from "react-hook-form"
import { TextInput } from "react-native"
export default function FormInput({ value, placeholder, OnChangeText }: { value: string, placeholder: string, OnChangeText: (text: string) => void }) {
  //NOTE: ignore the styling error
  return (
    <TextInput
      style={{ margin: 20, color: 'black', backgroundColor: "white", padding: 10, flexDirection: 'col', width: '80%' }}
      placeholder={placeholder}
      onChange={OnChangeText}
      value={value}
    />
  )
}
