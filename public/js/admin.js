const themeToggler = document.querySelector('.theme-toggler');

//Change theme
themeToggler.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme-variables');
  themeToggler.querySelector('span').classList.toggle('active');
});

//Fill orders in  table
/*Orders.forEach(order => {
    const tr = document.createElement('tr');
    const trContent = `
                <td>${order.ProductName}</td>
                <td>${order.ProductNumber}</td>
                <td>${order.PaymentStatus}</td>
                <td class="warning">${order.ShippingStatus}</td>
                <td class="primary">${order.ProductName}</td>
    `;
    tr.innerHTML = trContent;
    document.querySelector('table tbody').appendChilde(tr);
}) */
