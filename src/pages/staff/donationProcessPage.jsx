//Quản lý từng bước trong quá trình hiến máu (từ gửi yêu cầu đến hoàn tất.)
import React from 'react';
import '../../styles/donationProcessPage.css';
import { FaCheckCircle, FaClock, FaHourglassHalf } from 'react-icons/fa';

const steps = [
  { step: 1, title: '📨 Gửi yêu cầu hiến máu', status: 'done' },
  { step: 2, title: '📅 Xác nhận lịch hẹn', status: 'done' },
  { step: 3, title: '🩻 Kiểm tra sức khỏe', status: 'in-progress' },
  { step: 4, title: '🩸 Hiến máu', status: 'pending' },
  { step: 5, title: '🎉 Hoàn tất & nghỉ ngơi', status: 'pending' },
];

function DonationProcessPage() {
  return (
    <div className="admin-layout">
      <div className="dashboard-container">
        <h1>🩸 Quản Lý Quá Trình Hiến Máu</h1>
        <p className="subtext">Theo dõi và quản lý các bước trong quá trình hiến máu</p>

        <div className="process-container">
          <div className="process-steps">
            {steps.map(({ step, title, status }) => (
              <div key={step} className={`step-card ${status}`}>
                <div className="step-header">
                  <div className="step-number">Bước {step}</div>
                  <div className="step-status">
                    {status === 'done' && (
                      <span className="status-badge done">
                        <FaCheckCircle /> Đã hoàn thành
                      </span>
                    )}
                    {status === 'in-progress' && (
                      <span className="status-badge in-progress">
                        <FaHourglassHalf /> Đang thực hiện
                      </span>
                    )}
                    {status === 'pending' && (
                      <span className="status-badge pending">
                        <FaClock /> Chưa thực hiện
                      </span>
                    )}
                  </div>
                </div>
                <div className="step-title">{title}</div>
                {status === 'in-progress' && (
                  <div className="step-progress">
                    <div className="progress-bar">
                      <div className="progress-fill"></div>
                    </div>
                    <div className="progress-text">Đang xử lý...</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationProcessPage;