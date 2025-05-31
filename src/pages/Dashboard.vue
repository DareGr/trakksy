<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">SubTrack</h1>
          <p class="text-sm text-gray-600">Welcome back, {{ userEmail }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <router-link v-if="!authStore.hasValidCredentials" to="/login" class="btn-secondary text-sm">
            Setup Supabase
          </router-link>
          <button
            v-if="authStore.user"
            @click="authStore.logout"
            class="btn-secondary text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Demo Notice -->
    <div v-if="!authStore.hasValidCredentials" class="bg-blue-50 border-b border-blue-200">
      <div class="max-w-4xl mx-auto px-4 py-3">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-blue-700">
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
      <div class="card p-6 mb-8">
        <div class="text-center">
          <h2 class="text-lg font-medium text-gray-700 mb-2">Total Monthly Spend</h2>
          <div class="text-4xl font-bold text-primary-600">
            ${{ subscriptionsStore.totalMonthlySpend.toFixed(2) }}
          </div>
          <p class="text-sm text-gray-500 mt-2">
            {{ subscriptionsStore.subscriptions.length }} active subscription{{ subscriptionsStore.subscriptions.length !== 1 ? 's' : '' }}
          </p>
        </div>
      </div>

      <!-- Add Subscription Button -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-gray-900">Your Subscriptions</h3>
        <button
          @click="showAddModal = true"
          class="btn-primary"
        >
          + Add Subscription
        </button>
      </div>

      <!-- Subscriptions List -->
      <div v-if="subscriptionsStore.loading" class="text-center py-8">
        <div class="text-gray-500">Loading subscriptions...</div>
      </div>

      <div v-else-if="subscriptionsStore.subscriptions.length === 0" class="text-center py-12">
        <div class="text-gray-500 mb-4">No subscriptions yet</div>
        <button
          @click="showAddModal = true"
          class="btn-primary"
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
          @delete="deleteSubscription"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useSubscriptionsStore } from '../stores/subscriptions'
import SubscriptionCard from '../components/SubscriptionCard.vue'
import AddSubscriptionModal from '../components/AddSubscriptionModal.vue'

const authStore = useAuthStore()
const subscriptionsStore = useSubscriptionsStore()

const showAddModal = ref(false)
const editingSubscription = ref(null)

const userEmail = computed(() => {
  if (!authStore.hasValidCredentials) {
    return 'Demo User'
  }
  return authStore.user?.email || 'User'
})

const editSubscription = (subscription) => {
  editingSubscription.value = subscription
}

const deleteSubscription = async (subscription) => {
  if (confirm(`Are you sure you want to delete ${subscription.name}?`)) {
    try {
      await subscriptionsStore.deleteSubscription(subscription.id)
    } catch (error) {
      alert('Failed to delete subscription. Please try again.')
    }
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingSubscription.value = null
}

const handleSaveSubscription = async (subscriptionData) => {
  try {
    if (editingSubscription.value) {
      await subscriptionsStore.updateSubscription(editingSubscription.value.id, subscriptionData)
    } else {
      await subscriptionsStore.addSubscription({
        ...subscriptionData,
        user_id: authStore.user?.id || 'demo-user'
      })
    }
    closeModal()
  } catch (error) {
    alert('Failed to save subscription. Please try again.')
  }
}

onMounted(() => {
  subscriptionsStore.fetchSubscriptions()
})
</script> 