import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { HeaderProps } from '@/types'
import Typo from './Typo'
import BackButton from './BackButton'
import { verticalScale } from '@/utils/styling'
import { colors, spacingX, spacingY } from '@/constants/theme'

const Header = ({title = "", leftIcon, style, rightIcon, showBackButton = true,}: HeaderProps & {showBackButton?: boolean}) => {
  return (  
    <View style={[styles.container, style]}>
        {/* Left Section */}
        <View style={styles.leftSection}>
            {showBackButton && !leftIcon && <BackButton iconSize={24}/>}
            {leftIcon && leftIcon}
            {!showBackButton && !leftIcon && <View style={styles.placeholder} />}
        </View>

        {/* center section */}
        <View style={styles.centerSection}>
            {title && (
                <Typo size={18} fontWeight='600' style={styles.title}>
                    {title}
                </Typo>
            )}
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
            {rightIcon && rightIcon}
            {!rightIcon && <View style={styles.placeholder} />}
        </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: spacingX._10,
        paddingVertical: spacingY._15,
        backgroundColor: colors.white,
        minHeight: verticalScale(60),

    },
    leftSection: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginRight: spacingX._20,
    },
    centerSection: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: spacingX._15,
    },
    rightSection: { 
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginLeft: spacingX._20,
    },
    title: {
        textAlign: 'center',
    },
    placeholder:{
        width: verticalScale(32),
        height: verticalScale(32),
    }
})