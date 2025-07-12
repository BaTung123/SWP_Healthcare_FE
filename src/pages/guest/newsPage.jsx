// Xem các bài viết chia sẻ kinh nghiệm, tin tức liên quan đến hiến máu.
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../../styles/newsPage.css";
import axios from "axios";

const categories = ["Chia sẻ", "Hướng dẫn", "Ứng dụng hỗ trợ", "Chiến dịch hiến máu"];

function NewsPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to format date to dd/MM/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if invalid date
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("https://localhost:7293/api/Blog");        
        // Đảm bảo posts luôn là array
        
        const data = Array.isArray(response.data.data.blogs) ? response.data.data.blogs : [];
        setPosts(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải bài viết.");
        setPosts([]); // Đảm bảo posts là array khi lỗi
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
        </aside>
        {/* Main Content */}
        <main className="blog-main">
          {loading ? (
            <div>Đang tải bài viết...</div>
          ) : error ? (
            <div style={{ color: 'red' }}>{error}</div>
          ) : (
            <div className="blog-grid">
              {Array.isArray(posts) && posts.map((post) => (
                <div 
                  className="blog-card" 
                  key={post.id || post.title}
                  onClick={() => handleBlogClick(post.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={post.imageUrl || post.image} alt={post.title} className="blog-card-img" />
                  <div className="blog-card-title">{post.title}</div>
                  <div className="blog-card-meta">
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default NewsPage; 