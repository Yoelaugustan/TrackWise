import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { TransactionItemProps, TransactionListType, TransactionType } from '@/types'
import { colors, radius, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Typo from './Typo'
import { FlashList } from "@shopify/flash-list";
import Loading from './Loading'
import { expenseCategories, incomeCategories } from '@/constants/data'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { router } from 'expo-router'

const TransactionList = ({
    data,
    title,
    loading,
    emptyListMessage,
}: TransactionListType) => {

    const handleClick = (item: TransactionType) => {
        router.push({
            pathname: '/(modals)/transactionModal',
            params: {
                id: item?.id,
                type: item?.type,
                amount: item?.amount?.toString(),
                category: item?.category,
                date: item.date?.toString(),
                description: item?.description,
                image: item?.image,
                walletID: item?.walletID,
                authUID: item?.authUID
            }
        })

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

    const cats = item.type === 'income'
    ? incomeCategories
    : expenseCategories

    const catDef = cats[item.category!] || {
        label: 'Unknown',
        icon: null,
        bgColor: colors.neutral300,
    }
    const IconComponent = catDef.icon

    const d = new Date(item.date)

    const monthNames = [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December'
    ]

    const formattedDate = `${d.getDate()} ${
        monthNames[d.getMonth()]
    } ${d.getFullYear()}`

    const isExpense = item.type === 'expense'
    const sign = isExpense ? '-' : '+'
    const amountColor = isExpense ? colors.rose : colors.green

    const hasDescription = Boolean(item.description && item.description.trim())

    return (
        <Animated.View entering={FadeInDown.delay(index * 70).springify().damping(14)} style={{ padding: 4, flex: 1 }}>
            <TouchableOpacity style={styles.row} onPress={()=>handleClick(item)}>
                <View style={[styles.icon, { backgroundColor: catDef.bgColor }]}>
                    {IconComponent && (
                        <IconComponent 
                            size={verticalScale(25)} 
                            color={colors.white} 
                            weight='fill'
                        />
                    )}
                </View>

                <View 
                    style={[
                        styles.categoryDesc,
                        !hasDescription && styles.categoryDescEmpty
                    ]}
                >
                    <Typo 
                        size={13} 
                        fontWeight={'500'}
                        style={!hasDescription && styles.categoryOnly}
                    >
                        {catDef.label}
                    </Typo>
                    {
                        hasDescription && (
                            <Typo size={10} color={colors.neutral600} textProps={{numberOfLines: 1}}>
                                {item.description ?? ''}
                            </Typo>
                        )
                    }
                </View>

                <View style={styles.amountDate}>
                    <Typo fontWeight={'500'} color={amountColor} size={15}>
                        {`${sign} Rp. ${Number(item.amount).toLocaleString('id-ID')}`}
                    </Typo>
                    <Typo size={10} color={colors.neutral600}>{formattedDate}</Typo>
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
    categoryDescEmpty: {
        justifyContent: 'center',
    },
    categoryOnly: {
        flex: 1,
        textAlignVertical: 'center',
        fontSize: verticalScale(15)
    },
    amountDate: {
        alignItems: 'flex-end',
        gap: 3
    },
})