import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
        const response = await axios.get(`https://localhost:7293/api/Blog/${id}`);                        
        const data = response.data.data;
        setBlog(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải bài viết.");
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [id]);
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh] text-lg font-semibold">Đang tải...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-[60vh] text-lg text-red-600 font-semibold">{error}</div>;
  }

  if (!blog) {
    return <div className="flex justify-center items-center min-h-[60vh] text-lg text-gray-500 font-semibold">Không tìm thấy bài viết.</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-2 md:px-0 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 md:p-10 flex flex-col gap-6">
        {/* Hàng trên: ảnh + title/time */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Ảnh bên trái */}
          <div className="w-full md:w-2/5 flex justify-center items-start">
            <img 
              src={blog.imageUrl} 
              alt={blog.title} 
              className="w-full max-h-[600px] object-cover rounded-lg shadow-md border border-gray-100"
              style={{ maxHeight: '600px', minHeight: '350px' }}
            />
          </div>
          {/* Title và thời gian bên phải */}
          <div className="w-full md:w-3/5 flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">{blog.title}</h1>
            <div className="text-sm text-gray-500 mb-2">{formatDate(blog.createdAt)}</div>
          </div>
        </div>
        {/* Description bên dưới */}
        <div className="w-full mt-2">
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed whitespace-pre-line">{blog.description}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage; 