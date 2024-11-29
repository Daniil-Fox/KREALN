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
const orbitActive = document.querySelectorAll('.orbit__planet--active .orbit__img')
const orbitNext = document.querySelectorAll('.orbit__planet--next .orbit__img')

gsap.set(orbitActive, {zIndex: -1, opacity: 0})
gsap.set(orbitNext, {zIndex: -1, opacity: 0})

const nextBtn = document.querySelector('.orbit-control__btn--next')
const prevBtn = document.querySelector('.orbit-control__btn--prev')

function initOrbit(){
  let currentIndex = 0;
  const tl1 = gsap.timeline()
  const tl2 = gsap.timeline()

  function incr(){
    if(currentIndex + 1 != orbitActive.length){
      currentIndex = currentIndex + 1
    }
  }
  function decr(){
    if(currentIndex-1 >= 0){
      currentIndex = currentIndex - 1
    }
  }

  function incrSlides(){
    let prev = currentIndex-1

    gsap.to('.orbit', {rotateZ: () => 180 * currentIndex, duration: 1})

    tl1.to(orbitActive[prev], {
      zIndex: -1,

      rotateZ: () => -180 * currentIndex
    }).to('.orbit__planet--active', {
      scale: () => !!(currentIndex % 2) ? '0.2' : '1'
    }, "-=0.5")

    tl1.to(orbitActive[currentIndex+2], {
      zIndex: currentIndex,
      opacity: 1,
      rotateZ: () => -180 * currentIndex
    },"-=0.7")

    tl2.to(orbitNext[prev], {
      zIndex: -1,
      opacity: 0,
      rotateZ: () => -180 * currentIndex
    }).to('.orbit__planet--next', {
      scale: () => !!(currentIndex % 2) ? '1' : '0.2'
    }, "-=0.5")

    tl2.to(orbitNext[(currentIndex + 2) % orbitActive.length], {
      zIndex: currentIndex,
      opacity: 1,
      rotateZ: () => -180 * currentIndex
    }, "-=0.7")

  }

  function decrSlides(){
    let next = currentIndex+1

    tl1.to(orbitActive[next], {zIndex: -1, opacity: 0})
    tl1.to(orbitActive[currentIndex], {zIndex: 2, opacity: 1})

    tl2.to(orbitNext[next + 1], {zIndex: -1, opacity: 0})
    tl2.to(orbitNext[(currentIndex + 1) % orbitActive.length], {zIndex: 2, opacity: 1})
  }


  function nextPlanet(){
    if(currentIndex != orbitActive.length - 1){
      incr()
      incrSlides()
    }

  }
  function prevPlanet(){
    if(currentIndex-1 >= 0){
      decr()
      decrSlides()
    }
  }
  gsap.set(orbitActive[currentIndex], {zIndex: 2, opacity: 1})
  gsap.set(orbitNext[currentIndex + 1], {zIndex: 2, opacity: 1})

  nextBtn.addEventListener('click', nextPlanet)
  prevBtn.addEventListener('click', prevPlanet)
}
initOrbit()
export {animateArrow}
