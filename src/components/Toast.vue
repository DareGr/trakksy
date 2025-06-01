<template>
  <transition
    enter-active-class="transition ease-out duration-300 transform"
    enter-from-class="opacity-0 scale-95 translate-y-8"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition ease-in duration-200 transform"
    leave-from-class="opacity-100 scale-100 translate-y-0"
    leave-to-class="opacity-0 scale-95 translate-y-8"
  >
    <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-4">
      <div class="pointer-events-auto">
        <div :class="[
          'relative max-w-sm w-full rounded-xl shadow-xl border backdrop-blur-sm',
          type === 'success' ? 'bg-green-50/95 dark:bg-green-900/95 border-green-200 dark:border-green-700' :
          type === 'error' ? 'bg-red-50/95 dark:bg-red-900/95 border-red-200 dark:border-red-700' :
          'bg-blue-50/95 dark:bg-blue-900/95 border-blue-200 dark:border-blue-700'
        ]">
          <!-- Progress bar -->
          <div 
            v-if="duration > 0"
            :class="[
              'absolute top-0 left-0 h-1 rounded-t-xl transition-all duration-100 ease-linear',
              type === 'success' ? 'bg-green-400' :
              type === 'error' ? 'bg-red-400' : 'bg-blue-400'
            ]"
            :style="{ width: `${progress}%` }"
          ></div>

          <div class="p-6">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <!-- Success Icon -->
                <div v-if="type === 'success'" class="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-800">
                  <svg class="w-6 h-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <!-- Error Icon -->
                <div v-else-if="type === 'error'" class="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-800">
                  <svg class="w-6 h-6 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <!-- Info Icon -->
                <div v-else class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div class="ml-4 flex-1">
                <h4 :class="[
                  'text-base font-semibold',
                  type === 'success' ? 'text-green-800 dark:text-green-200' :
                  type === 'error' ? 'text-red-800 dark:text-red-200' :
                  'text-blue-800 dark:text-blue-200'
                ]">
                  {{ title }}
                </h4>
                <p v-if="message" :class="[
                  'mt-1 text-sm',
                  type === 'success' ? 'text-green-700 dark:text-green-300' :
                  type === 'error' ? 'text-red-700 dark:text-red-300' :
                  'text-blue-700 dark:text-blue-300'
                ]">
                  {{ message }}
                </p>
              </div>
              
              <div class="ml-4 flex-shrink-0">
                <button
                  @click="close"
                  :class="[
                    'rounded-lg p-1.5 inline-flex items-center justify-center text-sm transition-colors',
                    type === 'success' ? 'text-green-600 hover:text-green-800 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-200 dark:hover:bg-green-800' :
                    type === 'error' ? 'text-red-600 hover:text-red-800 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-200 dark:hover:bg-red-800' :
                    'text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-200 dark:hover:bg-blue-800'
                  ]"
                >
                  <span class="sr-only">Close</span>
                  <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['close'])

const show = ref(true)
const progress = ref(100)
let progressInterval = null
let closeTimeout = null

const close = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
  if (closeTimeout) {
    clearTimeout(closeTimeout)
  }
  show.value = false
  setTimeout(() => emit('close'), 200)
}

onMounted(() => {
  if (props.duration > 0) {
    // Animate progress bar
    const step = 100 / (props.duration / 50)
    progressInterval = setInterval(() => {
      progress.value -= step
      if (progress.value <= 0) {
        close()
      }
    }, 50)

    // Auto close
    closeTimeout = setTimeout(close, props.duration)
  }
})

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
  if (closeTimeout) {
    clearTimeout(closeTimeout)
  }
})
</script> 