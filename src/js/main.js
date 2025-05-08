import './_components.js';
import Rellax from 'rellax';

const service = document.querySelectorAll('.service');
if (service.length > 0) {
  service.forEach((section) => {
    const serviceArr = section.querySelector(
      '.service__wrapper',
    );
    section.addEventListener('mousemove', (e) => {
      const x =
        e.pageX -
        (window.innerWidth / section.clientWidth) * 150;
      const y = e.pageY - 900;

      // serviceArr.style.transform = `translateX(${x}px)`
      serviceArr.style.setProperty('--pos', x + 'px');
    });
  });
}
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

window.addEventListener('DOMContentLoaded', (e) => {
  const circle = document.querySelectorAll(
    '.team-lic__circle circle',
  );
  if (circle.length > 0) {
    let percnetage = 32;

    let radius =
      document.querySelector('.team-lic__circle')
        .clientWidth / 2;
    circle.forEach((c) => {
      let circleLength = 2 * Math.PI * radius;
      c.setAttribute('stroke-dasharray', circleLength);
      c.setAttribute(
        'stroke-dashoffset',
        circleLength - (circleLength * percnetage) / 100,
      );
    });
  }
});

const circInfo = document.querySelectorAll('.sp-circ');

if (circInfo && circInfo.length > 0) {
  const clearActive = () => {
    circInfo.forEach((el) => el.classList.remove('active'));
  };
  circInfo.forEach((el) => {
    const btn = el.querySelector('.trigger');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      clearActive();
      el.classList.add('active');
    });
  });
}

const attachResume =
  document.querySelectorAll('.form__file');

if (attachResume.length > 0) {
  attachResume.forEach((el) => {
    const textCont = el.querySelector('span');
    const input = el.querySelector('input[type=file]');
    input.addEventListener('change', (e) => {
      const fileName = [...input.files]
        .map((item) => item.name)
        .join(',');
      textCont.textContent = fileName;
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector(
    '.header:not(.h-nav--nolist)',
  );
  const footer = document.querySelector('.footer');
  const sidebar = document.querySelector('.sidebar');
  if (footer) {
    if (
      !document
        .querySelector('.geography_filter')
        ?.closest('.site-screen')
    ) {
      function handleScroll() {
        const headerHeight = header?.offsetHeight; // Высота сайдбара
        const footerRect = footer.getBoundingClientRect(); // Положение футера
        const sidebarRect = sidebar.getBoundingClientRect(); // Положение сайдбара
        const sidebarHeight = sidebar?.offsetHeight; // Положение сайдбара

        // Если нижняя часть сайдбара касается верха футера
        if (footerRect.top <= sidebarHeight) {
          sidebar.classList.remove('fixed');
          sidebar.classList.add('stopped');

          if (header) {
            header.classList.add('stopped');
            header.classList.remove('fixed');
            header.style.top = `${
              window.scrollY +
              footerRect.top -
              header.clientHeight
            }px`;
          }

          sidebar.style.top = `${
            window.scrollY +
            footerRect.top -
            sidebar.clientHeight
          }px`;
        }
        // Если пользователь скроллит вверх и сайдбар не касается футера
        else if (window.scrollY > 0) {
          sidebar.classList.remove('stopped');
          sidebar.classList.add('fixed');
          sidebar.style.top = '0'; // Возвращаем сайдбар к фиксированной позиции

          if (header) {
            header.classList.remove('stopped');
            header.classList.add('fixed');
            header.style.top = '0'; // Возвращаем сайдбар к фиксированной позиции
          }
        }
      }

      document.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    }
  }
});
