import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase, hasValidCredentials } from '../lib/supabase'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const initializeAuth = async () => {
    try {
      // If we don't have valid credentials, skip auth initialization
      if (!hasValidCredentials) {
        console.warn('Supabase credentials not configured. Please set up your .env file.')
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        user.value = session.user
      }

      supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          user.value = session.user
        } else {
          user.value = null
        }
      })
    } catch (err) {
      console.error('Error initializing auth:', err)
    }
  }

  const login = async (email, password) => {
    try {
      loading.value = true
      error.value = null

      if (!hasValidCredentials) {
        throw new Error('Supabase is not configured. Please set up your environment variables.')
      }
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError

      user.value = data.user
      router.push('/dashboard')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (email, password) => {
    try {
      loading.value = true
      error.value = null

      if (!hasValidCredentials) {
        throw new Error('Supabase is not configured. Please set up your environment variables.')
      }
      
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password
      })

      if (authError) throw authError

      if (data.user) {
        user.value = data.user
        router.push('/dashboard')
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      loading.value = true
      
      if (hasValidCredentials) {
        await supabase.auth.signOut()
      }
      
      user.value = null
      router.push('/login')
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    user,
    loading,
    error,
    hasValidCredentials,
    initializeAuth,
    login,
    register,
    logout,
    clearError
  }
}) 