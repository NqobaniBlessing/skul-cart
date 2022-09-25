const themeToggler = document.querySelector('.theme-toggler');
const openBtn = document.querySelectorAll('.open');
const closeBtn = document.querySelector('#close');
const modalContainer = document.querySelector('.modal-container');
const modal = document.querySelector('.modal');
const date = new Date();

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

console.log(orderData);

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
