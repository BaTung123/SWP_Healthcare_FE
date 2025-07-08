//Trang hiển thị và nhắc nhở thời gian phục hồi giữa 2 lần hiến máu.
import React from 'react';
import '../../styles/recoveryReminderPage.css';

function RecoveryReminderPage() {
  // Giả định có ngày hiến máu gần nhất từ backend hoặc localStorage
  const lastDonationDate = new Date('2025-04-15'); // Giả định
  const today = new Date();
  const recoveryPeriodDays = 56; // theo WHO khuyến nghị giữa 2 lần hiến máu toàn phần
  const nextEligibleDate = new Date(lastDonationDate);
  nextEligibleDate.setDate(lastDonationDate.getDate() + recoveryPeriodDays);

  const timeDiff = nextEligibleDate - today;
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  const isEligible = daysRemaining <= 0;

  return (
    <div className="reminder-container">
      <h1>⏳ Nhắc nhở phục hồi sau hiến máu</h1>
      <div className="reminder-card">
        <p><strong>Lần hiến máu gần nhất:</strong> {lastDonationDate.toDateString()}</p>
        <p><strong>Ngày đủ điều kiện hiến tiếp theo:</strong> {nextEligibleDate.toDateString()}</p>
        <p><strong>Thời gian phục hồi còn lại:</strong> {isEligible ? 'Bạn đã sẵn sàng hiến máu!' : `${daysRemaining} ngày`}</p>
        <p className={`status ${isEligible ? 'ready' : 'not-ready'}`}>
          {isEligible ? '✅ Bạn có thể hiến máu ngay hôm nay.' : '❌ Bạn chưa đủ thời gian phục hồi.'}
        </p>
      </div>

      <div className="tips">
        <h2>🩺 Mẹo phục hồi nhanh:</h2>
        <ul>
          <li>Uống nhiều nước và ăn đủ chất.</li>
          <li>Tránh hoạt động gắng sức trong 24 giờ sau khi hiến.</li>
          <li>Ngủ đủ giấc và giữ tinh thần thoải mái.</li>
          <li>Thông báo cho nhân viên y tế nếu cảm thấy bất thường.</li>
        </ul>
      </div>
    </div>
  );
}

export default RecoveryReminderPage;