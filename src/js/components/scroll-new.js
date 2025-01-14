import { throttle } from './../functions/throttle.js';

// -------------------- Глобальные переменные --------------------
let delta, direction;
const delayAnim = 1300; // Задержка на переключение слайдов
let windPos = 0; // Индекс текущего слайда
const HOR_SCROLL_STEP = 100; // Шаг прокрутки в hor-scroll
let anim = false; // Флаг блокировки анимации
let pause = false; // Пауза прокрутки
let isPageScrollEnabled = false; // Включение стандартного скролла
let footerVisible = false; // Флаг видимости футера

let horScrollSec = 0;
// -------------------- Утилитарные функции --------------------

// Отключение/включение стандартной прокрутки страницы
const setBodyScroll = (enabled) => {
  document.body.style.overflow = enabled
    ? 'auto'
    : 'hidden';
};

// Инициализация слайдов
const initSlides = (siteSlides) => {
  siteSlides.forEach((slide, i) => {
    slide.style.zIndex = i;
    slide.style.transform =
      i === 0 ? 'translateY(0)' : 'translateY(100%)'; // Первый слайд виден, остальные спрячем
  });
};

// Смещение к слайду
const setPosition = (newPos, siteSlides, navItems) => {
  if (newPos < 0 || newPos >= siteSlides.length) return;

  const dir = newPos > windPos ? 'down' : 'up';

  // Переключение слайдов
  if (dir === 'down') {
    for (let i = windPos; i <= newPos; i++) {
      siteSlides[i].style.transform = 'translateY(0)';
    }
  } else if (dir === 'up') {
    for (let i = newPos; i < windPos; i++) {
      siteSlides[i + 1].style.transform =
        'translateY(100%)';
    }
  }

  windPos = newPos;

  // Обновляем навигацию
  setNavItem(windPos, siteSlides, navItems);

  // Отдельно обрабатываем случай последнего слайда
  // Разрешаем стандартный скролл ТОЛЬКО после завершения анимации
  if (windPos === siteSlides.length - 1) {
    setTimeout(() => {
      isPageScrollEnabled = true;
      setBodyScroll(true);
    }, delayAnim); // Включаем стандартный скролл после завершения анимации
  } else {
    isPageScrollEnabled = false;
    setBodyScroll(false); // Отключаем стандартный скролл для всех других слайдов
  }
};

// -------------------- Навигация --------------------

// Очистка класса активного элемента навигации
const clearNav = (navItems) => {
  navItems.forEach((el) => el.classList.remove('active'));
};

// Подсветка активного пункта навигации
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

// Добавление обработчиков кликов для навигации
const initNavigationClicks = (navItems, siteSlides) => {
  navItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault(); // Отключаем стандартное поведение ссылок
      if (anim) return; // Блокируем, если идёт анимация
      if (window.scrollY != 0) window.scrollTo(0, 0);
      setPosition(index, siteSlides, navItems); // Переход к слайду по индексу
    });
  });
};

// -------------------- Горизонтальная прокрутка (.hor-scroll) --------------------

// Карта для хранения состояния translateX каждого элемента .hor-scroll
const horizontalState = new WeakMap();

const initHorizontalState = (element) => {
  if (!horizontalState.has(element)) {
    horizontalState.set(element, { currentTranslateX: 0 });
  }
};

const handleHorizontalScroll = (horScroll, delta) => {
  const state = horizontalState.get(horScroll);
  const horContainerWidth =
    horScroll.parentElement.clientWidth;
  const maxTranslateX =
    horScroll.scrollWidth - horContainerWidth; // Крайняя точка вправо

  let newTranslateX = state.currentTranslateX;
  // Прокрутка вниз (вправо)
  if (delta < 0) {
    horScrollSec += HOR_SCROLL_STEP;

    horScrollSec = Math.min(maxTranslateX, horScrollSec);
  }
  // Прокрутка вверх (влево)
  else if (delta > 0) {
    horScrollSec -= HOR_SCROLL_STEP;
    horScrollSec = Math.max(0, horScrollSec);
  }

  horScroll.style.transform = `translateX(-${horScrollSec}px)`;
  state.currentTranslateX = newTranslateX;

  // Возвращаем статус прокрутки
  if (horScrollSec === maxTranslateX) return 'endRight';
  if (horScrollSec === 0) return 'endLeft';
  return 'inProgress';
};

// -------------------- Обработка прокрутки --------------------

const handleScroll = (siteSlides, navItems) => {
  if (anim || pause || isPageScrollEnabled) return;

  const currentSlide = siteSlides[windPos];
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

    return; // Прекращаем выполнение, так как был обработан hor-scroll
  }

  // Если нет hor-scroll, продолжаем работу эталонного кода
  anim = true;

  if (
    direction === 'down' &&
    windPos + 1 < siteSlides.length
  ) {
    setPosition(windPos + 1, siteSlides, navItems);
  } else if (direction === 'up' && windPos - 1 >= 0) {
    setPosition(windPos - 1, siteSlides, navItems);
  }

  setTimeout(() => {
    anim = false;
  }, delayAnim);
};

// Основное событие прокрутки
const mainFunc = (e, siteSlides, navItems) => {
  delta = e.wheelDeltaY || -e.deltaY;
  direction = delta > 0 ? 'up' : 'down';
  handleScroll(siteSlides, navItems);
};

// -------------------- Инициализация --------------------
document.addEventListener('DOMContentLoaded', () => {
  if (!window.matchMedia('(min-width: 1025px)').matches)
    return;

  const siteSlider = document.querySelector('.site-slider');
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

  if (siteSlides.length > 1) {
    setBodyScroll(false);
    initSlides(siteSlides);
    initNavigationClicks(navItems, siteSlides); // Инициализация кликов по навигации

    const footerObserver = new IntersectionObserver(
      (entries) => {
        footerVisible = entries.some(
          (entry) => entry.isIntersecting,
        );

        if (footerVisible) {
          isPageScrollEnabled = true;
          setBodyScroll(true); // Включаем стандартный скролл, если виден футер
        } else if (windPos < siteSlides.length - 1) {
          isPageScrollEnabled = false;
          setBodyScroll(false); // Отключаем стандартный скролл
        }
      },
      { threshold: 0.1 },
    );

    if (footer) footerObserver.observe(footer);

    const throttledMainFunc = throttle(
      (e) => mainFunc(e, siteSlides, navItems),
      300,
    );
    window.addEventListener('wheel', throttledMainFunc);

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
  } else {
    console.log(
      'Insufficient slides detected: enabling standard page scroll.',
    );
    setBodyScroll(true);
  }
});
