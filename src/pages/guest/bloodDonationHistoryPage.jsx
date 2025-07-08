import React, { useState, useEffect } from 'react';

// Mock data
const mockDonationHistory = [
  {
    id: 1,
    date: '2024-03-15',
    location: 'Bệnh viện Chợ Rẫy',
    amount: 350,
    status: 'completed',
    notes: 'Hiến máu định kỳ'
  },
  {
    id: 2,
    date: '2023-12-20',
    location: 'Bệnh viện Nhân dân 115',
    amount: 350,
    status: 'completed',
    notes: 'Hiến máu nhân đạo'
  },
  {
    id: 3,
    date: '2023-09-10',
    location: 'Bệnh viện Đại học Y Dược',
    amount: 350,
    status: 'completed',
    notes: 'Hiến máu tình nguyện'
  },
  {
    id: 4,
    date: '2023-06-05',
    location: 'Bệnh viện Chợ Rẫy',
    amount: 350,
    status: 'completed',
    notes: 'Hiến máu định kỳ'
  },
  {
    id: 5,
    date: '2023-03-01',
    location: 'Bệnh viện Nhân dân 115',
    amount: 350,
    status: 'completed',
    notes: 'Hiến máu nhân đạo'
  }
];

const BloodDonationHistoryPage = () => {
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Giả lập việc gọi API
    const fetchDonationHistory = async () => {
      try {
        // Giả lập độ trễ của network
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDonationHistory(mockDonationHistory);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải lịch sử hiến máu. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Lịch Sử Hiến Máu</h1>
      
      {donationHistory.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">Bạn chưa có lịch sử hiến máu nào.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày Hiến
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa Điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lượng Máu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ghi Chú
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donationHistory.map((donation) => (
                <tr key={donation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(donation.date).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {donation.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {donation.amount} ml
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      donation.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {donation.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Thống Kê Hiến Máu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600">Tổng số lần hiến</p>
            <p className="text-2xl font-bold">{donationHistory.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600">Tổng lượng máu đã hiến</p>
            <p className="text-2xl font-bold">
              {donationHistory.reduce((sum, donation) => sum + donation.amount, 0)} ml
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600">Lần hiến gần nhất</p>
            <p className="text-2xl font-bold">
              {donationHistory.length > 0 
                ? new Date(donationHistory[0].date).toLocaleDateString('vi-VN')
                : 'Chưa có'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodDonationHistoryPage; 