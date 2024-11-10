import { Swiper } from "swiper";
import { Autoplay, FreeMode, Navigation, Pagination } from "swiper/modules";
import { gsap } from "gsap";

function nextTab(tab){
  const tl = gsap.timeline()
  gsap.set(tab, {
    opacity: 0,
    yPercent: 60,
  })

  tl.to(tab, {
    opacity: 1,
    duration: .5
  }).to(tab, {
    yPercent: 0,
    duration: 0.4
  }, "-=0.5")

}

Swiper.use([Navigation, Pagination, Autoplay, FreeMode])

new Swiper('.research__slider', {
  slidesPerView: 'auto',
  centeredSlides: true,
  loop: true,
  spaceBetween: 20,
  speed: 500,
  autoplay: {
    disableOnInteraction: false,
  },
  speed: 500
})


new Swiper('.team-people__slider', {
  slidesPerView: 'auto',
  spaceBetween: 0,
  centeredSlides: true,
  speed: 500,
  loop: true
})

const licTabs = document.querySelectorAll('.animate-g')
const wrappers = document.querySelectorAll('.team-lic__wrapper')
const numbers = document.querySelectorAll('.team-lic__number')

function clearActive(){
  licTabs.forEach(el => el.classList.remove('active'))
  wrappers.forEach(el => el.classList.remove('active'))
  numbers.forEach(el => el.classList.remove('active'))
}

const resizableSwiper = (container, swiperClass, swiperSettings, tabItem, callback) => {
  let swiper;

  // breakpoint = window.matchMedia(breakpoint);

  const enableSwiper = function(className, settings) {
    swiper = new Swiper(className, settings);

    if (callback) {
      callback(swiper);
    }
  }

  const checker = function() {
    if (container.classList.contains('active')) {
      return enableSwiper(swiperClass, swiperSettings);
    } else {
      if (swiper !== undefined) swiper.destroy(true, true);
      return;
    }
  };

  tabItem?.addEventListener('click', checker);


  checker();
}

const someFunc = (instance) => {
  if (instance) {
    instance.on('slideChange', function (e) {
      console.log('*** mySwiper.activeIndex', instance.activeIndex);
    });
  }
};


licTabs.forEach((el, idx) => {
  el.addEventListener('click', e => {
    e.preventDefault()
    console.log(el)
    const dataset = el.dataset.tab

    if(dataset == document.querySelector(`.team-lic__wrapper.active`).dataset.tab) return
    else {

      clearActive()

      const currentWrap = document.querySelector(`.team-lic__wrapper[data-tab=${dataset}]`)


      el.classList.add('active')
      currentWrap.classList.add('active')
      numbers[idx].classList.add('active')
      setTimeout(() => {
        nextTab(currentWrap)
      }, 10)
    }
  })

})

const slidersTeamLic = document.querySelectorAll('.team-lic__wrapper')

slidersTeamLic.forEach((el, idx) => {
  resizableSwiper(
    el,
    el.querySelector('.swiper'),
    {
      direction: 'vertical',
      slidesPerView: 'auto',
      spaceBetween: 40,
    },
    licTabs[idx]
  );
})
