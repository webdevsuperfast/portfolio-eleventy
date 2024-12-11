// Set initial color scheme
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

function toggleDarkMode(isDark) {
  const toggleSwitch = document.getElementById('toggle-dark-mode')
  if (toggleSwitch) {
    toggleSwitch.checked = isDark
  } else {
    console.error('Element with ID "toggle-dark-mode" not found.')
  }
}
