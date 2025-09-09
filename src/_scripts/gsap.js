import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(Flip)

// Performance optimization: Cache DOM queries
const allAnchor = document.querySelector('#all'),
  filters = gsap.utils.toArray('.filter'),
  items = gsap.utils.toArray('.portfolio')

// Performance optimization: Use will-change for better animation performance
function updateFilters() {
  // Add will-change before animation
  gsap.set(items, { willChange: 'transform, opacity' })

  const state = Flip.getState(items), // get the current state
    activeFilters = filters
      .filter((anchor) => anchor.classList.contains('active'))
      .map((anchor) => '.' + anchor.id),
    matches = activeFilters.length
      ? gsap.utils.toArray(activeFilters.join(','))
      : activeFilters

  // Optimize display property changes
  items.forEach(
    (item) =>
      (item.style.display =
        matches.indexOf(item) === -1 ? 'none' : 'inline-block')
  )

  // animate from the previous state with hardware acceleration
  Flip.from(state, {
    duration: 0.5,
    scale: true,
    absolute: true,
    ease: 'power1.inOut',
    // Use transform3d for hardware acceleration
    force3D: true,
    onEnter: (elements) =>
      gsap.fromTo(
        elements,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5 }
      ),
    onLeave: (elements) =>
      gsap.to(elements, { opacity: 0, scale: 0, duration: 0.5 }),
    onComplete: () => {
      // Remove will-change after animation completes
      gsap.set(items, { willChange: 'auto' })
    },
  })

  // Update the all anchor tag:
  allAnchor.classList.add('active', matches.length === items.length)
}

// Performance optimization: Use passive event listeners for better scroll performance
filters.forEach((anchor) =>
  anchor.addEventListener(
    'click',
    function () {
      filters.forEach((otherAnchor) => {
        if (otherAnchor !== this) {
          otherAnchor.classList.remove('active')
        }
      })
      this.classList.add('active')
      updateFilters()
    },
    { passive: true }
  )
)

allAnchor.addEventListener(
  'click',
  function () {
    filters.forEach((anchor) =>
      anchor.classList.toggle('active', this.classList.contains('active'))
    )
    updateFilters()
  },
  { passive: true }
)
