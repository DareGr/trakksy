<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ isEditing ? 'Edit Subscription' : 'Add New Subscription' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Service Name *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="input-field"
              placeholder="e.g., Netflix, Spotify, Adobe Creative Cloud"
            />
          </div>

          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700 mb-2">
              Cost *
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500">$</span>
              <input
                id="amount"
                v-model="form.amount"
                type="number"
                step="0.01"
                min="0"
                required
                class="input-field pl-8"
                placeholder="15.99"
              />
            </div>
          </div>

          <div>
            <label for="billing_cycle" class="block text-sm font-medium text-gray-700 mb-2">
              Billing Cycle *
            </label>
            <select
              id="billing_cycle"
              v-model="form.billing_cycle"
              required
              class="input-field"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label for="next_billing_date" class="block text-sm font-medium text-gray-700 mb-2">
              Next Billing Date *
            </label>
            <input
              id="next_billing_date"
              v-model="form.next_billing_date"
              type="date"
              required
              class="input-field"
            />
          </div>

          <div>
            <label for="tag" class="block text-sm font-medium text-gray-700 mb-2">
              Category (Optional)
            </label>
            <select
              id="tag"
              v-model="form.tag"
              class="input-field"
            >
              <option value="">Select a category</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Productivity">Productivity</option>
              <option value="Health & Fitness">Health & Fitness</option>
              <option value="Education">Education</option>
              <option value="News & Media">News & Media</option>
              <option value="Cloud Storage">Cloud Storage</option>
              <option value="Software">Software</option>
              <option value="Music">Music</option>
              <option value="Gaming">Gaming</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="3"
              class="input-field resize-none"
              placeholder="Any additional notes about this subscription..."
            ></textarea>
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 btn-primary"
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
import { reactive, computed, onMounted } from 'vue'

const props = defineProps({
  subscription: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const isEditing = computed(() => !!props.subscription)

const form = reactive({
  name: '',
  amount: '',
  billing_cycle: 'monthly',
  next_billing_date: '',
  tag: '',
  notes: ''
})

const handleSubmit = () => {
  const subscriptionData = {
    name: form.name.trim(),
    amount: parseFloat(form.amount),
    billing_cycle: form.billing_cycle,
    next_billing_date: form.next_billing_date,
    tag: form.tag || null,
    notes: form.notes.trim() || null
  }

  emit('save', subscriptionData)
}

onMounted(() => {
  if (props.subscription) {
    // Populate form with existing subscription data
    form.name = props.subscription.name || ''
    form.amount = props.subscription.amount || ''
    form.billing_cycle = props.subscription.billing_cycle || 'monthly'
    form.next_billing_date = props.subscription.next_billing_date || ''
    form.tag = props.subscription.tag || ''
    form.notes = props.subscription.notes || ''
  } else {
    // Set default next billing date to next month
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    form.next_billing_date = nextMonth.toISOString().split('T')[0]
  }
})
</script> 