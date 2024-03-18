document.addEventListener('DOMContentLoaded', () => {
  const openContactButton = document.getElementById('open-contact')
  const contactOverlay = document.getElementById('contact')

  openContactButton.addEventListener('click', (e) => {
    e.preventDefault()
    contactOverlay.classList.remove('hidden')
  })
})
