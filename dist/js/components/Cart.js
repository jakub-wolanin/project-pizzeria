import { settings, select, classNames, templates } from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();

    // console.log('new Cart', thisCart);
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);

  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', () => {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    })

    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });

    this.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    })
  }

  add(menuProduct) {
    const thisCart = this;

    // console.log('adding product', menuProduct);

    const generatedHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    // console.log('thisCart.product', thisCart.products);

    this.update();
  }

  update() {
    const thisCart = this;
    const deliveryFee = settings.cart.defaultDeliveryFee;
    let totalNumber = 0;
    let subtotalPrice = 0;

    for (const product of thisCart.products) {
      totalNumber += product.amount;
      subtotalPrice += product.price;
    }

    const totalDeliveryFee = thisCart.products.length > 0 ? deliveryFee : 0;
    thisCart.totalPrice = subtotalPrice + totalDeliveryFee;

    thisCart.totalNumber = totalNumber;
    thisCart.subtotalPrice = subtotalPrice;

    thisCart.dom.totalNumber.innerText = totalNumber;
    thisCart.dom.subtotalPrice.innerText = subtotalPrice;
    thisCart.dom.totalPrice.forEach(elem => elem.innerText = thisCart.totalPrice);
    thisCart.dom.deliveryFee.innerText = totalDeliveryFee;

    console.log(`Total items: ${totalNumber}, Subtotal: ${subtotalPrice}, Total Price: ${thisCart.totalPrice}`);
  }

  remove(cartProduct) {
    const index = this.products.indexOf(cartProduct);
    if (index !== -1) {
      this.products.splice(index, 1);
      cartProduct.dom.wrapper.remove();
      this.update();
    }
  }

  sendOrder() {
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.orders;

    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: parseFloat(thisCart.dom.deliveryFee.innerText),
      products: []
    };

    console.log(payload);

    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options);
  }
}

export default Cart;