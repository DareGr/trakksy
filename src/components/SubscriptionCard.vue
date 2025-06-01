<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <div class="flex items-center mb-2">
          <img 
            v-if="subscription.favicon_url"
            :src="subscription.favicon_url" 
            :alt="subscription.name"
            class="w-6 h-6 rounded mr-3"
            @error="handleImageError"
          />
          <div v-else class="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded mr-3 flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">{{ subscription.name }}</h4>
        </div>
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
          ${{ parseFloat(subscription.amount).toFixed(2) }}
          <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
            /{{ subscription.billing_cycle === 'yearly' ? 'year' : 'month' }}
          </span>
        </div>
      </div>
      
      <div class="flex space-x-2">
        <button
          @click="$emit('edit', subscription)"
          class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500 dark:text-gray-400">Next billing</span>
        <span class="text-sm font-medium text-gray-900 dark:text-white">
          {{ formatDate(subscription.next_billing_date) }}
        </span>
      </div>
      
      <div v-if="subscription.tag" class="flex justify-between items-center">
        <span class="text-sm text-gray-500 dark:text-gray-400">Category</span>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
          {{ subscription.tag }}
        </span>
      </div>
      
      <div v-if="subscription.notes" class="pt-2">
        <p class="text-sm text-gray-600 dark:text-gray-300">{{ subscription.notes }}</p>
      </div>
      
      <!-- Billing status indicator -->
      <div class="flex items-center pt-2">
        <div :class="[
          'h-2 w-2 rounded-full mr-2',
          daysUntilBilling <= 3 ? 'bg-red-500' : 
          daysUntilBilling <= 7 ? 'bg-yellow-500' : 'bg-green-500'
        ]"></div>
        <span :class="[
          'text-xs font-medium',
          daysUntilBilling <= 3 ? 'text-red-600 dark:text-red-400' : 
          daysUntilBilling <= 7 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
        ]">
          {{ daysUntilBilling === 0 ? 'Due today' : 
             daysUntilBilling === 1 ? 'Due tomorrow' : 
             `${daysUntilBilling} days until billing` }}
        </span>
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
  const today = new Date()
  const billingDate = new Date(props.subscription.next_billing_date)
  const diffTime = billingDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
})

const handleImageError = (event) => {
  // Hide broken images and show default icon
  event.target.style.display = 'none'
}
</script> 