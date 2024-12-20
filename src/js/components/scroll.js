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

// functions
let goToOtherSlide = null;
let resetScrollSettings = null;

if (window.matchMedia('(min-width: 1025px)').matches) {
  const siteSlider = document.querySelector('.site-slider');

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
      navItems = nav.querySelectorAll('li');
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
    if (nav) {
      const indices = [];

      function findIndicesOfOnes() {
        siteSlides.forEach((value, index) => {
          if (!value.classList.contains('nav-disable')) {
            indices.push(index);
          }
        });
        console.log(indices);
        return indices;
      }

      findIndicesOfOnes();

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

    resetScrollSettings = () => {
      windPos = 0;
      navPos = 0;
      siteSlides =
        siteSlider.querySelectorAll('.site-screen');
      initSlides();
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
      console.log('pause: ' + pause);
      if (!anim && !pause) {
        goToSlide();
      }
    }

    function handleVars() {
      // Проверяем высоту слайда, если выше - включаем в него скролл
      const currentSection =
        siteSlides[windPos].querySelector('section');

      if (currentSection.querySelector('.hor-scroll')) {
        const horScroll =
          currentSection.querySelector('.hor-scroll');
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
        currentSection.scrollHeight > window.innerHeight
      ) {
        // Обработка слайдов, у которых высота больше, чем высота экрана
        // <-- 18.11 MAYBE DELETE THIS
        // currentSection.addEventListener("scroll", (e) => {
        //   e.preventDefault();

        //   if (window.scrollY != 0) {
        //     window.scrollTo(0, 0);
        //   }
        // });
        // -->
        pause = true;
        if (
          direction == 'down' &&
          currentSection.scrollHeight -
            currentSection.scrollTop ===
            currentSection.clientHeight
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

      if (target) {
        target.classList.add('active');
        checkSlide(siteSlides[windPos]);
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
      }
    });
  }
}

export { goToOtherSlide, resetScrollSettings, delayAnim };
