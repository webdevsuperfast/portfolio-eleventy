document.addEventListener('DOMContentLoaded', () => {
  const openContactButton = document.getElementById('open-contact')
  const contactOverlay = document.getElementById('contact')
  const closeContactButton = document.getElementById('close-contact')

  const toggleContactOverlay = (e) => {
    e.preventDefault()

    contactOverlay.classList.toggle('hidden')
    contactOverlay.classList.toggle('flex')
  }

  openContactButton.addEventListener('click', toggleContactOverlay)
  closeContactButton.addEventListener('click', toggleContactOverlay)
})
