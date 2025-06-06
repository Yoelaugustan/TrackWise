import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { TransactionItemProps, TransactionListType } from '@/types'
import { colors, radius, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Typo from './Typo'
import { FlashList } from "@shopify/flash-list";
import Loading from './Loading'
import { expenseCategories, incomeCategory } from '@/constants/data'
import Animated, { FadeInDown } from 'react-native-reanimated'

const TransactionList = ({
    data,
    title,
    loading,
    emptyListMessage,
}: TransactionListType) => {

    const handleClick = () => {
        
    }
  return (
    <View style={styles.container}>
      {
        title && (
            <Typo size={20} fontWeight={'500'}>{title}</Typo>
        )
      }

      <View style={styles.list}>
        <FlashList
            data={data}
            renderItem={({ item, index }) => <TransactionItem item = {item} index = {index} handleClick={handleClick}/>}
            estimatedItemSize={60}
        />
      </View>
      {
        !loading && data.length === 0 && emptyListMessage && (
            <Typo size={15} color={colors.neutral600} style={{textAlign: 'center', marginTop: spacingY._15}}>
                {emptyListMessage}
            </Typo>
        )
      }
      {
        loading && (
            <View style={{top: verticalScale(100)}}>
                <Loading />
            </View>
        )
      }
    </View>
  )
}

const TransactionItem = ({
    item, index, handleClick
}: TransactionItemProps) => {

    let category = expenseCategories['entertainment']
    const IconComponent = category.icon
    return (
        <Animated.View entering={FadeInDown.delay(index * 70).springify().damping(14)} style={{ padding: 4, flex: 1 }}>
            <TouchableOpacity style={styles.row} onPress={()=>handleClick(item)}>
                <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
                    {IconComponent && (
                        <IconComponent 
                            size={verticalScale(25)} 
                            color={colors.white} 
                            weight='fill'
                        />
                    )}
                </View>

                <View style={styles.categoryDesc}>
                    <Typo size={13} fontWeight={'500'}>{category.label}</Typo>
                    <Typo size={10} color={colors.neutral600} textProps={{numberOfLines: 1}}>
                        Watched Mission Impossible
                    </Typo>
                </View>

                <View style={styles.amountDate}>
                    <Typo fontWeight={'500'} color={colors.rose} size={15}>
                        - Rp. 50.000
                    </Typo>
                    <Typo size={10} color={colors.neutral600}>12 January 2025</Typo>
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}

export default TransactionList

const styles = StyleSheet.create({
    container: {
        gap: spacingY._17
    },
    list: {
        minHeight: 3,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacingY._12,
        marginBottom: verticalScale(4),
        padding: spacingY._10,
        paddingHorizontal: spacingY._10,
        borderRadius: radius._17,
        backgroundColor: colors.white,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 3,
    },
    icon: {
        height: verticalScale(44),
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: radius._12,
        borderCurve: 'continuous',
    },
    categoryDesc: {
        flex: 1,
        gap: 2.5,
    },
    amountDate: {
        alignItems: 'flex-end',
        gap: 3
    },
})