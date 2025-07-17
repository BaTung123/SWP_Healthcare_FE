import React, { useState } from "react";
import { CreateEvent } from "../../services/bloodDonationEvent";

const EventRegistrationForm = () => {
  const [form, setForm] = useState({
    eventName: "",
    eventType: "",
    facilityID: "",
    eventDate: new Date().toISOString().split('T')[0],
    endDate: "",
    location: "",
    targetDonors: "",
    isActive: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (Number(form.targetDonors) > 100) {
      setError("Số người hiến máu mục tiêu tối đa là 100.");
      return;
    }
    // Chuyển đổi dữ liệu form sang đúng định dạng API
    const eventBody = {
      name: form.eventName,
      type: form.eventType,
      locationName: form.facilityID, // hoặc tên cơ sở nếu có
      locationAddress: form.location,
      targetParticipant: Number(form.targetDonors),
      eventStartTime: new Date(form.eventDate).toISOString(),
      eventEndTime: new Date(form.endDate).toISOString(),
      status: form.isActive ? 1 : 0,
    };
    try {
      const res = await CreateEvent(eventBody);
      alert("Tạo sự kiện thành công!");
      // Reset form nếu muốn
      // setForm({ ... });
    } catch (err) {
      alert("Tạo sự kiện thất bại!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-lg shadow-md bg-white p-6">
        <h1 className="!text-[30px] text-[#b30000] text-center mb-6">
          Đăng ký sự kiện hiến máu
        </h1>

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          {/* Tên sự kiện và Loại sự kiện */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Tên sự kiện <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="eventName"
                value={form.eventName}
                onChange={handleChange}
                required
                className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2 text-base"
                placeholder="Nhập tên sự kiện"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Loại sự kiện <span className="text-red-500">*</span>
              </label>
              <select
                name="eventType"
                value={form.eventType}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">-- Chọn loại sự kiện --</option>
                <option value="emergency">Hiến máu khẩn cấp</option>
                <option value="regular">Hiến máu định kỳ</option>
                <option value="campaign">Chiến dịch hiến máu</option>
                <option value="festival">Sự kiện lễ hội</option>
              </select>
            </div>
          </div>

          {/* Cơ sở tổ chức và Địa điểm */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Cơ sở tổ chức <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="facilityID"
                value={form.facilityID}
                onChange={handleChange}
                required
                className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2 text-base"
                placeholder="Nhập ID cơ sở y tế"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Địa điểm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2 text-base"
                placeholder="Nhập địa chỉ tổ chức"
              />
            </div>
          </div>

          {/* Ngày bắt đầu và Ngày kết thúc */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                required
                disabled
                className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                min={form.eventDate}
                className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          {/* Số người hiến máu mục tiêu và đã đăng ký */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Số người hiến máu mục tiêu <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="targetDonors"
                value={form.targetDonors}
                onChange={handleChange}
                required
                min="1"
                max="100"
                className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2 text-base"
                placeholder="Ví dụ: 50"
              />
            </div>
            {/* XÓA input Số người đã đăng ký */}
          </div>

          {/* Trạng thái hoạt động */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <label className="font-semibold">Sự kiện đang hoạt động</label>
          </div>

          {/* Nút gửi */}
          <button
            type="submit"
            className="p-3 !text-white !bg-[#b30000] rounded-md font-bold hover:!bg-[#990000] transition-colors duration-300 ease-in-out"
          >
            Đăng ký sự kiện
          </button>
        </form>
        {error && (
          <div className="text-red-500 font-semibold text-center mt-2">{error}</div>
        )}
      </div>
    </div>
  );
};

export default EventRegistrationForm;