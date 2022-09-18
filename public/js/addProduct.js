let user = JSON.parse(sessionStorage.user || null);
let loader = document.querySelector('.loader');

//check if user is logged in or not
window.onload = () => {
  if (user) {
    if (!compareToken(user.authToken, user.email)) {
      location.replace('/login');
    }
  } else {
    location.replace('/login');
  }
};

//price inputs
const actualPrice = document.querySelector('#actual-price');
const discountPercentage = document.querySelector('#discount');
const sellingPrice = document.querySelector('#sell-price');

discountPercentage.addEventListener('input', () => {
  if (discountPercentage.value > 100) {
    discountPercentage.value = 90;
  } else {
    let discount = actualPrice.value * (discountPercentage.value / 100);
    sellingPrice.value = actualPrice.value - discount;
  }
});

sellingPrice.addEventListener('input', () => {
  let discount = 100 - (sellingPrice.value / actualPrice.value) * 100;
  discountPercentage.value = discount;
});

//upload image handle
let uploadImages = document.querySelectorAll('.file-upload');
let imagePaths = []; //will store the paths for uploaded images

uploadImages.forEach((fileupload, index) => {
  fileupload.addEventListener('change', () => {
    const file = fileupload.files[0];
    //console.log(file);
    let imageUrl;

    if (file.type.includes('image')) {
      //means user uploaded an image
      fetch('/s3url')
        .then(res => res.json())
        .then(url => {
          fetch(url, {
            method: 'PUT',
            headers: new Headers({ ContentType: 'multipart/form-data' }),
            body: file,
          }).then(res => {
            imageUrl = url.split('?')[0];
            imagePaths[index] = imageUrl;
            let label = document.querySelector(`label[for=${fileupload.id}]`);
            label.style.backgroundImage = `url(${imageUrl})`;
            let productImage = document.querySelector('.product-image');
            productImage.style.backgroundImage = `url(${imageUrl})`;
          });
        });
    } else {
      showAlert('You can only upload images');
    }
  });
});

//form submission
const productName = document.querySelector('#product-name');
const shortLine = document.querySelector('#short-description');
const detailedDescription = document.querySelector('#detailed-description');

let types = []; //will store all types

const stock = document.querySelector('#stock');
const tags = document.querySelector('#tags');
const tac = document.querySelector('#tac');

//buttons
const addProductBtn = document.querySelector('#add-btn');
const saveDraft = document.querySelector('#save-btn');

//store types function
const storeTypes = () => {
  types = [];
  let typeCheckBox = document.querySelectorAll('.type-checkbox');
  typeCheckBox.forEach(item => {
    if (item.checked) {
      types.push(item.value);
    }
  });
};

const validateForm = () => {
  if (!productName.value.length) {
    return showAlert('Enter product name');
  } else if (shortLine.value.length > 100 || shortLine.value.length < 10) {
    return showAlert(
      'Short description must be between 10 and 100 letters long'
    );
  } else if (!detailedDescription.value.length) {
    return showAlert('Enter detailed description about the product');
  } else if (!imagePaths.length) {
    //image link array
    return showAlert('Upload at least one product image');
  } else if (
    !actualPrice.value.length ||
    !discountPercentage.value.length ||
    !sellingPrice.value.length
  ) {
    return showAlert('You must add the pricing');
  } else if (stock.value < 20) {
    return showAlert('You should have at least 20 items in stock');
  } else if (!tags.value.length) {
    return showAlert(
      'Enter a few to tags to help with ranking your product in search'
    );
  } else if (!tac.checked) {
    return showAlert('You must agree to our terms and conditions');
  }
  return true;
};

const productData = () => {
  let tagArr = tags.value.split(',');
  tagArr.forEach((item, i) => (tagArr[i] = tagArr[i]).trim());
  return (data = {
    name: productName.value,
    shortDescription: shortLine.value,
    description: detailedDescription.value,
    images: imagePaths,
    actualPrice: actualPrice.value,
    discount: discountPercentage.value,
    sellPrice: sellingPrice.value,
    stock: stock.value,
    tags: tagArr,
    tac: tac.checked,
    email: user.email,
  });
};

addProductBtn.addEventListener('click', () => {
  //storeTypes();

  //validate form
  if (validateForm()) {
    //validateForm returns true or false while doing validation
    loader.style.display = 'block';
    let data = productData();
    if (productId) {
      data.id = productId;
    }
    sendData('/add-product', data);
  }
});

//save draft button
saveDraft.addEventListener('click', () => {
  //store types
  storeTypes();

  //check for product name
  if (!productName.value.length) {
    showAlert('Enter product name');
  } else {
    //don't validate the data
    let data = productData();
    data.draft = true;
    if (productId) {
      data.id = productId;
    }
    sendData('/add-product', data);
  }
});

//existing product detail handle

const setFormsData = data => {
  productName.value = data.name;
  shortLine.value = data.shortDescription;
  detailedDescription.value = data.description;
  actualPrice.value = data.actualPrice;
  discountPercentage.value = data.discount;
  sellingPrice.value = data.sellPrice;
  stock.value = data.stock;
  tags.value = data.tags;

  //set up images
  imagePaths = data.images;
  imagePaths.forEach((url, i) => {
    let label = document.querySelector(`label[for=${uploadImages[i].id}]`);
    label.style.backgroundImage = `url(${url})`;
    let productImage = document.querySelector('.product-image');
    productImage.style.backgroundImage = `url(${url})`;
  });

  //set up types
  //   types = data.types;
  //   let typeCheckbox = document.querySelectorAll('.type-checkbox');
  //   typeCheckbox.forEach(item => {
  //     if (types.includes(item.value)) {
  //       item.setAttribute('checked', '');
  //     }
  //   });
};

const fetchProductData = () => {
  fetch('/get-products', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ email: user.email, id: productId }),
  })
    .then(res => res.json())
    .then(data => {
      setFormsData(data);
    })
    .catch(err => {
      console.log(err);
    });
};

let productId = null;

if (location.pathname != '/add-product') {
  productId = decodeURI(location.pathname.split('/').pop());

  fetchProductData();
}
