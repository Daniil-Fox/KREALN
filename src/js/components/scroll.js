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
  // console.log(pause)
  !anim && !pause && goToSlide()
})


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
    if (currentSection.scrollHeight - currentSection.scrollTop === currentSection.clientHeight) {
      pause = false

    } else if(currentSection.scrollTop <= 1){
      pause = false
    }
    currentSection.addEventListener('wheel', e => {
      pause = true

      if (e.wheelDeltaY < 0 && currentSection.scrollHeight - currentSection.scrollTop === currentSection.clientHeight) {
        pause = false
      } else if(e.wheelDeltaY > 0 && currentSection.scrollTop == 0){
        pause = false
      }
    })
  }


  if(direction == 'down' && target && target == siteSlides[siteSlides.length - 1]){
    pause = true

    document.body.style.overflow = null
  }
}

window.addEventListener('scroll', e => {
  if(pause && window.scrollY == 0 && direction == 'up'){
    pause = false
    document.body.style.overflow = 'hidden'
  }
})
