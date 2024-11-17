const surveyItems = document.querySelectorAll('.sl-list__item')


if(surveyItems.length > 0){
  const clearActive = () => {
    surveyItems.forEach(el => el.classList.remove('active'))
  }

  surveyItems.forEach(item => {
    item.addEventListener('mouseenter', e => {
      clearActive()
      item.classList.add('active')
    })
  })
}
