import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Typo from './Typo'
import { WalletType } from '@/types'
import { Router } from 'expo-router'
import { verticalScale } from '@/utils/styling'
import { colors, radius, spacingX } from '@/constants/theme'
import { Image } from 'expo-image'
import * as Icons from 'phosphor-react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

const WalletListItem = ({
    item,
    index,
    router
}: {
    item: WalletType
    index: number,
    router: Router
}) => {

    const openWallet = () => {
        router.push({
            pathname: '/(modals)/walletModal',
            params: { 
                id: item?.id, 
                name: item?.name,
                image: item?.image
            },
        })
    }

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify().damping(13)}>
        <TouchableOpacity style={styles.container} onPress={openWallet}>
            <View style={styles.imageContainer}>
                <Image
                    style={{flex: 1}}
                    source={item?.image}
                    contentFit='cover'
                    transition={100}
                />
            </View>
            <View style={styles.nameContainer}>
                <Typo size={20}>{item?.name}</Typo>
                <Typo size={16} color={colors.neutral600}>Rp. {item?.amount?.toLocaleString('id-ID')}</Typo>
            </View>
            <Icons.CaretRight 
                size={verticalScale(20)}
                weight='bold'
                color={colors.black}
            />
        </TouchableOpacity>
    </Animated.View>
  )
}

export default WalletListItem

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(17),
        borderRadius: radius._20,
    },
    imageContainer: {
        height: verticalScale(70),
        width: verticalScale(70),
        borderWidth: 1,
        borderColor: colors.neutral100,
        borderRadius: radius._12,
        borderCurve: 'continuous',
        overflow: 'hidden',
    },
    nameContainer: {
        flex: 1,
        gap: 2,
        marginLeft: spacingX._10,
    },
})