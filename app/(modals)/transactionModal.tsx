import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
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
import { TransactionType, UserDataType, WalletType } from '@/types'
import Button from '@/components/Button'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useUpdateUserProfile } from '@/hooks/useUpdateUserProfile'
import { router, useLocalSearchParams } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';
import ImageUpload from '@/components/ImageUpload'
import { useWalletActions } from '@/hooks/useWalletActions'
import { useTransactionActions } from '@/hooks/useTransactionActions'
import CategoryPicker from '@/components/CategoryPicker'
import { incomeCategories } from '@/constants/data'
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';


const TransactionModal = () => {

    const [imageLoading, setImageLoading] = useState(false)

    const [transaction, setTransaction] = useState<TransactionType>({
        type: 'expense',
        amount: 0,
        description: "",
        date: new Date(),
        category: "",
        image: null,
        walletID: ""
    })

    const [showDatePicker, setShowDatePicker] = useState(false)

    const [wallets, setWallets] = useState<{ label: string; value: string }[]>([])

    const oldTransaction: TransactionType = useLocalSearchParams()
    
    const onDateChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || transaction.date
        setTransaction({...transaction, date: currentDate})
        setShowDatePicker(Platform.OS === 'ios' ? true : false);
    }

    useEffect(() => {
        if(oldTransaction?.id){
            setTransaction({
                type: oldTransaction?.type,
                amount: Number(oldTransaction.amount),
                description: oldTransaction.description || "",
                date: new Date(oldTransaction.date),
                category: oldTransaction.category || "",
                image: oldTransaction.image,
                walletID: oldTransaction.walletID,
            })
        }
    }, [])
    
    useEffect(() => {
        if(!oldTransaction?.id){
            if(transaction.type === 'income'){
                setTransaction((prev) => ({ ...prev, category: 'salary' }))
            }
            else{
                setTransaction((prev) => ({ ...prev, category: 'food' }))
            }
        }
    }, [transaction.type, oldTransaction?.id])

    const {
        selectTransaction,
        insertTransaction,
        updateTransaction,
        deleteTransaction,
        loading: txLoading,
        error: txError,
    } = useTransactionActions()

    const {
        selectWallet: fetchWallets,
        updateWallet,
        deleteWallet,
        loading: walletLoading,
        error: walletError,
    } = useWalletActions()

    useEffect(() => {
        const loadWallets = async () => {
            const data = await fetchWallets()
            if (data) {
                const dropdownItems = data.map((w: any) => ({
                label: `${w.name} (Rp. ${w.amount.toLocaleString('id-ID')})`,
                value: w.id,
                }))
                setWallets(dropdownItems)
            }
        }
        loadWallets()
    }, [fetchWallets])

    const onSubmit = async () => {
        const {type, amount, description, category, date, walletID, image} = transaction

        if(!walletID || !amount || !date || (type === 'expense' && !category)){
            Alert.alert('Transaction', 'Please fill all the fields')
            return
        }


        let finalImageUrl: string | null = null

        try {
            if (image && typeof image !== 'string' && image.uri) {
            setImageLoading(true)
            const uploadResult = await uploadFiletoCloudinary(
                { uri: image.uri },
                'transactions'
            )
            if (!uploadResult.success || !uploadResult.data) {
                throw new Error(uploadResult.msg || 'Failed to upload image')
            }
            finalImageUrl = uploadResult.data
            } else if (typeof image === 'string') {
                finalImageUrl = image
            }

            const payload: Partial<TransactionType> = {
                type,
                amount,
                date: (date as Date).toISOString(),   // supabase wants ISO strings
                walletID,
                image: finalImageUrl,
                description: description || null,
                category: type === 'income' ? category || 'salary' : category,
            }

            let result: any

            if (oldTransaction?.id) {
                result = await updateTransaction(oldTransaction.id, payload)
            } else {
                result = await insertTransaction(payload as TransactionType)
            }

            if (result) {
            Alert.alert('Success', oldTransaction?.id ? 'Transaction updated!' : 'Transaction added!')
            router.back()
            } else {
            Alert.alert(
                'Error',
                txError || (oldTransaction?.id ? 'Failed to update' : 'Failed to add')
            )
            }
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Something went wrong')
        } finally {
            setImageLoading(false)
        }
    }

    const onDelete = async () => {
        const result = await deleteTransaction(oldTransaction.id)
        if (result) {
            Alert.alert('Success', 'Transaction deleted!')
            router.back()
        }
    }

    const showDeleteAlert = () => {
        Alert.alert(
            "Confirm", "Are you sure you want to delete this Transaction?",[
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Delete"),
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: onDelete,
                    style: "destructive"
                }
            ]
        )
    }

    return (
    <ModalWrapper>
        
        <View style={styles.container}>
            <Header title={oldTransaction?.id ? 'Update Transaction' : 'New Transaction'} showBackButton/>

            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                {/* Type */}
                <View style={styles.typeContainer}>
                    <Button
                        onPress={() =>
                            setTransaction({ ...transaction, type: 'expense' })
                        }
                        style={[
                            styles.typeButton,
                            transaction.type === 'expense'
                            ? styles.typeButtonSelected
                            : styles.typeButtonUnselected,
                        ]}
                    >
                        <Typo
                            fontWeight='600'
                            color={
                                transaction.type === 'expense' ? colors.white : colors.black
                            }
                        >
                        Expense
                        </Typo>
                    </Button>

                    <Button
                        onPress={() =>
                            setTransaction({ ...transaction, type: 'income' })
                        }
                        style={[
                            styles.typeButton,
                            transaction.type === 'income'
                            ? styles.typeButtonSelected
                            : styles.typeButtonUnselected,
                        ]}
                    >
                        <Typo
                            fontWeight='600'
                            color={
                            transaction.type === 'income' ? colors.white : colors.black
                            }
                        >
                            Income
                        </Typo>
                    </Button>
                </View>

                {/* Categories */}
                <View>
                    <Typo size={17} color={colors.black}>Select Category</Typo>
                    <CategoryPicker
                        type={transaction.type}
                        selectedCategory={transaction.category}
                        onSelectCategory={(value) => {
                            setTransaction((prev) => ({
                                ...prev,
                                category: value
                            }))
                        }}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Typo size={17} color={colors.black}>Wallet</Typo>
                    <Dropdown
                        style={styles.dropDownContainer}
                        activeColor={'rgba(22, 163, 74, 0.3)'}
                        placeholderStyle={styles.dropDownPlaceHolder}
                        selectedTextStyle={styles.dropDownSelectedText}
                        iconStyle={styles.dropDownIcon}
                        data={wallets}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        itemTextStyle={styles.dropDownItemText}
                        itemContainerStyle={styles.dropDownItemContainer}
                        containerStyle={styles.dropDownListContainer}
                        placeholder={'Select Wallet'}
                        value={transaction.walletID}
                        onChange={(item) => {
                            setTransaction({...transaction, walletID: item.value})
                        }}    
                    />
                </View>

                {/* Date Picker */}
                <View style={styles.inputContainer}>
                    <Typo size={17} color={colors.black}>Date</Typo>
                    {
                        !showDatePicker && (
                            <Pressable 
                                style={styles.dateInput}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Typo size={14}>{(transaction.date as Date).toLocaleDateString()}</Typo>
                            </Pressable>
                        )
                    }
                    {
                        showDatePicker && (
                            <View style={Platform.OS == 'ios' && styles.iosDatePicker}>
                                <DateTimePicker
                                    themeVariant='light'
                                    value={(transaction.date as Date)}
                                    textColor={colors.black}
                                    mode='date'
                                    display={Platform.OS == 'ios' ? 'spinner' : 'default'}
                                    onChange={onDateChange}
                                />

                                {
                                    Platform.OS == 'ios' && (
                                        <TouchableOpacity
                                            style={styles.datePickerButton}
                                            onPress={() => setShowDatePicker(false)}
                                        >
                                            <Typo size={15} fontWeight={'500'}>Confirm</Typo>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                        )
                    }
                </View>
                
                {/* Amount */}
                <View style={styles.inputContainer}>
                    <Typo color={colors.black} size={17}>Amount</Typo>
                    <Input 
                        keyboardType='numeric'
                        value={transaction.amount?.toLocaleString('id-ID').toString()}
                        onChangeText={(value) => {setTransaction({...transaction, amount: Number(value.replace(/[^0-9]/g, ''))})}}
                    />
                </View>

                {/* Description */}
                <View style={styles.inputContainer}>
                    <View style={styles.flexRow}>
                        <Typo size={17} color={colors.black}>Description</Typo>
                        <Typo size={13} color={colors.neutral500}>(Optional)</Typo>
                    </View>
                    <Input 
                        value={transaction.description}
                        multiline
                        containerStyle={{
                            flexDirection: 'row',
                            height: verticalScale(100),
                            alignItems: 'flex-start',
                            paddingVertical: 15
                        }}
                        onChangeText={(value) => {setTransaction({...transaction, description: value})}}
                    />
                </View>

                {/* Receipt */}
                <View style={styles.inputContainer}>
                    <View style={styles.flexRow}>
                        <Typo size={17} color={colors.black}>Receipt</Typo>
                        <Typo size={13} color={colors.neutral500}>(Optional)</Typo>
                    </View>
                    <ImageUpload 
                        file={transaction.image}
                        onSelect={(file) => {setTransaction({...transaction, image: file})}}
                        onClear={() => {setTransaction({...transaction, image: null})}}
                        placeholder='Upload Image'
                    />
                </View>
            </ScrollView>
        </View>

        <View style={styles.footer}>
            {
                oldTransaction?.id && (
                    <Button 
                        onPress={showDeleteAlert} 
                        style={{
                            backgroundColor: colors.rose,
                            paddingHorizontal: spacingX._15
                        }}
                    >
                        <Icons.Trash size={scale(20)} color={colors.white}/>
                    </Button>
                )
            }
            <Button onPress={onSubmit} style={{flex: 1}} loading={txLoading || imageLoading || walletLoading}>
                <Typo fontWeight={'600'}>
                    {oldTransaction?.id ? 'Update' : 'Submit'}
                </Typo>
            </Button>
        </View>
    </ModalWrapper>
  )
}

export default TransactionModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingY._20
    },
    form: {
        gap: spacingY._20,
        paddingVertical: spacingY._15,
        paddingBottom: spacingY._30
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
    typeContainer: {
        gap: spacingY._10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacingY._15,
        padding: 2,
    },
    typeButtonSelected: {
        backgroundColor: colors.green,
    },
    typeButtonUnselected: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.black,
    },
    typeButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 0,
    },
    inputContainer: {
        gap: spacingY._10,
    },
    isDropDown: {
        flexDirection: 'row',
        height: verticalScale(54),
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: verticalScale(14),
        borderWidth: 1,
        color: colors.black,
        borderBlockColor: colors.neutral400,
        borderRadius: radius._17,
        borderCurve: 'continuous',
        paddingHorizontal: spacingX._15
    },
    iosDatePicker: {

    },
    androidDropDown: {
        height: verticalScale(54),
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: verticalScale(14),
        borderWidth: 1,
        color: colors.black,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        borderCurve: 'continuous',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingX._5,
    },
    dateInput: {
        flexDirection: 'row',
        height: verticalScale(54),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.neutral400,
        borderRadius: radius._17,
        borderCurve: 'continuous',
        paddingHorizontal: spacingX._15
    },
    datePickerButton: {
        backgroundColor: colors.neutral100,
        alignSelf: 'flex-end',
        padding: spacingX._7,
        marginRight: spacingX._7,
        paddingHorizontal: spacingX._15,
        borderRadius: radius._10,
    },
    dropDownContainer: {
        height: verticalScale(54),
        borderWidth: 1,
        borderColor: colors.neutral400,
        paddingHorizontal: spacingX._15,
        borderRadius: radius._15,
        borderCurve: 'continuous',
    },
    dropDownItemText: {
        color: colors.black
    },
    dropDownSelectedText: {
        color: colors.black,
        fontSize: verticalScale(14),
    },
    dropDownListContainer: {
        backgroundColor: colors.neutral100,
        borderRadius: radius._15,
        borderCurve: 'continuous',
        paddingVertical: spacingY._7,
        top: 5,
        borderColor: colors.neutral500,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 5,
    },
    dropDownPlaceHolder: {
        color: colors.neutral600
    },
    dropDownItemContainer: {
        borderRadius: radius._15,
        marginHorizontal: spacingX._7,
    },
    dropDownIcon: {
        height: verticalScale(30),
        tintColor: colors.neutral700
    }
    
})