import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

const hasAnyClass = (el, list) => list.some((c) => el.classList.contains(c))
const isSectionDarkByClass = (section) => {
  const htmlIsDark = document.documentElement.classList.contains('dark')
  const lightClasses = ['bg-white', 'bg-gray-100']
  const darkClasses = ['bg-gray-900', 'bg-gray-800']
  const darkVariantClasses = ['dark:bg-gray-900', 'dark:bg-gray-800']

  if (htmlIsDark) {
    if (hasAnyClass(section, darkVariantClasses)) return true
    if (hasAnyClass(section, darkClasses)) return true
    if (hasAnyClass(section, lightClasses)) return false
    // default in dark mode: assume dark
    return true
  } else {
    if (hasAnyClass(section, darkClasses)) return true
    if (hasAnyClass(section, lightClasses)) return false
    // default in light mode: assume light
    return false
  }
}

const init = () => {
  const button = document.getElementById('floating-social-button')
  if (!button) return

  const updateForSection = (section) => {
    if (hasAnyClass(section, ['bg-gray-100', 'dark:bg-gray-900'])) {
      button.classList.add('btn-dark')
      button.classList.remove('btn-light')
    }
    if (hasAnyClass(section, ['bg-white', 'dark:bg-gray-800'])) {
      button.classList.add('btn-light')
      button.classList.remove('btn-dark')
    }
  }

  const sections = gsap.utils.toArray('section, .section')
  if (!sections.length) return

  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => updateForSection(section),
      onEnterBack: () => updateForSection(section),
    })
  })

  // Set initial state based on the section currently in view
  const current =
    sections.find((s) => {
      const rect = s.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      const topInView = rect.top < vh * 0.6
      const bottomAfter = rect.bottom > vh * 0.4
      return topInView && bottomAfter
    }) || sections[0]

  if (current) updateForSection(current)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
