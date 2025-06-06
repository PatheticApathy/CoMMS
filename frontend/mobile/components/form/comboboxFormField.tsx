import { Key, useState } from "react";
import { Button, Modal, View } from "react-native";

export default function ComboboxFormField({ default_label, options, OnClickSet }: { default_label: string, options: { label: string, value: Key }[], OnClickSet: (key: string) => void }) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={{ justifyContent: 'center', }}>
      <Button title={default_label} onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
          <View style={{ backgroundColor: '#FFE74C', padding: 40, borderRadius: 20 }}>
            {(() =>
              options.map((option) => (
                <View key={option.label} style={{ backgroundColor: '#C9ADA7', margin: '10', borderRadius: 20 }}>
                  <Button
                    title={option.label}
                    onPress={() => {
                      OnClickSet(option.value.toString());
                      setModalVisible(!modalVisible)
                    }}
                  />
                </View>
              )))()}
          </View>
        </View>
      </Modal >
    </View >
  )
}
