    import { Image, StyleSheet, Text, View } from 'react-native'
    import React, { useEffect } from 'react'
    import { colors } from '@/constants/theme'
    import { useRouter } from 'expo-router'
    import AsyncStorage from '@react-native-async-storage/async-storage'

    const index = () => {
        const router = useRouter()

        useEffect(() => {
            const checkAuthStatus = async () => {
                try{
                    const storedUserId = await AsyncStorage.getItem('userId')
                    if (storedUserId) {
                        router.replace('/(tabs)')
                    }
                    else{
                        setTimeout(() => {
                            router.replace('/(auth)/welcome')
                        }, 2000)
                    }
                } catch (error){
                    console.log(error)
                    setTimeout(() => {
                        router.replace('/(auth)/welcome')
                    }, 2000)
                }
            }
            checkAuthStatus();
        }, [router])

        return (
            <View style={styles.container}>
                <Image 
                    style={styles.logo}
                    resizeMode='contain'
                    source={require('../assets/images/splashImage.png')}
                />
            </View>
        )
    }

    export default index

    const styles = StyleSheet.create({
        container:{ 
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.white
        },
        logo: {
            height: '20%',
            aspectRatio: 1,
        },

    })