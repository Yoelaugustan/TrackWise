import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button from '@/components/Button'
import Typo from '@/components/Typo'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'expo-router'

const Home = () => {
  const router = useRouter()
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.navigate('/(auth)/welcome')
  }
  return (
    <View>
      <Text>Home</Text>
      <Button onPress={handleLogout}>
        <Typo>Logout</Typo>
      </Button>
    </View> 
  )
}

export default Home

const styles = StyleSheet.create({})