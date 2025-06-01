import { Dimensions, Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ModalWrapperProps, ScreenWrapperProps } from '@/types'
import { colors, spacingY } from '@/constants/theme'

const {height} = Dimensions.get('window')
const ModalWrapper = ({style, children, bg = colors.white}: ModalWrapperProps) => {
  let paddingTop = Platform.OS == 'ios'? height * 0.03 : 30;
  return (
    <View style={[{backgroundColor: bg, flex: 1, paddingTop}, style]}>
      <StatusBar barStyle='dark-content' />
      {children}
    </View> 
  )
}

export default ModalWrapper

const styles = StyleSheet.create({
})