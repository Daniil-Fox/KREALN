const tabs = document.querySelectorAll('.contacts-ways__tab')

if(tabs && tabs.length > 0){
  const tabsContainer = document.querySelectorAll('.contacts-ways__mwrap[data-contacts-tab]')
  const clear = () => {
    tabs.forEach(el => el.classList.remove('active'))
    tabsContainer.forEach(el => el.classList.remove('active'))
  }
  tabs.forEach(el => {
    el.addEventListener('click', e => {
      const dataset = el.dataset.contactsTab
      clear()
      el.classList.add('active')
      document.querySelector(`.contacts-ways__mwrap[data-contacts-tab=${dataset}]`).classList.add('active')
    })
  })
}
