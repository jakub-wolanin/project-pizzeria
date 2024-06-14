import { templates, select } from '../settings.js';

class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);
    thisHome.initWidgets();
  }

  render(element) {
    const thisHome = this;
    const generatedHTML = templates.homeWidget();

    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;

    thisHome.dom.carousel = thisHome.dom.wrapper.querySelector(select.home.carousel);
    thisHome.dom.carouselInner = thisHome.dom.carousel.querySelector('.carousel-inner');
  }

  initWidgets() {
    const thisHome = this;
    thisHome.initCarousel();
  }

  initCarousel() {
    const thisHome = this;
    let currentIndex = 0;
    const items = thisHome.dom.carousel.querySelectorAll('.carousel-item');
    const indicators = thisHome.dom.carousel.querySelectorAll('.carousel-indicators .indicator');
    const totalItems = items.length;

    function showSlide(index) {
      items.forEach((item, i) => {
        item.classList.remove('previous', 'next', 'active');
        if (i === index) {
          item.classList.add('active');
        } else if (i === (index - 1 + totalItems) % totalItems) {
          item.classList.add('previous');
        } else if (i === (index + 1) % totalItems) {
          item.classList.add('next');
        }
      });

      indicators[currentIndex].classList.remove('active');
      currentIndex = index;
      indicators[currentIndex].classList.add('active');
    }

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        showSlide(index);
      });
    });

    setInterval(() => {
      let nextIndex = (currentIndex + 1) % totalItems;
      showSlide(nextIndex);
    }, 3000);
  }
}

export default Home;
