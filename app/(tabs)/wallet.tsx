import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { verticalScale } from '@/utils/styling'
import { colors, radius, spacingY } from '@/constants/theme'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import * as Icons from 'phosphor-react-native'
import { router } from 'expo-router'

const wallet = () => {
  const getTotalBalance = () => {
    return 0
  }
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Balance */}
        <View style={styles.balanceView}>
          <View style={{alignItems: 'center'}}>
            <Typo size={45} fontWeight={'500'}>
              Rp. {getTotalBalance()?.toLocaleString('id-ID')}
            </Typo>
            <Typo size={16} color={colors.neutral500}>Total Balance</Typo>

          </View>
        </View>

        {/* Wallets */}
        <View style={styles.wallets}>
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={'500'}>My Wallet</Typo>
            <TouchableOpacity onPress={() => router.push('/(modals)/walletModal')}>
              <Icons.PlusCircle 
                weight='fill'
                color={colors.green}
                size = {verticalScale(33)}
              />
            </TouchableOpacity>
          </View>

          {/* Todo: wallet list */}
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default wallet

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  balanceView: {
    height: verticalScale(160),
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._10,
  },
  wallets: {
    flex: 1,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingY._20,
    paddingTop: spacingY._25,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15
  }
})