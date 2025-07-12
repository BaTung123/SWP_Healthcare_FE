import { useState } from "react";

const BloodDropPage = () => {

  // Lấy ngày hiện tại theo định dạng yyyy-mm-dd
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    gender: "",
    bloodType: "",
    quantity: 0,
    hospital: "",
    phone: "",
    type: "",
    needDate: todayStr,
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Thay đổi số lượng máu (ml)
  const handleQuantityChange = (delta) => {
    setFormData((prev) => {
      let newQuantity = (parseInt(prev.quantity) || 0) + delta;
      if (newQuantity < 0) newQuantity = 0;
      if (newQuantity > 5000) newQuantity = 5000;
      return { ...prev, quantity: newQuantity };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted form data:", formData);
    // Xử lý gửi dữ liệu tại đây
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-[#eaf3fb] min-h-screen flex items-center justify-center">
      <div className="rounded-2xl shadow-2xl bg-white p-10 w-full max-w-2xl transition-shadow hover:shadow-3xl">
        <h1 className="text-[32px] font-bold text-[#b30000] text-center mb-8 tracking-wide drop-shadow-sm">Thông tin Gửi Máu vào Kho</h1>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
              placeholder="Nhập họ và tên"
              style={{ width: '100%' }}
            />
          </div>

          {/* ngày sinh */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="flex-1 flex flex-col">
              <label className="font-semibold mb-1">Ngày sinh</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                style={{ width: '100%' }}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="font-semibold mb-1">Giới tính</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                style={{ width: '100%' }}
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          {/* Nhóm máu và số lượng */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="flex-1 flex flex-col">
              <label className="font-semibold mb-1">Nhóm máu <span className="text-red-500">*</span></label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                style={{ width: '100%' }}
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
            <div className="flex-1 flex flex-col">
              <label className="font-semibold mb-1">Số ml cần</label>
              <input
                type="number"
                name="quantity"
                min={0}
                step={50}
                value={formData.quantity}
                onChange={handleChange}
                className="w-full text-center border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Ngày bỏ máu vào kho */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Ngày bỏ máu vào kho <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="needDate"
              value={formData.needDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
              min={todayStr}
              style={{ width: '100%' }}
            />
          </div>

          {/* Loại và số điện thoại trên cùng một dòng */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="flex-1 flex flex-col">
              <label className="font-semibold mb-1">Loại <span className="text-red-500">*</span></label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                style={{ width: '100%' }}
              >
                <option value="">-- Chọn loại --</option>
                <option value="Toàn phần">Toàn phần</option>
                <option value="Tiểu cầu">Tiểu cầu</option>
                <option value="Huyết tương">Huyết tương</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="font-semibold mb-1">Số điện thoại <span className="text-red-500">*</span></label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                placeholder="VD: 0901234567"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Nút gửi */}
          <button
            type="submit"
            className={`w-full p-3 text-white rounded-lg font-bold shadow-md transition-all duration-300 ease-in-out mt-2
              bg-gradient-to-r from-[#b30000] to-[#ff4d4d] hover:scale-105 hover:shadow-lg`}
          >
            Gửi yêu cầu
          </button>
        </form>
      </div>
    </div>
  );
};

export default BloodDropPage;