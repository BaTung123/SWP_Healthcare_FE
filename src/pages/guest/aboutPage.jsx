//Giới thiệu tổ chức/cơ sở y tế.
import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../../styles/aboutPage.css";

function AboutPage() {
  return (
    <div className="about-bg">
      <div className="about-header">Về chúng tôi</div>
      <div className="about-main">
        {/* Section 1: Intro */}
        <div className="about-intro-row">
          <div className="about-intro-left">
            <div className="about-intro-video-wrap">
              <img
                src="https://liveyourlifept.com/blog/wp-content/uploads/2017/01/Give-blood-save-life.jpg"
                alt="Hình ảnh giới thiệu"
                className="about-intro-video-img"
              />
            </div>

            <div className="about-intro-desc">
              Chúng tôi là một tổ chức hướng đến cộng đồng, cam kết cứu sống nhiều người thông qua hoạt động hiến máu. Sứ mệnh của chúng tôi là kết nối những người hiến máu nhân ái với những bệnh nhân cần máu khẩn cấp, đồng thời đảm bảo tiêu chuẩn chăm sóc, an toàn và chuyên nghiệp cao nhất trong suốt quá trình hiến máu.
            </div>
            <div className="about-progress-list">
              <div className="about-progress-item">
                <div className="about-progress-label">Đội ngũ y tế chứng nhận</div>
                <div className="about-progress-bar"><div style={{ width: '95%' }}></div></div>
                <div className="about-progress-percent">95%</div>
              </div>
              <div className="about-progress-item">
                <div className="about-progress-label">Trang thiết bị hiện đại</div>
                <div className="about-progress-bar"><div style={{ width: '90%' }}></div></div>
                <div className="about-progress-percent">90%</div>
              </div>
              <div className="about-progress-item">
                <div className="about-progress-label">Môi trường hiến máu an toàn</div>
                <div className="about-progress-bar"><div style={{ width: '95%' }}></div></div>
                <div className="about-progress-percent">95%</div>
              </div>
            </div>
          </div>
          <div className="about-intro-right">
            <div className="about-intro-badge">CHÚNG TÔI LÀ AI</div>
            <div className="about-intro-title">
              Tận tâm <span>cứu sống</span> qua hoạt động hiến máu
            </div>
            <div className="about-intro-text">
              Chúng tôi hợp tác với các bệnh viện, trường học và trung tâm cộng đồng để việc hiến máu trở nên dễ tiếp cận và ý nghĩa. Đội ngũ tình nguyện viên và y tế của chúng tôi luôn nỗ lực mang lại trải nghiệm hiến máu nhanh chóng, an toàn và đáng nhớ cho mọi người.
            </div>
            <ul className="about-intro-list">
              <li>Khuyến khích hiến máu thường xuyên.</li>
              <li>Hợp tác với các đơn vị y tế.</li>
              <li>Tổ chức các chương trình hiến máu lưu động.</li>
              <li>Nâng cao nhận thức qua các chiến dịch.</li>
              <li>Cung cấp dịch vụ hiến máu khẩn cấp 24/7.</li>
            </ul>
            <div className="about-intro-reviews">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="user1" />
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="user2" />
              <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="user3" />
              <img src="https://randomuser.me/api/portraits/women/46.jpg" alt="user4" />
              <span className="about-intro-stars">★★★★★</span>
              <span className="about-intro-review-count">(3k+ đánh giá từ người hiến máu)</span>
            </div>
            <div className="about-intro-hours">
              <div className="about-intro-hours-title">Giờ tiếp nhận hiến máu</div>
              <div className="about-intro-hours-desc">Đến trực tiếp hoặc đặt lịch để hiến máu.</div>
              <div className="about-intro-hours-table">
                <div><span>Thứ 2 - Thứ 6 :</span> <b>8h - 18h</b></div>
                <div><span>Thứ 7 :</span> <b>8h - 12h</b></div>
                <div className="about-intro-hours-emergency">Nhận hiến máu khẩn cấp 24/7</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Stats */}
        <div className="about-stats-row">
          <div className="about-stats-left">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="user1" />
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="user2" />
            <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="user3" />
            <img src="https://randomuser.me/api/portraits/women/46.jpg" alt="user4" />
            <span className="about-stats-booking">300+ lượt đăng ký hiến máu trong tuần này</span>
          </div>
          <div className="about-stats-center">
            <div className="about-stats-item">
              <div className="about-stats-icon"><i className="fa-solid fa-droplet"></i></div>
              <div className="about-stats-value">10k+</div>
              <div className="about-stats-label">Đơn vị máu đã tiếp nhận</div>
            </div>
            <div className="about-stats-item">
              <div className="about-stats-icon"><i className="fa-solid fa-hand-holding-medical"></i></div>
              <div className="about-stats-value">200+</div>
              <div className="about-stats-label">Tình nguyện viên hoạt động</div>
            </div>
            <div className="about-stats-item">
              <div className="about-stats-icon"><i className="fa-solid fa-building"></i></div>
              <div className="about-stats-value">35</div>
              <div className="about-stats-label">Bệnh viện đối tác</div>
            </div>
            <div className="about-stats-item">
              <div className="about-stats-icon"><i className="fa-solid fa-heart"></i></div>
              <div className="about-stats-value">50k+</div>
              <div className="about-stats-label">Cuộc sống được cứu giúp</div>
            </div>
          </div>
          <div className="about-stats-right">
            <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="logo1" className="about-stats-logo" />
            <img src="https://cdn-icons-png.flaticon.com/512/3774/3774297.png" alt="logo2" className="about-stats-logo" />
            <img src="https://cdn-icons-png.flaticon.com/512/3774/3774295.png" alt="logo3" className="about-stats-logo" />
          </div>
        </div>

        {/* Section 3: Volunteers */}
        <div className="about-doctors-row">
          <div className="about-doctors-header">
            <div className="about-doctors-badge">ĐỘI NGŨ TÌNH NGUYỆN</div>
            <div className="about-doctors-title">
              Gặp gỡ <span>đội ngũ hỗ trợ hiến máu</span> đầy nhiệt huyết
            </div>
            <div className="about-doctors-desc">
              Đằng sau mỗi chương trình hiến máu thành công là đội ngũ tình nguyện viên và nhân viên tận tâm, luôn mong muốn tạo ra sự khác biệt. Chúng tôi cùng nhau truyền cảm hứng cho cộng đồng và xây dựng mạng lưới hỗ trợ cứu người.
            </div>
          </div>
          <div className="about-doctors-list">
            <div className="about-doctor-card">
              <img src="https://randomuser.me/api/portraits/men/31.jpg" alt="George Taylor" className="about-doctor-img" />
              <div className="about-doctor-name">George Taylor</div>
              <div className="about-doctor-special">Điều phối viên kết nối người hiến</div>
              <div className="about-doctor-icon"><i className="fa-solid fa-users"></i></div>
              <button className="about-doctor-btn">Liên hệ</button>
            </div>
            <div className="about-doctor-card">
              <img src="https://randomuser.me/api/portraits/women/41.jpg" alt="Jenny Smith" className="about-doctor-img" />
              <div className="about-doctor-name">Jenny Smith</div>
              <div className="about-doctor-special">Quản lý tình nguyện viên</div>
              <div className="about-doctor-icon"><i className="fa-solid fa-handshake-angle"></i></div>
              <button className="about-doctor-btn">Liên hệ</button>
            </div>
            <div className="about-doctor-card">
              <img src="https://randomuser.me/api/portraits/women/42.jpg" alt="Alexis South" className="about-doctor-img" />
              <div className="about-doctor-name">Alexis South</div>
              <div className="about-doctor-special">Quản lý tình nguyện viên</div>
              <div className="about-doctor-icon"><i className="fa-solid fa-shield-heart"></i></div>
              <button className="about-doctor-btn">Liên hệ</button>
            </div>
            <div className="about-doctor-card">
              <img src="https://randomuser.me/api/portraits/women/43.jpg" alt="Cavin Keith" className="about-doctor-img" />
              <div className="about-doctor-name">Cavin Keith</div>
              <div className="about-doctor-special">Phụ trách y tế & an toàn</div>
              <div className="about-doctor-icon"><i className="fa-solid fa-shield-heart"></i></div>
              <button className="about-doctor-btn">Liên hệ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;