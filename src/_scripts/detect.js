// set initial color scheme

let explicitelyPreferScheme = false
if (window.localStorage) {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark')
    document.getElementById('toggle-dark-mode').checked = true
    explicitelyPreferScheme = 'dark'
  } else if (localStorage.getItem('theme') === 'light') {
    document.documentElement.classList.remove('dark')
    document.getElementById('toggle-dark-mode').checked = false
    explicitelyPreferScheme = 'light'
  }
}

if (
  explicitelyPreferScheme !== 'light' &&
  window.matchMedia('(prefers-color-scheme:dark)').matches
) {
  document.documentElement.classList.add('dark')
  document.getElementById('toggle-dark-mode').checked = true
}
