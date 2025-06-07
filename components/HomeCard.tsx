import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import Typo from './Typo'
import { scale, verticalScale } from '@/utils/styling'
import { colors, spacingY } from '@/constants/theme'
import { ImageBackground } from 'expo-image'
import * as Icons from 'phosphor-react-native'
import { HomeCardProps, WalletType } from '@/types'
import { useFocusEffect } from 'expo-router'
import { useWalletActions } from '@/hooks/useWalletActions'
import { TransactionType } from '@/types'

const HomeCard = ({ children, monthlyTransactions }: HomeCardProps) => {

    const monthlyTotals = monthlyTransactions.reduce(
        (acc, tx) => {
            if (tx.type === 'income') {
                acc.income += Number(tx.amount)
            } 
            else {
                acc.expense += Number(tx.amount)
            }
            return acc;
        },
        { income: 0, expense: 0 }
    )

    const net = monthlyTotals.income - monthlyTotals.expense


  return (
    <ImageBackground 
        source={require("@/assets/images/card.png")} 
        style={styles.bgImage}
        resizeMode='stretch'
    >
        <View style={styles.container}>
            <View>
                {/* Month Navigator */}
                <View style={styles.monthNavigator}>
                    {children}
                </View>

                {/* Net for this month */}
                    <View style={styles.totalBalanceRow}>
                        <Typo color={colors.black} size={25} fontWeight="bold">
                            Rp. {net.toLocaleString('id-ID')}
                        </Typo>
                    </View>
            </View>

            {/* Expense and Income */}
            <View style={styles.stats}>
                {/* Income */}
                <View style={{ gap: verticalScale(2)}}>
                    <View style={styles.incomeExpense}>
                        <View style={styles.statsIcon}>
                            <Icons.ArrowUp 
                                size={verticalScale(12)}
                                color={colors.green}
                                weight='bold'
                            />
                        </View>
                        <Typo size={14} color={colors.neutral700} fontWeight={'500'}>Income</Typo>
                    </View>

                    <View style={{ alignSelf: 'center' }}>
                        <Typo size={15} color={colors.green} fontWeight={'600'}>
                            Rp. {monthlyTotals.income.toLocaleString('id-ID')}
                        </Typo>
                    </View>
                </View>

                {/* Expense */}
                <View style={{ gap: verticalScale(2)}}>
                    <View style={styles.incomeExpense}>
                        <View style={styles.statsIcon}>
                            <Icons.ArrowDown 
                                size={verticalScale(12)}
                                color={colors.rose}
                                weight='bold'
                            />
                        </View>
                        <Typo size={14} color={colors.neutral700} fontWeight={'500'}>Expense</Typo>
                    </View>

                    <View style={{ alignSelf: 'center' }}>
                        <Typo size={15} color={colors.rose} fontWeight={'600'}>
                            Rp. {monthlyTotals.expense.toLocaleString('id-ID')}
                        </Typo>
                    </View>
                </View>
                
            </View>
        </View>
    </ImageBackground>
  )
}

export default HomeCard

const styles = StyleSheet.create({
    bgImage: {
        height: scale(210),
        width: '100%'
    },
    container: {
        padding: spacingY._15,
        paddingHorizontal: scale(23),
        height: "87%",
        width: "100%",
        justifyContent: 'space-between',
    },
    monthNavigator: {
        paddingVertical: 0,
    },
    totalBalanceRow: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(7)
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statsIcon: {
        backgroundColor: colors.neutral100,
        padding: spacingY._5,
        borderRadius: 50,
    },
    incomeExpense: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingY._7
    }
})