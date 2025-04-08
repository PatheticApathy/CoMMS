import { Alert } from "react-native"
export const Notify = {
  message: (title: string, msg: string) => {
    Alert.alert(title, msg, [
      {
        text: 'Ok',
        style: 'default'
      }
    ])

  },

  error: (msg: string) => {
    Alert.alert('Error', msg, [
      {
        text: 'Ok',
        style: 'cancel'
      }
    ])

  },

  success: (msg: string) => {
    Alert.alert('Success', msg, [
      {
        text: 'Ok',
        style: 'default'
      }
    ])

  }
}
