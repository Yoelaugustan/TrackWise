import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import ScreenWrapper from '@/components/ScreenWrapper'
import ModalWrapper from '@/components/ModalWrapper'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import { Image } from 'expo-image'
import { getProfileImage, uploadFiletoCloudinary } from '@/services/imageServices'
import * as Icons from 'phosphor-react-native'
import Typo from '@/components/Typo'
import Input from '@/components/Input'
import { UserDataType, WalletType } from '@/types'
import Button from '@/components/Button'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useUpdateUserProfile } from '@/hooks/useUpdateUserProfile'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';
import ImageUpload from '@/components/ImageUpload'
import { useWalletActions } from '@/hooks/useWalletActions'


const WalletModal = () => {

    const [imageLoading, setImageLoading] = useState(false)

    const [wallet, setWallet] = useState<WalletType>({
        name: '',
        image: null,
    })
    
    const { insertWallet, updateWallet, deleteWallet, loading, error } = useWalletActions()
    const onSubmit = async () => {
        let {name, image} = wallet
        if(!name.trim() || !image){
            Alert.alert('User', 'Please fill all the fields')
            return
        }
        
        setImageLoading(true)
        const uploadResult = await uploadFiletoCloudinary(
            { uri: image.uri }, 
            'wallets'
        )
        setImageLoading(false)
        if (uploadResult.success && uploadResult.data) {
            const imageUrl = uploadResult.data
            const result = await insertWallet({ name, image: imageUrl })
            if (result) {
                Alert.alert('Success', 'Wallet created!')
                router.back()
            }
        } else {
            Alert.alert('Upload Failed', uploadResult.msg || 'Failed to upload image')
        }
    }
    
    return (
    <ModalWrapper>
        
        <View style={styles.container}>
            <Header title='New Wallet' showBackButton/>

            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps='handled'>

                <View style={styles.inputContainer}>
                    <Typo color={colors.black}>Wallet Name</Typo>
                    <Input 
                        placeholder='Salary'
                        value={wallet.name}
                        onChangeText={(value) => {setWallet({...wallet, name: value})} }
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Typo color={colors.black}>Wallet Icon</Typo>
                    <ImageUpload 
                        file={wallet.image}
                        onSelect={(file) => {setWallet({...wallet, image: file})}}
                        onClear={() => {setWallet({...wallet, image: null})}}
                        placeholder='Upload Image'
                    />
                </View>
            </ScrollView>
        </View>

        <View style={styles.footer}>
            <Button onPress={onSubmit} style={{flex: 1}} loading={loading || imageLoading}>
                <Typo fontWeight={'600'}>Add Wallet</Typo>
            </Button>
        </View>
    </ModalWrapper>
  )
}

export default WalletModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacingX._20,
    },
    footer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingX._15,
        borderTopColor: colors.neutral100,
        marginBottom: spacingX._25,
        borderTopWidth: 1,
    },
    form: {
        gap: spacingX._30,
        marginTop: spacingX._15
    },
    inputContainer: {
        gap: spacingY._10,
    }
})