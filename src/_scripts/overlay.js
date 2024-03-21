document.addEventListener('DOMContentLoaded', () => {
  const openContactButton = document.getElementById('open-contact')
  const contactOverlay = document.getElementById('contact')
  const closeContactButton = document.getElementById('close-contact')

  let scriptElement // Variable to store the script element

  const createScript = (src) => {
    const script = document.createElement('script')

    script.src = src
    script.async = true
    script.defer = true
    return script
  }

  const toggleContactOverlay = (e) => {
    e.preventDefault()

    contactOverlay.classList.toggle('hidden')
    contactOverlay.classList.toggle('flex')

    if (contactOverlay.classList.contains('flex')) {
      // Load script if overlay is opened
      scriptElement = createScript(
        'https://challenges.cloudflare.com/turnstile/v0/api.js'
      )
      document.head.appendChild(scriptElement)
    } else {
      // Remove script if overlay is closed
      if (scriptElement) {
        scriptElement.remove()
        scriptElement = null // Clear reference
      }
    }
  }

  openContactButton.addEventListener('click', toggleContactOverlay)
  closeContactButton.addEventListener('click', toggleContactOverlay)
})
