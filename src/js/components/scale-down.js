const slideStart = document.querySelector(
  '.site-screen-start',
);

if (slideStart) {
  const section = slideStart.querySelector('section');

  const intersectionObserver = new IntersectionObserver(
    (entries, observer) => {
      if (entries[0].isIntersecting) {
        entries[0].target.classList.add('scale-down');
      }
    },
    {
      threshold: 0.8,
    },
  );

  intersectionObserver.observe(section);
}
