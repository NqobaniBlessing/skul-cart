// const {
//   UserImportBuilder,
// } = require("firebase-admin/lib/auth/user-import-builder");

let loader = document.querySelector('.loader');
let user = JSON.parse(sessionStorage.user || null);

const becomeSellerElement = document.querySelector('.become-seller');
const productListingElement = document.querySelector('.product-listing');
const applyForm = document.querySelector('.apply-form');
const showApplyFormBtn = document.querySelector('#apply-btn');

window.onload = () => {
  if (user) {
    if (compareToken(user.authToken, user.email)) {
      if (!user.seller) {
        //becomeSellerElement.classList.remove('hide');
      } else {
        becomeSellerElement.classList.add('hide');
        loader.style.display = 'block';
        setupProducts();
      }
    }
  } else {
    location.replace('/login');
  }
};

showApplyFormBtn.addEventListener('click', () => {
  becomeSellerElement.classList.add('hide');
  applyForm.classList.remove('hide');
});

//form submission
const applyFormButton = document.querySelector('#apply-form-btn');
const businessName = document.querySelector('#business-name');
const address = document.querySelector('#business-address');
const about = document.querySelector('#about');
const number = document.querySelector('#number');
const legitInfo = document.querySelector('#legitInfo');
const tac = document.querySelector('#terms-and-conditions');

applyFormButton.addEventListener('click', () => {
  if (
    !businessName.value.length ||
    !address.value.length ||
    !about.value.length ||
    !number.value.length
  ) {
    showAlert('Fill all the inputs');
  } else if (!tac.checked || !legitInfo.checked) {
    showAlert(
      'You must confirm that all the information provided is legitimate'
    );
  } else {
    //making server request
    loader.style.display = 'block';
    sendData('/seller', {
      name: businessName.value,
      address: address.value,
      about: about.value,
      number: number.value,
      tac: tac.checked,
      legit: legitInfo.checked,
      email: JSON.parse(sessionStorage.user).email,
    });
  }
});

const setupProducts = () => {
  fetch('/get-products', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ email: user.email }),
  })
    .then(res => res.json())
    .then(data => {
      loader.style.display = null;
      productListingElement.classList.remove('hide');
      if (data == 'No Products') {
        let emptySvg = document.querySelector('.no-product-image');
        emptySvg.classList.remove('hide');
      } else {
        data.forEach(product => createProduct(product));
      }
    });
};
