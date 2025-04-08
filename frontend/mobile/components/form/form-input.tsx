/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, Controller, UseFormReturn } from "react-hook-form"
import { TextInput } from "react-native"
export default function FormInput({ name, placeholder, control }: { name: string, placeholder: string, control: Control<any, any> }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <TextInput>
          <TextInput placeholder={placeholder} {...field} />
        </TextInput>
      )}
    />
  )
}
