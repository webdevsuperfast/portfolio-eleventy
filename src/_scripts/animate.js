const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('scroll-animation')
    } else {
      entry.target.classList.remove('scroll-animation')
    }
  })
})

document.querySelectorAll('.animation').forEach((section) => {
  observer.observe(section)
})
