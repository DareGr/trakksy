<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Subscription' : 'Add New Subscription' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Service Selection -->
          <div v-if="!isEditing">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Choose Service
            </label>
            <div class="grid grid-cols-1 gap-3 mb-4">
              <!-- Custom Service Option -->
              <label class="relative cursor-pointer">
                <input
                  v-model="serviceType"
                  type="radio"
                  value="custom"
                  class="sr-only"
                />
                <div :class="[
                  'p-4 border-2 rounded-lg transition-all',
                  serviceType === 'custom' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                ]">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">Custom Service</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Enter your own service details</p>
                    </div>
                  </div>
                </div>
              </label>

              <!-- Database Services Option -->
              <label class="relative cursor-pointer">
                <input
                  v-model="serviceType"
                  type="radio"
                  value="database"
                  class="sr-only"
                />
                <div :class="[
                  'p-4 border-2 rounded-lg transition-all',
                  serviceType === 'database' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                ]">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">Popular Services</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Choose from Netflix, Spotify, and more</p>
                    </div>
                  </div>
                </div>
              </label>
            </div>

            <!-- Database Services Grid -->
            <div v-if="serviceType === 'database'" class="mb-6">
              <div v-if="servicesStore.loading" class="text-center py-4">
                <div class="text-gray-500 dark:text-gray-400">Loading services...</div>
              </div>
              <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                <button
                  v-for="service in servicesStore.services"
                  :key="service.id"
                  type="button"
                  @click="selectDatabaseService(service)"
                  :class="[
                    'p-3 border-2 rounded-lg text-left transition-all hover:border-blue-300',
                    selectedService?.id === service.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-600'
                  ]"
                >
                  <div class="flex items-center space-x-2">
                    <img 
                      :src="service.favicon_url" 
                      :alt="service.name"
                      class="w-6 h-6 rounded"
                      @error="handleImageError"
                    />
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ service.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">${{ service.suggested_price }}</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Service Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Service Name *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              :readonly="serviceType === 'database' && selectedService"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
              placeholder="e.g., Netflix, Spotify, Adobe Creative Cloud"
            />
          </div>

          <!-- Amount -->
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cost *
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
              <input
                id="amount"
                v-model="form.amount"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="15.99"
              />
            </div>
          </div>

          <!-- Billing Cycle -->
          <div>
            <label for="billing_cycle" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Billing Cycle *
            </label>
            <select
              id="billing_cycle"
              v-model="form.billing_cycle"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <!-- Next Billing Date -->
          <div>
            <label for="next_billing_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Next Billing Date *
            </label>
            <input
              id="next_billing_date"
              v-model="form.next_billing_date"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <!-- Category Tag -->
          <div>
            <label for="tag" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category (Optional)
            </label>
            <input
              id="tag"
              v-model="form.tag"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., Entertainment, Productivity, Music"
            />
          </div>

          <!-- Favicon URL (only for custom services) -->
          <div v-if="serviceType === 'custom' || isEditing">
            <label for="favicon_url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon URL (Optional)
            </label>
            <input
              id="favicon_url"
              v-model="form.favicon_url"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="https://example.com/favicon.ico"
            />
          </div>

          <!-- Notes -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              placeholder="Any additional notes about this subscription..."
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {{ isEditing ? 'Update' : 'Add' }} Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, ref } from 'vue'
import { useServicesStore } from '../stores/services'

const props = defineProps({
  subscription: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const servicesStore = useServicesStore()
const isEditing = computed(() => !!props.subscription)
const serviceType = ref('custom')
const selectedService = ref(null)

const form = reactive({
  name: '',
  amount: '',
  billing_cycle: 'monthly',
  next_billing_date: '',
  tag: '',
  notes: '',
  favicon_url: '',
  service_id: null
})

const selectDatabaseService = (service) => {
  selectedService.value = service
  form.name = service.name
  form.amount = service.suggested_price
  form.tag = service.category
  form.service_id = service.id
  // Clear favicon_url since we're using a database service
  form.favicon_url = ''
}

const handleImageError = (event) => {
  // Hide broken images
  event.target.style.display = 'none'
}

const handleSubmit = () => {
  const subscriptionData = {
    name: form.name.trim(),
    amount: parseFloat(form.amount),
    billing_cycle: form.billing_cycle,
    next_billing_date: form.next_billing_date,
    tag: form.tag || null,
    notes: form.notes.trim() || null,
    // Only include service_id if it's a database service
    service_id: serviceType.value === 'database' ? form.service_id : null,
    // Only include favicon_url for custom services
    favicon_url: serviceType.value === 'custom' || isEditing.value ? (form.favicon_url || null) : null
  }

  emit('save', subscriptionData)
}

onMounted(async () => {
  // Fetch services for the dropdown
  await servicesStore.fetchServices()

  if (props.subscription) {
    // Populate form with existing subscription data
    form.name = props.subscription.name || ''
    form.amount = props.subscription.amount || ''
    form.billing_cycle = props.subscription.billing_cycle || 'monthly'
    form.next_billing_date = props.subscription.next_billing_date || ''
    form.tag = props.subscription.tag || ''
    form.notes = props.subscription.notes || ''
    form.favicon_url = props.subscription.favicon_url || ''
    form.service_id = props.subscription.service_id || null
  } else {
    // Set default next billing date to next month
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    form.next_billing_date = nextMonth.toISOString().split('T')[0]
  }
})
</script> 