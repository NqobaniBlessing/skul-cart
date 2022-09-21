const themeToggler = document.querySelector('.theme-toggler');
const openBtn = document.querySelectorAll('.open');
const closeBtn = document.querySelector('#close');
const modalContainer = document.querySelector('.modal-container');
const modal = document.querySelector('.modal');
const date = new Date();

console.log(openBtn);

openBtn.forEach(btn => {
  if (btn.innerHTML.includes('Orders')) {
    modal.innerHTML = `
    <h1>Orders</h1>`;

    //Orders array
    let orders = [];

    //Fetch orders from the backend
    const getOrders = fetch('/get-orders')
      .then(res => res.json())
      .then(data => {
        for (let i = 0; i < 20; i++) {
          orders.push(data[i].order[0].name);
        }

        //Fill orders in modal
        orders.forEach((order, i) => {
          const ul = document.createElement('ul');
          const ulContent = `
                  <li>${order}</li>
                  `;
          ul.append(ulContent);
          //document.querySelector('.modal-body').appendChild(ul);
        });
      })
      .catch(err => console.log(err));
  }
  btn.addEventListener('click', () => {
    modalContainer.classList.add('show');
  });
});

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

//Orders array
let orders = [];
let paymentStatus = ['Due', 'Settled', 'Partial'];
let shippingStatus = ['Pending', 'Declined', 'Returned', 'Delivered'];

//Fetch orders from the backend
const viewOrders = fetch('/get-orders')
  .then(res => res.json())
  .then(data => {
    for (let i = 0; i < 8; i++) {
      orders.push(data[i].order[0].name);
    }

    //Fill orders in table
    orders.forEach((order, i) => {
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
