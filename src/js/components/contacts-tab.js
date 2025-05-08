const tabs = document.querySelectorAll(
  '.contacts-ways__tab',
);

// Функция для логирования состояния скролла
function logScrollState() {
  console.log('=== SCROLL STATE ===');
  console.log('anim:', window.anim);
  console.log('pause:', window.pause);
  console.log('scrollLock:', window.scrollLock);
  console.log(
    'isPageScrollEnabled:',
    window.isPageScrollEnabled,
  );
  console.log('footerVisible:', window.footerVisible);
  console.log(
    'myLenis active:',
    window.myLenis && !window.myLenis.isStopped,
  );
  console.log('==================');
}

// Логируем состояние скролла каждую секунду
setInterval(logScrollState, 1000);

// Также логируем при скролле
window.addEventListener('wheel', () => {
  console.log('--- Wheel event ---');
  logScrollState();
});

// Функция для сброса блокировок скролла
function resetScrollLocks() {
  // Сбрасываем все флаги блокировки скролла
  window.anim = false;
  window.pause = false;
  window.scrollLock = false;
  window.isPageScrollEnabled = true;
  window.horScrollSec = 0;

  // Запускаем Lenis скроллер если он существует
  if (window.myLenis) {
    window.myLenis.start();
    window.myLenis.resize();
  }

  // Разрешаем стандартный скролл body
  document.body.style.overflow = 'auto';

  // Исправляем позиционирование для слайдов если мы на последнем слайде
  const slides = Array.from(
    document.querySelectorAll('.site-screen'),
  );

  if (slides.length > 0) {
    const lastSlide = slides[slides.length - 1];
    if (lastSlide) {
      lastSlide.style.position = 'relative';
    }

    // Проверяем текущую позицию слайда
    const currentPos = window.windPos || 0;
    if (currentPos === slides.length - 1) {
      // Если мы на последнем слайде, устанавливаем правильные стили
      const siteSlider =
        document.querySelector('.site-slider');
      if (siteSlider) {
        siteSlider.style.height = 'auto';
      }

      lastSlide.style.position = 'relative';
      lastSlide.style.height = 'auto';
    }
  }

  // Логируем состояние после сброса
  console.log('After reset:');
  logScrollState();
}

if (tabs && tabs.length > 0) {
  const tabsContainer = document.querySelectorAll(
    '.contacts-ways__mwrap[data-contacts-tab]',
  );
  const clear = () => {
    tabs.forEach((el) => el.classList.remove('active'));
    tabsContainer.forEach((el) =>
      el.classList.remove('active'),
    );
  };
  tabs.forEach((el) => {
    el.addEventListener('click', (e) => {
      // Немедленно сбрасываем блокировки скролла
      resetScrollLocks();

      const dataset = el.dataset.contactsTab;
      clear();
      el.classList.add('active');
      document
        .querySelector(
          `.contacts-ways__mwrap[data-contacts-tab=${dataset}]`,
        )
        .classList.add('active');

      // Сбрасываем все горизонтальные скроллы
      const allHorScrolls =
        document.querySelectorAll('.hor-scroll');
      allHorScrolls.forEach((scroll) => {
        scroll.style.transform = 'translateX(0)';
      });

      // Дополнительный сброс блокировок с задержкой
      setTimeout(() => {
        resetScrollLocks();

        // Эмулируем событие ресайза для обновления обработчиков
        window.dispatchEvent(new Event('resize'));
      }, 100);

      // Еще один сброс блокировок для гарантии
      setTimeout(resetScrollLocks, 500);
    });
  });
}

// Обработчик для всех страниц с потенциальными проблемами скролла
document.addEventListener('DOMContentLoaded', () => {
  // Проверяем, находимся ли мы на странице новостей
  const isNewsPage = document.querySelector('.news-hero');
  const isContactsPage = document.querySelector(
    '.contacts-ways__tabs',
  );

  // Функция для исправления последнего слайда
  function fixLastSlideTransition() {
    const slides = Array.from(
      document.querySelectorAll('.site-screen'),
    );

    if (slides.length === 0) return;

    // Сбрасываем счетчики скролла и блокировки
    window.horScrollSec = 0;

    // Текущая позиция слайда
    const currentPos = window.windPos || 0;
    const isLastSlide = currentPos === slides.length - 1;
    const isPenultimateSlide =
      currentPos === slides.length - 2;

    if (isLastSlide || isPenultimateSlide) {
      console.log(
        `Исправление позиций слайдов. Текущий слайд: ${currentPos}, Всего слайдов: ${slides.length}`,
      );

      // Если мы близко к последнему слайду, делаем сброс блокировок
      window.anim = false;
      window.pause = false;
      window.scrollLock = false;

      // Проверяем позиционирование предпоследнего слайда
      if (isPenultimateSlide && slides[currentPos]) {
        slides[currentPos].style.zIndex = slides.length - 2;
        console.log('Исправлен предпоследний слайд');
      }

      // Проверяем позиционирование последнего слайда
      if (slides[slides.length - 1]) {
        const lastSlide = slides[slides.length - 1];
        lastSlide.style.position = 'relative';
        lastSlide.style.zIndex = slides.length - 1;

        // Если мы на последнем слайде, удостоверимся, что все настроено правильно
        if (isLastSlide) {
          const siteSlider =
            document.querySelector('.site-slider');
          if (siteSlider) {
            siteSlider.style.height = 'auto';
          }
          lastSlide.style.height = 'auto';
          window.isPageScrollEnabled = true;
          document.body.style.overflow = 'auto';

          // Убедимся, что Lenis запущен
          if (window.myLenis) {
            window.myLenis.start();
            window.myLenis.resize();
          }
        }

        console.log('Исправлен последний слайд');
      }
    }
  }

  if (isNewsPage || isContactsPage) {
    console.log(
      'Detected page with potential scroll issues, adding handlers',
    );

    // Добавляем обработчик для сброса состояний скролла
    window.addEventListener('scroll', () => {
      resetScrollLocks();
    });

    // Добавляем обработчик колеса мыши для фиксации последнего слайда
    window.addEventListener('wheel', (e) => {
      // Принудительно пересчитываем переход между последними слайдами
      fixLastSlideTransition();
    });

    // Периодически сбрасываем блокировки
    const resetInterval = setInterval(
      resetScrollLocks,
      3000,
    );

    // Периодически проверяем переход между последними слайдами
    const fixTransitionInterval = setInterval(
      fixLastSlideTransition,
      1000,
    );

    // Очищаем интервалы при уходе со страницы
    window.addEventListener('beforeunload', () => {
      clearInterval(resetInterval);
      clearInterval(fixTransitionInterval);
    });
  }

  // Проверяем, находимся ли мы на странице контактов
  if (isContactsPage) {
    console.log(
      'Страница контактов загружена, добавляем обработчики',
    );

    // Добавляем обработчик колеса мыши для сброса блокировок
    window.addEventListener(
      'wheel',
      () => {
        requestAnimationFrame(() => {
          // Сбрасываем блокировки скролла на следующем кадре анимации
          resetScrollLocks();
        });
      },
      { passive: true },
    );

    // Периодически сбрасываем блокировки
    const resetInterval = setInterval(
      resetScrollLocks,
      2000,
    );

    // Очищаем интервал при уходе со страницы
    window.addEventListener('beforeunload', () => {
      clearInterval(resetInterval);
    });
  }
});
