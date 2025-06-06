import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Typo from './Typo'
import { scale, verticalScale } from '@/utils/styling'
import { colors, spacingY } from '@/constants/theme'
import { ImageBackground } from 'expo-image'
import * as Icons from 'phosphor-react-native'

const HomeCard = () => {
  return (
    <ImageBackground 
        source={require("@/assets/images/card.png")} 
        style={styles.bgImage}
        resizeMode='stretch'
    >
        <View style={styles.container}>
            <View>
                {/* Total Balance */}
                <View style={styles.totalBalanceRow}>
                    <Typo color={colors.neutral800} size={15} fontWeight={'500'}>Total Balance</Typo>
                
                    <Icons.DotsThreeOutline 
                    size={verticalScale(20)}
                    color={colors.black}
                    weight="fill"
                    />
                </View>
                
                <Typo color={colors.black} size={25} fontWeight={'bold'}>
                    Rp. 100.000.000
                </Typo>
            </View>

            {/* Expense and Income */}
            <View style={styles.stats}>
                {/* Income */}
                <View style={{ gap: verticalScale(4)}}>
                    <View style={styles.incomeExpense}>
                        <View style={styles.statsIcon}>
                            <Icons.ArrowUp 
                                size={verticalScale(15)}
                                color={colors.green}
                                weight='bold'
                            />
                        </View>
                        <Typo size={15} color={colors.neutral700} fontWeight={'500'}>Income</Typo>
                    </View>

                    <View style={{ alignSelf: 'center' }}>
                        <Typo size={16} color={colors.green} fontWeight={'600'}>
                            Rp. 1.000.000
                        </Typo>
                    </View>
                </View>

                {/* Expense */}
                <View style={{ gap: verticalScale(4)}}>
                    <View style={styles.incomeExpense}>
                        <View style={styles.statsIcon}>
                            <Icons.ArrowDown 
                                size={verticalScale(15)}
                                color={colors.rose}
                                weight='bold'
                            />
                        </View>
                        <Typo size={15} color={colors.neutral700} fontWeight={'500'}>Expense</Typo>
                    </View>

                    <View style={{ alignSelf: 'center' }}>
                        <Typo size={16} color={colors.rose} fontWeight={'600'}>
                            Rp. 1.000.000
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
    totalBalanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingY._5
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