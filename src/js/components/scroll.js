let delta, direction;
const siteSlider = document.querySelector('.site-slider')
const siteSlides = siteSlider.querySelectorAll('.site-screen')

const delatSizeUp = 0
const delayAnim = 1300

let windPos = 0;
let navPos = 0;

let anim = false;
let pause = false;
let checkTopScreen = false;


document.body.style.overflow = 'hidden'

function setLightBody(flag){
  flag ? document.body.classList.add('body-light') : document.body.classList.remove('body-light')
}


function checkSlide(slide){
  if(slide.classList.contains('site-screen-start')){
    siteSlider.classList.add('hide-control')
    setLightBody(1)
  } else {
    siteSlider.classList.remove('hide-control')
    setLightBody(0)
  }
}

checkSlide(siteSlides[0])

const nav = document.querySelector('.header__nav:not(.no-active)')
let navItems
if(nav){
  navItems = nav.querySelectorAll('li')
  navItems[0].classList.add('active')
}

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

// Логика для навигации сбоку

function clearNav(){
  navItems.forEach(el => el.classList.remove('active'))
}
if(nav){
  const indices = [];

  function findIndicesOfOnes() {
    siteSlides.forEach((value, index) => {
        if (!value.classList.contains('nav-disable')) {
            indices.push(index);
        }
    });
    return indices;
  }

  findIndicesOfOnes()

  navItems.forEach((item, index) => {
    item.addEventListener('click', e => {
      e.preventDefault()
      if(!checkNavDisabled()){
        setNavItem(index)
        goToOtherSlide(indices[index])
      }
    })
  })
}


function goToOtherSlide(slideIndex){
  setPosition(slideIndex)

  goToSlide()
}

function setPosition(newPos){
  if(newPos > windPos) {
    direction = 'down'
    windPos = newPos-1
  }
  else if(newPos < windPos) {
    direction = 'up'
    windPos = newPos+1
  }
  else return
}

function setNavItem(pos){
  clearNav()
  navItems[pos].classList.add('active')
}

function checkNavDisabled(){
  return nav.classList.contains('disabled')
}

// Переход к следующим слайдам относительно winPos
function goToSlide(){
  anim = true
  let target;
  if(direction == "down" && windPos + 1 != siteSlides.length){
    if(!siteSlides[windPos].classList.contains('nav-disable') && navPos + 1 < navItems.length) navPos++;
    target = siteSlides[++windPos]

    setTimeout(() => {
      target.style.transform = 'translateY(0%)'
    }, delatSizeUp)

  } else if(direction == "up" && windPos - 1 > -1){

    if(!siteSlides[windPos].classList.contains('nav-disable') && navPos - 1 > -1) navPos--;
    target = siteSlides[windPos--]

    setTimeout(() => {
      target.style.transform = 'translateY(100%)'
    }, delatSizeUp)

  }

  if(target){
    target.classList.add('active')
    checkSlide(siteSlides[windPos])
  }

  if(!checkNavDisabled()){
    setNavItem(navPos)
  }

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
