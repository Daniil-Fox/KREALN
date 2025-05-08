import { Fancybox } from '@fancyapps/ui/dist/fancybox/fancybox.esm.js';

// Создаем и добавляем стили для галереи
const style = document.createElement('style');
style.textContent = `
  .custom-gallery {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .custom-gallery.active {
    display: flex;
    opacity: 1;
    pointer-events: all;
  }

  .gallery-content {
    position: relative;
    max-width: 90%;
    max-height: 90vh;
    margin: auto;
    z-index: 99999;
  }

  .gallery-image {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    user-select: none;
    -webkit-user-drag: none;
  }

  .gallery-close {
    position: absolute;
    top: -40px;
    right: 0;
    width: 30px;
    height: 30px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    z-index: 100000;
  }

  .gallery-close::before,
  .gallery-close::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    background: white;
  }

  .gallery-close::before {
    transform: rotate(45deg);
  }

  .gallery-close::after {
    transform: rotate(-45deg);
  }

  .gallery-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 100000;
  }

  .gallery-prev {
    left: -60px;
  }

  .gallery-next {
    right: -60px;
  }

  .gallery-nav::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    border-left: 2px solid white;
    border-bottom: 2px solid white;
  }

  .gallery-prev::before {
    transform: translate(-25%, -50%) rotate(45deg);
  }

  .gallery-next::before {
    transform: translate(-75%, -50%) rotate(-135deg);
  }

  @media (max-width: 768px) {
    .gallery-nav {
      width: 30px;
      height: 30px;
    }
    .gallery-prev {
      left: -40px;
    }
    .gallery-next {
      right: -40px;
    }
  }

  body.gallery-open {
    position: fixed;
    width: 100%;
    height: 100%;
  }
`;
document.head.appendChild(style);

// Инициализация галереи
const initProjectGallery = () => {
  // Создаем элементы галереи
  const gallery = document.createElement('div');
  gallery.className = 'custom-gallery';
  gallery.innerHTML = `
    <div class="gallery-content">
      <img class="gallery-image" src="" alt="" draggable="false">
      <button class="gallery-close" aria-label="Закрыть"></button>
      <button class="gallery-prev gallery-nav" aria-label="Предыдущее изображение"></button>
      <button class="gallery-next gallery-nav" aria-label="Следующее изображение"></button>
    </div>
  `;
  document.body.appendChild(gallery);

  // Получаем элементы управления
  const galleryImage = gallery.querySelector(
    '.gallery-image',
  );
  const closeBtn = gallery.querySelector('.gallery-close');
  const prevBtn = gallery.querySelector('.gallery-prev');
  const nextBtn = gallery.querySelector('.gallery-next');

  // Сохраняем позицию слайдера
  let savedPosition;
  let currentImageIndex = 0;
  let images = [];
  let scrollPosition = 0;

  // Функция инициализации изображений для определенного контейнера
  const initializeImages = (container) => {
    if (!container) return;
    const containerImages = container.querySelectorAll(
      'img:not([data-gallery-initialized])',
    );
    if (!containerImages.length) return;

    containerImages.forEach((img) => {
      img.dataset.galleryInitialized = 'true';
      img.style.cursor = 'pointer';
      images.push(img);

      img.addEventListener('click', () =>
        openGallery(img, images.indexOf(img)),
      );
    });
  };

  // Обработчики событий
  const openGallery = (img, index) => {
    try {
      savedPosition = window.windPos;
      currentImageIndex = index;
      galleryImage.src = img.src;
      scrollPosition = window.pageYOffset;
      document.body.classList.add('gallery-open');
      document.body.style.top = `-${scrollPosition}px`;
      gallery.classList.add('active');
    } catch (error) {
      console.warn('Error in gallery open:', error);
    }
  };

  const closeGallery = () => {
    try {
      gallery.classList.remove('active');
      document.body.classList.remove('gallery-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollPosition);

      // Восстанавливаем позицию слайдера
      if (
        typeof savedPosition !== 'undefined' &&
        typeof window.windPos !== 'undefined'
      ) {
        window.windPos = savedPosition;

        // Восстанавливаем позиции слайдов если они есть
        const slides =
          document.querySelectorAll('.site-screen');
        if (slides.length) {
          slides.forEach((slide, index) => {
            if (index <= savedPosition) {
              slide.style.transform = 'translateY(0)';
            } else {
              slide.style.transform = 'translateY(100%)';
            }
          });
        }
      }
    } catch (error) {
      console.warn('Error in gallery close:', error);
    }
  };

  const showImage = (index) => {
    currentImageIndex = index;
    galleryImage.src = images[index].src;
  };

  const showNext = () => {
    const newIndex =
      (currentImageIndex + 1) % images.length;
    showImage(newIndex);
  };

  const showPrev = () => {
    const newIndex =
      (currentImageIndex - 1 + images.length) %
      images.length;
    showImage(newIndex);
  };

  // Добавляем обработчики событий
  closeBtn.addEventListener('click', closeGallery);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  // Обработка клавиш
  document.addEventListener('keydown', (e) => {
    if (!gallery.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeGallery();
        break;
      case 'ArrowLeft':
        showPrev();
        break;
      case 'ArrowRight':
        showNext();
        break;
    }
  });

  // Предотвращаем скролл при открытой галерее
  gallery.addEventListener(
    'wheel',
    (e) => {
      if (gallery.classList.contains('active')) {
        e.preventDefault();
      }
    },
    { passive: false },
  );

  // Инициализация для proj-obj
  const projectSections =
    document.querySelectorAll('.proj-obj');
  projectSections.forEach((section) => {
    initializeImages(section);
  });

  // Инициализация для research__slider
  const researchSliders = document.querySelectorAll(
    '.research__slider',
  );
  researchSliders.forEach((slider) => {
    initializeImages(slider);
  });
};

// Инициализация при загрузке страницы
document.addEventListener(
  'DOMContentLoaded',
  initProjectGallery,
);

export default initProjectGallery;
