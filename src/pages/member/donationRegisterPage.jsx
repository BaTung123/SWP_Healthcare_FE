//Đăng ký nhóm máu, thời gian sẵn sàng hiến máu.
import dayjs from "dayjs";
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { GetUserProfileByUserId } from "../../services/userProfile";
import { GetBloodDonationEventById } from "../../services/bloodDonationEvent";
import { createDonorRegistration, DeleteDonorRegistration, postBloodDonationApplication } from "../../services/donorRegistration";
import { DatePicker } from "antd";

// Constants
const BLOOD_TYPES = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

const DONATION_TYPES = [
  { value: "Toàn Phần", label: "Toàn Phần" },
  { value: "Tiểu Cầu", label: "Tiểu Cầu" },
  { value: "Huyết Tương", label: "Huyết Tương" },
];

// Mapping blood type string to number
const BLOOD_TYPE_MAP = {
  "A+": 0, "A-": 1, "B+": 2, "B-": 3, "AB+": 4, "AB-": 5, "O+": 6, "O-": 7
};
const DONATION_TYPE_MAP = {
  "Toàn Phần": 0, "Tiểu Cầu": 1, "Huyết Tương": 2
};

const DonationRegisterPage = () => {
  const [donateEvent, setDonateEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const eventId = params.get("eventId");

  const [formData, setFormData] = useState({
    userId: "",
    fullName: "",
    birthDate: "",
    gender: "",
    bloodType: "",
    type: "",
    toDate: dayjs(), // Mặc định là ngày hiện tại
    phone: "",
    quantity: "",
  });

  // Mock: các ngày đã đăng ký trước đó (giả lập, thực tế lấy từ API)
  const registeredDates = [
    '2024-06-01',
    '2024-07-10',
    '2024-08-15',
  ];

  // Fetch user profile and event data
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const userProfileData = await GetUserProfileByUserId(1);
      setUserProfile(userProfileData);
      
      // Update form data with user info
      setFormData(prev => ({
        ...prev,
        userId: userProfileData.userId,
        fullName: `${userProfileData.firstName} ${userProfileData.lastName}`,
        phone: userProfileData.phoneNumber,
        birthDate: userProfileData.birthDate || "",
        gender: userProfileData.gender || "",
      }));

      // Fetch event data if eventId exists
      if (eventId) {
        const eventData = await GetBloodDonationEventById(eventId);
        setDonateEvent(eventData);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      toast.error("Không thể tải thông tin người dùng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Date validation
  const disabledDate = useCallback((current) => {
    // Không cho chọn ngày trước hôm nay
    return current && current < dayjs().startOf('day');
  }, []);

  const validateDate = useCallback((selectedDate) => {
    if (!selectedDate) {
      toast.error("Vui lòng chọn ngày.");
      return false;
    }

    const selectedDateStr = dayjs(selectedDate).format("YYYY-MM-DD");
    const today = dayjs().format("YYYY-MM-MM-DD");

    // Check if date is in the past
    if (selectedDateStr < today) {
      toast.error("Không thể chọn ngày trong quá khứ.");
      return false;
    }

    // Check event date range if event exists
    if (donateEvent) {
      const eventStartDate = dayjs(donateEvent.eventDate).format("YYYY-MM-DD");
      const eventEndDate = dayjs(donateEvent.endDate).format("YYYY-MM-DD");

      if (selectedDateStr < eventStartDate || selectedDateStr > eventEndDate) {
        toast.error(`Ngày phải từ ${eventStartDate} đến ${eventEndDate}`);
        return false;
      }
    }

    return true;
  }, [donateEvent]);

  // Form handlers
  const handleToDateChange = useCallback((date) => {
    setFormData(prev => ({
      ...prev,
      toDate: date,
    }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const validateForm = useCallback(() => {
    // Validate nhóm máu
    if (!formData.bloodType) {
      toast.error("Vui lòng chọn nhóm máu.");
      return false;
    }
    // Validate loại hiến máu
    if (!formData.type) {
      toast.error("Vui lòng chọn loại hiến máu.");
      return false;
    }
    // Validate ngày sinh
    if (!formData.birthDate) {
      toast.error("Vui lòng nhập ngày sinh.");
      return false;
    }
    // Validate tuổi (18-60)
    const age = dayjs().diff(dayjs(formData.birthDate), 'year');
    if (age < 18 || age > 60) {
      toast.error("Tuổi phải từ 18 đến 60 để đủ điều kiện hiến máu.");
      return false;
    }
    // Validate giới tính
    if (!formData.gender) {
      toast.error("Vui lòng chọn giới tính.");
      return false;
    }
    // Validate số điện thoại
    const phone = formData.phone || '';
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Số điện thoại phải đủ 10 số và chỉ chứa số.");
      return false;
    }
    // Validate số lượng ml máu
    const quantity = Number(formData.quantity);
    if (!quantity || isNaN(quantity) || quantity < 50) {
      toast.error("Vui lòng nhập số lượng máu muốn hiến (ml) tối thiểu 50ml.");
      return false;
    }
    if (quantity > 500) {
      toast.error("Số lượng máu hiến tối đa là 500ml cho một lần hiến.");
      return false;
    }
    if (quantity % 50 !== 0) {
      toast.error("Số lượng máu phải là bội số của 50ml.");
      return false;
    }
    // Validate ngày đăng ký hiến
    if (!validateDate(formData.toDate)) {
      return false;
    }
    // Không cho phép đăng ký trùng ngày (giả lập)
    const selectedDateStr = dayjs(formData.toDate).format('YYYY-MM-DD');
    if (registeredDates.includes(selectedDateStr)) {
      toast.error("Bạn đã đăng ký hiến máu vào ngày này rồi. Vui lòng chọn ngày khác.");
      return false;
    }
    return true;
  }, [formData, validateDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const dataToSend = {
        bloodStorageId: 0,
        userId: formData.userId,
        eventId: eventId ? Number(eventId) : 0,
        fullName: formData.fullName,
        dob: formData.birthDate,
        gender: formData.gender,
        bloodType: BLOOD_TYPE_MAP[formData.bloodType],
        bloodTransferType: DONATION_TYPE_MAP[formData.type],
        quantity: Number(formData.quantity),
        note: "",
        phoneNumber: formData.phone,
        donationStartDate: {
          year: dayjs(formData.toDate).year(),
          month: dayjs(formData.toDate).month() + 1,
          day: dayjs(formData.toDate).date(),
          dayOfWeek: dayjs(formData.toDate).day()
        },
        donationEndDate: {
          year: dayjs(formData.toDate).year(),
          month: dayjs(formData.toDate).month() + 1,
          day: dayjs(formData.toDate).date(),
          dayOfWeek: dayjs(formData.toDate).day()
        }
      };

      const response = await postBloodDonationApplication(dataToSend);
      console.log("Registration response:", response);
      toast.success("Đăng ký thành công!");
      
      // Reset form after successful submission
      setFormData(prev => ({
        ...prev,
        bloodType: "",
        type: "",
        toDate: "",
        quantity: "",
      }));

    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data || "Không thể đăng ký. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userProfile) {
    return (
      <div className="p-8 max-w-xl mx-auto bg-[#eaf3fb]">
        <div className="rounded-lg shadow-md bg-[#fffafa] p-6">
          <div className="text-center">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-[#eaf3fb] min-h-screen flex items-center justify-center">
      <div className="rounded-2xl shadow-2xl bg-white p-10 w-full max-w-2xl transition-shadow hover:shadow-3xl">
        <h1 className="text-[32px] font-bold text-[#b30000] text-center mb-8 tracking-wide drop-shadow-sm">Đăng ký Hiến Máu</h1>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-[#b30000] tracking-wide">Họ và tên</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
              style={{ width: '100%' }}
            />
          </div>

          {/* Ngày sinh và giới tính */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="flex flex-col flex-1">
              <label className="mb-1 font-semibold text-[#b30000] tracking-wide">Ngày sinh</label>
              <input
                type="date"
                name="birthDate"
                required
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                style={{ width: '100%' }}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="mb-1 font-semibold text-[#b30000] tracking-wide">Giới tính</label>
              <select
                name="gender"
                required
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

          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="flex flex-col flex-1">
              <label className="mb-1 font-semibold text-[#b30000] tracking-wide">Nhóm máu</label>
              <select
                name="bloodType"
                required
                value={formData.bloodType}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                style={{ width: '100%' }}
              >
                <option value="">-- Chọn nhóm máu --</option>
                {BLOOD_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col flex-1">
              <label className="mb-1 font-semibold text-[#b30000] tracking-wide">Số lượng (ml)</label>
              <input
                type="number"
                name="quantity"
                min={50}
                max={500}
                step={50}
                required
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Nhập số ml (tối đa 500ml)"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-[#b30000] tracking-wide">Thời gian sẵn sàng hiến</label>
            <div className="flex justify-center md:justify-start">
              <DatePicker
                style={{ 
                  marginTop: 10, 
                  backgroundColor: "#fffafa", 
                  padding: 12,
                  width: "100%",
                  maxWidth: "100%",
                  borderRadius: "0.75rem",
                  border: "1px solid #e5e7eb"
                }}
                format="DD/MM/YYYY"
                value={formData.toDate}
                onChange={handleToDateChange}
                disabledDate={disabledDate}
                placeholder="Chọn ngày"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-[#b30000] tracking-wide">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="VD: 0987654321"
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
              style={{ width: '100%' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 text-white rounded-lg font-bold shadow-md transition-all duration-300 ease-in-out mt-2
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#b30000] to-[#ff4d4d] hover:scale-105 hover:shadow-lg'}
            `}
          >
            {loading ? "Đang xử lý..." : "Gửi đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DonationRegisterPage;