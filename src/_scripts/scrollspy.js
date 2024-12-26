import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

try {
  const scrollSections = gsap.utils.toArray('.section')
  const links = gsap.utils.toArray('.nav-link')

  if (scrollSections.length !== links.length) {
    throw new Error('Number of sections does not match the number of links.')
  }

  scrollSections.forEach((section, index) => {
    const link = links[index]
    if (!link) {
      throw new Error(`No link found for section at index ${index}.`)
    }
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'top bottom',
      onEnter: () => link.classList.add('active'),
      onEnterBack: () => link.classList.add('active'),
      onLeave: () => link.classList.remove('active'),
      onLeaveBack: () => link.classList.remove('active'),
      // markers: true, // Uncomment this line for debugging
    })
  })
} catch (error) {
  console.error('Error in scrollspy.js:', error)
}
