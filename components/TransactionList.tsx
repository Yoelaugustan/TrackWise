import { ListRenderItemInfo, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { TransactionItemProps, TransactionListType, TransactionType } from '@/types'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Typo from './Typo'
import { FlashList } from "@shopify/flash-list";
import Loading from './Loading'
import { expenseCategories, incomeCategories } from '@/constants/data'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { router } from 'expo-router'

function formatShortDate(date: Date) {
  const opts: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'numeric', day: 'numeric', year: 'numeric' }
  return date.toLocaleDateString('en-ID', opts)
}

function groupByDate(transactions: TransactionType[]) {
    const groups: Record<string, TransactionType[]> = {}
    transactions.forEach(tx => {
        const d = new Date(tx.date)
        const dateKey = formatShortDate(d)
        if (!groups[dateKey]) groups[dateKey] = []
        groups[dateKey].push(tx)
    })
    return Object.entries(groups)
        .map(([title, data]) => ({ title, data }))
        .sort((a, b) => (
            new Date(b.data[0].date).getTime()
            - new Date(a.data[0].date).getTime()
        ))
}

const TransactionList = ({
    data,
    title,
    loading,
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

    const sections = groupByDate(data)
    return (
        <View style={styles.container}>
            {title && <Typo size={20} fontWeight="500" style={{marginBottom: spacingY._10}}>{title}</Typo>}

            {sections.map((section, sIndex) => {
                const totalIncome = section.data
                    .filter(tx => tx.type === 'income')
                    .reduce((sum, tx) => sum + Number(tx.amount), 0)
                const totalExpense = section.data
                    .filter(tx => tx.type === 'expense')
                    .reduce((sum, tx) => sum + Number(tx.amount), 0)

                return (
                    <Animated.View entering={FadeInDown.delay(sIndex * 70).springify().damping(14)} key={section.title} style={styles.sectionBox}>
                        {/* Date header */}
                        <View style={styles.sectionTitle}>
                            <Typo size={12} fontWeight="500">
                                {section.title}
                            </Typo>
                            
                            {(totalIncome > 0 || totalExpense > 0) && (
                                <View style={styles.totalsRow}>
                                    {totalIncome > 0 && (
                                        <Typo size={9} color={colors.green} fontWeight={'500'}>
                                            Income:Rp.{totalIncome.toLocaleString('id-ID')}
                                        </Typo>
                                    )}
                                    {totalExpense > 0 && (
                                        <Typo size={9} color={colors.rose} fontWeight={'500'}>
                                            Expense:Rp.{totalExpense.toLocaleString('id-ID')}
                                        </Typo>
                                    )}
                                </View>
                            )}
                        </View>
                        

                        {/* Transactions */}
                        {section.data.map((item, idx) => (
                            <React.Fragment key={item.id}>
                                <TransactionItem item={item} index={idx} handleClick={handleClick} />
                                {section.data.length > 1 && idx < section.data.length - 1 && (
                                    <View style={styles.separator} />
                                )}
                            </React.Fragment>
                        ))}
                    </Animated.View>
                )
            })}
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

    const isExpense = item.type === 'expense'
    const sign = isExpense ? '-' : '+'
    const amountColor = isExpense ? colors.rose : colors.green

    const hasDescription = Boolean(item.description && item.description.trim())

    return (
        <View style={{ padding: 4, flex: 1 }}>
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
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default TransactionList

const styles = StyleSheet.create({
    container: {
        paddingBottom: spacingY._25,
        paddingHorizontal: 2
    },
    sectionBox: {
        backgroundColor: colors.white,
        marginBottom: spacingY._15,
        borderRadius: radius._17,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 3,
    },
    sectionTitle: {
        paddingHorizontal: spacingX._10,
        paddingVertical: spacingY._5,
        backgroundColor: colors.neutral100,
        borderTopLeftRadius: radius._17,
        borderTopRightRadius: radius._17,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacingX._5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacingY._12,
        padding: spacingY._10,
        paddingHorizontal: spacingY._10,
        borderRadius: radius._17,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.neutral500,
        marginHorizontal: spacingX._10,
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