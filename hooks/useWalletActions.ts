import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { WalletType } from '@/types'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function useWalletActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const insertWallet = useCallback(async ({ name, image }: WalletType) => {
    setLoading(true)
    setError(null)

    try {
        const uid = await AsyncStorage.getItem('userId')
        if (!uid) throw new Error('User not logged in')

        const { data, error: insertError } = await supabase
            .from('wallet')
            .insert([{ uid, name, image }])
            .select()
            .single()

        if (insertError) throw insertError
        return data
    } catch (err: any) {
        setError(err.message)
        return null
    } finally {
        setLoading(false)
    }
  }, [])

  const updateWallet = useCallback(async (id: string, { name, image }: WalletType) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: updateError } = await supabase
        .from('wallet')
        .update({ name, image })
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      return data
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteWallet = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('wallet')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return { insertWallet, updateWallet, deleteWallet, loading, error }
}
