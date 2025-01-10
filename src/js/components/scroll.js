import { throttle } from './../functions/throttle.js';

let delta, direction;
const delatSizeUp = 0;
const delayAnim = 1300;

let windPos = 0;
let navPos = 0;
let scroll = 0;

let anim = false;
let pause = false;
let checkTopScreen = false;

let ind = 0;
let an = false;
let sc = 0;
let svc = 0;
// functions
let goToOtherSlide = null;
let resetScrollSettings = null;

if (window.matchMedia('(min-width: 1025px)').matches) {
  const siteSlider = document.querySelector('.site-slider');
  const testiTabs = document.querySelectorAll(
    '.testi-cont__tab',
  );
  const testiArray = document.querySelector(
    '.testi-cont__arr',
  );
  testiTabs.forEach((el, idx) => {
    el.addEventListener('click', (e) => {
      goToOtherSlide(idx);
    });
  });
  if (siteSlider) {
    let siteSlides =
      siteSlider.querySelectorAll('.site-screen');

    function setLightBody(flag) {
      flag
        ? document.body.classList.add('body-light')
        : document.body.classList.remove('body-light');
    }

    function checkOverflow() {
      if (siteSlides.length > 1 && window.scrollY == 0) {
        document.body.style.overflow = 'hidden';
      }
    }

    function checkSlide(slide) {
      if (slide.classList.contains('site-screen-start')) {
        siteSlider.classList.add('hide-control');
      } else {
        siteSlider.classList.remove('hide-control');
        document.querySelector('.testi-cont__right')
          ? (document.querySelector(
              '.testi-cont__right',
            ).style.opacity = 1)
          : null;
      }

      if (slide.classList.contains('site-screen-light')) {
        setLightBody(1);
      } else {
        setLightBody(0);
      }

      if (
        slide.classList.contains('site-screen-hide-nav')
      ) {
        siteSlider.classList.add('hide-nav');
      } else {
        siteSlider.classList.remove('hide-nav');
      }
    }
    checkOverflow();
    checkSlide(siteSlides[0]);

    const nav = document.querySelector(
      '.header__nav:not(.no-active)',
    );
    let navItems;
    if (nav) {
      navItems = nav.querySelectorAll(
        'li:not(.no-clickable)',
      );
      navItems[0].classList.add('active');
    }

    function initSlides() {
      siteSlides.forEach((slide, i) => {
        slide.style.zIndex = i;

        if (i != 0) {
          slide.style.transform = 'translateY(100%)';
        }
      });
    }

    initSlides();
    function mainFunc(e) {
      delta = e.wheelDeltaY;
      let scrr = 0;
      if (delta > 0) {
        direction = 'up';
        if (window.scrollY != 0) {
          window.scrollTo(0, 0);
        }
      } else {
        direction = 'down';
      }
      handleScroll();
    }
    let func = throttle(mainFunc);
    window.addEventListener('wheel', func);

    // Логика для навигации сбоку

    function clearNav() {
      navItems.forEach((el) =>
        el.classList.remove('active'),
      );
    }

    function initNavigation() {
      if (nav) {
        const indices = [];

        function findIndicesOfOnes() {
          siteSlides.forEach((value, index) => {
            if (!value.classList.contains('nav-disable')) {
              indices.push(index);
            }
          });
          return indices;
        }
        findIndicesOfOnes();
        console.log(indices);
        navItems.forEach((item, index) => {
          item.addEventListener('click', (e) => {
            e.preventDefault();
            if (!checkNavDisabled()) {
              goToOtherSlide(indices[index]);
              setNavItem(index);
              if (index != navItems.length - 1) {
                window.scrollTo(0, 0);
                disableScrollSlides();
              }
            }
          });
        });
      }
    }
    initNavigation();

    resetScrollSettings = () => {
      windPos = 0;
      navPos = 0;
      siteSlides =
        siteSlider.querySelectorAll('.site-screen');
      initSlides();
      initNavigation();
    };

    goToOtherSlide = (slideIndex) => {
      setPosition(slideIndex);

      goToSlide();
    };

    const renewPosSlidesDown = (start, end) => {
      for (let i = start; i < end; i++) {
        siteSlides[i].style.transform = 'translateY(0)';
      }
    };

    const renewPosSlidesUp = (start, end) => {
      for (let i = start; i < end; i++) {
        siteSlides[i].style.transform = 'translateY(100%)';
      }
    };

    function setPosition(newPos) {
      if (newPos > windPos) {
        direction = 'down';
        renewPosSlidesDown(windPos, newPos);
        windPos = newPos - 1;
      } else if (newPos < windPos) {
        direction = 'up';
        renewPosSlidesUp(newPos + 1, windPos + 1);
        windPos = newPos + 1;
      } else return;
    }

    // Подсветка активного пункта навигации
    function setNavItem(pos) {
      clearNav();
      navPos = pos;
      navItems[navPos].classList.add('active');
    }

    function checkNavDisabled() {
      return nav && nav.classList.contains('disabled');
    }

    function isEnd() {
      return (
        direction == 'down' &&
        windPos == siteSlides.length - 1
      );
    }

    function disableScrollSlides() {
      if (isEnd()) {
        setTimeout(() => {
          pause = true;

          document.body.style.overflow = null;
        }, delayAnim);
      } else {
        document.body.style.overflow = 'hidden';
      }
    }

    function handleScroll() {
      handleVars();
      if (!anim && !pause) {
        goToSlide();
      }
    }

    function handleVars() {
      // Проверяем высоту слайда, если выше - включаем в него скролл
      const currentSection =
        siteSlides[windPos].querySelector('section');
      const horScroll =
        currentSection?.querySelector('.hor-scroll');
      if (horScroll) {
        const horScrollContainer =
          currentSection.querySelector(
            '.hor-scroll-container',
          );

        let finish =
          horScroll.scrollWidth -
          horScrollContainer.clientWidth;
        const STEP = 20;
        if (
          horScroll.scrollWidth >
          horScrollContainer.clientWidth
        ) {
          function horWheel(e) {
            pause = true;
            if (e.wheelDeltaY < 0) {
              scroll -= STEP;
              scroll = Math.max(scroll, -finish);
              horScroll.style.transform = `translateX(${scroll}px)`;
              horScroll.addEventListener(
                'transitionend',
                (e) => {
                  if (scroll == -finish) {
                    pause = false;
                    currentSection.removeEventListener(
                      'wheel',
                      horWheel,
                    );
                  }
                },
              );
            } else if (e.wheelDeltaY > 0) {
              scroll += STEP;
              scroll = Math.min(scroll, 0);
              horScroll.style.transform = `translateX(${scroll}px)`;
              horScroll.addEventListener(
                'transitionend',
                (e) => {
                  if (scroll == 0) {
                    pause = false;
                    currentSection.removeEventListener(
                      'wheel',
                      horWheel,
                    );
                  }
                },
              );
            }
          }
          currentSection.addEventListener(
            'wheel',
            horWheel,
          );
        }
      }
      if (
        currentSection &&
        currentSection.scrollHeight > window.innerHeight
      ) {
        pause = true;
        if (
          direction == 'down' &&
          currentSection.scrollHeight -
            currentSection.scrollTop >=
            currentSection.clientHeight - 20
        ) {
          pause = false;
        } else if (
          direction == 'up' &&
          currentSection.scrollTop <= 1
        ) {
          pause = false;
        }
        currentSection.addEventListener('wheel', (e) => {
          if (
            e.wheelDeltaY < 0 &&
            currentSection.scrollHeight -
              currentSection.scrollTop ===
              currentSection.clientHeight
          ) {
            setTimeout(() => {
              pause = false;
            }, 300);
          } else if (
            e.wheelDeltaY > 0 &&
            currentSection.scrollTop == 0
          ) {
            setTimeout(() => {
              pause = false;
            }, 300);
          }
        });
      }
    }
    function changeOpacity() {
      if (direction == 'down') {
        if (
          siteSlides[windPos - 1].querySelector(
            '.hide-side',
          ) &&
          siteSlides[windPos].querySelector('.hide-side')
        ) {
          siteSlides[windPos - 1].querySelector(
            '.hide-side',
          ).style.opacity = 0;
          siteSlides[windPos].querySelector(
            '.hide-side',
          ).style.opacity = 1;
        }
      } else {
        if (
          siteSlides[windPos + 1].querySelector(
            '.hide-side',
          ) &&
          siteSlides[windPos].querySelector('.hide-side')
        ) {
          siteSlides[windPos + 1].querySelector(
            '.hide-side',
          ).style.opacity = 0;
          siteSlides[windPos].querySelector(
            '.hide-side',
          ).style.opacity = 1;
        }
      }
    }
    // Переход к следующим слайдам относительно winPos
    function goToSlide() {
      anim = true;
      let target;

      if (
        direction == 'down' &&
        windPos + 1 != siteSlides.length
      ) {
        if (
          nav &&
          !siteSlides[windPos].classList.contains(
            'nav-disable',
          ) &&
          navPos + 1 < navItems.length
        )
          navPos++;
        target = siteSlides[++windPos];

        setTimeout(() => {
          target.style.transform = 'translateY(0%)';
        }, delatSizeUp);
      } else if (direction == 'up' && windPos - 1 > -1) {
        if (
          nav &&
          !siteSlides[windPos].classList.contains(
            'nav-disable',
          ) &&
          navPos - 1 > -1
        )
          navPos--;
        target = siteSlides[windPos--];

        setTimeout(() => {
          target.style.transform = 'translateY(100%)';
        }, delatSizeUp);
      }
      const contGrad = siteSlider.querySelector(
        '.testi-cont-grad',
      );
      if (contGrad) {
        if (windPos == siteSlides.length - 1) {
          if (siteSlider.classList.contains('grad')) {
            contGrad.style.background =
              'linear-gradient(180deg, #fff 0%, #dcecff 100%)';
          }
        } else {
          contGrad.style.background = null;
        }
      }
      changeOpacity();
      if (target) {
        target.classList.add('active');
        checkSlide(siteSlides[windPos]);
      }

      if (testiArray) {
        if (navPos != 0) {
          testiTabs[0].classList.remove('active');
          testiTabs[1].classList.add('active');
          testiArray.style.transform =
            'translate(-50%, 40vh)';
        } else {
          testiTabs[1].classList.remove('active');
          testiTabs[0].classList.add('active');
          testiArray.style.transform = 'translate(-50%, 0)';
        }
      }

      if (nav) {
        setNavItem(navPos);
      }
      if (target == siteSlides[siteSlides.length - 1]) {
        disableScrollSlides();
      }
      setTimeout(() => {
        anim = false;
        target?.classList.remove('active');
        direction == 'down' && !pause;
      }, delayAnim);

      // Если слайд последний и скролл вниз включаем обычный скролл
    }

    window.addEventListener('scroll', (e) => {
      if (
        pause &&
        window.scrollY == 0 &&
        direction == 'up'
      ) {
        checkOverflow();

        setTimeout(() => {
          pause = false;
        }, 300);
      } else {
      }
    });
  }
}

export { goToOtherSlide, resetScrollSettings, delayAnim };
