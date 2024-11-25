let delta, direction;
const delatSizeUp = 0
const delayAnim = 1300

let windPos = 0;
let navPos = 0;

let anim = false;
let pause = false;
let checkTopScreen = false;

// functions
let goToOtherSlide = null;
let resetScrollSettings = null;


const siteSlider = document.querySelector('.site-slider')

if(siteSlider){
  let siteSlides = siteSlider.querySelectorAll('.site-screen')

  function setLightBody(flag){
    flag ? document.body.classList.add('body-light') : document.body.classList.remove('body-light')
  }

  function checkOverflow(){
    if(siteSlides.length > 1){
      document.body.style.overflow = 'hidden'
    }
  }

  function checkSlide(slide){
    if(slide.classList.contains('site-screen-start')){
      siteSlider.classList.add('hide-control')

    } else {
      siteSlider.classList.remove('hide-control')

    }

    if(slide.classList.contains('site-screen-light')){
      setLightBody(1)
    } else {
      setLightBody(0)
    }
  }
  checkOverflow()
  checkSlide(siteSlides[0])

  const nav = document.querySelector('.header__nav:not(.no-active)')
  let navItems
  if(nav){
    navItems = nav.querySelectorAll('li')
    navItems[0].classList.add('active')
  }

  function initSlides(){
    siteSlides.forEach((slide, i) => {
      slide.style.zIndex = i

      if(i != 0){
        slide.style.transform = 'translateY(100%)'
      }
    })
  }

  initSlides()


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
          goToOtherSlide(indices[index])
          setNavItem(index)
        }
      })
    })
  }

  resetScrollSettings = () =>{
    windPos = 0;
    navPos = 0;
    siteSlides = siteSlider.querySelectorAll('.site-screen')
    initSlides()
  }

  goToOtherSlide = (slideIndex) => {
    setPosition(slideIndex)

    goToSlide()
  }

  const renewPosSlidesDown = (start, end) => {
    for(let i = start; i < end; i++){
      siteSlides[i].style.transform = 'translateY(0)'
    }
  }

  const renewPosSlidesUp = (start, end) => {
    for(let i = start; i < end; i++){
      siteSlides[i].style.transform = 'translateY(100%)'
    }
  }

  function setPosition(newPos){
    if(newPos > windPos) {
      direction = 'down'
      renewPosSlidesDown(windPos, newPos)
      windPos = newPos-1

    }
    else if(newPos < windPos) {
      direction = 'up'
      renewPosSlidesUp(newPos+1, windPos+1)
      windPos = newPos+1
    }
    else return
  }

  // Подсветка активного пункта навигации
  function setNavItem(pos){
    clearNav()
    console.log(navItems[pos])
    navItems[pos].classList.add('active')
  }

  function checkNavDisabled(){
    return nav && nav.classList.contains('disabled')
  }

  // Переход к следующим слайдам относительно winPos
  function goToSlide(){
    anim = true
    let target;
    if(direction == "down" && windPos + 1 != siteSlides.length){
      if(nav && !siteSlides[windPos].classList.contains('nav-disable') && navPos + 1 < navItems.length) navPos++;
      target = siteSlides[++windPos]

      setTimeout(() => {
        target.style.transform = 'translateY(0%)'
      }, delatSizeUp)

    } else if(direction == "up" && windPos - 1 > -1){
      if(nav && !siteSlides[windPos].classList.contains('nav-disable') && navPos - 1 > -1) navPos--;
      target = siteSlides[windPos--]

      setTimeout(() => {
        target.style.transform = 'translateY(100%)'
      }, delatSizeUp)

    }

    if(target){
      target.classList.add('active')
      checkSlide(siteSlides[windPos])
    }

    if(nav){
      setNavItem(navPos)
    }
    // Выключаем анимацию
    setTimeout(() => {
      anim = false
      target?.classList.remove('active')
    }, delayAnim)


    // Проверяем высоту слайда, если выше - включаем в него скролл
    const currentSection = siteSlides[windPos].querySelector('section')

    if(currentSection.scrollHeight > window.innerHeight){ // Обработка слайдов, у которых высота больше, чем высота экрана
      // <-- 18.11 MAYBE DELETE THIS
      currentSection.addEventListener('scroll', e => {
        e.preventDefault()

        if(window.scrollY != 0){
          window.scrollTo(0, 0)
        }
      })
      // -->
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

    if(currentSection.querySelector('.hor-scroll')){
      pause = true
      const horScroll = currentSection.querySelector('.hor-scroll')
      const horScrollContainer = currentSection.querySelector('.hor-scroll-container')

      if(horScroll.scrollWidth > horScrollContainer.clientWidth){
        let scroll = 0;
        let finish = horScroll.scrollWidth - horScrollContainer.clientWidth

        function horWheel(e){
          if (e.wheelDeltaY < 0) {
            scroll -= 30
            scroll = Math.max(scroll, -finish)
            horScroll.style.transform = `translateX(${scroll}px)`
            if(scroll == finish) {
              pause = false
              setTimeout(() => {
                checkOverflow()
              }, 300)

            }
          } else if(e.wheelDeltaY > 0){
            scroll += 30
            scroll = Math.min(scroll, 0)

            horScroll.style.transform = `translateX(${scroll}px)`
            if(scroll == 0) {
              pause = false
              setTimeout(() => {
                checkOverflow()
              }, 300)
            }
          }

        }
        currentSection.addEventListener('wheel', horWheel)

      }
    }

    // Если слайд последний и скролл вниз включаем обычный скролл
    function isEnd(){
      return direction == 'down' && windPos == siteSlides.length - 1
    }

    if(isEnd()){
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
        checkOverflow()
    }
  })
}

export {goToOtherSlide, resetScrollSettings, delayAnim}
