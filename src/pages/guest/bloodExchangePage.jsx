import React, { useState, useEffect } from 'react';
import '../../styles/bloodExchangePage.css';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

// Mock data cho người cần máu
const mockRecipients = [
  { id: 1, name: "Nguyễn Văn A", bloodType: "A+", location: "Quận 1, TP.HCM", urgency: "Cao" },
  { id: 2, name: "Trần Thị B", bloodType: "O-", location: "Quận 2, TP.HCM", urgency: "Trung bình" },
  { id: 3, name: "Lê Văn C", bloodType: "B+", location: "Quận 3, TP.HCM", urgency: "Cao" },
  { id: 4, name: "Phạm Thị D", bloodType: "AB+", location: "Quận 4, TP.HCM", urgency: "Thấp" },
  { id: 5, name: "Đỗ Minh E", bloodType: "O+", location: "Quận 5, TP.HCM", urgency: "Cao" },
];

// Mock data cho người hiến máu
const mockDonors = [
  { id: 1, name: "Lê Văn C", bloodType: "A+", location: "Quận 3, TP.HCM", availableDate: "2024-03-20" },
  { id: 2, name: "Phạm Thị D", bloodType: "O-", location: "Quận 4, TP.HCM", availableDate: "2024-03-25" },
  { id: 3, name: "Nguyễn Văn E", bloodType: "B+", location: "Quận 5, TP.HCM", availableDate: "2024-03-22" },
  { id: 4, name: "Trần Thị F", bloodType: "AB+", location: "Quận 6, TP.HCM", availableDate: "2024-03-28" },
  { id: 5, name: "Lý Văn G", bloodType: "O+", location: "Quận 7, TP.HCM", availableDate: "2024-03-30" },
];

// Bảng tương thích truyền máu
const bloodCompatibility = {
  whole: {
    'A+': ['A+', 'O+'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'O+'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'B+', 'AB+', 'O+'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+'],
    'O-': ['O-']
  },
  redCells: {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
  },
  plasma: {
    'A+': ['A+', 'AB+'],
    'A-': ['A-', 'AB-', 'A+', 'AB+'],
    'B+': ['B+', 'AB+'],
    'B-': ['B-', 'AB-', 'B+', 'AB+'],
    'AB+': ['AB+'],
    'AB-': ['AB-', 'AB+'],
    'O+': ['A+', 'B+', 'AB+', 'O+'],
    'O-': ['A-', 'B-', 'AB-', 'O-', 'A+', 'B+', 'AB+', 'O+'],
  },
  platelets: {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
  }
};

function BloodExchangePage() {
  // State cho tab đang active
  const [activeTab, setActiveTab] = useState('recipients'); // 'recipients' hoặc 'donors'

  // State cho form tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [donorBloodType, setDonorBloodType] = useState('');
  const [transfusionType, setTransfusionType] = useState('whole');

  // Thêm state để hiển thị/ẩn bảng tương thích
  const [showCompatibilityTable, setShowCompatibilityTable] = useState(false);

  const itemsPerPage = 10;

  // Xử lý tìm kiếm
  const handleSearch = () => {
    let filtered = [];
    if (activeTab === 'recipients') {
      filtered = mockRecipients.filter(r => {
        const compatibleDonors = bloodCompatibility[transfusionType][r.bloodType] || [];
        return (
          (donorBloodType === '' || compatibleDonors.includes(donorBloodType)) &&
          (bloodType === '' || r.bloodType === bloodType) &&
          (location === '' || r.location === location) &&
          (urgency === '' || r.urgency === urgency) &&
          (searchQuery.trim() === '' || r.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      });
    } else {
      filtered = mockDonors.filter(d => {
        return (
          (bloodType === '' || d.bloodType === bloodType) &&
          (location === '' || d.location === location) &&
          (searchQuery.trim() === '' || d.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      });
    }
    setResults(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    handleSearch();
  }, [activeTab, bloodType, location, urgency, donorBloodType, transfusionType]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const uniqueLocations = [...new Set([...mockRecipients, ...mockDonors].map(r => r.location))];
  const urgencyLevels = ['Cao', 'Trung bình', 'Thấp'];

  return (
    <div className="blood-exchange-container">
      <h1>🩸 Tìm Kiếm Hiến Máu & Nhận Máu</h1>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'recipients' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipients')}
        >
          Tìm Người Cần Máu
        </button>
        <button 
          className={`tab-button ${activeTab === 'donors' ? 'active' : ''}`}
          onClick={() => setActiveTab('donors')}
        >
          Tìm Người Hiến Máu
        </button>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="left-controls">
          <input
            type="text"
            placeholder={`Nhập tên ${activeTab === 'recipients' ? 'người cần máu' : 'người hiến máu'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <button onClick={handleSearch}>Tìm kiếm</button>
        </div>

        <div className="right-filters">
          {activeTab === 'recipients' && (
            <>
              <select value={donorBloodType} onChange={(e) => setDonorBloodType(e.target.value)}>
                <option value="">-- Nhóm máu của bạn (người hiến) --</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>

              <div className="transfusion-type-container">
                <select value={transfusionType} onChange={(e) => setTransfusionType(e.target.value)}>
                  <option value="whole">Toàn phần</option>
                  <option value="redCells">Hồng cầu</option>
                  <option value="plasma">Huyết tương</option>
                  <option value="platelets">Tiểu cầu</option>
                </select>
                <button 
                  className="info-button"
                  onClick={() => setShowCompatibilityTable(!showCompatibilityTable)}
                >
                  ℹ️
                </button>
              </div>

              {showCompatibilityTable && (
                <div className="compatibility-table-container">
                  <h3>Bảng Tương Thích Truyền Máu</h3>
                  <div className="compatibility-info">
                    <div className="info-section">
                      <h4>Máu toàn phần</h4>
                      <p>Chứa tất cả các thành phần của máu. Người nhận phải có cùng nhóm máu hoặc nhóm máu tương thích.</p>
                      <ul>
                        <li>A+ có thể nhận: A+, O+</li>
                        <li>A- có thể nhận: A-, O-</li>
                        <li>B+ có thể nhận: B+, O+</li>
                        <li>B- có thể nhận: B-, O-</li>
                        <li>AB+ có thể nhận: tất cả các nhóm máu</li>
                        <li>AB- có thể nhận: A-, B-, AB-, O-</li>
                        <li>O+ có thể nhận: O+</li>
                        <li>O- có thể nhận: O-</li>
                      </ul>
                    </div>

                    <div className="info-section">
                      <h4>Hồng cầu</h4>
                      <p>Chỉ chứa tế bào hồng cầu. Có thể truyền cho người có nhóm máu tương thích.</p>
                      <ul>
                        <li>A+ có thể nhận: A+, A-, O+, O-</li>
                        <li>A- có thể nhận: A-, O-</li>
                        <li>B+ có thể nhận: B+, B-, O+, O-</li>
                        <li>B- có thể nhận: B-, O-</li>
                        <li>AB+ có thể nhận: tất cả các nhóm máu</li>
                        <li>AB- có thể nhận: A-, B-, AB-, O-</li>
                        <li>O+ có thể nhận: O+, O-</li>
                        <li>O- có thể nhận: O-</li>
                      </ul>
                    </div>

                    <div className="info-section">
                      <h4>Huyết tương</h4>
                      <p>Phần chất lỏng của máu. Quy tắc tương thích ngược với truyền máu toàn phần.</p>
                      <ul>
                        <li>A+ có thể nhận: A+, AB+</li>
                        <li>A- có thể nhận: A-, AB-, A+, AB+</li>
                        <li>B+ có thể nhận: B+, AB+</li>
                        <li>B- có thể nhận: B-, AB-, B+, AB+</li>
                        <li>AB+ có thể nhận: AB+</li>
                        <li>AB- có thể nhận: AB-, AB+</li>
                        <li>O+ có thể nhận: tất cả các nhóm máu</li>
                        <li>O- có thể nhận: tất cả các nhóm máu</li>
                      </ul>
                    </div>

                    <div className="info-section">
                      <h4>Tiểu cầu</h4>
                      <p>Tế bào giúp đông máu. Có thể truyền cho người có nhóm máu tương thích.</p>
                      <ul>
                        <li>A+ có thể nhận: A+, A-, O+, O-</li>
                        <li>A- có thể nhận: A-, O-</li>
                        <li>B+ có thể nhận: B+, B-, O+, O-</li>
                        <li>B- có thể nhận: B-, O-</li>
                        <li>AB+ có thể nhận: tất cả các nhóm máu</li>
                        <li>AB- có thể nhận: A-, B-, AB-, O-</li>
                        <li>O+ có thể nhận: O+, O-</li>
                        <li>O- có thể nhận: O-</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <select value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
            <option value="">-- Nhóm máu --</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>

          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">-- Tất cả địa điểm --</option>
            {uniqueLocations.map((loc, idx) => (
              <option key={idx} value={loc}>{loc}</option>
            ))}
          </select>

          {activeTab === 'recipients' && (
            <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
              <option value="">-- Tất cả độ khẩn cấp --</option>
              {urgencyLevels.map((level, idx) => (
                <option key={idx} value={level}>{level}</option>
              ))}
            </select>
          )}
        </div>

        <div className="results-section">
          {currentItems.length > 0 ? (
            <>
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Nhóm máu</th>
                    <th>Địa điểm</th>
                    {activeTab === 'recipients' ? (
                      <th>Độ khẩn cấp</th>
                    ) : (
                      <th>Ngày sẵn sàng</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(person => (
                    <tr key={person.id}>
                      <td>{person.name}</td>
                      <td>{person.bloodType}</td>
                      <td>{person.location}</td>
                      <td>
                        {activeTab === 'recipients' ? (
                          <strong>{person.urgency}</strong>
                        ) : (
                          person.availableDate
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                  <FaAngleDoubleLeft />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={currentPage === i + 1 ? 'active' : ''}
                  >
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                  <FaAngleDoubleRight />
                </button>
              </div>
            </>
          ) : (
            <p>Không có kết quả phù hợp.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BloodExchangePage; 