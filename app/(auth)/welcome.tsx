import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Button from '@/components/Button'
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"
import { useRouter } from 'expo-router'

const welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.content}>
          <Animated.Image
            source={require('../../assets/images/welcome.jpg')}
            style={styles.welcomeImage}
            resizeMode="contain"
            entering={FadeIn.duration(1000)}
          />
            <View style={{ gap: 3 }}>
              <Animated.View entering={FadeInDown.duration(1000).springify().damping(12)} style={{alignItems: 'center'}}>
                <Typo size={30} fontWeight={'800'}>Master Your Money</Typo>
              </Animated.View>
              
              <Animated.View entering={FadeInDown.duration(1000).delay(100).springify().damping(12)} style={{alignItems:'center', gap: 2}}>
                <Typo size={17}>Track every expense, set clear goals, </Typo>
                <Typo size={17}>and build the future you deserve.</Typo>
              </Animated.View>
            </View>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Animated.View entering={FadeInDown.duration(1000).delay(200).springify().damping(12)} style={styles.buttonContainer}>
            <Button onPress={()=>router.push('/(auth)/register')}>
              <Typo size={22} fontWeight={"600"}>Let's Go</Typo>
            </Button>
          </Animated.View>

          {/* Login Button & Image*/}
          <Animated.View entering={FadeInDown.duration(1000).delay(300).springify().damping(12)} style={{flexDirection: 'row', gap: 5}}>
            <Typo size={15}>Have an account?</Typo>
            <Pressable onPress={()=>router.push('/(auth)/login')}>
              <Typo size={15} fontWeight={'700'} color={colors.primary}>Login</Typo>
            </Pressable>
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
    justifyContent: 'space-between',
    paddingTop: spacingY._7,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    justifyContent: 'center'
  },
  footer: {
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
