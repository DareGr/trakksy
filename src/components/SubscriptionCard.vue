<template>
  <div class="card p-6 hover:shadow-md transition-shadow duration-200">
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h4 class="text-lg font-semibold text-gray-900 mb-1">{{ subscription.name }}</h4>
        <div class="text-2xl font-bold text-primary-600 mb-2">
          ${{ parseFloat(subscription.amount).toFixed(2) }}
          <span class="text-sm font-normal text-gray-500">
            /{{ subscription.billing_cycle === 'yearly' ? 'year' : 'month' }}
          </span>
        </div>
      </div>
      
      <div class="flex space-x-2">
        <button
          @click="$emit('edit', subscription)"
          class="text-gray-400 hover:text-primary-600 transition-colors"
          title="Edit subscription"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="$emit('delete', subscription)"
          class="text-gray-400 hover:text-red-600 transition-colors"
          title="Delete subscription"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Next billing:</span>
        <span class="font-medium text-gray-900">{{ formatDate(subscription.next_billing_date) }}</span>
      </div>
      
      <div class="flex justify-between text-sm" v-if="daysUntilBilling !== null">
        <span class="text-gray-500">Days until billing:</span>
        <span :class="daysUntilBilling <= 3 ? 'text-red-600 font-medium' : 'text-gray-900'">
          {{ daysUntilBilling }} day{{ daysUntilBilling !== 1 ? 's' : '' }}
        </span>
      </div>
      
      <div v-if="subscription.billing_cycle === 'yearly'" class="flex justify-between text-sm">
        <span class="text-gray-500">Monthly equivalent:</span>
        <span class="text-gray-900">${{ (parseFloat(subscription.amount) / 12).toFixed(2) }}/month</span>
      </div>
      
      <div v-if="subscription.tag" class="mt-3">
        <span class="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
          {{ subscription.tag }}
        </span>
      </div>
      
      <div v-if="subscription.notes" class="mt-3 text-sm text-gray-600">
        {{ subscription.notes }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  subscription: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const daysUntilBilling = computed(() => {
  if (!props.subscription.next_billing_date) return null
  
  const today = new Date()
  const billingDate = new Date(props.subscription.next_billing_date)
  const diffTime = billingDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays >= 0 ? diffDays : 0
})
</script> 