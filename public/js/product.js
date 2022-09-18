const productImages = document.querySelectorAll('.product-images img');
const productImageSlider = document.querySelector('.image-slider');
const cartBtn = document.querySelector('.cart-btn');

let activeImageSlide = 0;

productImages.forEach((item, i) => {
  item.addEventListener('click', () => {
    productImages[activeImageSlide].classList.remove('active');
    item.classList.add('active');
    productImageSlider.style.backgroundImage = `url(${item.src})`;
    activeImageSlide = i;
  });
});

//toggle type buttons
const typeBtns = document.querySelectorAll('.type-radio-btn');
let checkedBtn = 0;
let type;

typeBtns.forEach((item, i) => {
  item.addEventListener('click', () => {
    typeBtns[checkedBtn].classList.remove('check');
    item.classList.add('check');
    checkedBtn = i;
    type = item.innerHTML;
  });
});

const setData = data => {
  let title = document.querySelector('title');
  title.innerHTML += data.name;

  //set up the images
  productImages.forEach((img, i) => {
    if (data.images[i]) {
      img.src = data.images[i];
    } else {
      img.style.display = 'none';
    }
  });
  productImages[0].click();

  //set up type buttons
  // typeBtns.forEach(item => {
  //   if (data.types.includes(item.innerHTML)) {
  //     item.style.display = 'none';
  //   }
  // });

  //set up text
  const name = document.querySelector('.product-brand');
  const shortDescription = document.querySelector('.product-short-description');
  const description = document.querySelector('.description');

  title.innerHTML += name.innerHTML = data.name;
  shortDescription.innerHTML = data.shortDescription;
  description.innerHTML = data.description;

  //pricing
  const sellPrice = document.querySelector('.product-price');
  const actualPrice = document.querySelector('.product-actual-price');
  const discount = document.querySelector('.product-discount');

  if (data.tags.includes('special-offer')) {
    sellPrice.innerHTML = `$${data.sellPrice}`;
    actualPrice.innerHTML = `$${data.actualPrice}`;
    discount.innerHTML = `(${data.discount}% off)`;
  } else if (data.tags.includes('coming-soon')) {
    sellPrice.innerHTML = `$${data.sellPrice}`;
    cartBtn.style.display = 'none';
  } else {
    sellPrice.innerHTML = `$${data.sellPrice}`;
  }

  //cart and wishlist button
  const wishListBtn = document.querySelector('.wishlist-btn');
  wishListBtn.addEventListener('click', () => {
    if (!sessionStorage.user) {
      location.replace('/login');
    } else {
      wishListBtn.innerHTML = add_product_to_cart_or_wishlist('wishlist', data);
    }
  });

  // const cartBtn = document.querySelector('.cart-btn');
  cartBtn.addEventListener('click', () => {
    if (!data.tags.includes('coming-soon')) {
      if (!sessionStorage.user) {
        location.replace('/login');
      } else {
        cartBtn.innerHTML = add_product_to_cart_or_wishlist('cart', data);
      }
    }
  });
};

//fetch data
const fetchProductData = () => {
  fetch('/get-products', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ id: productId }),
  })
    .then(res => res.json())
    .then(data => {
      setData(data);
      getProducts(data.tags[1]).then(data =>
        createProductSlider(
          data,
          '.container-for-card-slider',
          'Similar Products'
        )
      );
    })
    .catch(err => {
      location.replace('/404');
    });
};

let productId = null;
if (location.pathname != '/products') {
  productId = decodeURI(location.pathname.split('/').pop());
  fetchProductData();
}
