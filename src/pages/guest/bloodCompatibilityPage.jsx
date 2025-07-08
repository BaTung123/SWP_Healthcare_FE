import React from 'react';
import '../../styles/bloodCompatibilityPage.css';

function BloodCompatibilityPage() {
  return (
    <div className="compatibility-page-container">
      <h1>🩸 Bảng Tương Thích Truyền Máu</h1>
      
      <div className="compatibility-grid">
        <div className="compatibility-card">
          <h2>Máu Toàn Phần</h2>
          <p className="description">
            Chứa tất cả các thành phần của máu. Người nhận phải có cùng nhóm máu hoặc nhóm máu tương thích.
          </p>
          <div className="compatibility-table">
            <table>
              <thead>
                <tr>
                  <th>Nhóm Máu</th>
                  <th>Có Thể Nhận Từ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A+</td>
                  <td>A+, O+</td>
                </tr>
                <tr>
                  <td>A-</td>
                  <td>A-, O-</td>
                </tr>
                <tr>
                  <td>B+</td>
                  <td>B+, O+</td>
                </tr>
                <tr>
                  <td>B-</td>
                  <td>B-, O-</td>
                </tr>
                <tr>
                  <td>AB+</td>
                  <td>Tất cả các nhóm máu</td>
                </tr>
                <tr>
                  <td>AB-</td>
                  <td>A-, B-, AB-, O-</td>
                </tr>
                <tr>
                  <td>O+</td>
                  <td>O+</td>
                </tr>
                <tr>
                  <td>O-</td>
                  <td>O-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="compatibility-card">
          <h2>Hồng Cầu</h2>
          <p className="description">
            Chỉ chứa tế bào hồng cầu. Có thể truyền cho người có nhóm máu tương thích.
          </p>
          <div className="compatibility-table">
            <table>
              <thead>
                <tr>
                  <th>Nhóm Máu</th>
                  <th>Có Thể Nhận Từ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A+</td>
                  <td>A+, A-, O+, O-</td>
                </tr>
                <tr>
                  <td>A-</td>
                  <td>A-, O-</td>
                </tr>
                <tr>
                  <td>B+</td>
                  <td>B+, B-, O+, O-</td>
                </tr>
                <tr>
                  <td>B-</td>
                  <td>B-, O-</td>
                </tr>
                <tr>
                  <td>AB+</td>
                  <td>Tất cả các nhóm máu</td>
                </tr>
                <tr>
                  <td>AB-</td>
                  <td>A-, B-, AB-, O-</td>
                </tr>
                <tr>
                  <td>O+</td>
                  <td>O+, O-</td>
                </tr>
                <tr>
                  <td>O-</td>
                  <td>O-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="compatibility-card">
          <h2>Huyết Tương</h2>
          <p className="description">
            Phần chất lỏng của máu. Quy tắc tương thích ngược với truyền máu toàn phần.
          </p>
          <div className="compatibility-table">
            <table>
              <thead>
                <tr>
                  <th>Nhóm Máu</th>
                  <th>Có Thể Nhận Từ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A+</td>
                  <td>A+, AB+</td>
                </tr>
                <tr>
                  <td>A-</td>
                  <td>A-, AB-, A+, AB+</td>
                </tr>
                <tr>
                  <td>B+</td>
                  <td>B+, AB+</td>
                </tr>
                <tr>
                  <td>B-</td>
                  <td>B-, AB-, B+, AB+</td>
                </tr>
                <tr>
                  <td>AB+</td>
                  <td>AB+</td>
                </tr>
                <tr>
                  <td>AB-</td>
                  <td>AB-, AB+</td>
                </tr>
                <tr>
                  <td>O+</td>
                  <td>Tất cả các nhóm máu</td>
                </tr>
                <tr>
                  <td>O-</td>
                  <td>Tất cả các nhóm máu</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="compatibility-card">
          <h2>Tiểu Cầu</h2>
          <p className="description">
            Tế bào giúp đông máu. Có thể truyền cho người có nhóm máu tương thích.
          </p>
          <div className="compatibility-table">
            <table>
              <thead>
                <tr>
                  <th>Nhóm Máu</th>
                  <th>Có Thể Nhận Từ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A+</td>
                  <td>A+, A-, O+, O-</td>
                </tr>
                <tr>
                  <td>A-</td>
                  <td>A-, O-</td>
                </tr>
                <tr>
                  <td>B+</td>
                  <td>B+, B-, O+, O-</td>
                </tr>
                <tr>
                  <td>B-</td>
                  <td>B-, O-</td>
                </tr>
                <tr>
                  <td>AB+</td>
                  <td>Tất cả các nhóm máu</td>
                </tr>
                <tr>
                  <td>AB-</td>
                  <td>A-, B-, AB-, O-</td>
                </tr>
                <tr>
                  <td>O+</td>
                  <td>O+, O-</td>
                </tr>
                <tr>
                  <td>O-</td>
                  <td>O-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="notes-section">
        <h3>Lưu ý quan trọng:</h3>
        <ul>
          <li>Luôn kiểm tra kỹ sự tương thích trước khi truyền máu</li>
          <li>Trong trường hợp khẩn cấp, có thể sử dụng nhóm máu O- cho tất cả các nhóm máu</li>
          <li>Người có nhóm máu AB+ có thể nhận máu từ tất cả các nhóm máu</li>
          <li>Người có nhóm máu O- chỉ có thể nhận máu từ người có cùng nhóm máu</li>
        </ul>
      </div>
    </div>
  );
}

export default BloodCompatibilityPage; 