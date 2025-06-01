<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="max-w-md w-full space-y-8">
      <!-- Dark Mode Toggle -->
      <div class="flex justify-end">
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
      </div>

      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">SubTrack</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account</p>
      </div>

      <!-- Configuration Notice -->
      <div v-if="!authStore.hasValidCredentials" class="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Supabase Configuration Required
            </h3>
            <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>To use authentication and data persistence, please:</p>
              <ol class="list-decimal list-inside mt-2 space-y-1">
                <li>Create a Supabase project</li>
                <li>Copy <code class="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">env.example</code> to <code class="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">.env</code></li>
                <li>Add your Supabase URL and API key</li>
                <li>Run the SQL schema from <code class="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">supabase-schema.sql</code></li>
              </ol>
              <p class="mt-2 text-xs">For now, you can explore the app with demo data by going to the <router-link to="/dashboard" class="underline font-medium">dashboard</router-link>.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div v-if="authStore.error" class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            {{ authStore.error }}
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your email"
              :disabled="!authStore.hasValidCredentials"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your password"
              :disabled="!authStore.hasValidCredentials"
            />
          </div>
          
          <button
            type="submit"
            :disabled="authStore.loading || !authStore.hasValidCredentials"
            class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="authStore.loading">Signing in...</span>
            <span v-else-if="!authStore.hasValidCredentials">Configure Supabase to Enable Login</span>
            <span v-else>Sign in</span>
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <router-link to="/register" class="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium">
              Sign up
            </router-link>
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Or <router-link to="/dashboard" class="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium">view demo</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useDarkMode } from '../composables/useDarkMode'

const authStore = useAuthStore()
const { isDark, toggleDarkMode } = useDarkMode()

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