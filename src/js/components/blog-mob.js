const blogItems = [
  ...document.querySelectorAll(
    '.blog-slider__slider .swiper-slide',
  ),
];

if (blogItems && blogItems.length > 0) {
  const totalLength = blogItems.length;
  let visible = 3;

  const showMore = document.querySelector(
    '.blog-show-more',
  );
  blogItems
    .slice(visible)
    .forEach((el) => el.classList.add('hide'));

  showMore?.addEventListener('click', (e) => {
    visible += 3;
    e.preventDefault();
    blogItems
      .slice(0, visible)
      .forEach((el) => el.classList.remove('hide'));

    if (visible >= totalLength) {
      showMore.classList.add('hide');
    }
  });
}
