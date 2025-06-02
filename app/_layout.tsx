import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'index', 
        }} 
      />
      <Stack.Screen 
        name="(modals)/profileModal" 
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen 
        name="(modals)/PasswordModal" 
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  )
}

export default _layout

 