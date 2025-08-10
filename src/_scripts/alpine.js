import Alpine from 'alpinejs'

window.Alpine = Alpine

try {
  // Start Alpine when the page is ready.
  document.addEventListener('DOMContentLoaded', () => {
    Alpine.start()
  })

  // Basic Store Example in Alpine.
  document.addEventListener('alpine:init', () => {
    Alpine.store('nav', {
      isOpen: false,
      close() {
        this.isOpen = false
      },
      open() {
        this.isOpen = true
      },
      toggle() {
        this.isOpen = !this.isOpen
      },
    })
    Alpine.store('theme', {
      value: 'light',
      allowed: ['dark', 'light', 'cyberpunk', 'wireframe', 'lofi'],
      init() {
        const t =
          localStorage.theme ||
          (window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light')
        this.set(t)
      },
      set(name) {
        try {
          if (typeof name !== 'string' || !name) return
          if (!this.allowed.includes(name)) name = 'light'
          localStorage.theme = name
          document.documentElement.setAttribute('data-theme', name)
          document.documentElement.classList.toggle('dark', name === 'dark')
          this.value = name
        } catch (e) {
          console.error('Failed to set theme:', e)
        }
      },
    })
    Alpine.data('filterNav', () => ({
      value: '#about',
      clicked: function (e) {
        if (e.target && e.target.hash) {
          this.value = e.target.hash
        } else {
          console.error('Invalid target for navigation.')
        }
      },
    }))
    Alpine.data('filterPortfolio', () => ({
      value: 'all',
      clicked(e) {
        if (e.target && e.target.dataset && e.target.dataset.filter) {
          this.value = e.target.dataset.filter
        } else {
          console.error('Invalid target for portfolio filter.')
        }
      },
    }))
  })
} catch (error) {
  console.error('An error occurred while initializing Alpine:', error)
}
