import { useState } from "react";

const BloodRequestPage = () => {

  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    gender: "",
    bloodType: "",
    quantity: "",
    reason: "",
    hospital: "",
    phone: "",
    type:"",
    needDate: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted form data:", formData);
    // Xử lý gửi dữ liệu tại đây
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-lg shadow-md bg-white p-6">
        <h1 className="!text-[30px] text-[#b30000] text-center mb-6">Đăng ký Nhận Máu</h1>

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          {/* họ và tên */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2 text-base"
              placeholder="Nhập họ và tên"
            />
          </div>

          {/* ngày sinh */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Ngày sinh</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Giới tính</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          {/* Nhóm máu và số lượng */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Nhóm máu <span className="text-red-500">*</span>
              </label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">-- Chọn nhóm máu --</option>
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
            <div className="flex-1">
              <label className="block font-semibold mb-1">Số đơn vị cần</label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2"
                placeholder="Ví dụ: 2"
              />
            </div>
          </div>

          {/* Lý do và bệnh viện */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Lý do cần máu</label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2"
                placeholder="VD: Phẫu thuật, thiếu máu..."
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Loại <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">-- Chọn loại --</option>
                <option value="Toàn phần">Toàn phần</option>
                <option value="Tiểu cầu">Tiểu cầu</option>
                <option value="Huyết tương">Huyết tương</option>
              </select>
            </div>
          </div>

          {/* Bệnh viện / Cơ sở y tế */}
          <div>
            <label className="block font-semibold mb-1">Bệnh viện / Cơ sở y tế</label>
            <input
              type="text"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Tên bệnh viện"
            />
          </div>

          {/* Thời gian cần máu */}
          <div className="flex gap-4">
            <div className="flex flex-row gap-7">
              <label className="block font-semibold mb-1">Thời gian cần máu:</label>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="urgent"
                  checked={formData.type === "urgent"}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 !mr-1"
                />
                <span>Gấp</span>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="range"
                  checked={formData.type === "range"}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 !mr-1"
                />
                <span>Chọn ngày</span>
              </div>
            </div>
          </div>

          {formData.type === "range" && (
            <div className="flex justify-around">
              <div>
                <span>Từ:</span>
                <input
                  type="date"
                  name="fromDate"
                  required
                  value={new Date().toISOString().split('T')[0]}
                  disabled
                  className="!ml-2 px-3 py-2 border border-gray-300 rounded-md text-base bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <span>Đến:</span>
                <input
                  type="date"
                  name="toDate"
                  required
                  value={formData.toDate}
                  onChange={handleChange}
                  className="!ml-2 px-3 py-2 border border-gray-300 rounded-md text-base"
                />
              </div>
            </div>
          )}

          {/* số điện thoại */}
          <div>
            <label className="block font-semibold mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="VD: 0901234567"
            />
          </div>

          {/* Nút gửi */}
          <button
            type="submit"
            className="p-3 !text-white !bg-[#b30000] rounded-md font-bold hover:!bg-[#990000] transition-colors duration-300 ease-in-out"
          >
            Gửi yêu cầu
          </button>
        </form>
      </div>
    </div>
  );
};

export default BloodRequestPage;