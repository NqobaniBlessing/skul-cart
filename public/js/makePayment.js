//card and form inputs
let cardNumberInput = document.querySelector('.card-number-input');
let cardNumberBox = document.querySelector('.card-number-box');
let cardHolderInput = document.querySelector('.card-holder-input');
let cardHolderName = document.querySelector('.card-holder-name');
let monthInput = document.querySelector('.month-input');
let expMonth = document.querySelector('.exp-month');
let yearInput = document.querySelector('.year-input');
let expYear = document.querySelector('.exp-year');
let cvvInput = document.querySelector('.cvv-input');
let cardFront = document.querySelector('.front');
let cardBack = document.querySelector('.back');
let cvvBox = document.querySelector('.cvv-box');
let test = document.querySelector('.box span');

let cardType = document.getElementById('cardtype');
let cardType2 = document.getElementById('cardtype-2');
let cardNumberText = document.getElementById('output-cardnumber');
let cardHolderText = document.getElementById('output-cardholder');
let monthText = document.getElementById('month-text');
let yearText = document.getElementById('year-text');
let cvvText = document.getElementById('cvv-text');
let expiresText = document.getElementById('expiresText');

cardNumberInput.oninput = () => {
  cardNumberBox.innerText = cardNumberInput.value;

  if (paymentRadioButtons[0].checked) {
    if (cardNumberInput.value[0] == 2) {
      cardType.src = 'img/mastercard-removebg.png';
      cardType2.src = 'img/mastercard-removebg.png';
    } else if (cardNumberInput.value[0] == 4) {
      cardType.src = 'img/visa-removebg.png';
      cardType2.src = 'img/visa-removebg.png';
    } else if (
      cardNumberInput.value[0] != 0 &&
      cardNumberInput.value[0] != 2 &&
      cardNumberInput.value[0] != 4 &&
      cardNumberInput.value[0] != null
    ) {
      cardType.src = 'img/zimswitch-removebg.png';
      cardType2.src = 'img/zimswitch-removebg.png';
    }
  } else if (paymentRadioButtons[1].checked) {
    if (cardNumberInput.value[0] == 0 && cardNumberInput.value[0] != null) {
      cardType.src = 'img/ecocash-1-removebg-preview.png';
    } else if (cardNumberInput.value[0] == null) {
      cardType.src = '';
      cardType2.src = '';
    }
  }
};

cardHolderInput.oninput = () => {
  cardHolderName.innerText = cardHolderInput.value;
};

monthInput.oninput = () => {
  expMonth.innerText = monthInput.value;
};

yearInput.oninput = () => {
  expYear.innerText = yearInput.value;
};

cvvInput.onmouseenter = () => {
  cardFront.style.transform = 'perspective(1000px) rotateY(-180deg)';
  cardBack.style.transform = 'perspective(1000px) rotateY(0deg)';
};

cvvInput.onmouseleave = () => {
  cardFront.style.transform = 'perspective(1000px) rotateY(0deg)';
  cardBack.style.transform = 'perspective(1000px) rotateY(180deg)';
};

cvvInput.oninput = () => {
  cvvBox.innerText = cvvInput.value;
};

const options = ['Card', 'Ecocash'];

const group = document.querySelector('#group');
group.innerHTML = options
  .map(
    option => `<div><input
type="radio"
name="payment-radio"
value="${option}"
class="radio_input"
id="${option}"
/>
<label for="${option}">${option}</label></div>`
  )
  .join(' ');

// add an event listener for the change event
let paymentRadioButtons = document.querySelectorAll(
  'input[name="payment-radio"]'
);
for (const radioButton of paymentRadioButtons) {
  radioButton.addEventListener('change', showSelected);
}

//toggling between payment options
function showSelected(e) {
  console.log(e);
  if (this.checked) {
    if (this.value == 'Ecocash') {
      cardNumberText.innerText = 'Phone Number';
      cardHolderText.innerText = 'Account Holder';
      cardNumberBox.innerText = '##########';
      cardNumberInput.value = '';
      cardHolderInput.value = '';
      monthText.classList.add('hide');
      yearText.classList.add('hide');
      cvvText.classList.add('hide');
      expiresText.classList.add('hide');
      document.querySelector('#output').innerText = `Account Holder`;
      cardFront.style.background =
        'linear-gradient(45deg, rgb(89, 89, 239), rgb(2, 2, 85))';
      cardType.src = '';
      cvvInput.classList.add('hide');
      cvvInput.disabled = true;
      monthInput.classList.add('hide');
      yearInput.classList.add('hide');
      expMonth.classList.add('hide');
      expYear.classList.add('hide');
    } else if (this.value == 'Card') {
      cardNumberText.innerText = 'Card Number';
      cardHolderText.innerText = 'Card Holder';
      cardNumberBox.innerText = '################';
      cardNumberInput.value = '';
      cardHolderInput.value = '';
      monthText.classList.remove('hide');
      yearText.classList.remove('hide');
      cvvText.classList.remove('hide');
      expiresText.classList.remove('hide');
      document.querySelector('#output').innerText = `Card Holder`;
      cardFront.style.background = 'linear-gradient(45deg, #d09459, #df7206)';
      cardType.src = '';
      cvvInput.classList.remove('hide');
      cvvInput.disabled = false;
      monthInput.classList.remove('hide');
      yearInput.classList.remove('hide');
      expMonth.classList.remove('hide');
      expYear.classList.remove('hide');
      monthInput.value = 'month';
      yearInput.value = 'year';
      expMonth.innerText = 'mm';
      expYear.innerText = 'yy';
    }
  }
}

const d = new Date();
let month_check = d.getMonth();

const validateForm = () => {
  if (paymentRadioButtons[0].checked) {
    if (!cardNumberInput.value.length || cardNumberInput.value.length < 16) {
      return showAlert('Enter a valid card number');
    } else if (!cardHolderInput.value.length || !isNaN(cardHolderInput.value)) {
      return showAlert('Enter the card holder name');
    } else if (monthInput.value == 'month') {
      return showAlert('Select the card expiry month');
    } else if (yearInput.value == 'year') {
      return showAlert('Select the card expiry year');
    } else if (!cvvInput.value.length) {
      return showAlert('Enter the CVV number');
    } else if (monthInput.value < month_check && yearInput.value == 2022) {
      return showAlert('Your card has expired, please use another one');
    }
  } else if (paymentRadioButtons[1].checked) {
    if (!cardNumberInput.value.length || cardNumberInput.value.length < 10) {
      return showAlert('Enter a valid phone number');
    } else if (!cardHolderInput.value.length || !isNaN(cardHolderInput.value)) {
      return showAlert('Enter the account holder name');
    }
  } else {
    return showAlert('You must select a payment option');
  }
  return true;
};

const submitBtn = document.querySelector('.submit-btn');

submitBtn.addEventListener('click', () => {
  if (validateForm()) {
    location.replace('/checkout');
  }
});
