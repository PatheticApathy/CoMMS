import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Modal, TouchableOpacity } from 'react-native';

export default function AdminDropDown({ user }: { user: any }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newJobsite, setNewJobsite] = useState('');
  const [newRole, setNewRole] = useState('');

  const handleUpdateCompany = () => {
    console.log(`Update company to: ${newCompany}`);
    setModalVisible(false);
  };

  const handleUpdateJobsite = () => {
    console.log(`Update jobsite to: ${newJobsite}`);
    setModalVisible(false);
  };

  const handleUpdateRole = () => {
    console.log(`Update role to: ${newRole}`);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>Actions</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Actions</Text>
          <TextInput
            placeholder="New Company"
            value={newCompany}
            onChangeText={setNewCompany}
            style={styles.input}
          />
          <Button title="Change Company" onPress={handleUpdateCompany} />
          <TextInput
            placeholder="New Jobsite"
            value={newJobsite}
            onChangeText={setNewJobsite}
            style={styles.input}
          />
          <Button title="Change Jobsite" onPress={handleUpdateJobsite} />
          <TextInput
            placeholder="New Role"
            value={newRole}
            onChangeText={setNewRole}
            style={styles.input}
          />
          <Button title="Change Role" onPress={handleUpdateRole} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
});