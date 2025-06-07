import { FlatList, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { verticalScale } from '@/utils/styling'
import { colors, radius, spacingY } from '@/constants/theme'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import * as Icons from 'phosphor-react-native'
import { router } from 'expo-router'
import { useWalletActions } from '@/hooks/useWalletActions'
import { WalletType } from '@/types'
import Loading from '@/components/Loading'
import WalletListItem from '@/components/WalletListItem'
import { useFocusEffect } from '@react-navigation/native'

const wallet = () => {
  const [wallets, setWallets] = useState<WalletType[]>([])
  const { selectWallet, updateWallet, deleteWallet, loading, error } = useWalletActions()

  const fetchWallets = useCallback(async () => {
    const data = await selectWallet()
    if (data) setWallets(data)
  }, [selectWallet])
    
  useFocusEffect(
    useCallback(() => {
      fetchWallets()
    }, [fetchWallets])
  )
  
  const getTotalBalance = () => {
    return wallets.reduce((total, item) => {
      return total + (item.amount || 0)
    }, 0)
  }

  const balanceColor = getTotalBalance() < 0 ? colors.rose : colors.white

  return (
    <ScreenWrapper style={{backgroundColor: colors.green}}>
      <View style={styles.container}>
        {/* Balance */}
        <View style={styles.balanceView}>
          <View style={{alignItems: 'center'}}>
            <Typo size={45} fontWeight={'500'} color={balanceColor}>
              Rp. {getTotalBalance()?.toLocaleString('id-ID')}
            </Typo>
            <Typo size={16} color={colors.neutral200}>Net Worth</Typo>

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

          {loading && <Loading />}
          <FlatList 
            data={wallets}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <WalletListItem item={item} index={index} router={router} />
            )}
            contentContainerStyle={styles.listStyle}
          />
            
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
    backgroundColor: colors.green
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
    backgroundColor: colors.white,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingY._20,
    paddingTop: spacingY._25,
  },
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15
  }
})