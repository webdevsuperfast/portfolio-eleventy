import Shuffle from 'shufflejs'

const collectionsContainer = document.querySelector('.collections')
const shuffleInstance = new Shuffle(collectionsContainer, {
  itemSelector: '.portfolio',
  sizer: '.items-sizer',
  delimiter: ',',
})

const filters = document.querySelector('.filters')
const filterItems = filters.children

let activeButton = null

for (const button of filterItems) {
  button.addEventListener('click', (evt) => {
    const btn = evt.currentTarget
    const isAlreadyActive = btn === activeButton

    if (!isAlreadyActive) {
      if (activeButton) {
        activeButton.classList.remove('active')
      }
      btn.classList.add('active')
      activeButton = btn
    } else {
      btn.classList.remove('active')
      activeButton = null
    }

    const filterGroup = isAlreadyActive
      ? shuffleInstance.ALL_ITEMS
      : btn.getAttribute('data-filter')
    shuffleInstance.filter(filterGroup)
  })
}
