import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { TransactionType } from '@/types'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function useTransactionActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectTransaction = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
        const uid = await AsyncStorage.getItem('userId')
        if (!uid) throw new Error('User not logged in')

        const { data, error: selectError } = await supabase
            .from('transaction')
            .select()
            .eq('authUID', uid)
            .order('date', { ascending: false })

        if (selectError) throw selectError

        return data
    } catch (err: any) {
        setError(err.message)
        return null
    } finally {
        setLoading(false)
    }
  }, [])


  const insertTransaction = useCallback(async (transactionInfo: TransactionType) => {
    setLoading(true)
    setError(null)

    try {
        const uid = await AsyncStorage.getItem('userId')
        if (!uid) throw new Error('User not logged in')

        const payload = {
            ...transactionInfo,
            authUID: uid,
        };

        const { data, error: insertError } = await supabase
            .from('transaction')
            .insert([payload])
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

  const updateTransaction = useCallback(async (id: string, updates: Partial<TransactionType>) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: updateError } = await supabase
        .from('transaction')
        .update(updates)
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

  const deleteTransaction = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('transaction')
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

  return { selectTransaction, insertTransaction, updateTransaction, deleteTransaction, loading, error }
}
