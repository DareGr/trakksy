import { ref, onMounted, watch } from 'vue'

export function useDarkMode() {
  const isDark = ref(false)

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    localStorage.setItem('darkMode', isDark.value.toString())
    updateDarkMode()
  }

  const updateDarkMode = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const initializeDarkMode = () => {
    // Check if user has a preference stored
    const stored = localStorage.getItem('darkMode')
    
    if (stored !== null) {
      isDark.value = stored === 'true'
    } else {
      // Check system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    updateDarkMode()
  }

  // Watch for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = (e) => {
    // Only update if user hasn't set a manual preference
    if (localStorage.getItem('darkMode') === null) {
      isDark.value = e.matches
      updateDarkMode()
    }
  }

  onMounted(() => {
    initializeDarkMode()
    mediaQuery.addEventListener('change', handleChange)
  })

  return {
    isDark,
    toggleDarkMode
  }
} 