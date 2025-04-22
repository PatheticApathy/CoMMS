import { UseFormReturn } from "react-hook-form";
import { Button, Text, View } from "react-native";
import * as ImagePicker from 'expo-image-picker'
import { Notify } from "../notify";
import { useEffect } from "react";

export default function FormPictueInput({ name, placeholder, OnPicture }: { name: string, placeholder: string, OnPicture: (file: File) => void }) {
  const [lib_status, requestlib] = ImagePicker.useMediaLibraryPermissions()
  const [cam_status, requestcam] = ImagePicker.useCameraPermissions()

  useEffect(async () => {
    await requestlib()
    await requestcam()
    return
  }, [])

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {lib_status ?
        <Button title="Upload picture" onPress={async () => {
          const pic = await ImagePicker.launchImageLibraryAsync()
          if (!pic.canceled) {
            console.log(pic.assets[0].uri)
          }
        }
        } /> : <Text>No File access given</Text>
      }
      {cam_status ?
        <Button title="Take picture" onPress={async () => {
          const pic = await ImagePicker.launchCameraAsync()
          if (!pic.canceled) {
            console.log(pic.assets[0].uri)
          }
        }
        } /> : <Text>No Camera access given</Text>
      }
    </View>
  )
}
