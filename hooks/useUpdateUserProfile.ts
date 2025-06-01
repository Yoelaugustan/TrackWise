import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'

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

export function useUpdateUserProfile(): UseUpdateUserProfileResult {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const updateUserProfile = useCallback(
    async ({ updatedEmail, updatedUsername, updatedImageUrl }: UpdateUserProfileParams) => {
      setLoading(true)
      setError(null)

      try {
        // Debug logs
        console.log('=== UPDATE PROFILE START ===')
        console.log('Parameters received:', { updatedEmail, updatedUsername, updatedImageUrl })
        
        const userId = await AsyncStorage.getItem('userId')

        if (!userId) {
          throw new Error('No userId found in storage (user not logged in)')
        }
        
        console.log('userId:', userId)

        const {
          data: authRow,
          error: authError,
        } = await supabase
          .from('authentication')
          .select('email')
          .eq('id', userId)
          .maybeSingle()

        if (authError) {
          throw authError
        }
        if (!authRow) {
          throw new Error('No matching authentication record found')
        }

        console.log('Current user email:', authRow.email)
        console.log('Email to update to:', updatedEmail)

        if (updatedEmail && updatedEmail.trim() !== authRow.email) {
          console.log('Updating email from', authRow.email, 'to', updatedEmail.trim())

          const { error: updateAuthError } = await supabase
            .from('authentication')
            .update({ email: updatedEmail.trim() })
            .eq('id', userId)
          if (updateAuthError) {
            console.log('Authentication table update error:', updateAuthError)
            throw updateAuthError
          }
          console.log('Email update in authentication table successful')
        } else if (updatedEmail) {
          console.log('Email not updated - same as current email')
        }
        
        const updates: { username?: string; image?: string } = {}
        if (updatedUsername !== undefined && updatedUsername.trim() !== '') {
          updates.username = updatedUsername.trim()
        }
        if (updatedImageUrl !== undefined) {
          updates.image = updatedImageUrl
        }

        console.log('Profile updates to apply:', updates)

        if (Object.keys(updates).length > 0) {
          const { data: updatedData, error: updateProfileError } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()

          console.log('Supabase update response:', { updatedData, updateProfileError })
          
          if (updateProfileError) {
            throw updateProfileError
          }

          console.log('Profile update successful')
        }

        setError(null)
      } catch (err: any) {
        console.log('=== UPDATE PROFILE ERROR ===')
        console.log('Error details:', err)
        console.log('Error message:', err.message || err)
        
        // More specific error messages
        let errorMessage = 'An unexpected error occurred'
        
        if (err.message?.includes('Email')) {
          errorMessage = err.message
        } else if (err.message?.includes('already registered') || err.message?.includes('already exists')) {
          errorMessage = 'This email is already registered to another account'
        } else if (err.message?.includes('invalid')) {
          errorMessage = 'Invalid email format'
        } else if (err.message) {
          errorMessage = err.message
        }
        
        setError(errorMessage)
        throw err

      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { updateUserProfile, loading, error }
}