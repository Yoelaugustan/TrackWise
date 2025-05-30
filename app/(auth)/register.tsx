import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import * as Icons from 'phosphor-react-native'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"

const Register = () => {
    const emailRef = useRef('')
    const passwordRef = useRef('')
    const passwordConfirmRef = useRef('')
    const nameRef = useRef('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [showConfPass, setShowConfPass] = useState(false)
    const router = useRouter()
    const handleSubmit = async()=>{
        if(!emailRef.current || !passwordRef.current || !nameRef.current){
            Alert.alert('Sign up', 'Please fill all the fields')
            return
        }
        if(passwordRef.current != passwordConfirmRef.current){
            Alert.alert('Sign up', 'Password Does Not Match')
            return
        }
        console.log('email: ', emailRef.current)
        console.log('name: ', nameRef.current)
        console.log('password: ', passwordRef.current)
        console.log("good to go")
    }
  return (
    <ScreenWrapper>
        <View style={styles.container}>
            {/* Back Button */}
            <BackButton iconSize={28}/>
    
            <Animated.View entering={FadeInDown.duration(1000).delay(100).springify().damping(12)} style={{gap: 5}}>
                <Typo size={30} fontWeight={'800'}>Let's Get Started</Typo>
                <Typo size={15} fontWeight={'400'}>Create your account to start tracking your expenses</Typo>
            </Animated.View>

            {/* form */}
            <Animated.View entering={FadeInDown.duration(1000).delay(200).springify().damping(12)} style={styles.form}>
                {/* input */}
                <Input 
                    placeholder='Enter Your Name'
                    onChangeText={value=>nameRef.current = value}
                    icon={<Icons.User size={verticalScale(26)} color={colors.black} weight='bold'/>}
                />
                <Input 
                    placeholder='Enter Your Email'
                    onChangeText={value=>emailRef.current = value}
                    icon={<Icons.EnvelopeSimple size={verticalScale(26)} color={colors.black} weight='bold'/>}
                />
                <Input 
                    containerStyle={styles.password}
                    placeholder='Enter Your Password'
                    secureTextEntry={!showPass}
                    onChangeText={value=>passwordRef.current = value}
                    icon={
                      <TouchableOpacity
                        onPress={()=> setShowPass(value => !value)}
                      >
                        {showPass
                          ? <Icons.Eye size={verticalScale(26)} color={colors.black} weight='bold'/>
                          : <Icons.EyeClosed size={verticalScale(26)} color={colors.black} weight='bold'/>
                        }
                      </TouchableOpacity>
                    }
                />
                <Input
                    containerStyle={styles.password}
                    placeholder='Confirm Your Password'
                    secureTextEntry={!showConfPass}
                    onChangeText={value=>passwordConfirmRef.current = value}
                    icon={
                      <TouchableOpacity
                        onPress={()=> setShowConfPass(value => !value)}
                      >
                        {showConfPass
                          ? <Icons.Eye size={verticalScale(26)} color={colors.black} weight='bold'/>
                          : <Icons.EyeClosed size={verticalScale(26)} color={colors.black} weight='bold'/>
                        }
                      </TouchableOpacity>
                    }
                />

                <Button loading={isLoading} onPress={handleSubmit}>
                    <Typo fontWeight={'700'} size={21}>Sign Up</Typo>
                </Button>
            </Animated.View>
            
            {/* Footer */}
            <Animated.View entering={FadeInDown.duration(1000).delay(300).springify().damping(12)} style={styles.footer}>
                <Typo size={15}>Already have an account?</Typo>
                <Pressable onPress={()=>router.push('/(auth)/login')}>
                    <Typo size={15} fontWeight={'700'} color={colors.primary}>Log In</Typo>
                </Pressable>
            </Animated.View>
        </View>
    </ScreenWrapper>
  )
}

export default Register

const styles = StyleSheet.create({
  container: {
      flex: 1,
      gap: spacingY._30,
      paddingHorizontal: spacingX._20,
  },
  welcomeText: {
      fontSize: verticalScale(20),
      fontWeight: 'bold',
      color: colors.black
  },
  form: {
      gap: spacingY._20
  },
  forgotPassword: {
      textAlign: 'right',
      fontWeight: "500",
      color: colors.black
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 5
  },
  footerText: {
      textAlign: 'center',
      color: colors.black,
      fontSize: verticalScale(15),
  },
  password: {
    justifyContent: 'flex-start'
  }
})