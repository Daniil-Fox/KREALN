import { throttle } from './../functions/throttle.js';
import Lenis from 'lenis';

// Global variables
let delta, direction;
const delayAnim = 700;
let windPos = 0;
const HOR_SCROLL_STEP = 100;
let anim = false;
let pause = false;
let isPageScrollEnabled = false;
let footerVisible = false;
let myLenis;
let lastScrollTime = 0;
let scrollLock = false;
let lastScrollY = 0;
myLenis = new Lenis({
  duration: 0.5,
  lerp: 0.1,
  easing: (t) =>
    t < 0.5 ? 2 * t * t : -1 + 4 * t - 2 * t * t,
  smooth: true,
});
document
  .querySelector('.btn_showmore_news')
  ?.addEventListener('click', (e) => {
    setTimeout(() => {
      myLenis.resize();
    }, 50);
  });
function raf(time) {
  myLenis.raf(time);
  requestAnimationFrame(raf);
}
const testiTabs = document.querySelectorAll(
  '.testi-cont__tab',
);
const testiArray = document.querySelectorAll(
  '.testi-cont__arr',
);
const siteSlider = document.querySelector('.site-slider');
let horScrollSec = 0;

// Utility functions
function isLongSlide(slide) {
  const sec = slide.querySelector('section');
  if (!sec) return false;
  const isSlideLong = sec.scrollHeight > window.innerHeight;
  return isSlideLong;
}
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction() {
    for (
      var _len = arguments.length,
        args = new Array(_len),
        _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
const handleResize = debounce(() => {
  if (myLenis) {
    myLenis.resize();
  }
}, 250);
window.addEventListener('resize', handleResize);
const processLongSectionScroll = (slide, delta) => {
  if (!slide || typeof delta !== 'number') return 'none';
  const sec = slide.querySelector('section');
  if (!sec) return 'none';
  const currentScroll = sec.scrollTop;
  const maxScroll = sec.scrollHeight - sec.clientHeight;
  if (delta < 0 && currentScroll < maxScroll) {
    sec.scrollTop = Math.min(
      currentScroll + Math.abs(delta),
      maxScroll,
    );
    return 'inProgress';
  }
  if (delta > 0 && currentScroll > 0) {
    sec.scrollTop = Math.max(
      currentScroll - Math.abs(delta),
      0,
    );
    return 'inProgress';
  }
  return delta < 0 ? 'endBottom' : 'endTop';
};
function changeOpacity(newPos, direction, siteSlides) {
  if (!siteSlides || !Array.isArray(siteSlides)) return;
  const updateSlideOpacity = (slide, opacity) => {
    const hideSide = slide?.querySelector('.hide-side');
    if (hideSide) {
      hideSide.style.opacity = opacity;
    }
  };
  if (direction === 'down') {
    if (newPos > 0) {
      updateSlideOpacity(siteSlides[newPos - 1], 0);
    }
    updateSlideOpacity(siteSlides[newPos], 1);
  } else if (direction === 'up') {
    if (newPos < siteSlides.length - 1) {
      updateSlideOpacity(siteSlides[newPos + 1], 0);
    }
    updateSlideOpacity(siteSlides[newPos], 1);
  }
}
function updateNavigation(navItems, newPos) {
  navItems.forEach((item, index) => {
    item.classList.toggle('active', index === newPos);
  });
}
const setBodyScroll = (enabled) => {
  document.body.style.overflow = enabled
    ? 'auto'
    : 'hidden';
};
function setLightBody(flag) {
  flag
    ? document.body.classList.add('body-light')
    : document.body.classList.remove('body-light');
}
const initSlides = (siteSlides) => {
  siteSlides.forEach((slide, i) => {
    slide.style.zIndex = i;
    if (i !== 0) {
      slide.style.transform = 'translateY(100%)';
    }
    if (i === 0) {
      if (slide.classList.contains('site-screen-light')) {
        setLightBody(1);
      } else {
        setLightBody(0);
      }
    }
  });
};
const setPosition = (newPos, siteSlides, navItems) => {
  if (newPos < 0 || newPos >= siteSlides.length) return;
  anim = true;
  if (
    isPageScrollEnabled &&
    windPos === siteSlides.length - 1
  ) {
    window.scrollTo(0, 0);
    isPageScrollEnabled = false;
    setBodyScroll(false);
  }
  const currentSlide = siteSlides[windPos];
  const isCurrentLong = isLongSlide(currentSlide);
  const isCurrentAtBottom =
    isCurrentLong &&
    currentSlide.scrollTop >=
      currentSlide.scrollHeight - currentSlide.clientHeight;
  const isCurrentAtTop =
    isCurrentLong && currentSlide.scrollTop <= 0;
  if (
    newPos > windPos &&
    isCurrentLong &&
    !isCurrentAtBottom
  ) {
    anim = false;
    return;
  }
  if (
    newPos < windPos &&
    isCurrentLong &&
    !isCurrentAtTop
  ) {
    anim = false;
    return;
  }
  if (testiArray.length > 0) {
    if (newPos != 1) {
      testiTabs[0].classList.remove('active');
      testiTabs[1].classList.add('active');
      testiArray.forEach((el) => {
        el.style.transform = 'translate(-50%, 40vh)';
      });
    } else {
      testiTabs[1].classList.remove('active');
      testiTabs[0].classList.add('active');
      testiArray.forEach((el) => {
        el.style.transform = 'translate(-50%, 0)';
      });
    }
  }
  const dir = newPos > windPos ? 'down' : 'up';
  if (dir === 'down') {
    for (let i = windPos; i <= newPos; i++) {
      siteSlides[i].style.transform = 'translateY(0)';
    }
  } else if (dir === 'up') {
    siteSlides.forEach((slide, index) => {
      if (index > newPos) {
        slide.style.transform = 'translateY(100%)';
      }
    });
    for (let i = 0; i <= newPos; i++) {
      siteSlides[i].style.transform = 'translateY(0)';
    }
  }
  windPos = newPos;
  changeOpacity(newPos, dir, siteSlides);
  if (
    siteSlides[windPos].classList.contains(
      'site-screen-light',
    )
  ) {
    setLightBody(1);
  } else {
    setLightBody(0);
  }
  setNavItem(windPos, siteSlides, navItems);
  if (windPos === siteSlides.length - 1) {
    myLenis.start();
    requestAnimationFrame(raf);
    if (isLongSlide(siteSlides[windPos])) {
      siteSlides[windPos].style.position = 'relative';
      siteSlides[windPos].style.height = 'auto';
      setBodyScroll(true);
      setTimeout(() => {
        siteSlider.style.height = 'auto';
        myLenis.resize();
      }, 50);
    }
    setTimeout(() => {
      isPageScrollEnabled = true;
      setBodyScroll(true);
      anim = false;
    }, delayAnim);
  } else {
    myLenis?.stop();
    siteSlides[windPos].style.position = 'absolute';
    siteSlides[windPos].style.height = '100%';
    siteSlider.style.height = '100vh';
    isPageScrollEnabled = false;
    setBodyScroll(false);
    setTimeout(() => {
      anim = false;
    }, delayAnim);
  }
};
const clearNav = (navItems) => {
  navItems.forEach((el) => el.classList.remove('active'));
};
const setNavItem = (windPos, siteSlides, navItems) => {
  clearNav(navItems);
  const visibleSlides = siteSlides.filter(
    (slide) => !slide.classList.contains('nav-disable'),
  );
  const activeIndex = visibleSlides.indexOf(
    siteSlides[windPos],
  );
  if (activeIndex !== -1 && navItems[activeIndex]) {
    navItems[activeIndex].classList.add('active');
  }
};
const initNavigationClicks = (navItems, siteSlides) => {
  const visibleSlides = siteSlides.filter(
    (slide) => !slide.classList.contains('nav-disable'),
  );
  navItems.forEach((item, visibleIndex) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      if (anim) return;
      const targetSlide = visibleSlides[visibleIndex];
      const realIndex = siteSlides.indexOf(targetSlide);
      if (realIndex !== -1) {
        setPosition(realIndex, siteSlides, navItems);
      }
    });
  });
};
const horizontalState = new WeakMap();
const initHorizontalState = (element) => {
  if (!horizontalState.has(element)) {
    horizontalState.set(element, {
      currentTranslateX: 0,
    });
  }
};
const handleHorizontalScroll = (horScroll, delta) => {
  if (anim) return 'blocked';
  const state = horizontalState.get(horScroll);
  const horContainerWidth =
    horScroll.parentElement.clientWidth;
  const maxTranslateX =
    horScroll.scrollWidth - horContainerWidth;
  let newTranslateX = state.currentTranslateX;
  if (delta < 0) {
    horScrollSec += HOR_SCROLL_STEP;
    horScrollSec = Math.min(maxTranslateX, horScrollSec);
  } else if (delta > 0) {
    horScrollSec -= HOR_SCROLL_STEP;
    horScrollSec = Math.max(0, horScrollSec);
  }
  horScroll.style.transform = `translateX(-${horScrollSec}px)`;
  state.currentTranslateX = newTranslateX;
  if (horScrollSec === maxTranslateX) return 'endRight';
  if (horScrollSec === 0) return 'endLeft';
  return 'inProgress';
};

// Функция для разблокировки скролла
function unlockScrollIfIdle() {
  requestAnimationFrame(() => {
    const now = Date.now();
    if (now - lastScrollTime > 400) {
      scrollLock = false;
    } else {
      unlockScrollIfIdle(); // ждём ещё немного
    }
  });
}

// Функция для определения тачпада
function isTrackpad(e) {
  // Проверяем, является ли устройство тачпадом
  // Для MacBook тачпадов deltaY обычно меньше и более плавный
  return Math.abs(e.deltaY) < 20 && e.deltaMode === 0;
}
const handleScroll = (e, siteSlides, navItems) => {
  // Проверяем блокировку скролла для тачпада
  if (isTrackpad(e)) {
    if (scrollLock) return;
    const deltaY = e.deltaY;
    if (Math.abs(deltaY) < 20) return; // игнорируем слабые движения

    lastScrollTime = Date.now();
    scrollLock = true;
    unlockScrollIfIdle(); // проверяем, когда можно разблокировать
  }
  if (anim || pause) return;
  const currentSlide = siteSlides[windPos];
  const isCurrentLong = isLongSlide(currentSlide);
  const isCurrentAtBottom =
    isCurrentLong &&
    currentSlide.scrollTop >=
      currentSlide.scrollHeight -
        currentSlide.clientHeight -
        5;
  const isCurrentAtTop =
    isCurrentLong && currentSlide.scrollTop <= 5;
  if (
    windPos === siteSlides.length - 1 &&
    delta > 0 &&
    window.scrollY === 0
  ) {
    isPageScrollEnabled = false;
    setBodyScroll(false);
    setPosition(windPos - 1, siteSlides, navItems);
    return;
  }
  const lenis = new Lenis({
    duration: 0.5,
    lerp: 0.1,
    easing: (t) =>
      t < 0.5 ? 2 * t * t : -1 + 4 * t - 2 * t * t,
    smooth: true,
    wrapper: currentSlide.querySelector('section'),
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  const horScroll =
    currentSlide.querySelector('.hor-scroll');
  if (horScroll) {
    initHorizontalState(horScroll);
    const scrollStatus = handleHorizontalScroll(
      horScroll,
      delta,
    );
    if (scrollStatus === 'endRight' && delta < 0) {
      setPosition(windPos + 1, siteSlides, navItems);
    } else if (scrollStatus === 'endLeft' && delta > 0) {
      setPosition(windPos - 1, siteSlides, navItems);
    }
    return;
  }
  if (isCurrentLong) {
    const sectionStatus = processLongSectionScroll(
      currentSlide,
      delta,
    );
    if (
      sectionStatus === 'endBottom' &&
      delta < 0 &&
      isCurrentAtBottom
    ) {
      setPosition(windPos + 1, siteSlides, navItems);
    } else if (
      sectionStatus === 'endTop' &&
      delta > 0 &&
      isCurrentAtTop
    ) {
      setPosition(windPos - 1, siteSlides, navItems);
    }
    return;
  }
  if (
    direction === 'down' &&
    windPos + 1 < siteSlides.length
  ) {
    setPosition(windPos + 1, siteSlides, navItems);
  } else if (direction === 'up' && windPos - 1 >= 0) {
    setPosition(windPos - 1, siteSlides, navItems);
  }
};
const mainFunc = (e, siteSlides, navItems) => {
  // Если мы не в верхней точке страницы, не активируем слайдер
  if (window.scrollY > 0) {
    return;
  }

  if (anim || pause || isPageScrollEnabled) return;
  delta = e.wheelDeltaY || -e.deltaY;
  direction = delta > 0 ? 'up' : 'down';
  handleScroll(e, siteSlides, navItems);
  if (
    windPos == siteSlides.length - 1 &&
    window.scrollY == 0 &&
    direction == 'up'
  ) {
    isPageScrollEnabled = false;
    setBodyScroll(false);
    pause = false;
  }
};
document.addEventListener('DOMContentLoaded', () => {
  if (!window.matchMedia('(min-width: 1025px)').matches)
    return;

  // Принудительный сброс состояния при загрузке
  const resetInitialState = () => {
    // Отключаем плавный скролл при сбросе состояния
    document.documentElement.style.scrollBehavior = 'auto';

    // Принудительный сброс скролла и состояний
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    isPageScrollEnabled = false;
    footerVisible = false;
    windPos = 0;
    anim = false;
    pause = false;
    horScrollSec = 0;

    // Останавливаем Lenis скролл
    if (myLenis) {
      myLenis.stop();
      myLenis.scrollTo(0, {
        immediate: true,
      });
    }

    // Получаем все слайды
    const slides = Array.from(
      document.querySelectorAll('.site-screen'),
    );
    const siteSlider =
      document.querySelector('.site-slider');
    if (slides.length > 1) {
      // Сбрасываем позиции всех слайдов
      slides.forEach((slide, index) => {
        // Сброс трансформации и позиционирования
        if (index === 0) {
          slide.style.transform = 'translateY(0)';
        } else {
          slide.style.transform = 'translateY(100%)';
        }
        slide.style.position = 'absolute';
        slide.style.height = '100%';

        // Сброс скролла внутри секций
        const section = slide.querySelector('section');
        if (section) {
          section.scrollTop = 0;
        }
      });

      // Сброс состояния тестимониалов
      if (testiArray.length > 0) {
        testiTabs[0]?.classList.add('active');
        testiTabs[1]?.classList.remove('active');
        testiArray.forEach((el) => {
          el.style.transform = 'translate(-50%, 0)';
        });
      }

      // Устанавливаем правильное состояние для первого слайда
      if (
        slides[0].classList.contains('site-screen-light')
      ) {
        setLightBody(1);
      } else {
        setLightBody(0);
      }

      // Сброс высоты слайдера
      if (siteSlider) {
        siteSlider.style.height = '100vh';
      }
    }

    // Сброс навигации
    const nav = document.querySelector(
      '.header__nav:not(.no-active)',
    );
    if (nav) {
      const navItems = Array.from(
        nav.querySelectorAll('li:not(.no-clickable)'),
      );
      navItems.forEach((item, index) => {
        item.classList.toggle('active', index === 0);
      });
    }
  };

  // Вызываем сброс состояния при загрузке
  resetInitialState();

  // Добавляем обработчики для гарантированного сброса состояния
  window.addEventListener('beforeunload', () => {
    document.documentElement.style.scrollBehavior = 'auto';
    resetInitialState();
  });
  window.addEventListener('load', () => {
    resetInitialState();
    // Дополнительная проверка после небольшой задержки
    setTimeout(() => {
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
      // Возвращаем плавный скролл после загрузки
      document.documentElement.style.scrollBehavior =
        'smooth';
    }, 100);
  });

  // Добавляем принудительный скролл в начало при загрузке
  window.scrollTo(0, 0);

  // Сбрасываем состояния
  isPageScrollEnabled = false;
  footerVisible = false;
  windPos = 0;
  anim = false;
  pause = false;
  myLenis.stop();
  const footer = document.querySelector('footer');
  if (!siteSlider) {
    console.warn('Site slider not found');
    return;
  }
  const siteSlides = Array.from(
    siteSlider.querySelectorAll('.site-screen'),
  );
  const nav = document.querySelector(
    '.header__nav:not(.no-active)',
  );
  const navItems = nav
    ? Array.from(
        nav.querySelectorAll('li:not(.no-clickable)'),
      )
    : [];
  if (!document.querySelector('.site-screen-start')) {
    navItems[0]?.classList.add('active');
  }
  if (siteSlides.length > 1) {
    setBodyScroll(false);
    initSlides(siteSlides);
    initNavigationClicks(navItems, siteSlides);
    const footerObserver = new IntersectionObserver(
      (entries) => {
        const wasFooterVisible = footerVisible;
        footerVisible = entries.some(
          (entry) => entry.isIntersecting,
        );

        // Если футер стал видимым
        if (footerVisible && !wasFooterVisible) {
          isPageScrollEnabled = true;
          setBodyScroll(true);

          // Устанавливаем правильные стили для последнего слайда
          if (windPos === siteSlides.length - 1) {
            siteSlides[windPos].style.position = 'relative';
            siteSlides[windPos].style.height = 'auto';
            siteSlider.style.height = 'auto';
          }
        }
        // Если футер перестал быть видимым и мы на последнем слайде
        else if (
          !footerVisible &&
          wasFooterVisible &&
          windPos === siteSlides.length - 1
        ) {
          // Плавно переходим к последнему слайду
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });

          setTimeout(() => {
            isPageScrollEnabled = false;
            setBodyScroll(false);
            pause = false;
          }, 300);
        }
        // Если футер перестал быть видимым и мы не на последнем слайде
        else if (
          !footerVisible &&
          wasFooterVisible &&
          windPos < siteSlides.length - 1
        ) {
          isPageScrollEnabled = false;
          setBodyScroll(false);
        }
      },
      {
        threshold: 0.1,
      },
    );
    if (footer && footer.querySelector('.geography_filter'))
      footerObserver.observe(
        footer.querySelector('.geography_filter'),
      );
    const handleWheel = (e) => {
      // Блокируем работу слайдера, если мы не в верхней точке страницы
      if (window.scrollY > 0) {
        // Разрешаем стандартный скролл страницы
        isPageScrollEnabled = true;
        setBodyScroll(true);
        return;
      }

      if (anim || pause) {
        e.preventDefault();
        return;
      }

      // Получаем направление скролла
      const delta = e.wheelDeltaY || -e.deltaY;
      const isScrollingDown = delta < 0;
      const isScrollingUp = delta > 0;

      // Случай 1: Мы на последнем слайде и скроллим вниз - разрешаем скролл к футеру
      if (
        windPos === siteSlides.length - 1 &&
        isScrollingDown
      ) {
        if (window.scrollY === 0) {
          // Если мы в начале страницы и скроллим вниз, разрешаем обычный скролл
          isPageScrollEnabled = true;
          setBodyScroll(true);
          return;
        }
      }

      // Случай 2: Мы на последнем слайде и скроллим вверх - возвращаемся к предыдущему слайду
      // Только если мы в верхней точке страницы
      if (
        windPos === siteSlides.length - 1 &&
        isScrollingUp &&
        window.scrollY === 0
      ) {
        isPageScrollEnabled = false;
        setBodyScroll(false);
        pause = false;

        // Переходим на предыдущий слайд
        if (windPos > 0) {
          setPosition(windPos - 1, siteSlides, navItems);
        }
        return;
      }

      // Стандартная обработка для остальных случаев
      // Только если мы в верхней точке страницы
      if (window.scrollY === 0) {
        mainFunc(e, siteSlides, navItems);
      }
    };
    window.addEventListener('wheel', handleWheel, {
      passive: false,
    });
    window.addEventListener('scroll', () => {
      if (
        isPageScrollEnabled &&
        window.scrollY === 0 &&
        !footerVisible
      ) {
        isPageScrollEnabled = false;
        setBodyScroll(false);
        pause = false;
      }

      // Добавляем обработку возврата от футера
      if (footer && siteSlider) {
        const siteSlides = Array.from(
          siteSlider.querySelectorAll('.site-screen'),
        );
        const nav = document.querySelector(
          '.header__nav:not(.no-active)',
        );
        const navItems = nav
          ? Array.from(
              nav.querySelectorAll('li:not(.no-clickable)'),
            )
          : [];

        // Определяем, возвращаемся ли мы от футера к слайдеру
        // Это происходит, когда мы скроллим вверх и находимся в верхней части страницы
        const isScrollingUp = lastScrollY > window.scrollY;
        lastScrollY = window.scrollY;

        if (isScrollingUp) {
          handleReturnFromFooter(siteSlides, navItems);
        }
      }
    });
    window.addEventListener('keydown', (e) => {
      if (anim || pause || isPageScrollEnabled) {
        e.preventDefault();
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (windPos + 1 < siteSlides.length) {
          setPosition(windPos + 1, siteSlides, navItems);
        }
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (windPos - 1 >= 0) {
          setPosition(windPos - 1, siteSlides, navItems);
        }
      }
    });
    window.addEventListener('resize', () => {
      if (
        !window.matchMedia('(min-width: 1025px)').matches
      ) {
        setBodyScroll(true);
        siteSlides.forEach((slide) => {
          slide.style.transform = 'translateY(0)';
          slide.style.position = 'relative';
          slide.style.height = 'auto';
        });
        siteSlider.style.height = 'auto';
        window.removeEventListener('wheel', handleWheel);
      } else {
        if (siteSlides.length > 0) {
          initSlides(siteSlides);
          setPosition(windPos, siteSlides, navItems);
        }
      }
    });
  } else {
    console.log('less');
    siteSlider.style.height = 'auto';
    siteSlides[windPos].style.height = 'auto';
    siteSlides[windPos].style.position = 'relative';
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) =>
        t < 0.5 ? 2 * t * t : -1 + 4 * t - 2 * t * t,
      smooth: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    setBodyScroll(true);
    console.log(siteSlides[windPos].style.height);
  }
  const initInteractiveElements = () => {
    const scrollDownBtn = document.querySelector(
      '.scroll-down-btn',
    );
    if (scrollDownBtn) {
      scrollDownBtn.addEventListener('click', () => {
        if (anim) return;
        if (windPos < siteSlides.length - 1) {
          setPosition(windPos + 1, siteSlides, navItems);
        }
      });
    }
    const scrollToTopBtn = document.querySelector(
      '.scroll-to-top',
    );
    if (scrollToTopBtn) {
      scrollToTopBtn.addEventListener('click', () => {
        if (anim) return;
        if (isPageScrollEnabled) {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        } else {
          setPosition(0, siteSlides, navItems);
        }
      });
      window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight) {
          scrollToTopBtn.classList.add('visible');
        } else {
          scrollToTopBtn.classList.remove('visible');
        }
      });
    }
  };
  initInteractiveElements();

  // Добавляем обработчик для history API
  window.addEventListener('popstate', () => {
    document.documentElement.style.scrollBehavior = 'auto';
    resetInitialState();
    setTimeout(() => {
      document.documentElement.style.scrollBehavior =
        'smooth';
    }, 100);
  });

  // Обработчик для сброса состояний блокировки после взаимодействия с табами
  const contactsTabsElement = document.querySelector(
    '.contacts-ways__tabs',
  );
  if (contactsTabsElement) {
    contactsTabsElement.addEventListener('mouseup', () => {
      // Сбрасываем флаги блокировки после короткой задержки
      setTimeout(() => {
        anim = false;
        pause = false;
      }, 300);
    });
  }

  // Добавим обработчик для плавного перехода от футера к слайдеру
  const smoothTransitionHandler = () => {
    // Если мы скроллим вверх от футера и находимся близко к верху страницы
    if (
      footerVisible &&
      lastScrollY > window.scrollY &&
      window.scrollY < 100
    ) {
      // Обеспечиваем плавный переход к последнему слайду
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      // Сбрасываем флаги скролла с задержкой
      setTimeout(() => {
        footerVisible = false;
        isPageScrollEnabled = false;
        setBodyScroll(false);

        // Активируем последний слайд
        const lastSlideIndex = siteSlides.length - 1;
        setPosition(lastSlideIndex, siteSlides, navItems);
      }, 300);
    }

    // Обновляем позицию скролла
    lastScrollY = window.scrollY;
  };

  // Добавляем обработчик для плавного перехода
  window.addEventListener(
    'scroll',
    smoothTransitionHandler,
    { passive: true },
  );
});

// Удалим дублирующуюся функцию resetScrollLocks и оставим только одну версию
function resetScrollLocks() {
  // Сбрасываем все флаги блокировки скролла
  anim = false;
  pause = false;
  scrollLock = false;

  // Если мы не в верхней точке страницы, всегда разрешаем стандартный скролл
  if (window.scrollY > 0) {
    isPageScrollEnabled = true;
    setBodyScroll(true);
    return;
  }

  // Если мы находимся в футере, разрешаем скролл страницы
  if (footerVisible) {
    isPageScrollEnabled = true;
    setBodyScroll(true);
  }
  // Если мы на последнем слайде, но не в футере
  else if (
    windPos ===
    document.querySelectorAll('.site-screen').length - 1
  ) {
    // Проверяем, является ли последний слайд длинным
    const lastSlide =
      document.querySelectorAll('.site-screen')[windPos];
    if (isLongSlide(lastSlide)) {
      isPageScrollEnabled = true;
      setBodyScroll(true);
    } else {
      isPageScrollEnabled = false;
      setBodyScroll(false);
    }
  }
  // На любом другом слайде
  else {
    isPageScrollEnabled = false;
    setBodyScroll(false);
  }
}

// Модифицируем функцию handleReturnFromFooter для работы только при достижении верхней точки
const handleReturnFromFooter = (siteSlides, navItems) => {
  // Если мы не в верхней точке страницы, не активируем слайдер
  if (window.scrollY > 0) {
    return false;
  }

  if (!footerVisible || !isPageScrollEnabled) return false;

  // Проверяем, находимся ли мы в зоне перехода (близко к верху страницы)
  if (window.scrollY < window.innerHeight / 3) {
    // Устанавливаем последний слайд активным
    const lastSlideIndex = siteSlides.length - 1;

    // Сбрасываем флаги скролла
    isPageScrollEnabled = false;
    footerVisible = false;
    anim = true;

    // Плавно прокручиваем страницу наверх
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Устанавливаем правильные стили для последнего слайда
    setTimeout(() => {
      // Активируем последний слайд только если мы в верхней точке
      if (window.scrollY === 0) {
        setPosition(lastSlideIndex, siteSlides, navItems);
      }

      // Сбрасываем блокировки скролла
      setTimeout(resetScrollLocks, 300);
    }, 400);

    return true;
  }

  return false;
};

// Добавим функцию для проверки и исправления стилей при переходе между футером и последним слайдом
function ensureProperTransition() {
  const siteSlider = document.querySelector('.site-slider');
  if (!siteSlider) return;

  const siteSlides = Array.from(
    siteSlider.querySelectorAll('.site-screen'),
  );
  if (siteSlides.length === 0) return;

  const lastSlide = siteSlides[siteSlides.length - 1];

  // Проверяем, находимся ли мы на последнем слайде
  if (windPos === siteSlides.length - 1) {
    // Если мы видим футер, устанавливаем правильные стили для прокрутки
    if (footerVisible) {
      lastSlide.style.position = 'relative';
      lastSlide.style.height = 'auto';
      siteSlider.style.height = 'auto';
      isPageScrollEnabled = true;
      setBodyScroll(true);
    }
    // Если мы в начале последнего слайда (футер не виден)
    else if (window.scrollY === 0) {
      // Если слайд длинный, разрешаем скролл внутри него
      if (isLongSlide(lastSlide)) {
        lastSlide.style.position = 'relative';
        lastSlide.style.height = 'auto';
        siteSlider.style.height = 'auto';
      } else {
        // Иначе устанавливаем стандартные стили слайда
        lastSlide.style.position = 'absolute';
        lastSlide.style.height = '100%';
        siteSlider.style.height = '100vh';
      }
    }
  }
}

// Вызываем функцию проверки стилей при скролле
window.addEventListener('scroll', () => {
  // Запускаем с небольшой задержкой для стабильности
  requestAnimationFrame(ensureProperTransition);
});

// Добавляем обработчик для проверки позиции скролла
window.addEventListener('scroll', () => {
  // Если мы не в верхней точке страницы, всегда разрешаем стандартный скролл
  if (window.scrollY > 0) {
    isPageScrollEnabled = true;
    setBodyScroll(true);
  }
  // Если мы вернулись в верхнюю точку и находимся на последнем слайде
  else if (
    window.scrollY === 0 &&
    windPos ===
      document.querySelectorAll('.site-screen').length - 1
  ) {
    // Проверяем, нужно ли активировать слайдер
    if (!footerVisible) {
      isPageScrollEnabled = false;
      setBodyScroll(false);
    }
  }
});

// Добавляем периодический сброс блокировок для предотвращения "застревания" скролла
setInterval(resetScrollLocks, 2000);

// Добавляем обработчик для сброса блокировок при клике
document.addEventListener('click', () => {
  // Небольшая задержка для завершения других операций
  setTimeout(resetScrollLocks, 300);
});
