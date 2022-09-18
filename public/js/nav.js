const createNav = () => {
  let nav = document.querySelector('.navbar');

  nav.innerHTML = `
  <div class="nav">
        <a href="/"><img src="../img/skul-cart-logo-removebg.png" class="brand-logo" alt="" /></a>
        <div class="nav-items">
          <div class="search">
            <input
              type="text"
              class="search-box"
              placeholder="search product"
            />
            <button class="search-btn">search</button>
          </div>
          <a>
          <img src="../img/user-login.png" id="user-img" alt="" />
          <div class="login-logout-popup hide">
          <p class="account-info">Log in as, name</p>
          <button class="btn" id="user-btn">Log out</button>
          </div>
          </a>
          <p class="xtra" id="my-account">My Account</p>
          <a href="/cart"><img src="../img/cart-icon.png" alt="" /></a>
          <p class="xtra">Cart</p>
        </div>
      </div>
      <ul class="links-container">
        <li class="link-item"><a href="/" class="link">home</a></li>
        <li class="link-item"><a href="/search/stationery" class="link">stationery</a></li>
        <li class="link-item"><a href="/search/gadgets" class="link">gadgets</a></li>
        <li class="link-item"><a href="/search/accessories" class="link">accessories</a></li>
        <li class="link-item"><a href="/search/extras" class="link">extras</a></li>
      </ul>
  `;
};

createNav();

//nav popup button
const userImageButton = document.querySelector('#user-img');
const userPop = document.querySelector('.login-logout-popup');
const popupText = document.querySelector('.account-info');
const actionBtn = document.querySelector('#user-btn');
const myAccount = document.querySelector('#my-account');

userImageButton.addEventListener('click', () => {
  userPop.classList.toggle('hide');
});

window.onload = () => {
  let user = JSON.parse(sessionStorage.user || null);
  if (user != null) {
    //mean user is logged in
    myAccount.innerHTML = `Hi, ${user.name.split(' ')[0]}`;
    popupText.innerHTML = `Logged in as, ${user.name}`;
    actionBtn.innerHTML = 'Log out';
    actionBtn.addEventListener('click', () => {
      sessionStorage.clear();
      delete localStorage.cart;
      location.replace('/');
    });
  } else {
    //user is not logged in
    popupText.innerHTML = 'Log in to purchase items';
    actionBtn.innerHTML = 'Log in';
    actionBtn.addEventListener('click', () => {
      location.href = '/login';
    });
  }
};

//search box
const searchBtn = document.querySelector('.search-btn');
const searchBox = document.querySelector('.search-box');

searchBtn.addEventListener('click', () => {
  if (searchBox.value.length) {
    location.href = `/search/${searchBox.value}`;
  }
});

searchBox.addEventListener('keypress', event => {
  if (searchBox.value.length && event.keyCode === 13) {
    location.href = `/search/${searchBox.value}`;
  }
});
