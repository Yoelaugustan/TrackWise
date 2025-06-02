import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ModalWrapper from '@/components/ModalWrapper'

import { ScrollView } from 'react-native'
import Typo from '@/components/Typo'
import Header from '@/components/Header'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Image } from 'expo-image'
import { verticalScale } from '@/utils/styling'
import Input from '@/components/Input'
import { colors, spacingX, spacingY } from '@/constants/theme'
import Button from '@/components/Button'
import { useUpdatePassword } from '@/hooks/useUpdatePassword'
import { router, useLocalSearchParams } from 'expo-router'
import * as Icons from 'phosphor-react-native'

const PasswordModal:  React.FC = () => {
    const { variant } = useLocalSearchParams<{ variant: string }>();
    const resolvedVariant: 'profile' | 'login' = variant === 'login' ? 'login' : 'profile';
    
    const passwordRef = useRef('')
    const confirmPasswordRef = useRef('')
    const emailRef = useRef('')
    const [showPass, setShowPass] = useState(false)
    const [showConfPass, setShowConfPass] = useState(false)

    const { updateUserPassword, loading: updating, error: updateError } = useUpdatePassword()
    const handleSave = async () => {
        if (
            !passwordRef.current ||
            !confirmPasswordRef.current ||
            (variant === 'login' && !emailRef.current)
        ) 
        {
            Alert.alert('User', 'Please fill all the fields');
            return;
        }

        if (passwordRef.current !== confirmPasswordRef.current) {
            Alert.alert('User', 'Passwords do not match');
            return;
        }

        try {
            const success = await updateUserPassword({
                updatedPassword: passwordRef.current,
                email: variant === 'login' ? emailRef.current : undefined,
            });
            if (success) {
            Alert.alert('Success', 'Your password has been updated.');
            }
        } catch (err) {
            Alert.alert('Error', updateError ?? 'Failed to update password');
        } finally {
            router.back();
        }
};

  return (
    <ModalWrapper>
        <ScrollView keyboardShouldPersistTaps="handled">
            <Header title='Change Password' showBackButton/>
            
            <View style={styles.container}>
                <Animated.Image 
                    style={styles.image}
                    source={require('../../assets/images/ChangePassword.jpg')}
                    resizeMode='contain'
                    entering={FadeIn.duration(1000)}
                />

                <View style={styles.input}>
                    {variant === 'login' && (
                        <View style={styles.inputContainer}>
                            <Typo color={colors.black}>Enter Your Email:</Typo>
                            <Input 
                                placeholder='Your Email'
                                onChangeText={(value) => emailRef.current = value}
                                icon={<Icons.EnvelopeSimple size={verticalScale(26)} color={colors.black} weight='bold'/>}
                            />
                        </View>
                    )}
                    <View style={styles.inputContainer}>
                        <Typo color={colors.black}>Enter New Password: </Typo>
                        <Input 
                            placeholder='New Password'
                            onChangeText={(value) => passwordRef.current = value}
                            secureTextEntry={!showPass}
                            icon={
                                <TouchableOpacity
                                    onPress={()=> setShowPass(value => !value)}
                                >
                                    {showPass
                                    ? <Icons.Eye size={verticalScale(26)} color={colors.black} weight='bold'/>
                                    : <Icons.EyeClosed size={verticalScale(26)} color={colors.black} weight='bold'/>
                                    }
                                </TouchableOpacity>
                            }
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Typo color={colors.black}>Confirm New Password:</Typo>
                        <Input 
                            containerStyle={styles.password}
                            placeholder='Confirm Password'
                            onChangeText={(value) => confirmPasswordRef.current = value}
                            secureTextEntry={!showConfPass}
                            icon={
                                <TouchableOpacity
                                    onPress={()=> setShowConfPass(value => !value)}
                                >
                                    {showConfPass
                                    ? <Icons.Eye size={verticalScale(26)} color={colors.black} weight='bold'/>
                                    : <Icons.EyeClosed size={verticalScale(26)} color={colors.black} weight='bold'/>
                                    }
                                </TouchableOpacity>
                            }
                        />
                    </View>
                </View>

                <Button onPress={handleSave}>
                    <Typo>Save Password</Typo>
                </Button>
            </View>
        </ScrollView>
    </ModalWrapper>
  )
}

export default PasswordModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        gap: spacingY._20,
        paddingHorizontal: spacingX._20,
    },
    image: {
        width: "100%",
        height: verticalScale(300),
        justifyContent: 'center'
    },
    input: {
        gap: verticalScale(20)
    },
    inputContainer: {
        gap: verticalScale(10)
    },
    password: {
        justifyContent: 'flex-start'
    }
})