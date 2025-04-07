import { Stack } from 'expo-router'


export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name='index' />
      <Stack.Screen
        name='add_material'
        options={{
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name='add_material_log'
        options={{
          presentation: 'modal'
        }}
      />
    </Stack>
  )
}
