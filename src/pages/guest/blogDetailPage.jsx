import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import '../../styles/blogDetailPage.css';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Giả lập dữ liệu blog (sau này sẽ lấy từ API)
  const blogData = {
    id: parseInt(id),
    title: "Lợi ích sức khỏe của việc hiến máu tình nguyện",
    image: "https://img.freepik.com/free-photo/young-woman-donating-blood-clinic_1303-17869.jpg",
    date: "10/05/2025",
    content: `
      <p>Hiến máu không chỉ là một hành động nhân ái mà còn là đóng góp quan trọng cho hệ thống y tế. Khi bạn hiến máu, bạn đang góp phần cứu sống nhiều người và thậm chí còn có thể cải thiện sức khỏe của chính mình.</p>
    `
  };

  return (
    <div className="blog-detail-container">
      <div className="blog-detail-header">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/news')}
          className="back-button"
        >
          Quay lại
        </Button>
      </div>

      <div className="blog-detail-wrapper">
        <div className="blog-detail-image">
          <img src={blogData.image} alt={blogData.title} />
        </div>

        <article className="blog-detail-content">
          <h1 className="blog-detail-title">{blogData.title}</h1>
          <div className="blog-detail-meta">
            <span>{blogData.date}</span>
          </div>

          <div 
            className="blog-detail-body"
            dangerouslySetInnerHTML={{ __html: blogData.content }}
          />
        </article>
      </div>
    </div>
  );
};

export default BlogDetailPage; 