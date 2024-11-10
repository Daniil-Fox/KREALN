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
  // gsap.to(tab, {
  //   yPercent: 0
  // }, "-=1")
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



const resizableSwiper = (container, swiperClass, swiperSettings, callback) => {
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

  // breakpoint.addEventListener('change', checker);
  const licTabs = document.querySelectorAll('.animate-g')
  const wrappers = document.querySelectorAll('.team-lic__wrapper')

  function clearActive(){
    licTabs.forEach(el => el.classList.remove('active'))
    wrappers.forEach(el => el.classList.remove('active'))
  }

  licTabs.forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault()
      const dataset = el.dataset.tab
      if(dataset == document.querySelector(`.team-lic__wrapper.active`).dataset.tab) return
      else {
        checker();
        const currentWrap = document.querySelector(`.team-lic__wrapper[data-tab=${dataset}]`)

        clearActive()
        el.classList.add('active')

        currentWrap.classList.add('active')
        setTimeout(() => {
          nextTab(currentWrap)
        }, 10)
      }
    })

  })
  checker();
}

const someFunc = (instance) => {
  if (instance) {
    instance.on('slideChange', function (e) {
      console.log('*** mySwiper.activeIndex', instance.activeIndex);
    });
  }
};



const slidersTeamLic = document.querySelectorAll('.team-lic__wrapper')

slidersTeamLic.forEach(el => {
  resizableSwiper(
    el,
    el.querySelector('.team-lic__slider'),
    {
      slidesPerView: 'auto',
      spaceBetween: 40,
      direction: 'vertical',
      // freeMode: true
    }
  );
})
