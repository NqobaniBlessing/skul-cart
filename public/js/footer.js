const createFooter = () => {
  let footer = document.querySelector('footer');

  footer.innerHTML = `
  <div class="footer-content">
        <img src="../img/solusi-logo-removebg.png" class="logo" alt="" />
        <div class="footer-ul-container">
          <p class="footer-title">About Our Company</p>
          <p class="info">
            Skul-Cart is an e-commerce platform powered by Solusi University and
            tailor-made to meet the modern student's educational needs. Varsity life has needed a radical re-thinking, so we've decided to chart the path into the future by putting university solutions all into one convenient marketplace. And the good
            news is, we're open to everybody! Join
            the education revolution as univeristy meets commerce in the 21st
            Century...
          </p>
          <p class="info">Support Emails: skulcart2022@outlook.com</p>
          <p class="info">Contact Numbers: +263773654598</p>
        </div>
      </div>
      <div class="footer-social-container">
        <div>
          <a href="#" class="social-link">terms & conditions</a>
          <a href="/Skul-Cart Privacy Policy.pdf" class="social-link">privacy policy</a>
        </div>
        <div>
          <a href="#" class="social-link">instagram</a>
          <a href="https://www.facebook.com/profile.php?id=100081308207096" class="social-link">facebook</a>
          <a href="https://twitter.com/skul_cart" class="social-link">twitter</a>
        </div>
      </div>
      <p class="footer-credit">Skul-Cart, Solusi's Own E-Commerce Platform</p>
  `;
};

createFooter();
