import { Pressable, Button, Text, View, StyleSheet } from "react-native";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker'
import { useEffect } from "react";
import { Notify } from "../notify";

export default function FormPictueInput({ OnPicture }: { OnPicture: (file: [Blob, string]) => void }) {
  const [lib_status, requestlib] = ImagePicker.useMediaLibraryPermissions()
  const [cam_status, requestcam] = ImagePicker.useCameraPermissions()

  //Need to handle this error
  useEffect(() => {
    const RequestPermissions = async () => {
      await requestlib()
      await requestcam()
    }
    RequestPermissions()
  }, [])


  //This component returns the string of the encodoed file if base64
  return (
    <View style={style.pictureSelectorContainer}>
      {lib_status ?
        <Pressable
          style={({ pressed }) => pressed ? { ...style.buttonstyle, backgroundColor: 'cyan' } : style.buttonstyle}
          onPress={async () => {
            const pic = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 1,
            })
            if (!pic.canceled) {
              const file = await FileSystem.readAsStringAsync(pic.assets[0].uri, {
                encoding: FileSystem.EncodingType.Base64
              })

              try {

                const extension = pic.assets[0].uri.split('.').pop() || 'jpeg'
                const resp = await fetch(`data:${`image/${extension.toLowerCase() === 'jpg' ? 'jpeg' : extension.toLowerCase()}`};base64,${file}`)
                const blob = await resp.blob()

                OnPicture([blob, extension])
              } catch (err) {
                Notify.error(String(err))
              }
            }
          }
          }>
          <Text>Upload Picture</Text>
        </Pressable>
        : <Text >No File access given</Text>
      }
      {cam_status ?
        <Pressable
          style={({ pressed }) => pressed ? { ...style.buttonstyle, backgroundColor: 'cyan' } : style.buttonstyle}
          onPress={async () => {
            const pic = await ImagePicker.launchCameraAsync()

            if (!pic.canceled) {
              const file = await FileSystem.readAsStringAsync(pic.assets[0].uri, {
                encoding: FileSystem.EncodingType.Base64
              })

              try {

                const extension = pic.assets[0].uri.split('.').pop() || 'jpg'
                const resp = await fetch(`data:${`image/${extension}`};base64,${file}`)
                const blob = await resp.blob()

                OnPicture([blob, extension])
              } catch (err) {
                Notify.error(String(err))
              }
            }
          }
          }>
          <Text >Take Picture</Text>
        </Pressable>
        : <Text>No Camera access given</Text>
      }
    </View>
  )
}


const style = StyleSheet.create({
  buttonstyle:
  {
    margin: 20,
    flex: 1,
    backgroundColor: 'gray',
    borderRadius: 20,
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: 30
  },
  pictureSelectorContainer:
  {
    flex: 1,
    flexDirection: 'row',
  }
})
