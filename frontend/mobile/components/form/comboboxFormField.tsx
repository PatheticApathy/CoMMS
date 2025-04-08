import { Key, useState } from "react";
import { Control } from "react-hook-form";
import { Modal } from "react-native";

export function ComboboxFormField({ form_attr, default_label, options }: { form_attr: { name: string, control: Control<any> }, default_label: string, options: { label: string, value: Key }[] }) {
  const [modalVisible, setModalVisible] = useState(false);
  <Modal
    animationType="slide"
    transparent={true}
  >
  </Modal>

}
