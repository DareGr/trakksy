<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">SubTrack</h1>
        <p class="mt-2 text-gray-600">Create your account</p>
      </div>
      
      <div class="card p-8">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div v-if="authStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {{ authStore.error }}
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="input-field"
              placeholder="Enter your password (min. 6 characters)"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="input-field"
              placeholder="Confirm your password"
            />
          </div>
          
          <div v-if="passwordError" class="text-red-600 text-sm">
            {{ passwordError }}
          </div>
          
          <button
            type="submit"
            :disabled="authStore.loading || !!passwordError"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading">Creating account...</span>
            <span v-else>Create account</span>
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link to="/login" class="text-primary-600 hover:text-primary-500 font-medium">
              Sign in
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const passwordError = computed(() => {
  if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
    return 'Passwords do not match'
  }
  if (form.password && form.password.length < 6) {
    return 'Password must be at least 6 characters'
  }
  return null
})

const handleRegister = async () => {
  if (passwordError.value) return
  
  try {
    await authStore.register(form.email, form.password)
  } catch (error) {
    // Error is handled in the store
  }
}

onMounted(() => {
  authStore.clearError()
})
</script> 