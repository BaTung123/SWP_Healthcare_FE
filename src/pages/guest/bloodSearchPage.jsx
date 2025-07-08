import React, { useState } from 'react';

const BloodSearchPage = () => {
  const [searchType, setSearchType] = useState('donors');
  const [bloodType, setBloodType] = useState('');
  const [distance, setDistance] = useState(10);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data - sau này sẽ được thay thế bằng API call
  const mockData = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      bloodType: 'A+',
      location: 'Quận 1, TP.HCM',
      distance: 2.5,
      lastDonation: '2024-01-15',
      status: 'Sẵn sàng hiến máu',
      age: 25,
      gender: 'Nam',
      weight: 65,
    },
    {
      id: 2,
      name: 'Trần Thị B',
      bloodType: 'O+',
      location: 'Quận 3, TP.HCM',
      distance: 4.2,
      lastDonation: '2024-02-20',
      status: 'Có thể hiến máu sau 1 tuần',
      age: 30,
      gender: 'Nữ',
      weight: 55,
    },
  ];

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Searching with:', { searchType, bloodType, distance, location });
    } catch (err) {
      setError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-blue-600 text-white p-6 mb-8 rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-2">
          Tìm Kiếm Người Hiến/Nhận Máu
        </h1>
        <p className="text-center opacity-90">
          Kết nối người hiến máu và người cần máu một cách nhanh chóng và hiệu quả
        </p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <div className="flex justify-center space-x-4">
          <button
            className={`px-4 py-2 text-lg font-bold ${
              searchType === 'donors'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setSearchType('donors')}
          >
            Tìm Người Hiến Máu
          </button>
          <button
            className={`px-4 py-2 text-lg font-bold ${
              searchType === 'recipients'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setSearchType('recipients')}
          >
            Tìm Người Cần Máu
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="">Chọn Nhóm Máu</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoảng cách (km)
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-500">{distance} km</div>
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Tìm Kiếm'
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{item.name}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    item.status === 'Sẵn sàng hiến máu'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Nhóm máu:</span> {item.bloodType}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Vị trí:</span> {item.location}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Khoảng cách:</span> {item.distance} km
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Tuổi:</span> {item.age}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Giới tính:</span> {item.gender}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Cân nặng:</span> {item.weight} kg
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded hover:bg-blue-50">
                  Xem Chi Tiết
                </button>
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                  Liên Hệ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BloodSearchPage; 