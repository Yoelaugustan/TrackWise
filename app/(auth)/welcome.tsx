import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Button from '@/components/Button'
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"

const welcome = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Login Button & Image*/}
        <View>
          <TouchableOpacity style={styles.loginButton}>
            <Typo fontWeight={"500"}>Sign in</Typo>
          </TouchableOpacity>
        </View>

        <Animated.Image
          source={require('../../assets/images/welcome.png')}
          style={styles.welcomeImage}
          resizeMode="contain"
          entering={FadeIn.duration(1000)}
        />

        {/* footer */}
        <View style={styles.footer}>
          <Animated.View entering={FadeInDown.duration(1000).springify().damping(12)} style={{alignItems: 'center'}}>
            <Typo size={30} fontWeight={'800'}>Always Take Control</Typo>
            <Typo size={30} fontWeight={'800'}>of you finances</Typo>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.duration(1000).delay(100).springify().damping(12)} style={{alignItems:'center', gap: 2}}>
            <Typo size={17} color={colors.textLight}>Finances must be arranged to set a better</Typo>
            <Typo size={17}>lifestyle in</Typo>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(1000).delay(200).springify().damping(12)} style={styles.buttonContainer}>
            <Button>
              <Typo size={22} color={colors.neutral900} fontWeight={"600"}>Get Started</Typo>
            </Button>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    justifyContent: 'center'
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingY._20,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: 'center',
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  }
})
