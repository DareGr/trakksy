import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase, hasValidCredentials } from '../lib/supabase'
import { predefinedServices } from '../data/predefinedServices'

export const useServicesStore = defineStore('services', () => {
  const services = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchServices = async () => {
    try {
      loading.value = true
      error.value = null

      if (!hasValidCredentials) {
        console.warn('Supabase not configured - using static services data')
        services.value = predefinedServices
        return
      }

      const { data, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true })

      if (fetchError) throw fetchError

      services.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Error fetching services:', err)
      // Fallback to static data on error
      services.value = predefinedServices
    } finally {
      loading.value = false
    }
  }

  const addService = async (serviceData) => {
    try {
      loading.value = true
      error.value = null

      if (!hasValidCredentials) {
        throw new Error('Database not configured')
      }

      const { data, error: insertError } = await supabase
        .from('services')
        .insert([serviceData])
        .select()

      if (insertError) throw insertError

      if (data && data[0]) {
        services.value.push(data[0])
        // Sort services alphabetically
        services.value.sort((a, b) => a.name.localeCompare(b.name))
      }

      return data[0]
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
    services,
    loading,
    error,
    fetchServices,
    addService,
    clearError
  }
}) 