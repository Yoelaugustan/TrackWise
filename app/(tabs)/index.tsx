import { ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Button from '@/components/Button'
import Typo from '@/components/Typo'
import { supabase } from '@/lib/supabase'
import { router, useRouter } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import { useUserProfile } from '@/hooks/useUserProfile'
import * as Icons from 'phosphor-react-native'
import HomeCard from '@/components/HomeCard'
import TransactionList from '@/components/TransactionList'

const Home = () => {
  const { profile, loading, error } = useUserProfile()

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral800}>Hello,</Typo>
            <Typo size={20} fontWeight={'500'}>{profile?.username}</Typo>
          </View>

          <TouchableOpacity style={styles.searchIcon}>
            <Icons.MagnifyingGlass 
              size={verticalScale(22)}
              color={colors.neutral800}
              weight='bold'
            />
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          {/* Cards */}
          <View>
            <HomeCard />
          </View>

          <TransactionList 
            data={[1, 2, 3, 4, 5 ,6 , 7]} 
            loading={false} 
            title='Recent Transactions'
            emptyListMessage='No recent transactions'  
          />
        </ScrollView>

        <Button
          style={styles.floatingButton}
          onPress={() => router.push('/(modals)/transactionModal')}
        >
          <Icons.Plus 
            size={verticalScale(24)}
            color={colors.black}
            weight='bold'
          />
        </Button>
      </View> 
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._10,
  },
  searchIcon: {
    padding: spacingX._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(50),
    width : verticalScale(50),
    borderRadius: 100,
    position: 'absolute',
    bottom: verticalScale(25),
    right: verticalScale(25),
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  }
})