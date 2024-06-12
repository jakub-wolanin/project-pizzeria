import { templates, select } from '../settings.js';

class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);
    thisHome.initWidgets();
  }

  render(element) {
    const thisHome = this;
    const generatedHTML = templates.homeWidget(); // Upewnij się, że szablon jest poprawnie używany

    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;

    thisHome.dom.carousel = thisHome.dom.wrapper.querySelector(select.home.carousel);
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
      items[currentIndex].classList.remove('active');
      indicators[currentIndex].classList.remove('active');
      currentIndex = index;
      items[currentIndex].classList.add('active');
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
