const makePaymentBtn = document.querySelector('.make-payment-btn');
let loader = document.querySelector('.loader');

makePaymentBtn.addEventListener('click', () => {
  let address = getAddress();

  if (address) {
    loader.style.display = 'block';
    fetch('/order', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        order: JSON.parse(localStorage.cart),
        email: JSON.parse(sessionStorage.user).email,
        name: JSON.parse(sessionStorage.user).name,
        address: address,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.alert == 'Your order has been successfully placed') {
          delete localStorage.cart;
          showAlert(data.alert, 'Success');
          loader.style.display = 'none';
          location.replace('/mail');
        } else {
          loader.style.display = 'none';
          showAlert(data.alert);
        }
      });
  }
});

const getAddress = () => {
  //validation
  let address = document.querySelector('#address').value;
  let street = document.querySelector('#street').value;
  let city = document.querySelector('#city').value;
  let province = document.querySelector('#province').value;
  let areaCode = document.querySelector('#area-code').value;
  let landmark = document.querySelector('#landmark').value;

  if (
    !address.length ||
    !street.length ||
    !city.length ||
    !province.length ||
    !areaCode.length ||
    !landmark.length
  ) {
    return showAlert('Fill all inputs first');
  } else {
    return { address, street, city, province, areaCode, landmark };
  }
};
