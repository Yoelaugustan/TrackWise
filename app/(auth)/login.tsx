import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
import { supabase } from '@/lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
    const emailRef = useRef('')
    const passwordRef = useRef('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const handleSubmit = async()=>{
        if(!emailRef.current || !passwordRef.current){
            Alert.alert('Login', 'Pleese fill all the fields')
            return
        }

        setIsLoading(true)
        const { data: { session }, error } = await supabase.auth.signInWithPassword({
            email: emailRef.current,
            password: passwordRef.current,
        })
    
        setIsLoading(false)

        try {
            const {data: authRows, error: authError} = await supabase
                .from('authentication')
                .select('id, password')
                .eq('email', emailRef.current.trim())
                .limit(1)
                .single()

            if(authError && authError.code !== 'PGRST116'){
                throw authError
            }

            if (!authRows) {
                Alert.alert('Login Error', 'Email not registered.');
                setIsLoading(false);
                return;
            }

            if (authRows.password !== passwordRef.current) {
                Alert.alert('Login Error', 'Incorrect password.');
                setIsLoading(false);
                return;
            }

            await AsyncStorage.setItem('userId', authRows.id);

            router.replace('/(tabs)');
        } catch (error: any) {
            console.error('Login → unexpected error:', error);
            Alert.alert('Login Error', error.message ?? 'Something went wrong.');
            setIsLoading(false);
        }
    }
  return (
    <ScreenWrapper>
        <ScrollView keyboardShouldPersistTaps='handled'>
            <View style={styles.container}>
                {/* Back Button */}
                <BackButton iconSize={28}/>
                
                <Animated.Image
                    source={require('../../assets/images/login.jpg')}
                    style={styles.loginImage}
                    resizeMode="contain"
                    entering={FadeIn.duration(1000)}
                />

                <Animated.View entering={FadeInDown.duration(1000).delay(100).springify().damping(12)} style={{gap: 5}}>
                    <Typo size={30} fontWeight={'800'}>Welcome Back !</Typo>
                    <Typo size={20} fontWeight={'500'}>Sign in to continue</Typo>
                </Animated.View>

                {/* form */}
                <Animated.View entering={FadeInDown.duration(1000).delay(200).springify().damping(12)} style={styles.form}>
                    {/* input */}
                    <Input 
                        placeholder='Enter Your Email'
                        onChangeText={value=>emailRef.current = value}
                        icon={<Icons.EnvelopeSimple size={verticalScale(26)} color={colors.black} weight='bold'/>}
                    />
                    <Input 
                        placeholder='Enter Your Password'
                        secureTextEntry
                        onChangeText={value=>passwordRef.current = value}
                        icon={<Icons.Key size={verticalScale(26)} color={colors.black} weight='bold'/>}
                    />

                    {/* UI only */}
                    <TouchableOpacity>
                        <Typo size={14} style={{alignSelf: 'flex-end'}}>Forgot Password?</Typo> 
                    </TouchableOpacity>

                    <Button loading={isLoading} onPress={handleSubmit}>
                        <Typo fontWeight={'700'} size={21}>Login</Typo>
                    </Button>
                </Animated.View>
                
                {/* Footer */}
                <Animated.View entering={FadeInDown.duration(1000).delay(300).springify().damping(12)} style={styles.footer}>
                    <Typo size={15}>Don't have an account?</Typo>
                    <Pressable onPress={()=>router.navigate('/(auth)/register')}>
                        <Typo size={15} fontWeight={'700'} color={colors.primary}>Sign Up</Typo>
                    </Pressable>
                </Animated.View>
            </View>
        </ScrollView>
    </ScreenWrapper>
  )
}

export default Login

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
    loginImage: {
    width: "100%",
    height: verticalScale(250),
    justifyContent: 'center'
  },
})