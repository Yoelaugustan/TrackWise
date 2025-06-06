import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { ImageUploadProps } from '@/types'
import * as Icons from 'phosphor-react-native'
import { colors, radius } from '@/constants/theme'
import Typo from './Typo'
import { scale, verticalScale } from '@/utils/styling'
import { Image } from 'expo-image'
import { getFilePath } from '@/services/imageServices'
import * as ImagePicker from 'expo-image-picker';

const ImageUpload = ({
    file = null,
    onSelect,
    onClear,
    containerStyle,
    imageStyle,
    placeholder = ""
}: ImageUploadProps) => {
    const [uploadingImage, setUploadingImage] = useState(false)
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        aspect: [4, 3],
        quality: 0.5,
        });

        console.log(result.assets[0]);

        if (!result.canceled) {
            onSelect(result.assets[0])
        }
    }
  return (
    <View>
        {
            !file && (
                <TouchableOpacity 
                    style={[styles.inputContainer, containerStyle && containerStyle]}
                    onPress={pickImage}
                >
                    <Icons.UploadSimple color={colors.black}/>
                    {placeholder && <Typo size={15}>{placeholder}</Typo>}
                </TouchableOpacity>
            )
        }

        {
            file && (
                <View style={[styles.image, imageStyle && imageStyle]}>
                    <Image 
                        style={{flex: 1}}
                        source={getFilePath(file)}
                        contentFit='cover'
                        transition={100}
                    />
                    <TouchableOpacity style={styles.deleteIcon} onPress={onClear}>
                        <Icons.XCircle size={24} weight='fill' color={colors.neutral800}/>
                    </TouchableOpacity>
                </View>
            )
        }
    </View>
  )
}

export default ImageUpload

const styles = StyleSheet.create({
    inputContainer: {
        height: verticalScale(54),
        borderRadius: radius._15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderColor: colors.black,
        borderWidth: 1
    },
    image: {
        height: scale(365),
        width: scale(365),
        borderRadius: radius._15,
        borderCurve: 'continuous',
        overflow: 'hidden'
    },
    deleteIcon: {
        position: 'absolute',
        top: scale(6),
        right: scale(6),
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5,
    }
})