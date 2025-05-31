    import { Image, StyleSheet, Text, View } from 'react-native'
    import React, { useEffect } from 'react'
    import { colors } from '@/constants/theme'
    import { useRouter } from 'expo-router'
    import AsyncStorage from '@react-native-async-storage/async-storage'
    import { supabase } from '@/lib/supabase'

    const index = () => {
        const router = useRouter()

        useEffect(() => {
            const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_OUT') {
                    router.replace('/(auth)/welcome')
                }
            })

            const checkSession = async () => {
                const {data: {session}, error} = await supabase.auth.getSession()
                if (error) {
                    console.log(error)
                    setTimeout(() => {
                        router.replace('/(auth)/welcome')
                    }, 3000)
                    return
                }

                if (session) {
                    router.replace('/(tabs)')
                }
                else {
                    setTimeout(() => {
                        router.replace('/(auth)/welcome')
                    }, 3000)
                }
            }

            checkSession()

            return () => {
                listener?.subscription.unsubscribe()
            }
        }, [])

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