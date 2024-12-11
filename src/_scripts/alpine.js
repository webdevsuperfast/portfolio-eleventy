import Alpine from 'alpinejs'

window.Alpine = Alpine

try {
  // Start Alpine when the page is ready.
  window.addEventListener('DOMContentLoaded', () => {
    Alpine.start()
  })

  // Basic Store Example in Alpine.
  window.addEventListener('alpine:initializing', () => {
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
  })
} catch (error) {
  console.error('An error occurred while initializing Alpine:', error)
}
