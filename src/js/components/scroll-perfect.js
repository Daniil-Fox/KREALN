import { throttle } from './../functions/throttle.js';

// -------------------- Глобальные переменные --------------------
let delta, direction;
const delayAnim = 1300; // Время задержки анимации (осталось только для блокировки скролла)
let windPos = 0; // Индекс текущего слайда
let anim = false; // Флаг блокировки анимации (скролл и навигация "забанены")
let pause = false; // Флаг паузы скролла
let isPageScrollEnabled = false; // Флаг разрешения стандартного скролла
let footerVisible = false; // Флаг видимости футера

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

// -------------------- Горизонтальная прокрутка --------------------

// Проверка: является ли слайд горизонтально прокручиваемым
const isHorizontalScrollSlide = (slide) =>
  slide.classList.contains('hor-scroll');

// Горизонтальная прокрутка в секции (логика left <-> right)
const horizontalScroll = (slide, delta) => {
  const scrollAmount = 100; // Количество пикселей для прокрутки за один "шаг"
  const maxScrollLeft =
    slide.scrollWidth - slide.clientWidth; // Правая граница

  slide.scrollBy({
    left: delta < 0 ? scrollAmount : -scrollAmount, // Прокрутка зависит от направления
    behavior: 'smooth',
  });

  // Проверяем достижение правого края
  if (slide.scrollLeft >= maxScrollLeft && delta < 0) {
    return 'endRight'; // Достигнут правый край
  }

  // Проверяем достижение левого края
  if (slide.scrollLeft <= 0 && delta > 0) {
    return 'endLeft'; // Достигнут левый край
  }

  return null;
};

// -------------------- Вертикальная прокрутка --------------------

// Смещение к слайду
const setPosition = (newPos, siteSlides, navItems) => {
  // Проверка на валидность индекса слайда
  if (newPos < 0 || newPos >= siteSlides.length) return;

  const dir = newPos > windPos ? 'down' : 'up';

  // Переключение слайдов
  if (dir === 'down') {
    // Движение вниз
    for (let i = windPos; i <= newPos; i++) {
      siteSlides[i].style.transform = 'translateY(0)'; // Показываем слайды внизу
    }
  } else if (dir === 'up') {
    // Движение вверх
    for (let i = newPos; i < windPos; i++) {
      siteSlides[i + 1].style.transform =
        'translateY(100%)'; // Прячем предыдущие слайды
    }
  }

  windPos = newPos; // Обновление индекса текущего слайда

  // Обновляем навигацию сразу после смены слайда
  setNavItem(windPos, siteSlides, navItems);

  // Если достигнут последний слайд — включаем стандартный скролл
  if (windPos === siteSlides.length - 1) {
    isPageScrollEnabled = true;
    setBodyScroll(true);
  } else {
    // На других слайдах блокируем стандартный скролл
    isPageScrollEnabled = false;
    setBodyScroll(false);
  }
};

// -------------------------------------------------------------------------

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

// Обработка скролла
const handleScroll = (siteSlides, navItems) => {
  if (anim || pause || isPageScrollEnabled) return;

  const currentSlide = siteSlides[windPos];

  // Если слайд является горизонтальным
  if (isHorizontalScrollSlide(currentSlide)) {
    const horizontalResult = horizontalScroll(
      currentSlide,
      delta,
    );

    // Переход на следующий слайд, если достигнут правый край
    if (horizontalResult === 'endRight') {
      setPosition(windPos + 1, siteSlides, navItems);
    }

    // Переход на предыдущий слайд, если достигнут левый край
    if (horizontalResult === 'endLeft') {
      setPosition(windPos - 1, siteSlides, navItems);
    }

    return; // Останавливаем выполнение, т.к. обрабатываем горизонтальную прокрутку
  }

  anim = true; // Блокируем события (и скролл)

  // Вертикальная прокрутка
  if (
    direction === 'down' &&
    windPos + 1 < siteSlides.length
  ) {
    setPosition(windPos + 1, siteSlides, navItems); // Переключаем слайд вперёд
  } else if (direction === 'up' && windPos - 1 >= 0) {
    setPosition(windPos - 1, siteSlides, navItems); // Переключаем слайд назад
  }

  setTimeout(() => {
    anim = false; // Разблокируем
  }, delayAnim);
};

// Основное событие прокрутки
const mainFunc = (e, siteSlides, navItems) => {
  delta = e.wheelDeltaY || -e.deltaY; // Определяем направление прокрутки
  direction = delta > 0 ? 'up' : 'down'; // Направление прокрутки
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

  // Проверяем количество слайдов
  if (siteSlides.length > 1) {
    console.log(
      'Multiple slides detected: disabling standard page scroll.',
    );
    setBodyScroll(false);
    initSlides(siteSlides);
    initNavigation(siteSlides, navItems);

    const footerObserver = new IntersectionObserver(
      (entries) => {
        footerVisible = entries.some(
          (entry) => entry.isIntersecting,
        );

        if (footerVisible) {
          isPageScrollEnabled = true;
          setBodyScroll(true); // Включаем стандартный скролл, когда футер виден
        } else if (windPos < siteSlides.length - 1) {
          isPageScrollEnabled = false;
          setBodyScroll(false); // Отключаем стандартный скролл, если не на последнем слайде
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

// -------------------- Инициализация навигации --------------------
const initNavigation = (siteSlides, navItems) => {
  if (!navItems || !siteSlides) return;

  const visibleSlides = siteSlides.filter(
    (slide) => !slide.classList.contains('nav-disable'),
  );

  navItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      if (anim) return; // Если идёт анимация, блокируем клики

      anim = true; // Блокируем действия

      const targetSlide = visibleSlides[index];
      const targetSlideIndex =
        siteSlides.indexOf(targetSlide);

      setPosition(targetSlideIndex, siteSlides, navItems);
      anim = false; // Разблокируем сразу после смены пункта
    });
  });

  setNavItem(0, siteSlides, navItems);
};
