import { Key, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { Button, Modal, View } from "react-native";

export default function ComboboxFormField({ form_attr, default_label, options }: { form_attr: { name: string, form: UseFormReturn<any> }, default_label: string, options: { label: string, value: Key }[] }) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <Controller
          name={form_attr.name}
          control={form_attr.form.control}
          render={(() => (
            <View>
              {(() =>
                options.map((option) => (
                  <Button
                    title={option.label}
                    onPress={() => {
                      form_attr.form.setValue(form_attr.name, option.value)
                      setModalVisible(!modalVisible)
                    }}
                  />
                )))()}
            </View>))
          }
        />
      </Modal>
      <Button title={default_label} onPress={() => setModalVisible(true)} />
    </View>
  )
}
