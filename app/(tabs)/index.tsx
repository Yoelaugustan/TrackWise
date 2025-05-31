import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button from '@/components/Button'
import Typo from '@/components/Typo'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'

const Home = () => {
  const router = useRouter()
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.navigate('/(auth)/welcome')
  }
  return (
    <ScreenWrapper>
      <View>
        <Typo>Home</Typo>
        <Button onPress={handleLogout}>
          <Typo>Logout</Typo>
        </Button>
      </View> 
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({})