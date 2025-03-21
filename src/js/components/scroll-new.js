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
  const isSlideLong = sec.scrollHeight > window.innerHeight;
  return isSlideLong;
}

const processLongSectionScroll = (slide, delta) => {
  const sec = slide.querySelector('section');
  const currentScroll = sec.scrollTop;
  const maxScroll = sec.scrollHeight - sec.clientHeight;

  if (delta < 0) {
    if (currentScroll < maxScroll) {
      slide.scrollTop = Math.min(
        currentScroll + Math.abs(delta),
        maxScroll,
      );
      return 'inProgress';
    } else {
      return 'endBottom';
    }
  }

  if (delta > 0) {
    if (currentScroll > 0) {
      slide.scrollTop = Math.max(
        currentScroll - Math.abs(delta),
        0,
      );
      return 'inProgress';
    }
    return 'endTop';
  }

  return 'none';
};

function changeOpacity(newPos, direction, siteSlides) {
  if (direction === 'down') {
    if (
      newPos > 0 &&
      siteSlides[newPos - 1]?.querySelector('.hide-side')
    ) {
      siteSlides[newPos - 1].querySelector(
        '.hide-side',
      ).style.opacity = 0;
    }
    if (siteSlides[newPos]?.querySelector('.hide-side')) {
      siteSlides[newPos].querySelector(
        '.hide-side',
      ).style.opacity = 1;
    }
  }

  if (direction === 'up') {
    document.documentElement.scrollTop != 0 ?? 0;
    if (
      newPos < siteSlides.length - 1 &&
      siteSlides[newPos + 1]?.querySelector('.hide-side')
    ) {
      siteSlides[newPos + 1].querySelector(
        '.hide-side',
      ).style.opacity = 0;
    }
    if (siteSlides[newPos]?.querySelector('.hide-side')) {
      siteSlides[newPos].querySelector(
        '.hide-side',
      ).style.opacity = 1;
    }
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

  if (
    newPos > windPos &&
    isLongSlide(siteSlides[windPos]) &&
    siteSlides[windPos].scrollTop <
      siteSlides[windPos].scrollHeight -
        siteSlides[windPos].clientHeight
  ) {
    anim = false;
    return;
  }

  if (
    newPos < windPos &&
    isLongSlide(siteSlides[windPos]) &&
    siteSlides[windPos].scrollTop > 0
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
      }, delayAnim);
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
    horizontalState.set(element, { currentTranslateX: 0 });
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

const handleScroll = (e, siteSlides, navItems) => {
  if (anim || pause) return;

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

  const currentSlide = siteSlides[windPos];
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

  if (isLongSlide(currentSlide)) {
    const sectionStatus = processLongSectionScroll(
      currentSlide,
      delta,
    );

    if (sectionStatus === 'endBottom' && delta < 0) {
      setPosition(windPos + 1, siteSlides, navItems);
      lenis.destroy();
      if (windPos === siteSlides.length - 1) {
        isPageScrollEnabled = true;
        setBodyScroll(true);
      }
    }

    if (sectionStatus === 'endTop' && delta > 0) {
      setPosition(windPos - 1, siteSlides, navItems);
      lenis.destroy();
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
        footerVisible = entries.some(
          (entry) => entry.isIntersecting,
        );

        if (footerVisible) {
          isPageScrollEnabled = true;
          setBodyScroll(true);
        } else if (windPos < siteSlides.length - 1) {
          isPageScrollEnabled = false;
          setBodyScroll(false);
        }
      },
      { threshold: 0.1 },
    );

    if (footer && footer.querySelector('.geography_filter'))
      footerObserver.observe(
        footer.querySelector('.geography_filter'),
      );

    const handleWheel = (e) => {
      if (anim || pause) {
        e.preventDefault();
        return;
      }

      if (
        windPos === siteSlides.length - 1 &&
        window.scrollY === 0
      ) {
        delta = e.wheelDeltaY || -e.deltaY;
        if (delta > 0) {
          isPageScrollEnabled = false;
          setBodyScroll(false);
          pause = false;
        }
      }

      mainFunc(e, siteSlides, navItems);
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
        if (siteSlides.length > 1) {
          initSlides(siteSlides);
          setPosition(windPos, siteSlides, navItems);
        }
      }
    });
  } else {
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
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
});

export { setPosition, setBodyScroll };
