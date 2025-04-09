import { Stack } from 'expo-router'


export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name='add_materials'
        options={{
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name='add_log'
        options={{
          presentation: 'modal'
        }}
      />
    </Stack>
  )
}
