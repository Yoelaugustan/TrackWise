import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { HeaderShownContext } from '@react-navigation/elements'

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}></Stack>
  )
}

export default _layout

const styles = StyleSheet.create({})