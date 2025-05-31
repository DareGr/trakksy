<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">SubTrack</h1>
        <p class="mt-2 text-gray-600">Sign in to your account</p>
      </div>

      <!-- Configuration Notice -->
      <div v-if="!authStore.hasValidCredentials" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">
              Supabase Configuration Required
            </h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>To use authentication and data persistence, please:</p>
              <ol class="list-decimal list-inside mt-2 space-y-1">
                <li>Create a Supabase project</li>
                <li>Copy <code class="bg-yellow-100 px-1 rounded">env.example</code> to <code class="bg-yellow-100 px-1 rounded">.env</code></li>
                <li>Add your Supabase URL and API key</li>
                <li>Run the SQL schema from <code class="bg-yellow-100 px-1 rounded">supabase-schema.sql</code></li>
              </ol>
              <p class="mt-2 text-xs">For now, you can explore the app with demo data by going to the <router-link to="/dashboard" class="underline font-medium">dashboard</router-link>.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
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
              :disabled="!authStore.hasValidCredentials"
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
              class="input-field"
              placeholder="Enter your password"
              :disabled="!authStore.hasValidCredentials"
            />
          </div>
          
          <button
            type="submit"
            :disabled="authStore.loading || !authStore.hasValidCredentials"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading">Signing in...</span>
            <span v-else-if="!authStore.hasValidCredentials">Configure Supabase to Enable Login</span>
            <span v-else>Sign in</span>
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <router-link to="/register" class="text-primary-600 hover:text-primary-500 font-medium">
              Sign up
            </router-link>
          </p>
          <p class="text-sm text-gray-500 mt-2">
            Or <router-link to="/dashboard" class="text-primary-600 hover:text-primary-500 font-medium">view demo</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  try {
    await authStore.login(form.email, form.password)
  } catch (error) {
    // Error is handled in the store
  }
}

onMounted(() => {
  authStore.clearError()
})
</script> 