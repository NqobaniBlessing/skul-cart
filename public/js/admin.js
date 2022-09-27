const themeToggler = document.querySelector('.theme-toggler');
const openBtn = document.querySelectorAll('.open');
const closeBtn = document.querySelector('#close');
const modalContainer = document.querySelector('.modal-container');
const modal = document.querySelector('.modal');
const date = new Date();
let loader = document.querySelector('.loader');

window.onload = () => (loader.style.display = 'block');

closeBtn.addEventListener('click', () => {
  modalContainer.classList.remove('show');
});

//Set and display date
const dateEl = document.querySelector('#date');
dateEl.innerHTML = `<b>${date}</b>`;

//Change theme
themeToggler.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme-variables');
  themeToggler.querySelector('span').classList.toggle('active');
});

//Orders arrays
let orders = [];
let orderData = [];
let paymentStatus = ['Due', 'Settled', 'Partial'];
let shippingStatus = ['Pending', 'Declined', 'Returned', 'Delivered'];

//Fetch orders from the backend
fetch('/get-orders')
  .then(res => res.json())
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      orderData.push(data[i]);
    }
    for (let i = 0; i < 8; i++) {
      orders.push(data[i].order[0].name);
    }

    //Fill orders in table
    orders.forEach(order => {
      const tr = document.createElement('tr');
      const trContent = `
                  <td>${order}</td>
                  <td>${Math.floor(Math.random() * 82364)}</td>
                  <td>${
                    paymentStatus[
                      Math.floor(Math.random() * paymentStatus.length)
                    ]
                  }</td>
                  <td>${
                    shippingStatus[
                      Math.floor(Math.random() * shippingStatus.length)
                    ]
                  }</td>
                  <td class="primary">${'Details'}</td>`;
      tr.innerHTML = trContent;
      document.querySelector('table tbody').appendChild(tr);
    });
  })
  .catch(err => console.log(err));

const ul = document.createElement('ul');
let newOrders = [];

const clearModal = () => {
  newOrders = [];
  ul.innerHTML = '';
};

openBtn.forEach(btn => {
  btn.addEventListener('click', () => {
    switch (btn.childNodes[3].textContent) {
      case 'Customers':
        clearModal();
        modal.childNodes[1].textContent = 'Customers';

        for (let i = 0; i < orderData.length; i++) {
          newOrders.push(orderData[i].name);
        }

        customers = new Set(newOrders);
        customers.forEach(customer => {
          let li = document.createElement('li');
          li.textContent = customer;
          ul.appendChild(li);
        });

        break;
      case 'Orders':
        clearModal();
        modal.childNodes[1].textContent = 'Orders';

        for (let i = 0; i < 20; i++) {
          newOrders.push(orderData[i].order[0].name);
        }

        newOrders.forEach(order => {
          let li = document.createElement('li');
          li.textContent = order;
          ul.appendChild(li);
        });

        break;
      case 'Analytics':
        clearModal();
        modal.childNodes[1].textContent = 'Analytics';
        break;
      case 'Messages':
        clearModal();
        modal.childNodes[1].textContent = 'Messages';
        let li = `
        <li>1. This is a great service...Read more</li>
        <li>2. Keep up the good work...Read more</li>
        <li>3. I cannot find my order. Please help...Read more</li>
        <li>4. Do add this product to your catalogue...Read more</li>
        <li>5. This site is a life saver...Read more</li>
        <li>6. I can't wait to try out my new labcoat...Read more</li>
        <li>7. How long does your delivery take?...Read more</li>
        <li>8. My payment went through but on my side it says declined...Read more</li>
        <li>9. I am having trouble signing up...Read more</li>
        <li>10. Are there any extra terms for opening a seller account...Read more</li>
        `;
        ul.innerHTML = li;
        break;
      case 'Products':
        clearModal();
        modal.childNodes[1].textContent = 'Products';

        for (let i = 0; i < orderData.length; i++) {
          newOrders.push(orderData[i].order[0].name);
        }

        let products = new Set(newOrders);
        products.forEach(product => {
          let li = document.createElement('li');
          li.textContent = product;
          ul.appendChild(li);
        });

        break;
    }
    document.querySelector('.modal-body').appendChild(ul);
    modalContainer.classList.add('show');
  });
});

document.querySelector('.recent-orders a').addEventListener('click', () => {
  clearModal();
  modal.childNodes[1].textContent = 'Orders';

  for (let i = 0; i < 20; i++) {
    newOrders.push(orderData[i].order[0].name);
  }

  newOrders.forEach(order => {
    let li = document.createElement('li');
    li.textContent = order;
    ul.appendChild(li);
  });
  modalContainer.classList.add('show');
});

let sumArray = [];
let sum = 0;

let determine = fetch('/get-orders')
  .then(res => res.json())
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].order.length; j++) {
        sumArray.push(Number(data[i].order[j].sellPrice));
      }
    }
    sum = sumArray.reduce((acc, cur) => acc + cur, 0).toFixed(2);
    document.querySelector(
      '.sales .middle .left h1'
    ).textContent = `$${sum.toLocaleString('en-US')}`;
    document.querySelector(
      '.expenses .middle .left h1'
    ).textContent = `$${10450}`;
    document.querySelector('.income .middle .left h1').textContent = `$${
      sum - 10450
    }`;
    loader.style.display = 'none';
  });
