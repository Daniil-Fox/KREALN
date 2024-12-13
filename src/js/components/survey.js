const surveyItems = document.querySelectorAll('.sl-list__item')


if(surveyItems.length > 0){
  const clearActive = () => {
    surveyItems.forEach(el => el.classList.remove('active'))
  }
  if(window.matchMedia("(min-width: 1025px)").matches){
    surveyItems.forEach(item => {
      item.addEventListener('mouseenter', e => {
        clearActive()
        item.classList.add('active')
      })
    })
  } else {
    surveyItems.forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault()
        item.addEventListener('click', e => {
          location.href = item.href
        })

        clearActive()
        item.classList.add('active')
      })
    })
  }
}
