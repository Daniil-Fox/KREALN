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

var rellax = new Rellax('.rellax', {
  speed: 2,
  center: false,
  wrapper: '.news-section',
  round: true,
  vertical: true,
  horizontal: false,
});
var body = document.body,
  html = document.documentElement;

document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector(
    '.header:not(.h-nav--nolist)',
  );
  const footer = document.querySelector('.footer');
  const sidebar = document.querySelector('.sidebar');
  const footerRect = footer.getBoundingClientRect();
  const dif =
    document.documentElement.scrollHeight -
    footerRect.height;
  if (
    !document
      .querySelector('.geography_filter')
      ?.closest('.site-screen')
  ) {
    window.addEventListener('scroll', function () {
      const headerHeight =
        header?.scrollHeight || sidebar.scrollHeight;
      const footerRect = footer.getBoundingClientRect();
      if (footerRect.top < headerHeight) {
        if (header) {
          header.style.position = 'absolute';
          header.style.top = `${100}%`;
        }
        if (sidebar) {
          sidebar.style.position = 'absolute';
          sidebar.style.top = `${100}%`;
        }
      } else {
        if (header) {
          header.style.position = 'fixed';
          header.style.top = '0';
        }
        if (sidebar) {
          sidebar.style.position = 'fixed';
          sidebar.style.top = '0';
        }
      }
    });
  }
});
