import { throttle } from './../functions/throttle.js';

// -------------------- Глобальные переменные --------------------
let delta, direction;
const delayAnim = 700; // Задержка на переключение слайдов
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
// -------------------- Управляем классом body-light --------------------
function setLightBody(flag) {
  flag
    ? document.body.classList.add('body-light')
    : document.body.classList.remove('body-light');
}
// Инициализация слайдов
const initSlides = (siteSlides) => {
  siteSlides.forEach((slide, i) => {
    slide.style.zIndex = i;
    if (i !== 0) {
      slide.style.transform = 'translateY(100%)';
    }

    // Устанавливаем класс `body-light` для начального слайда (если это первый слайд при загрузке)
    if (i === 0) {
      if (slide.classList.contains('site-screen-light')) {
        setLightBody(1);
      } else {
        setLightBody(0);
      }
    }
  });
};
// -------------------- Управление процессом скролла длинных секций --------------------

// Проверяем, длиннее ли секция высоты экрана
const isLongSection = (slide) => {
  slide.scrollHeight > window.innerHeight;
  console.log(slide.scrollHeight > window.innerHeight);
};

// Управляем скроллом внутри длинных секций
const processLongSectionScroll = (slide, delta) => {
  const currentScroll = slide.scrollTop; // Текущая позиция прокрутки
  const maxScroll = slide.scrollHeight - slide.clientHeight; // Максимальное значение скролла

  // Скролл вниз
  if (delta < 0) {
    if (currentScroll < maxScroll) {
      slide.scrollTop = Math.min(
        currentScroll + Math.abs(delta),
        maxScroll,
      );
      return 'inProgress'; // Продолжаем скролл внутри секции
    }
    return 'endBottom'; // Достигли конца секции
  }

  // Скролл вверх
  if (delta > 0) {
    if (currentScroll > 0) {
      slide.scrollTop = Math.max(
        currentScroll - Math.abs(delta),
        0,
      );
      return 'inProgress'; // Продолжаем скролл внутри секции
    }
    return 'endTop'; // Достигли начала секции
  }

  return 'none'; // Скролл не изменился
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
  if (
    siteSlides[windPos].classList.contains(
      'site-screen-light',
    )
  ) {
    setLightBody(1);
  } else {
    setLightBody(0);
  }

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

// Функция очистки активного класса у всех элементов навигации
const clearNav = (navItems) => {
  navItems.forEach((el) => el.classList.remove('active'));
};

// Установка активного пункта навигации
const setNavItem = (windPos, siteSlides, navItems) => {
  clearNav(navItems);

  // Собираем список видимых слайдов (без nav-disable)
  const visibleSlides = siteSlides.filter(
    (slide) => !slide.classList.contains('nav-disable'),
  );

  // Определяем индекс активного слайда среди "видимых" слайдов
  const activeIndex = visibleSlides.indexOf(
    siteSlides[windPos],
  );

  // Если индекс существующий, подсвечиваем соответствующий элемент навигации
  if (activeIndex !== -1 && navItems[activeIndex]) {
    navItems[activeIndex].classList.add('active');
  }
};

// Инициализация кликов по элементам навигации
const initNavigationClicks = (navItems, siteSlides) => {
  // Собираем список только видимых слайдов
  const visibleSlides = siteSlides.filter(
    (slide) => !slide.classList.contains('nav-disable'),
  );

  navItems.forEach((item, visibleIndex) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      // Находим реальный индекс слайда в общем массиве слайдов
      const targetSlide = visibleSlides[visibleIndex];
      const realIndex = siteSlides.indexOf(targetSlide);

      // Если реальный индекс найден, переключаемся на слайд
      if (realIndex !== -1) {
        setPosition(realIndex, siteSlides, navItems);
      }
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
  if (isLongSection(currentSlide)) {
    const sectionStatus = processLongSectionScroll(
      currentSlide,
      delta,
    );

    // Если дошли до самого низа длинной секции
    if (sectionStatus === 'endBottom' && delta < 0) {
      setPosition(windPos + 1, siteSlides, navItems);
    }

    // Если поднялись до самого верха длинной секции
    if (sectionStatus === 'endTop' && delta > 0) {
      setPosition(windPos - 1, siteSlides, navItems);
    }
    return; // Скролл длинной секции обработан
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

  if (document.querySelector('.site-screen-start')) {
    setTimeout(() => {
      setPosition(windPos + 1, siteSlides, navItems);
    }, 1500);
  }

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
