//Trang chủ: giới thiệu cơ sở y tế, tài liệu nhóm máu, blog chia sẻ.
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import '../../styles/homePage.css';
import axios from "axios";

function HomePage() {
  const navigate = useNavigate();

  // State cho blog mới nhất
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBlog, setCurrentBlog] = useState(0);
  const visibleCount = 3;
  const handlePrevBlog = () => {
    setCurrentBlog((prev) => (prev - 1 + posts.length) % posts.length);
  };
  const handleNextBlog = () => {
    setCurrentBlog((prev) => (prev + 1) % posts.length);
  };
  const getVisibleBlogs = () => {
    if (!Array.isArray(posts) || posts.length === 0) return [];
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
      result.push(posts[(currentBlog + i) % posts.length]);
    }
    return result;
  };

  // Format date giống newsPage
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString;
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("https://localhost:7293/api/Blog");
        const data = Array.isArray(response.data.data.blogs) ? response.data.data.blogs : [];
        setPosts(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải bài viết.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <div className="home-bg">
      {/* HERO SECTION */}
      <div className="home-hero">
        <div className="home-hero-left">
          <div className="home-hero-badge">HỖ TRỢ HIẾN MÁU</div>
          <div className="home-hero-title">
            Hiến máu,<br />
            <span>Cứu người</span>
          </div>
          <div className="home-hero-desc">
            Tham gia sứ mệnh hỗ trợ y tế và tạo nên sự khác biệt qua việc hiến máu. Mỗi giọt máu đều quý giá, đóng góp của bạn có thể cứu sống nhiều người.
          </div>
          <div className="home-hero-actions">
            <button className="home-hero-btn">TRỞ THÀNH NGƯỜI HIẾN MÁU</button>
            <a className="home-hero-phone" href="tel:4356789988">
              <i className="fa-solid fa-phone"></i> (435)-678-9988
            </a>
          </div>
        </div>
        <div className="home-hero-right">
          <img src="https://cdn.24h.com.vn/upload/3-2024/images/2024-07-21/1721524041-bs-va-n-1-jpg-2195-1721273181-width680height1020.jpg" alt="Bác sĩ" className="home-hero-img" />
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="home-hero-info-row">
        <div className="home-hero-info-card">
          <div className="home-hero-info-icon"><i className="fa-solid fa-hand-holding-medical"></i></div>
          <div className="home-hero-info-title">Hỗ trợ hiến máu 24/7</div>
          <div className="home-hero-info-desc">Đội ngũ phản ứng nhanh luôn sẵn sàng hỗ trợ nhu cầu máu khẩn cấp.</div>
        </div>
        <div className="home-hero-info-card">
          <div className="home-hero-info-icon"><i className="fa-solid fa-droplet"></i></div>
          <div className="home-hero-info-title">Tài liệu nhóm máu</div>
          <div className="home-hero-info-desc">Hướng dẫn chi tiết về các nhóm máu và sự tương thích cho người hiến và nhận.</div>
        </div>
      </div>

       {/* BLOGS SHARING SECTION */}
       <div className="home-section">
        <div className="home-section-badge">BLOG MỚI NHẤT</div>
        <div className="home-section-title">Tin tức & <span>Trải nghiệm mới</span></div>
        <div className="home-section-desc">Cập nhật các bài viết mới nhất về hiến máu, hướng dẫn hữu ích và câu chuyện truyền cảm hứng.</div>
        <div style={{ position: 'relative' }}>
          <button
            className="blog-scroll-btn left"
            style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: '#fff', border: 'none', borderRadius: '50%', boxShadow: '0 2px 8px #ccc', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={handlePrevBlog}
            aria-label="Prev blog"
            disabled={posts.length === 0}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div className="home-department-list" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 360, gap: 24 }}>
            {loading ? (
              <div>Đang tải bài viết...</div>
            ) : error ? (
              <div style={{ color: 'red' }}>{error}</div>
            ) : (
              getVisibleBlogs().map((post, idx) => (
                <div
                  className="home-department-card"
                  key={post?.id || post?.title || idx}
                  onClick={() => handleBlogClick(post.id)}
                  style={{ cursor: 'pointer', minWidth: 280, maxWidth: 320, flex: '0 0 320px' }}
                >
                  <img src={post?.imageUrl || post?.image} alt={post?.title} className="home-department-img" />
                  <div className="home-department-title">{post?.title}</div>
                  <div className="home-department-desc">Đọc về những cập nhật mới nhất trong lĩnh vực hiến máu và chăm sóc sức khỏe.</div>
                  <div className="home-department-meta">{formatDate(post?.createdAt)}</div>
                </div>
              ))
            )}
          </div>
          <button
            className="blog-scroll-btn right"
            style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: '#fff', border: 'none', borderRadius: '50%', boxShadow: '0 2px 8px #ccc', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={handleNextBlog}
            aria-label="Next blog"
            disabled={posts.length === 0}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* DEPARTMENT SECTION */}
      <div className="home-section">
        <div className="home-section-header-row">
          <div className="home-section-badge">DỊCH VỤ</div>
          <div className="home-section-title">Chúng tôi cung cấp <span>chăm sóc toàn diện</span></div>
          <div className="home-section-desc">Các phòng ban hỗ trợ đầy đủ: tư vấn hiến máu, kiểm tra sức khỏe, chăm sóc sau hiến máu.</div>
          <button className="home-section-btn">XEM DỊCH VỤ</button>
        </div>
        <div className="home-department-list">
          <div className="home-department-card">
            <div className="home-department-number">01</div>
            <div className="home-department-icon"><i className="fa-solid fa-notes-medical"></i></div>
            <div className="home-department-title">Khám sức khỏe người hiến</div>
            <div className="home-department-desc">Khám sức khỏe cơ bản trước khi hiến để đảm bảo an toàn và đủ điều kiện.</div>
            <a className="home-department-link" href="#">TÌM HIỂU THÊM..</a>
          </div>
          <div className="home-department-card">
            <div className="home-department-number">02</div>
            <div className="home-department-icon"><i className="fa-solid fa-heart"></i></div>
            <div className="home-department-title">Giáo dục nhóm máu</div>
            <div className="home-department-desc">Hiểu về nhóm máu của bạn và ai có thể nhận/cho máu với bạn.</div>
            <a className="home-department-link" href="#">TÌM HIỂU THÊM..</a>
          </div>
          <div className="home-department-card">
            <div className="home-department-number">03</div>
            <div className="home-department-icon"><i className="fa-solid fa-hospital-user"></i></div>
            <div className="home-department-title">Mạng lưới bệnh viện</div>
            <div className="home-department-desc">Liên kết các bệnh viện, trung tâm hiến máu, truyền máu và chăm sóc.</div>
            <a className="home-department-link" href="#">TÌM HIỂU THÊM..</a>
          </div>
        </div>
      </div>

      {/* INTRODUCTION SECTION */}
      <div className="home-section home-intro-section">
        <div className="home-section-badge">VỀ CHÚNG TÔI</div>
        <div className="home-section-title">Chúng tôi đam mê<br /><span>cứu sống con người</span></div>
        <div className="home-intro-row">
          <div className="home-intro-left">
            <img src="https://dtdxsaqq5q4.cloudfront.net/sites/biologicalsciences/files/styles/max_width_full/public/2022-09/blood-donation-center.jpg?itok=hcR3W6nw" alt="Giới thiệu" className="home-intro-img" />
            <img src="https://www.uq.edu.au/news/filething/get-styled/large/314943/HaBS%20over%2050s%20blood.jpg?itok=LHBB7kO4" alt="Giới thiệu 2" className="home-intro-img2" />
          </div>
          <div className="home-intro-right">
            <div className="home-intro-desc">
              Chúng tôi là tổ chức phi lợi nhuận cung cấp máu cứu người và tài nguyên cho bệnh nhân cần thiết. Đội ngũ của chúng tôi đảm bảo hành trình hiến máu của bạn an toàn, thuận tiện và ý nghĩa.
            </div>
            <ul className="home-intro-list">
              <li>Nhân viên y tế và tình nguyện viên giàu kinh nghiệm.</li>
              <li>Trang thiết bị hiện đại, môi trường an toàn.</li>
              <li>Hỗ trợ máu khẩn cấp 24/7.</li>
              <li>Quy trình hiến máu nhanh chóng, tin cậy.</li>
            </ul>
            <div className="home-intro-hours">
              <div className="home-intro-hours-title">Giờ tiếp nhận hiến máu</div>
              <div className="home-intro-hours-table">
                <div><span>Thứ 2 - Thứ 6 :</span> <b>8h - 20h</b></div>
                <div><span>Thứ 7 - Chủ nhật :</span> <b>9h - 18h</b></div>
                <div className="home-intro-hours-emergency">Hỗ trợ máu khẩn cấp 24/7</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STORIES SHARING SECTION */}
      <div className="home-section">
        <div className="home-section-badge">CÂU CHUYỆN</div>
        <div className="home-section-title">Tiếng nói từ <span>cộng đồng</span></div>
        <div className="home-section-desc">Khám phá câu chuyện truyền cảm hứng, kiến thức về máu và mẹo chăm sóc sức khỏe tại blog của chúng tôi.</div>
        <div className="home-department-list">
          <div className="home-department-card">
            <div className="home-department-icon"><i className="fa-solid fa-blog"></i></div>
            <div className="home-department-title">Ngày tôi hiến máu</div>
            <div className="home-department-desc">Hành trình ấm áp của người hiến máu lần đầu và trải nghiệm thay đổi cuộc đời.</div>
            <a className="home-department-link" href="#">ĐỌC THÊM</a>
          </div>
          <div className="home-department-card">
            <div className="home-department-icon"><i className="fa-solid fa-book-medical"></i></div>
            <div className="home-department-title">Hiểu về nhóm máu</div>
            <div className="home-department-desc">Tìm hiểu cách các nhóm máu tương tác và ý nghĩa trong việc cứu người.</div>
            <a className="home-department-link" href="#">ĐỌC THÊM</a>
          </div>
          <div className="home-department-card">
            <div className="home-department-icon"><i className="fa-solid fa-heart-circle-check"></i></div>
            <div className="home-department-title">Sau khi hiến máu: Nên làm gì?</div>
            <div className="home-department-desc">Mẹo chăm sóc sức khỏe sau khi hiến máu.</div>
            <a className="home-department-link" href="#">ĐỌC THÊM</a>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="home-stats-row">
        <div className="home-stats-item">
          <div className="home-stats-icon"><i className="fa-solid fa-users"></i></div>
          <div className="home-stats-value">10k+</div>
          <div className="home-stats-label">Người hiến máu đã đăng ký</div>
        </div>
        <div className="home-stats-item">
          <div className="home-stats-icon"><i className="fa-solid fa-heart-pulse"></i></div>
          <div className="home-stats-value">33.000+</div>
          <div className="home-stats-label">Số người được cứu sống</div>
        </div>
        <div className="home-stats-item">
          <div className="home-stats-icon"><i className="fa-solid fa-hospital"></i></div>
          <div className="home-stats-value">75+</div>
          <div className="home-stats-label">Bệnh viện đối tác</div>
        </div>
        <div className="home-stats-item">
          <div className="home-stats-icon"><i className="fa-solid fa-medal"></i></div>
          <div className="home-stats-value">20+</div>
          <div className="home-stats-label">Giải thưởng ghi nhận</div>
        </div>
      </div>

      {/* PROCESS SECTION */}
      <div className="home-section home-process-section">
        <div className="home-section-badge">CÁC BƯỚC HIẾN MÁU</div>
        <div className="home-section-title">Quy trình đơn giản<br />để <span>hiến máu</span></div>
        <div className="home-process-list">
          <div className="home-process-card">
            <div className="home-process-number">01</div>
            <img src="https://img.freepik.com/free-photo/doctor-talking-with-patient-hospital_1303-17879.jpg" alt="step1" className="home-process-img" />
            <div className="home-process-title"></div>
            <div className="home-process-desc">Cung cấp thông tin cơ bản và kiểm tra điều kiện hiến máu.</div>
          </div>
          <div className="home-process-card">
            <div className="home-process-number">02</div>
            <img src="https://img.freepik.com/free-photo/medical-team-performing-surgical-operation-modern-operating-room_1303-17871.jpg" alt="step2" className="home-process-img" />
            <div className="home-process-title">Khám sức khỏe</div>
            <div className="home-process-desc">Đội ngũ y tế kiểm tra nhanh sức khỏe để đảm bảo bạn đủ điều kiện hiến máu.</div>
          </div>
          <div className="home-process-card">
            <div className="home-process-number">03</div>
            <img src="https://img.freepik.com/free-photo/gynecologist-examining-patient-clinic_1303-17873.jpg" alt="step3" className="home-process-img" />
            <div className="home-process-title">Tiến hành hiến máu</div>
            <div className="home-process-desc">Thư giãn trong khi đội ngũ lấy máu an toàn, nhẹ nhàng.</div>
          </div>
          <div className="home-process-card">
            <div className="home-process-number">04</div>
            <img src="https://img.freepik.com/free-photo/doctor-standing-hospital-office_1303-17877.jpg" alt="step4" className="home-process-img" />
            <div className="home-process-title">Nhận quà & nghỉ ngơi</div>
            <div className="home-process-desc">Sau khi hiến máu, bạn sẽ được nghỉ ngơi và nhận quà cảm ơn.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
