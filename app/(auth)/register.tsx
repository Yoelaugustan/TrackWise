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
import { supabase } from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useWalletActions } from '@/hooks/useWalletActions'

  const Register = () => {
    const emailRef = useRef('')
    const passwordRef = useRef('')
    const passwordConfirmRef = useRef('')
    const nameRef = useRef('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [showConfPass, setShowConfPass] = useState(false)
    const router = useRouter()
    const { insertWallet, error: walletError } = useWalletActions();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const handleSubmit = async()=>{
      const name = nameRef.current.trim();
      const email = emailRef.current.trim().toLowerCase();
      const password = passwordRef.current;
      const passwordConfirm = passwordConfirmRef.current;


      if (!name || !email || !password || !passwordConfirm) {
        Alert.alert('Sign Up', 'Please fill in all fields.');
        return;
      }

      if (!emailRegex.test(email)) {
        Alert.alert('Sign Up', 'Please provide a valid email address.');
        return;
      }

      if (password.length < 6) {
        Alert.alert('Sign Up', 'Password must be at least 6 characters long.');
        return;
      }

      if (password !== passwordConfirm) {
        Alert.alert('Sign Up', 'Passwords do not match.');
        return;
      }
      
      setIsLoading(true);
      try {
        const { data: existing, error: selectErr } = await supabase
          .from('authentication')
          .select('id')
          .eq('email', email)
          .limit(1)
          .single();

        if (selectErr && selectErr.code !== 'PGRST116') {
          throw selectErr;
        }

        if (existing) {
          Alert.alert('Sign Up', 'Email is already registered.');
          setIsLoading(false);
          return;
        }

        const newUserId = (uuid.v4() as string).toLowerCase();

        const { error: insertAuthErr } = await supabase
          .from('authentication')
          .insert({
            id: newUserId,
            email: email,
            password: password,
          });

        if (insertAuthErr) {
          throw insertAuthErr;
        }

        const { error: insertProfileErr } = await supabase.
        from('profiles').
        insert({
          id: newUserId,
          username: name,
        });

        if (insertProfileErr) {
          await supabase.from('authentication').delete().eq('id', newUserId);
          throw insertProfileErr;
        }

        await AsyncStorage.setItem('userId', newUserId);

        const newWallet = await insertWallet({ name: 'default', image: null });
        console.log('insertWallet returned →', newWallet);
        console.log('walletError →', walletError);
        if (!newWallet) {
          console.error('Failed to insert default wallet:', walletError);
          await supabase
            .from('authentication').delete().eq('id', newUserId)
          Alert.alert('Sign Up', `Failed to create default wallet:\n${walletError}`);
          return;
        }

        Alert.alert('Sign Up', 'Account created successfully!')
      } catch (error: any) {
        console.error('Register → unexpected error:', error);
        Alert.alert('Sign Up Error', error.message ?? 'Something went wrong.');
      } finally {
        setIsLoading(false);
        router.replace('/(tabs)');
      }
    }
  return (
    <ScreenWrapper>
      <ScrollView keyboardShouldPersistTaps='handled'>
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
                  <Pressable onPress={()=>router.navigate('/(auth)/login')}>
                      <Typo size={15} fontWeight={'700'} color={colors.primary}>Log In</Typo>
                  </Pressable>
              </Animated.View>
          </View>
        </ScrollView>
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