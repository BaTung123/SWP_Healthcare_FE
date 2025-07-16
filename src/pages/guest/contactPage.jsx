//Liên hệ, phản hồi, form gửi câu hỏi.
import React, { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../../styles/contactPage.css";
import { SendEmailToAdmin } from "../../services/authentication";
import { toast } from 'react-toastify';

function ContactPage() {
  const [formData, setFormData] = useState({
    subject: "",
    body: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.subject.trim() || !formData.body.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const emailData = {
        userId: 0, // Default value as per API spec
        subject: formData.subject,
        body: formData.body,
        isHtml: true
      };

      await SendEmailToAdmin(emailData);
      toast.success("Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi trong vòng 24 giờ.");
      setFormData({ subject: "", body: "" });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-bg">
      <div className="contact-header">Liên hệ với chúng tôi</div>
      <div className="contact-container">
        <div className="contact-info-block">
          <div className="contact-info-left">
            <div className="contact-now-btn">LIÊN HỆ NGAY</div>
            <div className="contact-title">
              Kết nối với chúng tôi để <span className="contact-title-highlight">biết thêm thông tin!</span>
            </div>
            <div className="contact-desc">
              Nếu bạn có bất kỳ câu hỏi nào về hiến máu, góp ý hoặc muốn trao đổi với đội ngũ hỗ trợ, hãy liên hệ với chúng tôi. Chúng tôi sẽ phản hồi trong vòng 24 giờ.
            </div>
          </div>
          <div className="contact-info-right">
            <div className="contact-social-label">Theo dõi chúng tôi trên mạng xã hội:</div>
            <div className="contact-social-icons">
              <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#"><i className="fa-brands fa-twitter"></i></a>
              <a href="#"><i className="fa-brands fa-instagram"></i></a>
              <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
              <a href="#"><i className="fa-brands fa-youtube"></i></a>
            </div>
          </div>
        </div>
        <div className="contact-cards-row">
          <div className="contact-card">
            <div className="contact-card-icon">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <div className="contact-card-title">Địa chỉ:</div>
            <div className="contact-card-content">
              Tòa nhà Riverside, County Hall, London SE1 7PB, Vương quốc Anh
            </div>
          </div>
          <div className="contact-card">
            <div className="contact-card-icon">
              <i className="fa-solid fa-phone"></i>
            </div>
            <div className="contact-card-title">Số điện thoại:</div>
            <div className="contact-card-content">
              Điện thoại: (+236)-768-9900<br />
              Di động: +760-550-6578
            </div>
          </div>
          <div className="contact-card">
            <div className="contact-card-icon">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <div className="contact-card-title">Địa chỉ Email:</div>
            <div className="contact-card-content">
              support@blooddonation.org<br />
              contact@donorsupport.com
            </div>
          </div>
        </div>
        <div className="contact-form-row">
          <form className="contact-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="subject"
              placeholder="Tiêu đề..." 
              value={formData.subject}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <textarea 
              name="body"
              placeholder="Nội dung liên hệ..." 
              rows={6}
              value={formData.body}
              onChange={handleInputChange}
              disabled={isLoading}
            ></textarea>
            <button 
              className="contact-send-btn" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "ĐANG GỬI..." : "GỬI TIN NHẮN"}
            </button>
          </form>
          <div className="contact-doctor-img-wrap">
            <img
              src="https://thebloodconnection.org/wp-content/uploads/2024/01/TBC-OctBlog-GivingBackToDonorsv3.jpg"
              alt="Tình nguyện viên y tế"
              className="contact-doctor-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;