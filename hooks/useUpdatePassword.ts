import { supabase } from "@/lib/supabase";
import { UpdatePassword, UpdatePasswordResult } from "@/types";
import { useCallback, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";

export function useUpdatePassword(): UpdatePasswordResult {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const updateUserPassword = useCallback(
        async ({ updatedPassword, email }: UpdatePassword): Promise<boolean> => {
            setLoading(true)
            setError(null)

            try {
                let userId: string | null = null
                let currentPassword: string | null = null

                if (email) {
                    const { data: userRow, error: emailError } = await supabase
                        .from('authentication')
                        .select('id, password')
                        .eq('email', email)
                        .maybeSingle();

                    if (emailError) throw emailError;

                    if (!userRow) {
                        Alert.alert('Error', 'Email not found');
                        return false;
                    }

                    userId = userRow.id;
                    currentPassword = userRow.password;
                } else {
                    userId = await AsyncStorage.getItem('userId');
                    if (!userId) throw new Error('No userId found in storage');

                    const { data: authRow, error: authError } = await supabase
                        .from('authentication')
                        .select('password')
                        .eq('id', userId)
                        .maybeSingle();

                    if (authError) throw authError;
                    if (!authRow) throw new Error('No matching authentication record found');

                    currentPassword = authRow.password;
                }

                if(updatedPassword === currentPassword) {
                    Alert.alert('Error', 'Password cannot be the same as before')
                    return false
                }

                const { error: updateError } = await supabase
                    .from('authentication')
                    .update({ password: updatedPassword })
                    .eq('id', userId);

                if (updateError) throw updateError;

                console.log('Password updated successfully');
                return true;
            } catch (err: any) {
                setError(err.message || "An unknown error occurred");
                throw err;
            } finally {
                setLoading(false);
            }
            
            return false;
        }, 
    [])

    return { updateUserPassword, loading, error };
} 