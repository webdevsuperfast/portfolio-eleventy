import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

document.addEventListener('DOMContentLoaded', () => {
  const openContactButton = document.getElementById('open-contact')
  const contactOverlay = document.getElementById('contact')

  let scriptElement // Variable to store the script element
  let contactObserver // IntersectionObserver reference
  let hasBeenInView = false // Track if contact has been visible at least once

  const createScript = (src) => {
    const script = document.createElement('script')

    script.src = src
    script.async = true
    script.defer = true
    return script
  }

  const toggleContactOverlay = (e) => {
    e.preventDefault()

    // Determine target state and explicitly set classes
    const willShow = !contactOverlay.classList.contains('flex')
    if (willShow) {
      contactOverlay.classList.remove('hidden')
      contactOverlay.classList.add('flex')
    } else {
      contactOverlay.classList.remove('flex')
      contactOverlay.classList.add('hidden')
    }

    if (willShow) {
      // Load script if overlay is opened
      scriptElement = createScript(
        'https://challenges.cloudflare.com/turnstile/v0/api.js'
      )
      document.head.appendChild(scriptElement)

      // Smooth scroll to the contact section using GSAP ScrollToPlugin
      // Wait a frame so layout reflects the new visibility before measuring
      requestAnimationFrame(() => {
        gsap.to(window, {
          duration: 0.8,
          ease: 'power2.out',
          scrollTo: {
            y: contactOverlay,
            autoKill: true,
            // small offset to account for sticky headers; tweak as needed
            offsetY: 16,
          },
        })

        // Fallback for any reason GSAP scroll doesn’t fire
        setTimeout(() => {
          try {
            contactOverlay.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          } catch {}
        }, 50)
      })

      // Observe when contact goes out of view to auto-hide
      if (typeof IntersectionObserver !== 'undefined') {
        // Clean up an existing observer if any
        if (contactObserver) {
          contactObserver.disconnect()
        }
        // Reset view tracker on open
        hasBeenInView = false
        contactObserver = new IntersectionObserver(
          (entries) => {
            const entry = entries[0]
            // Mark as seen once it is intersecting
            if (entry.isIntersecting) {
              hasBeenInView = true
              return
            }

            // Only hide after it has been in view at least once
            if (!entry.isIntersecting && hasBeenInView) {
              // Hide and cleanup when section leaves the viewport
              contactOverlay.classList.add('hidden')
              contactOverlay.classList.remove('flex')

              if (scriptElement) {
                scriptElement.remove()
                scriptElement = null
              }

              contactObserver.disconnect()
              contactObserver = null
            }
          },
          {
            root: null,
            threshold: 0.2, // if <20% visible, consider it "not in view"
          }
        )
        contactObserver.observe(contactOverlay)
      }
    } else {
      // Remove script if overlay is closed
      if (scriptElement) {
        scriptElement.remove()
        scriptElement = null // Clear reference
      }

      if (contactObserver) {
        contactObserver.disconnect()
        contactObserver = null
      }
    }
  }

  openContactButton.addEventListener('click', toggleContactOverlay)
})
