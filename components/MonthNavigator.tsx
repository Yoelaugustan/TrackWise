import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import Typo from './Typo'
import * as Icons from 'phosphor-react-native'
import { colors, spacingX } from '@/constants/theme'
import { MonthNavigatorProps } from '@/types'

export default function MonthNavigator({ date, onPrev, onNext }: MonthNavigatorProps) {
    const isCurrentMonth =
        date.getFullYear() === new Date().getFullYear() &&
        date.getMonth() === new Date().getMonth()

    const label = date.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
    })

    return (
        <View style={styles.row}>
            <TouchableOpacity onPress={onPrev}>
                <Icons.CaretLeft size={20} color={colors.black} weight="bold" />
            </TouchableOpacity>

            <Typo size={16} fontWeight="500" style={styles.label}>
                {label}
            </Typo>

            <TouchableOpacity onPress={onNext} disabled={isCurrentMonth}>
                <Icons.CaretRight
                    size={20}
                    color={isCurrentMonth ? colors.neutral400 : colors.black}
                    weight="bold"
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacingX._15,
    },
    label: {
        minWidth: 120,
        textAlign: 'center',
    },
})
