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
            notes: 'Standard plan',
            favicon_url: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico',
            service_id: null
          },
          {
            id: 'demo-2',
            name: 'Spotify',
            amount: 9.99,
            billing_cycle: 'monthly',
            next_billing_date: '2024-02-10',
            tag: 'Music',
            notes: 'Premium subscription',
            favicon_url: 'https://open.spotify.com/favicon.ico',
            service_id: null
          },
          {
            id: 'demo-3',
            name: 'Adobe Creative Cloud',
            amount: 52.99,
            billing_cycle: 'monthly',
            next_billing_date: '2024-03-01',
            tag: 'Productivity',
            notes: 'All apps plan',
            favicon_url: 'https://www.adobe.com/favicon.ico',
            service_id: null
          }
        ]
        return
      }

      // First fetch subscriptions
      const { data: subsData, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      // Then fetch services separately
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')

      if (servicesError) {
        console.warn('Could not fetch services:', servicesError.message)
      }

      // Create a services lookup map
      const servicesMap = (servicesData || []).reduce((map, service) => {
        map[service.id] = service
        return map
      }, {})

      // Transform data to include service information
      subscriptions.value = (subsData || []).map(sub => {
        const service = sub.service_id ? servicesMap[sub.service_id] : null
        return {
          ...sub,
          // Use service data if available, otherwise use subscription's custom data
          display_name: service?.name || sub.name,
          display_favicon: service?.favicon_url || sub.favicon_url,
          display_category: service?.category || sub.tag,
          service_data: service
        }
      })
    } catch (err) {
      error.value = err.message
      console.error('Error fetching subscriptions:', err)
    } finally {
      loading.value = false
    }
  }

  const addSubscription = async (subscriptionData) => {
    try {
      loading.value = true
      error.value = null

      if (!hasValidCredentials) {
        // Add to demo data
        const newSub = {
          ...subscriptionData,
          id: 'demo-' + Date.now(),
          created_at: new Date().toISOString(),
          service_id: null
        }
        subscriptions.value.unshift(newSub)
        return
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Prepare subscription data with user_id, removing null/empty values
      const finalSubscriptionData = {
        user_id: user.id,
        name: subscriptionData.name,
        amount: subscriptionData.amount,
        billing_cycle: subscriptionData.billing_cycle,
        next_billing_date: subscriptionData.next_billing_date
      }

      // Only add optional fields if they have values
      if (subscriptionData.tag) finalSubscriptionData.tag = subscriptionData.tag
      if (subscriptionData.notes) finalSubscriptionData.notes = subscriptionData.notes
      if (subscriptionData.service_id) finalSubscriptionData.service_id = subscriptionData.service_id
      
      // Only add favicon_url if it exists and has a value (for custom services)
      if (subscriptionData.favicon_url) {
        finalSubscriptionData.favicon_url = subscriptionData.favicon_url
      }

      console.log('Attempting to insert subscription:', finalSubscriptionData)

      const { data, error: insertError } = await supabase
        .from('subscriptions')
        .insert([finalSubscriptionData])
        .select()

      if (insertError) {
        console.error('Supabase insert error:', insertError)
        throw insertError
      }

      if (data && data[0]) {
        // If there's a service_id, fetch the service data
        let serviceData = null
        if (data[0].service_id) {
          const { data: service } = await supabase
            .from('services')
            .select('*')
            .eq('id', data[0].service_id)
            .single()
          serviceData = service
        }

        const transformedSub = {
          ...data[0],
          display_name: serviceData?.name || data[0].name,
          display_favicon: serviceData?.favicon_url || data[0].favicon_url,
          display_category: serviceData?.category || data[0].tag,
          service_data: serviceData
        }
        subscriptions.value.unshift(transformedSub)
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

      // Prepare update data, removing null/empty values
      const updateData = {}
      
      if (updates.name !== undefined) updateData.name = updates.name
      if (updates.amount !== undefined) updateData.amount = updates.amount
      if (updates.billing_cycle !== undefined) updateData.billing_cycle = updates.billing_cycle
      if (updates.next_billing_date !== undefined) updateData.next_billing_date = updates.next_billing_date
      if (updates.tag !== undefined) updateData.tag = updates.tag
      if (updates.notes !== undefined) updateData.notes = updates.notes
      if (updates.service_id !== undefined) updateData.service_id = updates.service_id
      
      // Only add favicon_url if it's provided and has a value
      if (updates.favicon_url !== undefined && updates.favicon_url) {
        updateData.favicon_url = updates.favicon_url
      }

      const { data, error: updateError } = await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('id', id)
        .select()

      if (updateError) throw updateError

      if (data && data[0]) {
        // If there's a service_id, fetch the service data
        let serviceData = null
        if (data[0].service_id) {
          const { data: service } = await supabase
            .from('services')
            .select('*')
            .eq('id', data[0].service_id)
            .single()
          serviceData = service
        }

        const transformedSub = {
          ...data[0],
          display_name: serviceData?.name || data[0].name,
          display_favicon: serviceData?.favicon_url || data[0].favicon_url,
          display_category: serviceData?.category || data[0].tag,
          service_data: serviceData
        }
        const index = subscriptions.value.findIndex(sub => sub.id === id)
        if (index !== -1) {
          subscriptions.value[index] = transformedSub
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