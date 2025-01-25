import { Swiper } from 'swiper';
import {
  Autoplay,
  EffectFade,
  FreeMode,
  Grid,
  Mousewheel,
  Navigation,
  Pagination,
} from 'swiper/modules';
import { gsap } from 'gsap';
import { animateArrow } from './animations.js';
function nextTab(tab) {
  const tl = gsap.timeline();
  gsap.set(tab, {
    opacity: 0,
    yPercent: 60,
  });

  tl.to(tab, {
    opacity: 1,
    duration: 0.5,
  }).to(
    tab,
    {
      yPercent: 0,
      duration: 0.4,
    },
    '-=0.5',
  );
}

Swiper.use([
  Navigation,
  Pagination,
  Autoplay,
  FreeMode,
  EffectFade,
  Grid,
  Mousewheel,
]);

const swiperContainer = document.querySelector(
  '.research__slider .swiper-wrapper',
);
let slides = null;
if (swiperContainer) {
  slides = Array.from(swiperContainer.children);
}

// Проверяем, если слайдов меньше 4
if (slides && slides.length < 4) {
  // Дублируем слайды
  const clonesNeeded = 4 - slides.length;
  for (let i = 0; i < clonesNeeded; i++) {
    // Получаем копию и добавляем в контейнер
    const clone = slides[i % slides.length].cloneNode(true);
    swiperContainer.appendChild(clone);
  }
}

const researchSlider = new Swiper('.research__slider', {
  slidesPerView: 'auto',
  centeredSlides: true,
  loop: true,
  loopFillGroupWithBlank: true,
  spaceBetween: 20,
  speed: 500,
  autoplay: {
    disableOnInteraction: false,
  },
  speed: 500,

  320: {
    freeMode: true,
  },
  1025: {
    freeMode: false,
  },
});

new Swiper('.proj-total__slider', {
  slidesPerView: 'auto',
  centeredSlides: true,
  loop: true,
  spaceBetween: 12,
  speed: 500,
  autoplay: {
    disableOnInteraction: false,
  },
  speed: 500,
});

new Swiper('.team-people__slider', {
  slidesPerView: 'auto',
  spaceBetween: 0,
  // centeredSlides: true,
  freeMode: true,
  speed: 500,
  loop: true,
});

const licTabs = document.querySelectorAll('.animate-g');
const wrappers = document.querySelectorAll(
  '.team-lic__wrapper',
);
const numbers = document.querySelectorAll(
  '.team-lic__number',
);

function clearActive() {
  licTabs.forEach((el) => el.classList.remove('active'));
  wrappers.forEach((el) => el.classList.remove('active'));
  numbers.forEach((el) => el.classList.remove('active'));
}

const toggleSwiper = (
  container,
  swiperClass,
  swiperSettings,
  tabItem,
  callback,
) => {
  let swiper;

  // breakpoint = window.matchMedia(breakpoint);

  const enableSwiper = function (className, settings) {
    swiper = new Swiper(className, settings);

    if (callback) {
      callback(swiper);
    }
  };

  const checker = function () {
    if (container.classList.contains('active')) {
      return enableSwiper(swiperClass, swiperSettings);
    } else {
      if (swiper !== undefined) swiper.destroy(true, true);
      return;
    }
  };

  tabItem?.addEventListener('click', checker);

  checker();
};

const someFunc = (instance) => {
  if (instance) {
    instance.on('slideChange', function (e) {
      console.log(
        '*** mySwiper.activeIndex',
        instance.activeIndex,
      );
    });
  }
};

licTabs.forEach((el, idx) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const dataset = el.dataset.tab;

    if (
      dataset ==
      document.querySelector(`.team-lic__wrapper.active`)
        .dataset.tab
    )
      return;
    else {
      clearActive();

      const currentWrap = document.querySelector(
        `.team-lic__wrapper[data-tab=${dataset}]`,
      );

      el.classList.add('active');
      currentWrap.classList.add('active');
      numbers[idx].classList.add('active');
      setTimeout(() => {
        nextTab(currentWrap);
      }, 10);
    }
  });
});

const slidersTeamLic = document.querySelectorAll(
  '.team-lic__wrapper',
);

slidersTeamLic.forEach((el, idx) => {
  toggleSwiper(
    el,
    el.querySelector('.swiper'),
    {
      direction: 'vertical',
      slidesPerView: 'auto',
      spaceBetween: 40,
      breakpoints: {
        320: {
          spaceBetween: 20,
          direction: 'horizontal',
          centeredSlides: true,
        },
        1025: {
          direction: 'vertical',
          centeredSlides: false,
          spaceBetween: 40,
        },
      },
    },
    licTabs[idx],
  );
});

const prodPagination = [
  'Блочно - модульные очистные сооружения',
  'Фильтры с плавающей загрузкой',
  'Станция приема сточных вод',
  'Канализационная насосная станция',
  'Трубчатые аэраторы',
  'Плоскостная загрузка',
  'Мешковая сушилка',
  'Станции водоподготовки',
  'Блок-бокс',
  'Модули приготовления и дозирования реагентов ',
];

const prodMainSlider = new Swiper('.prod-items__slider', {
  slidesPerView: 1,
  speed: 100,
  navigation: {
    prevEl: '.prod-items__btn--prev',
    nextEl: '.prod-items__btn--next',
  },
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },
  pagination: {
    el: '.prod-pagination',
    clickable: true,
    renderBullet: function (index, className) {
      return (
        '<li class="' +
        className +
        '">' +
        prodPagination[index] +
        '</li>'
      );
    },
  },
});

const prodInfoSlider = new Swiper('.prod-info__slider', {
  slidesPerView: 1,
  effect: 'fade',
  navigation: {
    prevEl: '.prod-items__btn--prev',
    nextEl: '.prod-items__btn--next',
  },
  speed: 100,
  fadeEffect: {
    crossFade: true,
  },
});

if (document.querySelector('.prod-info__slider')) {
  prodMainSlider.on(
    'slideChangeTransitionEnd',
    (swiper) => {
      animateArrow(
        swiper.el.querySelector(
          '.swiper-slide-active .prod-items__arr',
        ),
      );

      prodInfoSlider.slideTo(swiper.activeIndex);
    },
  );
  prodInfoSlider.on('slideChange', (swiper) => {
    prodMainSlider.slideTo(swiper.activeIndex);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const resizableSwiper = (
    breakpoint,
    swiperClass,
    swiperSettings,
    callback,
  ) => {
    let swiper;

    breakpoint = window.matchMedia(breakpoint);

    const enableSwiper = function (className, settings) {
      swiper = new Swiper(className, settings);

      if (callback) {
        callback(swiper);
      }
    };

    const checker = function () {
      if (breakpoint.matches) {
        return enableSwiper(swiperClass, swiperSettings);
      } else {
        if (swiper !== undefined)
          swiper.destroy(true, true);
        return;
      }
    };

    breakpoint.addEventListener('change', checker);
    checker();
  };

  const someFunc = (instance) => {
    if (instance) {
      instance.on('slideChangeTransitionEnd', function (e) {
        instance.el.style.height =
          instance.el.querySelector('.swiper-slide-active')
            .scrollHeight + 'px';
      });
    }
  };

  resizableSwiper(
    '(max-width: 1024px)',
    '.completed__slider',
    {
      slidesPerView: 1,
      spaceBetween: 12,
      // slidesPerGroup: 2,
      //   grid: {
      //     fill: "row",
      //     rows: 6,
      //   },
      pagination: {
        el: '.completed__pagination',
        clickable: true,
      },
      navigation: {
        prevEl: '.completed-prev',
        nextEl: '.completed-next',
      },
    },
    someFunc,
  );
  resizableSwiper(
    '(min-width: 1025px)',
    '.blog-slider__slider',
    {
      slidesPerView: 1,
      spaceBetween: 40,
      // mousewheel: true,
      speed: 500,
      navigation: {
        prevEl: '.blog-slider__btn--prev',
        nextEl: '.blog-slider__btn--next',
      },
    },
    someFunc,
  );

  resizableSwiper(
    '(max-width: 1024px)',
    '.spb-circle__slider',
    {
      slidesPerView: 1,
      spaceBetween: 20,
      speed: 500,
    },
  );

  resizableSwiper(
    '(max-width: 1024px)',
    '.testi-mob__slider',
    {
      slidesPerView: 'auto',
      spaceBetween: 30,
      loop: true,
      speed: 500,
    },
  );

  resizableSwiper(
    '(max-width: 1024px)',
    '.sp-slider-swiper',
    {
      slidesPerView: 'auto',
      speed: 500,
    },
  );
});

new Swiper('.eco-block__slider', {
  slidesPerView: 'auto',
  spaceBetween: 20,
});
