import React, { useState } from "react";
import { CreateEvent } from "../../services/bloodDonationEvent";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Tính ngày mai và ngày kết thúc +7 ngày
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(tomorrow);
nextWeek.setDate(tomorrow.getDate() + 7);
const formatDate = (date) => date.toISOString().slice(0, 10);

const EventRegistrationForm = () => {
  const [form, setForm] = useState({
    name: "",
    type: "",
    locationName: "",
    locationAddress: "",
    targetParticipant: "",
    eventStartTime: formatDate(tomorrow),
    eventEndTime: formatDate(nextWeek),
    status: 0,
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

    if (Number(form.targetParticipant) > 100) {
      setError("Số người hiến máu mục tiêu tối đa là 100.");
      return;
    }

    const eventBody = {
      name: form.name,
      type: form.type,
      locationName: form.locationName,
      locationAddress: form.locationAddress,
      targetParticipant: Number(form.targetParticipant),
      eventStartTime: new Date(form.eventStartTime).toISOString(),
      eventEndTime: new Date(form.eventEndTime).toISOString(),
      status: form.status ? 1 : 0,
    };

    try {
      await CreateEvent(eventBody);
      toast.success("Tạo sự kiện thành công!");
      // Reset form nếu muốn:
      // setForm({ name: "", type: "", locationName: "", ... });
    } catch (err) {
      toast.error("Tạo sự kiện thất bại!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-lg shadow-md bg-white p-6">
        <h1 className="!text-[30px] text-[#b30000] text-center mb-6">
          Đăng ký sự kiện hiến máu
        </h1>

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Tên sự kiện <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
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
                name="type"
                value={form.type}
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

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Tên cơ sở tổ chức <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="locationName"
                value={form.locationName}
                onChange={handleChange}
                required
                className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2 text-base"
                placeholder="Nhập tên cơ sở y tế"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Địa chỉ tổ chức <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="locationAddress"
                value={form.locationAddress}
                onChange={handleChange}
                required
                className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2 text-base"
                placeholder="Nhập địa chỉ tổ chức"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="eventStartTime"
                value={form.eventStartTime}
                onChange={handleChange}
                required
                min={formatDate(new Date())}
                className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="eventEndTime"
                value={form.eventEndTime}
                onChange={handleChange}
                required
                min={form.eventStartTime}
                className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Số người hiến máu mục tiêu <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="targetParticipant"
                value={form.targetParticipant}
                onChange={handleChange}
                required
                min="1"
                max="100"
                className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2 text-base"
                placeholder="Ví dụ: 50"
              />
            </div>
          </div>

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

        {/* Toast container đặt ở đây để toast hiển thị đúng vị trí */}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default EventRegistrationForm;
