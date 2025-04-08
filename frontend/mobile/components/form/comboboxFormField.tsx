import { Key, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { Button, Modal, Text } from "react-native";

export function ComboboxFormField({ form_attr, default_label, options }: { form_attr: { name: string, control: Control<any> }, default_label: string, options: { label: string, value: Key }[] }) {
  const [modalVisible, setModalVisible] = useState(false);
  <Modal
    animationType="slide"
    transparent={true}
  >
    <Text>{form_attr.name}</Text>
    <Controller
      control={form_attr.control}
      render={options.map((option) => {
        <Button />
      })}
    />
  </Modal>

}
