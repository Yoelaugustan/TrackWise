import React from 'react'
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native'
import Typo from './Typo'
import { colors, spacingX, spacingY, radius } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import * as Icons from 'phosphor-react-native'
import {
  ExpenseCategoriesType,
  CategoryType,
  CategoryPickerProps,
} from '@/types'
import { expenseCategories, incomeCategories } from '@/constants/data'
import { IconProps } from 'phosphor-react-native'


const CategoryPicker = ({
    type,
    selectedCategory,
    onSelectCategory,
    containerStyle,
}: CategoryPickerProps) => {

    let items: Array<CategoryType> = []
    if (type === 'expense') {
        items = Object.values(expenseCategories)
    } else {
        items = Object.values(incomeCategories)
    }

    const itemsPerRow = 3
    const numRows = Math.ceil(items.length / itemsPerRow)

    return (
        <View style={[styles.gridContainer, containerStyle]}>
            {items.map((cat, idx) => {
                const IconComponent = cat.icon as React.FC<IconProps>
                const isSelected = selectedCategory === cat.value

                const thisRow = Math.floor(idx / itemsPerRow) + 1
                const marginBottom = thisRow === numRows ? 0 : spacingY._15

                return (
                    <TouchableOpacity
                        key={cat.value}
                        activeOpacity={0.7}
                        onPress={() => onSelectCategory(cat.value)}
                        style={[
                            styles.title,
                            { marginBottom },
                            { backgroundColor: isSelected ? 'rgba(22, 163, 74, 0.2)' : colors.white },
                            isSelected ? { borderColor: colors.green } : { borderColor: colors.white },
                        ]}
                    >
                        <IconComponent
                            size={scale(32)}
                            color={cat.bgColor}
                            weight="fill"
                        />
                        <Typo
                            size={scale(12)}
                            color={isSelected ? colors.green : colors.neutral800}
                            style={styles.titleLabel}
                            textProps={{ numberOfLines: 1 }}
                        >
                            {cat.label}
                        </Typo>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

export default CategoryPicker

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: spacingX._10,
        paddingTop: verticalScale(5),
        paddingHorizontal: spacingX._5,
    },
    title: {
        width: '31%',
        aspectRatio: 1,
        borderRadius: radius._15,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: verticalScale(1),
        paddingVertical: spacingY._10,
    },
    titleLabel: {
        marginTop: spacingY._5,
        textAlign: 'center',
        width: '100%',
        flexWrap: 'wrap',
        lineHeight: verticalScale(16),
    }
})