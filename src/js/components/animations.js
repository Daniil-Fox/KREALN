import {gsap} from 'gsap'
import {ScrollTrigger} from "gsap/ScrollTrigger.js";
import { goToOtherSlide, delayAnim, resetScrollSettings } from './scroll.js';

gsap.registerPlugin(ScrollTrigger)

const timeline = gsap.timeline({
  onComplete: () => {
    const rmAnimating = document.querySelector('.site-screen-rm')
    if(rmAnimating){
      goToOtherSlide(1)

      setTimeout(() => {
        rmAnimating.remove()
        resetScrollSettings()
        animateArrow(document.querySelector('.swiper-slide-active .prod-items__arr'))
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
  console.log(cont)
  const arr1 = cont.querySelector('.arr1')
  const arr2 = cont.querySelector('.arr2')
  const arr3 = cont.querySelector('.arr3')

  const img = cont.querySelector('.anim-img')
  const imgMask = cont.querySelector('.mask-arr')


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




export {animateArrow}
