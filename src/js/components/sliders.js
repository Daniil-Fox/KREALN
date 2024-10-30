import { Swiper } from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

Swiper.use([Navigation, Pagination, Autoplay])

new Swiper('.research__slider', {
  slidesPerView: 'auto',
  centeredSlides: true,
  loop: true,
  spaceBetween: 20,
  speed: 500,
  autoplay: {
    disableOnInteraction: false,
  },
  speed: 500
})
