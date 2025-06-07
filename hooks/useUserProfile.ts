import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../lib/supabase'
import { UserProfile, UseUserProfileResult } from '@/types'

export function useUserProfile(): UseUserProfileResult {
  const [profile, setProfile] = useState<UserProfile>({
    email: null,
    username: null,
    imageUrl: null,
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const userId = await AsyncStorage.getItem('userId')
      if (!userId) {
        throw new Error('No userId found in storage (user not logged in)')
      }

      const {
        data: authRow,
        error: authError,
      } = await supabase
        .from('authentication')
        .select('email')
        .eq('id', userId)
        .maybeSingle()

      if (authError) throw authError
      if (!authRow) throw new Error('No matching authentication record found')

      const {
        data: profileRow,
        error: profileError,
      } = await supabase
        .from('profiles')
        .select('username, image')
        .eq('id', userId)
        .maybeSingle()

      if (profileError) throw profileError

      setProfile({
        email:    authRow.email,
        username: profileRow?.username ?? null,
        imageUrl: profileRow?.image    ?? null,
      })
    } catch (err: any) {
      console.log('useUserProfile error:', err.message || err)
      setError(err.message ?? 'Unknown error')
      setProfile({ email: null, username: null, imageUrl: null })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return { profile, loading, error, refetch: fetchProfile }
}
