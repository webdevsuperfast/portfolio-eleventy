document.addEventListener('DOMContentLoaded', () => {
  const openContactButton = document.getElementById('open-contact')
  const contactOverlay = document.getElementById('contact')
  const closeContactButton = document.getElementById('close-contact')

  openContactButton.addEventListener('click', (e) => {
    e.preventDefault()
    contactOverlay.classList.remove('hidden')
  })

  closeContactButton.addEventListener('click', (e) => {
    e.preventDefault()
    contactOverlay.classList.add('hidden')
    console.log('test')
  })
})
