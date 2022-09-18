const setupSlidingEffect = () => {
  const productContainers = [
    ...document.querySelectorAll('.product-container'),
  ];
  const preBtn = [...document.querySelectorAll('.pre-btn')];
  const nextBtn = [...document.querySelectorAll('.next-btn')];

  productContainers.forEach((item, i) => {
    let containerDimensions = item.getBoundingClientRect();
    let containerWidth = containerDimensions.width;

    item.style.height = '500px';

    nextBtn[i].addEventListener('click', () => {
      item.scrollLeft += containerWidth;
    });

    preBtn[i].addEventListener('click', () => {
      item.scrollLeft -= containerWidth;
    });
  });
};

//fetch product cards
const getProducts = tag => {
  return fetch('/get-products', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ tag: tag }),
  })
    .then(res => res.json())
    .then(data => {
      return data;
    });
};

//create product slider
const createProductSlider = (data, parent, title) => {
  let slideContainer = document.querySelector(`${parent}`);
  if (data == 'No Products') {
    slideContainer.innerHTML += `
  <section class="product">
    <h2 class="product-category">No Products Found</h2>
  </section>
  `;
  } else {
    slideContainer.innerHTML += `
    <section class="product">
      <h2 class="product-category">${title}</h2>
        <button class="pre-btn">
          <img src="../img/small-arrow-removebg.png" alt="" />
        </button>
        <button class="next-btn">
          <img src="../img/small-arrow-removebg.png" alt="" />
        </button>
        ${createProductCards(data)}
    </section>
    `;
  }

  setupSlidingEffect();
};

const createProductCards = (data, parent) => {
  //here parent is for search product
  let start = '<div class="product-container">';
  let middle = ''; //this will contain card HTML
  let end = '</div>';

  for (let i = 0; i < data.length; i++) {
    if (
      data[i].id != decodeURI(location.pathname.split('/').pop()) &&
      data[i].tags.includes('special-offer')
    ) {
      middle += `
    <div class="product-card">
          <div class="product-image">
            <span class="discount-tag">${data[i].discount}% off</span>
            <img src="${data[i].images[0]}" class="product-thumb" onclick="location.href = '/products/${data[i].id}'" alt="" />
          </div>
          <div class="product-info" onclick="location.href = '/products/${data[i].id}'">
            <h2 class="product-brand">${data[i].name}</h2>
            <p class="product-short-description">
              ${data[i].shortDescription}
            </p>
            <span class="price">$${data[i].sellPrice}</span><span class="actual-price">$${data[i].actualPrice}</span>
          </div>
        </div>
    `;
    } else {
      middle += `
    <div class="product-card">
          <div class="product-image">
          <style>.product-thumb {cursor: pointer;}</style>
            <img src="${data[i].images[0]}" class="product-thumb" onclick="location.href = '/products/${data[i].id}'" alt="" />
          </div>
          <style>.product-info {cursor: pointer;}</style>
          <div class="product-info" onclick="location.href = '/products/${data[i].id}'">
            <h2 class="product-brand">${data[i].name}</h2>
            <p class="product-short-description">
              ${data[i].shortDescription}
            </p>
            <span class="price">$${data[i].sellPrice}</span>
          </div>
        </div>
    `;
    }
  }

  if (parent) {
    let cardContainer = document.querySelector(parent);
    cardContainer.innerHTML = start + middle + end;
  } else {
    return start + middle + end;
  }
};

const add_product_to_cart_or_wishlist = (type, product) => {
  let data = JSON.parse(localStorage.getItem(type));
  if (data == null) {
    data = [];
  }

  product = {
    item: 1,
    name: product.name,
    sellPrice: product.sellPrice,
    type: type || null,
    shortDescription: product.shortDescription,
    image: product.images[0],
  };

  data.push(product);
  localStorage.setItem(type, JSON.stringify(data));
  return 'added';
};
