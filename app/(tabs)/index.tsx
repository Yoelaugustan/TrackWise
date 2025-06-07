import { ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import Button from '@/components/Button'
import Typo from '@/components/Typo'
import { supabase } from '@/lib/supabase'
import { router, useFocusEffect, useRouter } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import { useUserProfile } from '@/hooks/useUserProfile'
import * as Icons from 'phosphor-react-native'
import HomeCard from '@/components/HomeCard'
import TransactionList from '@/components/TransactionList'
import { useTransactionActions } from '@/hooks/useTransactionActions'
import MonthNavigator from '@/components/MonthNavigator'

const Home = () => {
  const { profile, loading, error } = useUserProfile()
  const [transactions, setTransactions] = useState<any[]>([])
  const { selectTransaction, loading: transactionLoading, error: transactionError } = useTransactionActions()
  const [allTx, setAllTx] = useState<any[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await selectTransaction()
        if (data) setAllTx(data)
      })()
    }, [selectTransaction])
  )

  const filtered = allTx.filter(tx => {
    const d = new Date(tx.date)
    return (
      d.getFullYear() === currentDate.getFullYear() &&
      d.getMonth() === currentDate.getMonth()
    )
  })

  const prevMonth = () => {
    const m = new Date(currentDate)
    m.setMonth(m.getMonth() - 1)
    setCurrentDate(m)
  }
  const nextMonth = () => {
    const m = new Date(currentDate)
    m.setMonth(m.getMonth() + 1)
    setCurrentDate(m)
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral800}>Hello,</Typo>
            <Typo size={20} fontWeight={'500'}>{profile?.username}</Typo> 
          </View>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          {/* Cards */}
          <HomeCard monthlyTransactions={filtered}>
            <MonthNavigator
              date={currentDate}
              onPrev={prevMonth}
              onNext={nextMonth}
            />
          </HomeCard>

          <TransactionList 
            data={filtered} 
            loading={transactionLoading} 
            title='Transactions this month'
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
    paddingHorizontal: spacingX._15,
    marginTop: verticalScale(8)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._10,
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