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
import { UserDataType } from '@/types'
import Button from '@/components/Button'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useUpdateUserProfile } from '@/hooks/useUpdateUserProfile'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';


const ProfileModal = () => {
    const { profile, loading, error } = useUserProfile()

    const [userData, setUserData] = useState<UserDataType>({
        name: '',
        image: null,
        email: '',
    })

    const [uploadingImage, setUploadingImage] = useState(false)
    
    useEffect(() => {
        setUserData({
            name: profile.username || '',
            image: profile.imageUrl || null,
            email: profile.email || '',
        })
    }, [profile.username, profile.imageUrl, profile.email])

    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        aspect: [4, 3],
        quality: 0.5,
        });

        console.log(result.assets[0]);

        if (!result.canceled) {

            setUploadingImage(true)

            const uploadResult = await uploadFiletoCloudinary(
                { uri: result.assets[0].uri }, 
                'users'
            )

            if (uploadResult.success && uploadResult.data) {
                setUserData({...userData, image: uploadResult.data})
                console.log('Image uploaded successfully:', uploadResult.data)
            } else {
                Alert.alert('Upload Failed', uploadResult.msg || 'Failed to upload image')
            }

            setUploadingImage(false)
        }
    };
    
    const { updateUserProfile, loading: updating, error: updateError } = useUpdateUserProfile()
    const onSubmit = async () => {
        let {name, image, email} = userData
        console.log('Original profile data:', profile)
        console.log('Current userData state:', userData)
        console.log('Email being sent:', email.trim())
        if(!name.trim()){
            Alert.alert('User', 'Please fill all the fields')
            return
        }
        if(!email.trim()){
            Alert.alert('Email', 'Please fill all the fields')
            return
        }

        try {
            const updateData = {
                updatedEmail: email.trim() || undefined,
                updatedUsername: name.trim() || undefined,
                updatedImageUrl: image || undefined,
            }
            console.log('Sending to updateUserProfile:', updateData)
        
            await updateUserProfile(updateData)
            Alert.alert('Success', 'Your profile has been updated.')

            router.back()
        } catch (err) {
            console.log(err)
        }
    }
    
    return (
    <ModalWrapper>
        
        <View style={styles.container}>
            <Header title='Update Profile' showBackButton/>

            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps='handled'>
                <View style={styles.avatarContainer}>
                    <Image 
                        style={styles.avatar}
                        source={getProfileImage(userData.image)}
                        contentFit='cover'
                        transition={100}
                    />

                    <TouchableOpacity onPress={onPickImage} style={styles.editIcons}>
                        <Icons.Pencil 
                            size={verticalScale(20)}
                            color={colors.neutral800}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Typo color={colors.black}>Name</Typo>
                    <Input 
                        placeholder='Name'
                        value={userData.name}
                        onChangeText={(value) => {setUserData({...userData, name: value})} }
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Typo color={colors.black}>Email</Typo>
                    <Input 
                        placeholder='Email'
                        value={userData.email}
                        onChangeText={(value) => {setUserData({...userData, email: value})} }
                    />
                </View>
            </ScrollView>
        </View>

        <View style={styles.footer}>
            <Button onPress={onSubmit} style={{flex: 1}} loading={loading || uploadingImage}>
                <Typo fontWeight={'600'}>Update</Typo>
            </Button>
        </View>
    </ModalWrapper>
  )
}

export default ProfileModal

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
    avatarContainer: {
        position: 'relative',
        alignSelf: 'center',
    },
    avatar: {
        alignSelf: 'center',
        backgroundColor: colors.neutral100,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral200
    },
    editIcons: {
        position: 'absolute',
        bottom: 0,
        right: 2,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingY._7
    },
    inputContainer: {
        gap: spacingY._10,
    }
})