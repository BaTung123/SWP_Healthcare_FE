// Xem các bài viết chia sẻ kinh nghiệm, tin tức liên quan đến hiến máu.
import React from "react";
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../../styles/newsPage.css";

const posts = [
  {
    id: 1,
    title: "Lợi ích sức khỏe của việc hiến máu tình nguyện",
    image: "https://img.freepik.com/free-photo/young-woman-donating-blood-clinic_1303-17869.jpg",
    date: "10/05/2025",
  },
  {
    id: 2,
    title: "Cách đăng ký hiến máu qua ứng dụng di động",
    image: "https://img.freepik.com/free-photo/blood-donation-campaign-doctor-registering-donor_1303-17871.jpg",
    date: "11/05/2025",
  },
  {
    id: 3,
    title: "Top ứng dụng quản lý lịch sử hiến máu của bạn",
    image: "https://img.freepik.com/free-photo/doctor-checking-donation-history-clipboard_1303-17873.jpg",
    date: "12/05/2025",
  },
  {
    id: 4,
    title: "Lần đầu hiến máu: Bạn cần biết gì?",
    image: "https://img.freepik.com/free-photo/first-time-blood-donor-smiling-chair_1303-17875.jpg",
    date: "13/05/2025",
  },
];

const categories = ["Chia sẻ", "Hướng dẫn", "Ứng dụng hỗ trợ", "Chiến dịch hiến máu"];

const recentPosts = posts.slice(0, 3);

function NewsPage() {
  const navigate = useNavigate();

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <div className="blog-archive-bg">
      <div className="blog-archive-header">Tin tức & Kinh nghiệm Hiến máu</div>
      <div className="blog-archive-container">
        {/* Sidebar */}
        <aside className="blog-sidebar">
          <div className="search-box">
            <div className="search-title">Tìm kiếm</div>
            <div className="search-desc">
              Tìm các bài viết về hiến máu, ứng dụng hữu ích và câu chuyện cá nhân.
            </div>
            <div className="search-input-wrap">
              <input type="text" placeholder="Tìm bài viết..." />
              <button className="search-btn">🔍</button>
            </div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-title">Danh mục</div>
            <ul className="category-list">
              {categories.map((cat) => (
                <li key={cat}><a href="#">{cat}</a></li>
              ))}
            </ul>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-title">Bài viết mới</div>
            <ul className="recent-post-list">
              {recentPosts.map((post) => (
                <li key={post.id} className="recent-post-item">
                  <img src={post.image} alt={post.title} className="recent-post-img" />
                  <div>
                    <div className="recent-post-title">{post.title}</div>
                    <div className="recent-post-date">{post.date}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {/* Main Content */}
        <main className="blog-main">
          <div className="blog-grid">
            {posts.map((post) => (
              <div 
                className="blog-card" 
                key={post.id}
                onClick={() => handleBlogClick(post.id)}
                style={{ cursor: 'pointer' }}
              >
                <img src={post.image} alt={post.title} className="blog-card-img" />
                <div className="blog-card-title">{post.title}</div>
                <div className="blog-card-meta">
                  <span>{post.date}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default NewsPage; 