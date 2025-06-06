import { Alert, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { use, useCallback, useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Header from '@/components/Header'
import Typo from '@/components/Typo'
import {Image} from 'expo-image'
import { getProfileImage } from '@/services/imageServices'
import { accountOptionType } from '@/types'
import * as Icons from 'phosphor-react-native'
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"
import { router, useRouter } from 'expo-router'
import { useUserProfile } from '@/hooks/useUserProfile'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import Button from '@/components/Button'

const Profile = () => {

  const { profile, loading, error, refetch } = useUserProfile()

  console.log(profile.imageUrl)
  console.log('type of profile.imageUrl:', typeof profile.imageUrl);

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch])
  )

  const accountOptions: accountOptionType[] = [
    {
      title: 'Edit Profile',
      icon: (
        <Icons.UserCircle
          size={26} 
          color={colors.white} 
        />
      ),
      routeName: '/(modals)/profileModal',
      bgColor: colors.black,
    },
    {
      title: 'Change Password',
      icon: (
        <Icons.Lock 
          size={26} 
          color={colors.white} 
        />
      ),
      routeName: '/(modals)/passwordModal',
      bgColor: colors.black,
    },
    {
      title: 'Setting (UI Only)',
      icon: (
        <Icons.GearSix
          size={26} 
          color={colors.white} 
        />
      ),
      // routeName: '/(modals)/profileModal',
      bgColor: colors.black,
    },
    {
      title: 'Privacy and Policy (UI Only)',
      icon: (
        <Icons.Shield 
          size={26} 
          color={colors.white} 
        />
      ),
      // routeName: '/(modals)/profileModal',
      bgColor: colors.black,
    },
  ]
  
  const showLogoutAlert = () => {
    Alert.alert("Confirm", "Are You Sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel logout"),
        style: "cancel"
      },
      {
        text: "Logout",
        onPress: async () => {
          await AsyncStorage.removeItem('userId');
          router.replace('/(auth)/welcome')
        },
        style: "destructive"  
      }
  ])
  }

  const router = useRouter()
  const handlePress = (item: accountOptionType) => {
    if(item.title === 'Logout') {
      showLogoutAlert()
    }

    if(item.routeName) {
      router.push(item.routeName)
    }
  }
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title='Profile' showBackButton/>
      
        {/* User Info */}
        <View style={styles.userInfo}>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            
            {/* User Image */}
            <Image 
              source={getProfileImage(profile.imageUrl)} 
              style={styles.avatar} 
              contentFit='cover' 
              transition={100}
            />


            <TouchableOpacity onPress={() => router.push('/(modals)/profileModal')} style={styles.editIcons}>
              <Icons.Pencil 
                  size={verticalScale(20)}
                  color={colors.neutral800}
              />
            </TouchableOpacity>
          </View>
          
          {/* Name & Email */}
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={'600'}>{profile.username}</Typo>
            <Typo size={15} color={colors.neutral700}>{profile.email}</Typo>
          </View>
        </View>

        {/* Account Options */}
        <View style={{ flex: 1, justifyContent: 'center',}}>
          <Typo size={20} fontWeight={'700'}>Account Options</Typo>
          <View style={styles.accountOptions}>
            {accountOptions.map((item, index) => {
              return (
                <Animated.View
                  key={index.toString()}
                  entering={FadeInDown.delay(index*50).springify().damping(14)} 
                >
                  <TouchableOpacity style={styles.flexRow} onPress={()=>handlePress(item)}>
                    {/* icon */}
                    <View style={[
                      styles.listIcons, {
                        backgroundColor: item.bgColor
                      }
                    ]}>
                      {item.icon && item.icon}
                    </View>
                    <Typo size={16} style={{flex: 1}} fontWeight={"500"}>{item.title}</Typo>
                    <Icons.CaretRight 
                      size={verticalScale(20)}
                      weight='bold'
                      color={colors.black}
                    />
                  </TouchableOpacity>
                </Animated.View>
              )
            })}
          </View>
        </View>

        <View style={styles.footer}>
          <Button onPress={showLogoutAlert} style={styles.button}>
            <Icons.SignOut size={verticalScale(20)} color={colors.white} />
            <Typo color={colors.white}>Logout</Typo>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    justifyContent: 'space-between'
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: 'center',
    gap: spacingX._15,
  },
  avatarContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  avatar: {
    alignSelf: 'center',
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderColor: colors.neutral200,
    borderWidth: 1,
  },
  editIcons: {
    position: 'absolute',
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: 5,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: 'center',
  },
  listIcons: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius._15,
    borderCurve: 'continuous',
  },
  accountOptions: {
    marginTop: spacingY._35,
    backgroundColor: colors.neutral100,
    padding: spacingX._10,
    borderRadius: radius._15,
    borderCurve: 'continuous',
    gap: spacingY._15
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._10,
  },
  footer: {
    marginBottom: verticalScale(20),
    alignItems: 'center'
  },
  button: {
    backgroundColor: colors.rose,
    flexDirection: 'row',
    gap: spacingX._10,
    width: "50%"
  }
})