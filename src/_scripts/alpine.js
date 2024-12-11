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
