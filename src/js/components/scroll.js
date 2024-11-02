let delta, direction;
const siteSlider = document.querySelector('.site-slider')
const delatSizeUp = 0
const delayAnim = 1300
const siteSlides = siteSlider.querySelectorAll('.site-screen')

let windPos = 0;
let anim = false;
let pause = false;
let checkTopScreen = false;

document.body.style.overflow = 'hidden'


const navItems = document.querySelectorAll('.header__nav:not(.no-active) .nav__item')


function clearNav(){
  navItems.forEach(el => el.classList.remove('active'))
}

navItems.forEach((item, index) => {
  item.addEventListener('click', e => {
    e.preventDefault()
    clearNav()
    item.classList.add('active')
    setPosition(index)
  })
})

siteSlides.forEach((slide, i) => {
  slide.style.zIndex = i

  if(i != 0){
    slide.style.transform = 'translateY(100%)'
  }
})

window.addEventListener('wheel', e => {
  delta = e.wheelDeltaY;
  if(delta > 0){
    direction = 'up'
  } else {
    direction = 'down'
  }
  !anim && !pause && goToSlide()
})

function setPosition(newPos){
  windPos = newPos
}

function goToSlide(){
  anim = true
  let target;

  if(direction == "down" && windPos + 1 != siteSlides.length){
    target = siteSlides[++windPos]

    setTimeout(() => {
      target.style.transform = 'translateY(0%)'
    }, delatSizeUp)

  } else if(direction == "up" && windPos - 1 > -1){

    target = siteSlides[windPos--]
    setTimeout(() => {
      target.style.transform = 'translateY(100%)'
    }, delatSizeUp)

  }

  target?.classList.add('active')

  setTimeout(() => {
    anim = false
    target?.classList.remove('active')
  }, delayAnim)

  const currentSection = siteSlides[windPos].querySelector('section')
  if(currentSection.scrollHeight > window.innerHeight){ // Обработка слайдов, у которых высота больше, чем высота экрана
    pause = true
    if (direction == 'down ' && currentSection.scrollHeight - currentSection.scrollTop === currentSection.clientHeight ) {
      pause = false

    } else if(direction == 'up' && currentSection.scrollTop <= 1){
      pause = false
    }
    currentSection.addEventListener('wheel', e => {
      if (e.wheelDeltaY < 0 && currentSection.scrollHeight - currentSection.scrollTop === currentSection.clientHeight) {
        setTimeout(() => {
          pause = false
        }, 300)
      } else if(e.wheelDeltaY > 0 && currentSection.scrollTop == 0){
        setTimeout(() => {
          pause = false
        }, 300)
      }
    })
  }
  if(direction == 'down' && windPos == siteSlides.length - 1){
    setTimeout(() => {
      pause = true

      document.body.style.overflow = null
    }, delayAnim)
  }
}

window.addEventListener('scroll', e => {
  if(pause && window.scrollY == 0 && direction == 'up'){
    setTimeout(() => {
          pause = false
        }, 300)
    document.body.style.overflow = 'hidden'
  }
})
