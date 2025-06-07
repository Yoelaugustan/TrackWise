import { Href } from "expo-router"
import { Icon } from "phosphor-react-native"
import React, { ReactNode } from "react"
import {
    ActivityIndicator,
    ActivityIndicatorProps,
    ImageStyle,
    PressableProps,
    StyleProp,
    TextInput,
    TextInputProps,
    TextProps,
    TextStyle,
    TouchableOpacityProps,
    ViewStyle,
} from "react-native"

export type ScreenWrapperProps = {
    style?: ViewStyle;
    children: React.ReactNode;
    bg?: string;
}

export type ModalWrapperProps = {
    style?: ViewStyle;
    children: React.ReactNode;
    bg?: string;
}

export type accountOptionType = {
    title: String;
    icon: React.ReactNode;
    bgColor: string;
    routeName?: any;
}

export type TypoProps = {
    size?: number;
    color?: string;
    fontWeight?: TextStyle["fontWeight"];
    children: any | null;
    style?: StyleProp<TextStyle>;
    textProps?: TextProps;
}

export type IconComponent = React.ComponentType<{
    height?: number;
    width?: number;
    strokeWidth?: number;
    color?: string;
    fill?: string;
}>

export type IconProps = {
    name: string;
    color?: string;
    size?: number;
    strokeWidth?: number;
    fill?: string;
}

export type HeaderProps = {
    title?: string;
    style?: ViewStyle;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    showBackButton?: boolean;
}

export type BackButtonProps = {
    style?: ViewStyle;
    iconSize?: number;
}

export type TransactionType = {
    id?: string;
    type: string;
    amount: number;
    category?: string;
    date: Date | string;
    description?: string;
    image?: any;
    authUID?: string;
    walletID: string;
}

export type CategoryType = {
    label: string;
    value: string;
    icon: Icon;
    bgColor: string;
}

export type ExpenseCategoriesType = {
    [key: string]: CategoryType;
}

export type IncomeCategoriesType = {
    [key: string]: CategoryType;
}

export type TransactionListType = {
    data: TransactionType[];
    title?: string;
    loading?: boolean;
}

export type TransactionItemProps = {
    item: TransactionType;
    index: number;
    handleClick: Function;
}

export interface InputProps extends TextInputProps {
    icon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    inputRef?: React.RefObject<TextInput>;
}

export interface CustomButtonProps extends TouchableOpacityProps {
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    loading?: boolean;
    children: React.ReactNode;
}

export type ImageUploadProps = {
    file?: any;
    onSelect: (file: any) => void;
    onClear: () => void;
    containerStyle?: ViewStyle;
    imageStyle?: ViewStyle;
    placeholder?: string;
}

export type UserType = {
    uid?: string;
    email?: string | null;
    name: string | null;
    image?: any;
} | null

export type UserDataType = {
    name: string;
    image?: any;
    email: string;
}

export type ResponseType = {
    success: boolean;
    data?: any;
    msg?: string;
}

export type WalletType = {
    id?: string;
    name: string;
    amount?: number;
    totalIncome?: number;
    totalExpense?: number;
    image: any;
    uid?: string;
    created?: Date;
}

export interface UserProfile {
    email: string | null
    username: string | null
    imageUrl: string | null
}

export interface UseUserProfileResult {
    profile: UserProfile
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
}

export interface UpdateUserProfileParams {
    updatedEmail?: string
    updatedUsername?: string
    updatedImageUrl?: string
}

export interface UseUpdateUserProfileResult {
    updateUserProfile: (params: UpdateUserProfileParams) => Promise<void>
    loading: boolean
    error: string | null
}

export interface UpdatePassword {
    updatedPassword?: string
    email?: string
}

export interface UpdatePasswordResult {
    updateUserPassword: (params: UpdatePassword) => Promise<boolean>
    loading: boolean
    error: string | null
}

export interface CategoryPickerProps {
    type: 'expense' | 'income'
    selectedCategory: string | null
    onSelectCategory: (value: string) => void
    containerStyle?: StyleProp<ViewStyle>
}

export type DailyTransactionListProps = {
    transactions?: TransactionType[]
    loading?: boolean
}