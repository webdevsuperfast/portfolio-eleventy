// Set initial color scheme with performance optimization
let explicitelyPreferScheme = false
if (window.localStorage) {
  const themePreference = localStorage.getItem('theme')
  if (themePreference === 'dark') {
    document.documentElement.classList.add('dark')
    toggleDarkMode(true)
    explicitelyPreferScheme = 'dark'
  } else if (themePreference === 'light') {
    document.documentElement.classList.remove('dark')
    toggleDarkMode(false)
    explicitelyPreferScheme = 'light'
  }
}

if (
  explicitelyPreferScheme !== 'light' &&
  window.matchMedia('(prefers-color-scheme:dark)').matches
) {
  document.documentElement.classList.add('dark')
  toggleDarkMode(true)
}

// Performance optimization: Cache DOM query
const toggleSwitch = document.getElementById('toggle-dark-mode')

function toggleDarkMode(isDark) {
  if (toggleSwitch) {
    toggleSwitch.checked = isDark
  } else {
    console.error('Element with ID "toggle-dark-mode" not found.')
  }
}

// Performance optimization: Use passive event listeners for media query changes
window.matchMedia('(prefers-color-scheme:dark)').addEventListener(
  'change',
  (e) => {
    if (!explicitelyPreferScheme) {
      const isDark = e.matches
      document.documentElement.classList.toggle('dark', isDark)
      toggleDarkMode(isDark)
    }
  },
  { passive: true }
)
