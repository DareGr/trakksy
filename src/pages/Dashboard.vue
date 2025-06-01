<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Trakksy</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">Welcome back, {{ userEmail }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            title="Toggle dark mode"
          >
            <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          
          <router-link v-if="!authStore.hasValidCredentials" to="/login" class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            Setup Supabase
          </router-link>
          <button
            v-if="authStore.user"
            @click="authStore.logout"
            class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Demo Notice -->
    <div v-if="!authStore.hasValidCredentials" class="bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800">
      <div class="max-w-4xl mx-auto px-4 py-3">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-blue-700 dark:text-blue-300">
              <strong>Demo Mode:</strong> You're viewing sample data. 
              <router-link to="/login" class="underline font-medium">Configure Supabase</router-link> 
              to enable authentication and data persistence.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 py-8">
      <!-- Total Monthly Spend -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="text-center">
          <h2 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Total Monthly Spend</h2>
          <div class="text-4xl font-bold text-blue-600 dark:text-blue-400">
            ${{ subscriptionsStore.totalMonthlySpend.toFixed(2) }}
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {{ subscriptionsStore.subscriptions.length }} active subscription{{ subscriptionsStore.subscriptions.length !== 1 ? 's' : '' }}
          </p>
        </div>
      </div>

      <!-- Add Subscription Button -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Your Subscriptions</h3>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          + Add Subscription
        </button>
      </div>

      <!-- Subscriptions List -->
      <div v-if="subscriptionsStore.loading" class="text-center py-8">
        <div class="text-gray-500 dark:text-gray-400">Loading subscriptions...</div>
      </div>

      <div v-else-if="subscriptionsStore.subscriptions.length === 0" class="text-center py-12">
        <div class="text-gray-500 dark:text-gray-400 mb-4">No subscriptions yet</div>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Add Your First Subscription
        </button>
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SubscriptionCard
          v-for="subscription in subscriptionsStore.subscriptions"
          :key="subscription.id"
          :subscription="subscription"
          @edit="editSubscription"
          @delete="showDeleteConfirmation"
        />
      </div>
    </main>

    <!-- Add/Edit Subscription Modal -->
    <AddSubscriptionModal
      v-if="showAddModal || editingSubscription"
      :subscription="editingSubscription"
      @close="closeModal"
      @save="handleSaveSubscription"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      v-if="subscriptionToDelete"
      :title="`Delete ${subscriptionToDelete.name}?`"
      :message="`Are you sure you want to delete this subscription? This action cannot be undone.`"
      confirm-text="Delete"
      @confirm="handleDeleteConfirmation"
      @cancel="cancelDelete"
    />

    <!-- Toast Notifications -->
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :title="toast.title"
      :message="toast.message"
      :type="toast.type"
      @close="removeToast(toast.id)"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useSubscriptionsStore } from '../stores/subscriptions'
import { useServicesStore } from '../stores/services'
import { useDarkMode } from '../composables/useDarkMode'
import SubscriptionCard from '../components/SubscriptionCard.vue'
import AddSubscriptionModal from '../components/AddSubscriptionModal.vue'
import ConfirmationModal from '../components/ConfirmationModal.vue'
import Toast from '../components/Toast.vue'

const authStore = useAuthStore()
const subscriptionsStore = useSubscriptionsStore()
const servicesStore = useServicesStore()
const { isDark, toggleDarkMode } = useDarkMode()

const showAddModal = ref(false)
const editingSubscription = ref(null)
const subscriptionToDelete = ref(null)
const toasts = ref([])

const userEmail = computed(() => {
  if (!authStore.hasValidCredentials) {
    return 'Demo User'
  }
  return authStore.user?.email || 'User'
})

const editSubscription = (subscription) => {
  editingSubscription.value = subscription
}

const showDeleteConfirmation = (subscription) => {
  subscriptionToDelete.value = subscription
}

const handleDeleteConfirmation = async () => {
  if (!subscriptionToDelete.value) return
  
  try {
    await subscriptionsStore.deleteSubscription(subscriptionToDelete.value.id)
    showToast('Success', `${subscriptionToDelete.value.display_name || subscriptionToDelete.value.name} has been deleted.`, 'success')
  } catch (error) {
    showToast('Error', `Failed to delete ${subscriptionToDelete.value.display_name || subscriptionToDelete.value.name}. Please try again.`, 'error')
  } finally {
    subscriptionToDelete.value = null
  }
}

const cancelDelete = () => {
  subscriptionToDelete.value = null
}

const closeModal = () => {
  showAddModal.value = false
  editingSubscription.value = null
}

const handleSaveSubscription = async (subscriptionData) => {
  try {
    if (editingSubscription.value) {
      await subscriptionsStore.updateSubscription(editingSubscription.value.id, subscriptionData)
      showToast('Success', `${subscriptionData.name} has been updated.`, 'success')
    } else {
      await subscriptionsStore.addSubscription(subscriptionData)
      showToast('Success', `${subscriptionData.name} has been added to your subscriptions.`, 'success')
    }
    closeModal()
  } catch (error) {
    console.error('Save subscription error:', error)
    showToast('Error', `Failed to save subscription: ${error.message}`, 'error')
  }
}

const showToast = (title, message, type) => {
  const id = Date.now()
  toasts.value.push({ id, title, message, type })
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

onMounted(async () => {
  // Fetch both subscriptions and services
  await Promise.all([
    subscriptionsStore.fetchSubscriptions(),
    servicesStore.fetchServices()
  ])
})
</script> 