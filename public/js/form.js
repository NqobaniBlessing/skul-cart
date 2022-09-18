//redirect to homepage if user logged in
window.onload = () => {
  if (sessionStorage.user) {
    user = JSON.parse(sessionStorage.user);
    if (compareToken(user.authToken, user.email)) {
      location.replace('/');
    }
  }
};

const loader = document.querySelector('.loader');

//select inputs
const submitBtn = document.querySelector('.submit-btn');
const name = document.querySelector('#name') || null;
const number = document.querySelector('#number') || null;
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const tac = document.querySelector('#terms-and-conditions') || null;
const notifications = document.querySelector('#notifications') || null;

submitBtn.addEventListener('click', () => {
  if (name != null) {
    //sign up page
    if (name.value.length < 2) {
      showAlert('Name must be at least two letters long');
    } else if (!number.value.length) {
      showAlert('Enter your phone number');
    } else if (!email.value.length) {
      showAlert('Enter your email address');
    } else if (password.value.length < 8) {
      showAlert('Password should be at least 8 characters long');
    } else if (!Number(number.value) || number.value.length < 10) {
      showAlert('Enter a valid phone number');
    } else if (!tac.checked) {
      showAlert('You must agree to our terms and conditions');
    } else {
      //submit form
      loader.style.display = 'block';
      sendData('/signup', {
        name: name.value,
        number: number.value,
        email: email.value,
        password: password.value,
        tac: tac.checked,
        notifications: notifications.checked,
        seller: false,
      });
    }
  } else {
    //login page
    if (!email.value.length || !password.value.length) {
      showAlert('Fill all the inputs');
    } else {
      loader.style.display = 'block';
      sendData('/login', {
        email: email.value,
        password: password.value,
      });
    }
  }
});
