import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger.js";
gsap.registerPlugin(ScrollTrigger);

// need to stop at a section mid-page? See this demo: https://codepen.io/GreenSock/pen/MWGVJYL?editors=0010

// Gsap Code
let currentIndex = -1;
let animating;
let swipePanels = gsap.utils.toArray(".site-screen");
let pagination = gsap.utils.toArray('.nav li')

let scrollEnd = 1
// set second panel two initial 100%
gsap.set(".site-screen:not(:first-child)", {yPercent: 100});

// set z-index levels for the swipe panels
gsap.set(swipePanels, {
  zIndex: i => i
});

// create an observer and disable it to start
let intentObserver = ScrollTrigger.observe({
  type: "wheel,touch",
  onUp: () => {
    !animating && gotoPanel(currentIndex + 1, true)
  },
  onDown: () => {
    !animating && gotoPanel(currentIndex - 1, false)},
  wheelSpeed: -1,
  tolerance: 10,
  preventDefault: true,
  onPress: self => {
    // on touch devices like iOS, if we want to prevent scrolling, we must call preventDefault() on the touchstart (Observer doesn't do that because that would also prevent side-scrolling which is undesirable in most cases)
    ScrollTrigger.isTouch && self.event.preventDefault()
  }
})
intentObserver.disable();

function activeNav(index){
  pagination.forEach(el => el.classList.remove('active'))
  pagination[index]?.classList.add('active')
}
function handleNavClick(){
  pagination.forEach((btn, i) => {
    btn.addEventListener('click', e => {
      scrollTo(0, 0)
      if(i == currentIndex) return

      if(i > currentIndex){
        gotoPanel(i, true)
      } else {
        gotoPanel(i, false)
      }
    })
  })
}

handleNavClick()
document.body.style.overflow = 'hidden'
// handle the panel swipe animations
function gotoPanel(index, isScrollingDown) {
  document.body.style.overflow = 'hidden'
  animating = true;
  let scrollFinish = true;

  if(index != swipePanels.length){
    activeNav(index)
  }
  if(swipePanels[index]?.classList.contains('no-scroll')){
    animating = true;
    intentObserver.disable();

    let sec = swipePanels[index].querySelector('.scroll-section')
    // console.log(sec)
    if((sec.scrollTop == 0 && !isScrollingDown) || (sec.scrollHeight - sec.scrollTop === sec.clientHeight && isScrollingDown)){
      animating = false
      scrollFinish = true
      intentObserver.enable();
    }
    sec.addEventListener('scroll', e => {
      intentObserver.disable();
      animating = true;
        e.preventDefault()
        if((sec.scrollTop == 0 && !isScrollingDown) || (sec.scrollHeight - sec.scrollTop === sec.clientHeight && isScrollingDown)){
          animating = false
          scrollFinish = true
          intentObserver.enable();
        }
      })
  }
  // return to normal scroll if we're at the end or back up to the start
  else if ((index === swipePanels.length && isScrollingDown) || (index === -1 && !isScrollingDown)) {
        document.body.style.overflow = null
        let target = index;
        gsap.to(target, {
        // yPercent: isScrollingDown ? -100 : 0,
        duration: 0.10,
        onComplete: () => {
          if(!swipePanels[index]?.classList.contains('no-scroll')){
            animating = false;
            isScrollingDown && intentObserver.disable();
          }
        }
    });

    return
  }



//   target the second panel, last panel?
  let target = isScrollingDown ? swipePanels[index]: swipePanels[currentIndex];
  target.classList.add('active')
  gsap.to(target, {
    yPercent: () => {
      if(!target.classList.contains('no-scroll')){
        return isScrollingDown ? 0 : 100
      } else if(scrollFinish && target.classList.contains('no-scroll')){
        console.log('asldkasld')
        return isScrollingDown ? 0 : 100
      }

    },
    duration: 1.25,
    delay: 0.25,
    onEnter: () => {
      if(target.classList.contains('no-scroll')){
        scrollFinish = false
      }
    },
    onComplete: () => {

      animating = false;
      target.classList.remove('active')


    }
  });
  currentIndex = index;
}

// pin swipe section and initiate observer
ScrollTrigger.create({
  trigger: ".site-slider",
  pin: true,
  start: "top top",
  end: "+=1",
  onEnter: (self) => {
    intentObserver.enable();
    gotoPanel(currentIndex + 1, true);
  },
  onEnterBack: () => {
    intentObserver.enable();
    gotoPanel(currentIndex - 1, false);
  }
})


window.addEventListener('DOMContentLoaded', e => {
  scrollTo(0, 0)
})
