//Đăng ký nhóm máu, thời gian sẵn sàng hiến máu.
import dayjs from "dayjs";
import { useState, useEffect, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GetUserProfileByUserId } from "../../services/userProfile";
import { GetBloodDonationEventById } from "../../services/bloodDonationEvent";
import { CreateBloodDonationApplication } from "../../services/donorRegistration";
import { DatePicker } from "antd";
import UserContext from "../../contexts/UserContext";

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

const bloodTypes = [
  'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'
];

const DONATION_TYPE_MAP = {
  "Toàn Phần": 0, "Tiểu Cầu": 1, "Huyết Tương": 2
};

const DonationRegisterPage = () => {
  const [donateEvent, setDonateEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  const { user } = useContext(UserContext);
  
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const eventId = params.get("eventId");

  const [formData, setFormData] = useState({
    userId: "",
    fullName: "",
    birthDate: null,
    gender: "",
    bloodType: "",
    type: "",
    toDate: dayjs(),
    phone: "",
    quantity: "",
  });

  useEffect(() => {
    if (user && user.dob) {
      setFormData({
        userId: user.id,
        fullName: user.name,
        birthDate: dayjs(user.dob, "DD-MM-YYYY"),
        gender: user.gender,
        bloodType: "",
        type: "",
        toDate: dayjs(), 
        phone: user.phoneNumber,
        quantity: "",
      });
    }
  }, [user]);
  const [errors, setErrors] = useState({});
  console.log("formData:", formData);
  // Mock: các ngày đã đăng ký trước đó (giả lập, thực tế lấy từ API)
  const registeredDates = [
    '2024-06-01',
    '2024-07-10',
    '2024-08-15',
  ];

  // Date validation
  const disabledDate = useCallback((current) => {
    // Không cho chọn ngày trước hôm nay
    return current && current < dayjs().startOf('day');
  }, []);

  const validateDate = useCallback((selectedDate) => {
    if (!selectedDate) {
      return false;
    }

    const selectedDateStr = dayjs(selectedDate).format("YYYY-MM-DD");
    const today = dayjs().format("YYYY-MM-MM-DD");

    // Check if date is in the past
    if (selectedDateStr < today) {
      return false;
    }

    // Check event date range if event exists
    if (donateEvent) {
      const eventStartDate = dayjs(donateEvent.eventDate).format("YYYY-MM-DD");
      const eventEndDate = dayjs(donateEvent.endDate).format("YYYY-MM-DD");

      if (selectedDateStr < eventStartDate || selectedDateStr > eventEndDate) {
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
    const newErrors = {};
    // Validate họ tên
    if (!formData.fullName) {
      newErrors.fullName = "Vui lòng nhập họ và tên.";
    } else if (/[^a-zA-ZÀ-ỹ\s]/.test(formData.fullName)) {
      newErrors.fullName = "Họ tên không được chứa số hoặc ký tự đặc biệt.";
    }
    // Validate nhóm máu
    if (!formData.bloodType) {
      newErrors.bloodType = "Vui lòng chọn nhóm máu.";
    }
    // Validate loại hiến máu
    if (!formData.type) {
      newErrors.type = "Vui lòng chọn loại hiến máu.";
    }
    // Validate ngày sinh
    if (!formData.birthDate) {
      newErrors.birthDate = "Vui lòng nhập ngày sinh.";
    } else {
      const age = dayjs().diff(dayjs(formData.birthDate), 'year');
      if (age < 18) {
        newErrors.birthDate = "Bạn phải đủ 18 tuổi trở lên để đăng ký hiến máu.";
      } else if (age > 60) {
        newErrors.birthDate = "Tuổi phải từ 18 đến 60 để đủ điều kiện hiến máu.";
      }
    }
    // Validate giới tính
    if (!formData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính.";
    }
    // Validate số điện thoại
    const phone = formData.phone || '';
    if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Số điện thoại phải đủ 10 số và chỉ chứa số.";
    }
    // Validate số lượng ml máu
    const quantity = Number(formData.quantity);
    if (!quantity || isNaN(quantity) || quantity < 50) {
      newErrors.quantity = "Vui lòng nhập số lượng máu muốn hiến (ml) tối thiểu 50ml.";
    } else if (quantity > 500) {
      newErrors.quantity = "Số lượng máu hiến tối đa là 500ml cho một lần hiến.";
    } else if (quantity % 50 !== 0) {
      newErrors.quantity = "Số lượng máu phải là bội số của 50ml (0, 50, 100, ..., 500).";
    }
    // Validate ngày đăng ký hiến
    if (!validateDate(formData.toDate)) {
      newErrors.toDate = "Vui lòng chọn ngày hợp lệ.";
    }
    // Không cho phép đăng ký trùng ngày (giả lập)
    const selectedDateStr = dayjs(formData.toDate).format('YYYY-MM-DD');
    if (registeredDates.includes(selectedDateStr)) {
      newErrors.toDate = "Bạn đã đăng ký hiến máu vào ngày này rồi. Vui lòng chọn ngày khác.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra userId và eventId hợp lệ trước khi gửi API
    if (!formData.userId || isNaN(Number(formData.userId))) {
      toast.error("Không xác định được userId. Vui lòng đăng nhập lại.");
      return;
    }
    // if (!eventId || isNaN(Number(eventId))) {
    //   toast.error("Không xác định được sự kiện hiến máu.");
    //   return;
    // }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      console.log("formData:", formData);

      const dataToSend = {
        userId: formData.userId,
        eventId: eventId ? Number(eventId) : null,
        fullName: formData.fullName,
        dob: formData.birthDate,
        gender: formData.gender,
        bloodType: bloodTypes[formData.bloodType],
        bloodTransferType: DONATION_TYPE_MAP[formData.type],
        quantity: Number(formData.quantity),
        note: "Hiến máu lần đầu", // hoặc lấy từ form nếu có
        phoneNumber: formData.phone,
        donationEndDate: formData.toDate ? dayjs(formData.toDate).format("YYYY-MM-DD") : ""
      };
      console.log('dataToSend:', dataToSend);

      const response = await CreateBloodDonationApplication(dataToSend);
      console.log("Registration response:", response);
      toast.success("Đăng ký hiến máu thành công!");
      // Reset form after successful submission
      setFormData(prev => ({
        ...prev,
        bloodType: "",
        type: "",
        toDate: "",
        quantity: "",
      }));
      setErrors({});
      // Chuyển hướng sang trang danh sách donor để tự động reload

    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.response.data.message || "Không thể đăng ký. Vui lòng thử lại.";
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
          {/* Họ và tên */}
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
            {errors.fullName && <span className="text-red-500 text-xs mt-1">{errors.fullName}</span>}
          </div>

          {/* Thông tin cá nhân */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="flex flex-col flex-1">
              <label className="mb-1 font-semibold text-[#b30000] tracking-wide">Ngày sinh</label>
              <DatePicker
                style={{
                  padding: 12,
                  borderRadius: "0.75rem",
                  border: "1px solid #e5e7eb"
                }}
                format="DD-MM-YYYY"
                value={formData.birthDate}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    birthDate: date,
                  }))
                }
                placeholder="Chọn ngày"
              />
              {errors.birthDate && <span className="text-red-500 text-xs mt-1">{errors.birthDate}</span>}
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
              {errors.gender && <span className="text-red-500 text-xs mt-1">{errors.gender}</span>}
            </div>
          </div>

          {/* Thông tin hiến máu */}
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
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.bloodType && <span className="text-red-500 text-xs mt-1">{errors.bloodType}</span>}
            </div>
            <div className="flex flex-col flex-1">
              <label className="mb-1 font-semibold text-[#b30000] tracking-wide">Loại</label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                style={{ width: '100%' }}
              >
                <option value="">-- Chọn loại --</option>
                <option value="Toàn Phần">Toàn Phần</option>
                <option value="Tiểu Cầu">Tiểu Cầu</option>
                <option value="Huyết Tương">Huyết Tương</option>
              </select>
              {errors.type && <span className="text-red-500 text-xs mt-1">{errors.type}</span>}
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
              {errors.quantity && <span className="text-red-500 text-xs mt-1">{errors.quantity}</span>}
            </div>
          </div>

          {/* Thời gian sẵn sàng hiến */}
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
                format="DD-MM-YYYY"
                value={formData.toDate}
                onChange={handleToDateChange}
                disabledDate={disabledDate}
                placeholder="Chọn ngày"
                disabled={loading}
              />
              {errors.toDate && <span className="text-red-500 text-xs mt-1">{errors.toDate}</span>}
            </div>
            <span className="text-xs text-gray-500 mt-1">Chỉ chọn ngày từ hôm nay trở đi.</span>
          </div>

          {/* Số điện thoại dưới cùng */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-[#b30000] tracking-wide">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="VD: 0987654321"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
              style={{ width: '100%' }}
            />
            {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone}</span>}
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