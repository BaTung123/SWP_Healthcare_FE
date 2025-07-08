import React from "react";
import "../styles/footer.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

function Footer() {
  return (
    <footer className="main-footer-bg">
      <div className="main-footer-container">
        {/* Logo và mô tả */}
        <div className="main-footer-logo-block">
          <div className="main-footer-logo">
            <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="logo" className="main-footer-logo-img" />
            <span className="main-footer-brand">Healthcare</span>
          </div>
          <div className="main-footer-desc">
            Chúng tôi cam kết mang đến dịch vụ y tế chất lượng, an toàn và tận tâm cho cộng đồng. Hãy đồng hành cùng Healthcare để xây dựng một xã hội khỏe mạnh hơn.
          </div>
        </div>
        {/* Menu links */}
        <div className="main-footer-menu-block">
          <div className="main-footer-menu-title">Quick Links</div>
          <ul className="main-footer-menu">
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/news">Blog</a></li>
          </ul>
        </div>
        {/* Thông tin liên hệ */}
        <div className="main-footer-contact-block">
          <div className="main-footer-menu-title">Contact Us</div>
          <div className="main-footer-contact-item">
            <i className="fa-solid fa-phone"></i>
            <a href="tel:+15005467789">+1 500-546-7789</a>
          </div>
          <div className="main-footer-contact-item">
            <i className="fa-solid fa-envelope"></i>
            <a href="mailto:Healthcare@gmail.com">Healthcare@gmail.com</a>
          </div>
          <div className="main-footer-socials">
            <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#"><i className="fa-brands fa-twitter"></i></a>
            <a href="#"><i className="fa-brands fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <div className="main-footer-copyright">
        © {new Date().getFullYear()} Healthcare. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
