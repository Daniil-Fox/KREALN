import {gsap} from 'gsap'
import {ScrollTrigger} from "gsap/ScrollTrigger.js";
import { goToOtherSlide, delayAnim, resetScrollSettings } from './scroll.js';


gsap.registerPlugin(ScrollTrigger)

const timeline = gsap.timeline({
  onComplete: () => {
    const rmAnimating = document.querySelector('.site-screen-rm')
    goToOtherSlide(1)
    if(rmAnimating){

      setTimeout(() => {
        rmAnimating.remove()
        resetScrollSettings()
        if(document.querySelector('.swiper-slide-active .prod-items__arr')){
          animateArrow(document.querySelector('.swiper-slide-active .prod-items__arr'))
        }
      }, delayAnim + 10)
    }
  }
})


const animateSpan = document.querySelectorAll('.animate-title span')
animateSpan.forEach((el, i )=> {
  timeline.fromTo(el, {
    x: 700,
    opacity: 0,
  }, {
    x: 0,
    opacity: 1,
    duration: 0.7
  })
})

timeline.fromTo('.team-main__desc', {
  opacity: 0,
  y: 100
}, {
  opacity: 1,
  y: 0
}, '-=0.6')


gsap.set('.arr1', {
  y: 800
})
gsap.set('.arr2', {
  y: 800
})
gsap.set('.arr3', {
  y: 800
})


function animateArrow(cont){

  const arr1 = cont?.querySelector('.arr1')
  const arr2 = cont?.querySelector('.arr2')
  const arr3 = cont?.querySelector('.arr3')

  const img = cont?.querySelector('.anim-img')
  const imgMask = cont?.querySelector('.mask-arr')


  const tl = gsap.timeline({
    duration: 1.2,
    onComplete: () => {
      img.style.opacity = 1
      setTimeout(() => {
        imgMask.style.opacity = 0
      }, 800)
    }
  })

  tl.to(arr1,{
    y: 0
  }).to(arr2, {
    y: 0
  }, "-=0.3").to(arr3, {
    y: 0
  }, "-=0.3")
}



// Contacts
const mapContainer = document.querySelector('.contacts-main__map')
const mapBack = document.querySelector('.contacts-main__back')
const tl = gsap.timeline({ paused: true})
  tl.to(mapContainer, {
    width: '100%',
    height: '100%',
    x: 0,
    y: 0,
    borderRadius: 0,
    duration: 1
  })
  .to(mapBack, {
    opacity: 1
  })
const controlTl = (reverse = false) => {


  if(reverse){
    tl.reverse()
  } else {
    tl.play()
  }
}

mapContainer?.addEventListener('click', e => {
  controlTl()

  mapContainer.classList.add('active')
})

mapBack?.addEventListener('click', e => {
  e.preventDefault()
  controlTl(true)
  mapContainer.classList.remove('active')
})


// Orbit


const contactsInitCont = document.querySelectorAll('.contacts-ways__flex')
if(contactsInitCont && contactsInitCont.length > 0){
  const orbitTriggers = document.querySelectorAll('[data-cont-trigger]')

  orbitTriggers.forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault()
      const dataset = trigger.dataset.contTrigger
      const curr = document.querySelector(`[data-way="${dataset}"]`)
      contactsInitCont.forEach(el => el.classList.remove('active'))
      curr.classList.add('active')

    })
  })

  function initOrbit(container){
    let currentIndex = 0;
    let turn = 0;
    let rotation = 0;
    let even = true;

    const orbitActive = container.querySelectorAll('.orbit__planet--active .orbit__img')
    const orbitNext = container.querySelectorAll('.orbit__planet--next .orbit__img')
    const orbitCounter = container.querySelector('.orbit__counter')

    const orbitActivePlanet = container.querySelector('.orbit__planet--active')
    const orbitActiveNext = container.querySelector('.orbit__planet--next')


    gsap.set(orbitActive, {zIndex: -1, opacity: 0})
    gsap.set(orbitNext, {zIndex: -1, opacity: 0})

    const nextBtn = container.querySelector('.orbit-control__btn--next')
    const prevBtn = container.querySelector('.orbit-control__btn--prev')

    const orbitNav = container.querySelectorAll('.contacts-ways__nav li')

    const tl1 = gsap.timeline()
    function setOrbitCounter(){
      orbitCounter.textContent = currentIndex < 10 ? `0${currentIndex + 1}` : `${currentIndex + 1}`
    }

    function changeSlideFw(idx){
      const prev = currentIndex
      turn++;

      gsap.to(container.querySelector('.orbit__wrapper'), {rotateZ: () => rotation += 180, duration: 1})


      gsap.set(container.querySelectorAll('.orbit__planet--active .orbit__img'), {
        zIndex: -2,
        opacity: 0
      })
      gsap.set(container.querySelectorAll('.orbit__planet--next .orbit__img'), {
        zIndex: -2,
        opacity: 0
      })


      gsap.to(orbitActivePlanet, {
        rotateZ: () => turn % 2 ? '180' : '0',
        scale: () =>  turn % 2 ? '0.2' : '1',
        onUpdate: () => turn % 2 ? orbitActivePlanet.classList.add('hide') : orbitActivePlanet.classList.remove('hide')
      })

      gsap.to(orbitActiveNext, {
        rotateZ: () => turn % 2 ? '180' : '0',
        scale: () =>  !(turn % 2) ? '0.2' : '1',
        onUpdate: () => !(turn % 2) ? orbitActiveNext.classList.add('hide') : orbitActiveNext.classList.remove('hide')
      })


      if(turn % 2){
        let nextActiveSlide = orbitActive[idx+1]
        if(!nextActiveSlide) nextActiveSlide = orbitActive[idx]
        tl1.to(nextActiveSlide, {
          zIndex: 4,
          opacity: 1
        })
        tl1.to(orbitNext[idx], {
          zIndex: 4,
          opacity: 1
        }, '-=0.5')
      } else{
        let nextNextSlide = orbitNext[idx+1]
        if(!nextNextSlide) nextNextSlide = orbitNext[idx]
        tl1.to(nextNextSlide, {
          zIndex: 4,
          opacity: 1
        }, "-=0.5")
        tl1.to(orbitActive[idx], {
          zIndex: 4,
          opacity: 1
        }, "-=0.5")
      }
    }


    function changeSlideBack(idx){
      const prev = currentIndex

      turn++;

      gsap.to(container.querySelector('.orbit__wrapper'), {rotateZ: () => rotation -= 180, duration: 1})

      gsap.set(container.querySelectorAll('.orbit__planet--active .orbit__img'), {
        zIndex: -2,
        opacity: 0
      })
      gsap.set(container.querySelectorAll('.orbit__planet--next .orbit__img'), {
        zIndex: -2,
        opacity: 0
      })

      gsap.to(orbitActivePlanet, {
        rotateZ: () => turn % 2 ? '180' : '0',
        scale: () =>  turn % 2 ? '0.2' : '1',
        onUpdate: () => turn % 2 ? orbitActivePlanet.classList.add('hide') : orbitActivePlanet.classList.remove('hide')
      })

      gsap.to(orbitActiveNext, {
        rotateZ: () => turn % 2 ? '180' : '0',
        scale: () =>  !(turn % 2) ? '0.2' : '1',
        onUpdate: () => !(turn % 2) ? orbitActiveNext.classList.add('hide') : orbitActiveNext.classList.remove('hide')
      })

      if(turn % 2){

        tl1.to(orbitActive[idx+1], {
          zIndex: 4,
          opacity: 1
        })
        tl1.to(orbitNext[idx], {
          zIndex: 4,
          opacity: 1
        }, "-=0.5")
      } else{

        tl1.to(orbitNext[idx+1], {
          zIndex: 4,
          opacity: 1
        })
        tl1.to(orbitActive[idx], {
          zIndex: 4,
          opacity: 1
        }, "-=0.5")
      }
    }

    function clearOrbitNav(){
      orbitNav.forEach(el => el.classList.remove('active'))
    }

    function setNavActive(newIdx){
      clearOrbitNav()
      orbitNav[newIdx].classList.add('active')
    }

    function initOrbitNav(){

      let prevItem = -1;
      orbitNav.forEach((item, index) => {
        item.addEventListener('click', e => {
          e.preventDefault()

          if(index != prevItem) {
            clearOrbitNav()


            item.classList.add('active')

            even = currentIndex % 2

            if(index > prevItem){
              changeSlideFw(index)
            } else {
              changeSlideBack(index)
            }
            currentIndex = index
            prevItem = index
            setOrbitCounter(currentIndex)
            disableBtn()
          }

        })
      })
    }


    function incr(){
      if(currentIndex + 1 < orbitActive.length){
        currentIndex++;
        return currentIndex % 2
      }
    }
    function decr(){
      if(currentIndex - 1 >= 0){
        currentIndex--;
        return currentIndex % 2
      }
    }

    // function incrSlides(){

    //   gsap.to('.orbit', {rotateZ: () => rotation += 180, duration: 1})

    //   gsap.to('.orbit__planet--active', {
    //     rotateZ: () => currentIndex % 2 ? '180' : '0',
    //     scale: () =>  currentIndex % 2 ? '0.2' : '1'
    //   })
    //   gsap.to('.orbit__planet--next', {
    //     rotateZ: () => currentIndex % 2 ? '180' : '0',
    //     scale: () =>  !(currentIndex % 2) ? '0.2' : '1'
    //   })

    //   if(even){
    //     // PREV
    //     tl1.to(orbitActive[currentIndex-1], {
    //       zIndex: -2
    //     })
    //     // CURRENT
    //     tl1.to(orbitActive[currentIndex+1], {
    //       zIndex: 4,
    //       opacity: 1
    //     })
    //   } else{
    //     tl1.to(orbitNext[currentIndex-1], {
    //       zIndex: -2
    //     })
    //     // CURRENT
    //     tl1.to(orbitNext[currentIndex+1], {
    //       zIndex: 4,
    //       opacity: 1
    //     })
    //   }
    // }

    // function decrSlides(){
    //   let next = currentIndex+1

    //   tl1.to(orbitActive[next], {zIndex: -1, opacity: 0})
    //   tl1.to(orbitActive[currentIndex], {zIndex: 2, opacity: 1})

    //   tl2.to(orbitNext[next + 1], {zIndex: -1, opacity: 0})
    //   tl2.to(orbitNext[(currentIndex + 1) % orbitActive.length], {zIndex: 2, opacity: 1})
    // }


    // function decrSlides(){
    //   gsap.to('.orbit', {rotateZ: () => rotation -= 180, duration: 1})

    //   gsap.to('.orbit__planet--active', {
    //     rotateZ: () => currentIndex % 2 ? '180' : '0',
    //     scale: () =>  currentIndex % 2 ? '0.2' : '1'
    //   })
    //   gsap.to('.orbit__planet--next', {
    //     rotateZ: () => currentIndex % 2 ? '180' : '0',
    //     scale: () =>  !(currentIndex % 2) ? '0.2' : '1'
    //   })

    //   if(!even){
    //     // PREV
    //     console.log(currentIndex)
    //     tl1.to(orbitActive[currentIndex+2], {
    //       zIndex: -2,
    //       opacity: 0
    //     })
    //     // CURRENT
    //     tl1.to(orbitActive[currentIndex], {
    //       zIndex: 4,
    //       opacity: 1
    //     })
    //   } else{
    //     tl1.to(orbitNext[currentIndex+2], {
    //       zIndex: -2,
    //       opacity: 0
    //     })
    //     // CURRENT
    //     tl1.to(orbitNext[currentIndex], {
    //       zIndex: 4,
    //       opacity: 1
    //     })
    //   }
    // }


    // function nextPlanet(){
    //   if(currentIndex != orbitActive.length - 1){
    //     even = incr()
    //     incrSlides()
    //   }

    // }
    // function prevPlanet(){
    //   if(currentIndex-1 >= 0){
    //     even = decr()
    //     decrSlides()
    //   }
    // }
    gsap.set(orbitActive[currentIndex], {zIndex: 2, opacity: 1})
    gsap.set(orbitNext[currentIndex+1], {zIndex: 2, opacity: 1})

    function disableBtn(){
      if(currentIndex == orbitActive.length - 1) nextBtn.classList.add('disable')
        else nextBtn.classList.remove('disable')

      if(currentIndex == 0) prevBtn.classList.add('disable')
        else prevBtn.classList.remove('disable')
    }

    nextBtn.addEventListener('click', e => {
      even = incr()
      disableBtn()
      changeSlideFw(currentIndex)
      setNavActive(currentIndex)
      setOrbitCounter(currentIndex)
    })
    prevBtn.addEventListener('click', () => {
      even = decr()
      disableBtn()
      changeSlideBack(currentIndex)
      setNavActive(currentIndex)
      setOrbitCounter(currentIndex)
    })

    disableBtn()
    setOrbitCounter()
    initOrbitNav()
  }

  contactsInitCont.forEach(cont => {
    initOrbit(cont)
  })
}

export {animateArrow}
