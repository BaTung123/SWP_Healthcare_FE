//Đăng ký nhóm máu, thời gian sẵn sàng hiến máu.
import dayjs from "dayjs";
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { GetUserProfileByUserId } from "../../services/userProfile";
import { GetBloodDonationEventById } from "../../services/bloodDonationEvent";
import { createDonorRegistration, DeleteDonorRegistration } from "../../services/donorRegistration";
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
    bloodType: "",
    type: "",
    toDate: "",
    phone: "",
  });

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
    if (!donateEvent) return false;
    
    return current && (
      current < dayjs(donateEvent.eventDate, "YYYY-MM-DD") ||
      current > dayjs(donateEvent.endDate, "YYYY-MM-DD")
    );
  }, [donateEvent]);

  const validateDate = useCallback((selectedDate) => {
    if (!selectedDate) {
      toast.error("Vui lòng chọn ngày.");
      return false;
    }

    const selectedDateStr = dayjs(selectedDate).format("YYYY-MM-DD");
    const today = dayjs().format("YYYY-MM-DD");

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
    if (!formData.bloodType) {
      toast.error("Vui lòng chọn nhóm máu.");
      return false;
    }
    
    if (!formData.type) {
      toast.error("Vui lòng chọn loại hiến máu.");
      return false;
    }
    
    if (!validateDate(formData.toDate)) {
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
        registrationId: 0,
        userId: formData.userId,
        fullNameRegister: formData.fullName,
        bloodGroup: formData.bloodType,
        type: formData.type,
        availableToDate: dayjs(formData.toDate).format("YYYY-MM-DD"),
        phone: formData.phone,
      };

      const response = await createDonorRegistration(dataToSend);
      console.log("Registration response:", response);
      toast.success("Đăng ký thành công!");
      
      // Reset form after successful submission
      setFormData(prev => ({
        ...prev,
        bloodType: "",
        type: "",
        toDate: "",
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
    <div className="p-8 max-w-xl mx-auto bg-[#eaf3fb]">
      <div className="rounded-lg shadow-md bg-[#fffafa] p-6">
        <h1 className="!text-[30px] text-[#b30000] text-center mb-6">Đăng ký Hiến Máu</h1>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Họ và tên</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              disabled
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-base bg-gray-50"
            />
          </div>

          <div className="flex flex-row gap-14">
            <div className="flex flex-col flex-1">
              <label className="mb-2 font-semibold text-gray-700">Nhóm máu:</label>
              <select
                name="bloodType"
                required
                value={formData.bloodType}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
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
              <label className="mb-2 font-semibold text-gray-700">Loại:</label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >
                <option value="">-- Chọn loại --</option>
                {DONATION_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Thời gian sẵn sàng hiến:</label>
            <div className="flex justify-center">
              <DatePicker
                style={{ 
                  marginTop: 10, 
                  backgroundColor: "#fffafa", 
                  padding: 12,
                  width: "100%",
                  maxWidth: "200px"
                }}
                format="DD/MM/YYYY"
                onChange={handleToDateChange}
                disabledDate={eventId ? disabledDate : false}
                placeholder="Chọn ngày"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Số điện thoại:</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="VD: 0987654321"
              disabled
              className="p-3 border border-gray-300 rounded-md text-base bg-gray-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`p-3 text-white rounded-md font-bold transition-colors duration-300 ease-in-out ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#b30000] hover:bg-[#990000]'
            }`}
          >
            {loading ? "Đang xử lý..." : "Gửi đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DonationRegisterPage;