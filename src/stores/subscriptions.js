import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, hasValidCredentials } from '../lib/supabase'

export const useSubscriptionsStore = defineStore('subscriptions', () => {
  const subscriptions = ref([])
  const loading = ref(false)
  const error = ref(null)

  const totalMonthlySpend = computed(() => {
    return subscriptions.value.reduce((total, sub) => {
      const amount = parseFloat(sub.amount) || 0
      if (sub.billing_cycle === 'yearly') {
        return total + (amount / 12)
      }
      return total + amount
    }, 0)
  })

  const fetchSubscriptions = async () => {
    try {
      loading.value = true
      error.value = null

      if (!hasValidCredentials) {
        console.warn('Supabase not configured - using demo data')
        // Set some demo data for development
        subscriptions.value = [
          {
            id: 'demo-1',
            name: 'Netflix',
            amount: 15.99,
            billing_cycle: 'monthly',
            next_billing_date: '2024-02-15',
            tag: 'Entertainment',
            notes: 'Standard plan'
          },
          {
            id: 'demo-2',
            name: 'Spotify',
            amount: 9.99,
            billing_cycle: 'monthly',
            next_billing_date: '2024-02-10',
            tag: 'Music',
            notes: 'Premium subscription'
          }
        ]
        return
      }

      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      subscriptions.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Error fetching subscriptions:', err)
    } finally {
      loading.value = false
    }
  }

  const addSubscription = async (subscription) => {
    try {
      loading.value = true
      error.value = null

      if (!hasValidCredentials) {
        // Add to demo data
        const newSub = {
          ...subscription,
          id: 'demo-' + Date.now(),
          created_at: new Date().toISOString()
        }
        subscriptions.value.unshift(newSub)
        return
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Prepare subscription data with user_id
      const subscriptionData = {
        ...subscription,
        user_id: user.id
      }

      console.log('Attempting to insert subscription:', subscriptionData)

      const { data, error: insertError } = await supabase
        .from('subscriptions')
        .insert([subscriptionData])
        .select()

      if (insertError) {
        console.error('Supabase insert error:', insertError)
        throw insertError
      }

      if (data && data[0]) {
        subscriptions.value.unshift(data[0])
      }
    } catch (err) {
      console.error('Error adding subscription:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSubscription = async (id, updates) => {
    try {
      loading.value = true
      error.value = null

      if (!hasValidCredentials) {
        // Update demo data
        const index = subscriptions.value.findIndex(sub => sub.id === id)
        if (index !== -1) {
          subscriptions.value[index] = { ...subscriptions.value[index], ...updates }
        }
        return
      }

      const { data, error: updateError } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', id)
        .select()

      if (updateError) throw updateError

      if (data && data[0]) {
        const index = subscriptions.value.findIndex(sub => sub.id === id)
        if (index !== -1) {
          subscriptions.value[index] = data[0]
        }
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSubscription = async (id) => {
    try {
      loading.value = true
      error.value = null

      if (!hasValidCredentials) {
        // Remove from demo data
        subscriptions.value = subscriptions.value.filter(sub => sub.id !== id)
        return
      }

      const { error: deleteError } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      subscriptions.value = subscriptions.value.filter(sub => sub.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    subscriptions,
    loading,
    error,
    totalMonthlySpend,
    fetchSubscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    clearError
  }
}) 