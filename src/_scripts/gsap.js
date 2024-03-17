import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(Flip)

const allAnchor = document.querySelector('#all'),
  filters = gsap.utils.toArray('.filter'),
  items = gsap.utils.toArray('.portfolio')

function updateFilters() {
  const state = Flip.getState(items), // get the current state
    activeFilters = filters
      .filter((anchor) => anchor.classList.contains('active'))
      .map((anchor) => '.' + anchor.id),
    matches = activeFilters.length
      ? gsap.utils.toArray(activeFilters.join(','))
      : activeFilters

  // adjust the display property of each item ("none" for filtered ones, "inline-flex" for matching ones)
  items.forEach(
    (item) =>
      (item.style.display =
        matches.indexOf(item) === -1 ? 'none' : 'inline-block')
  )

  // animate from the previous state
  Flip.from(state, {
    duration: 0.5,
    scale: true,
    absolute: true,
    ease: 'power1.inOut',
    onEnter: (elements) =>
      gsap.fromTo(
        elements,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5 }
      ),
    onLeave: (elements) =>
      gsap.to(elements, { opacity: 0, scale: 0, duration: 0.5 }),
  })

  // Update the all anchor tag:
  allAnchor.classList.add('active', matches.length === items.length)
}

filters.forEach((anchor) =>
  anchor.addEventListener('click', function () {
    filters.forEach((otherAnchor) => {
      if (otherAnchor !== this) {
        otherAnchor.classList.remove('active')
      }
    })
    this.classList.add('active')
    updateFilters()
  })
)

allAnchor.addEventListener('click', function () {
  filters.forEach((anchor) =>
    anchor.classList.toggle('active', this.classList.contains('active'))
  )
  updateFilters()
})
