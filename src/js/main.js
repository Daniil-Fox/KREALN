import './_components.js';

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
