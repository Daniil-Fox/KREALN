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
// timeline.fromTo('.animate-title span:first-child', {
//   x: -500,
//   opacity: 0,
// }, {
//   x: 0,
//   opacity: 1,
//   duration: 1.2
// })

// timeline.fromTo('.animate-title span:last-child', {
//   x: 500,
//   opacity: 0,
// }, {
//   x: 0,
//   opacity: 1,
//   duration: 1.2
// }, '-=1')

timeline.fromTo('.team-main__desc', {
  opacity: 0,
  y: 100
}, {
  opacity: 1,
  y: 0
}, '-=0.6')

