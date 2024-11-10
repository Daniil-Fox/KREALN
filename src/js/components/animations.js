import {gsap} from 'gsap'
import {ScrollTrigger} from "gsap/ScrollTrigger.js";


gsap.registerPlugin(ScrollTrigger)

const timeline = gsap.timeline()
timeline.fromTo('.animate-title span:first-child', {
  x: -500,
  opacity: 0,
}, {
  x: 0,
  opacity: 1,
  duration: 1.2
})
timeline.fromTo('.animate-title span:last-child', {
  x: 500,
  opacity: 0,
}, {
  x: 0,
  opacity: 1,
  duration: 1.2
}, '-=1')

timeline.fromTo('.team-main__desc', {
  opacity: 0,
  y: 100
}, {
  opacity: 1,
  y: 0
}, '-=0.6')
