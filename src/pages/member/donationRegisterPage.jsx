//Đăng ký nhóm máu, thời gian sẵn sàng hiến máu.
import dayjs from "dayjs";
import { useState, useEffect, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CreateBloodDonationApplication } from "../../services/donorRegistration";
import { GetEventById } from "../../services/bloodDonationEvent";
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
  { value: "Chưa biết", label: "Chưa biết" },
];

const DONATION_TYPES = [
  { value: "Toàn Phần", label: "Toàn Phần" },
  { value: "Hồng Cầu", label: "Hồng Cầu" },
  { value: "Tiểu Cầu", label: "Tiểu Cầu" },
  { value: "Huyết Tương", label: "Huyết Tương" },
];

// Mapping blood type string to number
const BLOOD_TYPE_MAP = {
  "A+": 0, "A-": 1, "B+": 2, "B-": 3, "AB+": 4, "AB-": 5, "O+": 6, "O-": 7, "Chưa biết": 8
};

const bloodTypes = [
  'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'Chưa biết'
];

const DONATION_TYPE_MAP = {
  "Toàn Phần": 0, "Hồng Cầu": 1, "Tiểu Cầu": 2, "Huyết Tương": 3
};

const DonationRegisterPage = () => {
  // State declarations
  const [loading, setLoading] = useState(false);
  const [donateEvent, setDonateEvent] = useState(null); // Khai báo donateEvent state
  
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const eventId = params.get("eventId");

  const [formData, setFormData] = useState({
    userId: "",
    fullName: "",
    birthDate: null,
    gender: "",
    bloodType: "",
    type: "",
    toDate: dayjs().add(1, 'day'),
    phone: "",
    quantity: "",
    note: "",
  });

  useEffect(() => {
    if (user) {
      // Map giới tính
      let gender = "Khác";
      if (user.gender === "male" || user.gender === "Nam") gender = "Nam";
      else if (user.gender === "female" || user.gender === "Nữ") gender = "Nữ";
      // Map nhóm máu
      let bloodType = "";
      if (typeof user.bloodType === "number") {
        bloodType = bloodTypes[user.bloodType];
      } else if (typeof user.bloodType === "string") {
        bloodType = user.bloodType;
      }
             setFormData({
         userId: user.id,
         fullName: user.name,
         birthDate: user.dob ? dayjs(user.dob, "DD-MM-YYYY") : null,
         gender: gender,
         bloodType: bloodType,
         type: "",
         toDate: dayjs().add(1, 'day'),
         phone: user.phoneNumber,
         quantity: "",
         note: "",
       });
    }
  }, [user]);

  // Fetch event data if eventId exists
  useEffect(() => {
    const fetchEventData = async () => {
      if (eventId) {
        try {
          const eventData = await GetEventById(eventId);
          setDonateEvent(eventData);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin sự kiện:", error);
          toast.error("Không thể lấy thông tin sự kiện hiến máu.");
        }
      }
    };

    fetchEventData();
  }, [eventId]);
  const [errors, setErrors] = useState({});
  console.log("formData:", formData);

  // Date validation
  const disabledDate = useCallback((current) => {
    // Không cho chọn ngày trước hôm nay và cả hôm nay
    return current && current <= dayjs().startOf('day');
  }, []);

  const validateDate = useCallback((selectedDate) => {
    if (!selectedDate) {
      return false;
    }

    const selectedDateStr = dayjs(selectedDate).format("YYYY-MM-DD");
    const today = dayjs().format("YYYY-MM-DD");

    // Check if date is in the past or today (before tomorrow)
    if (selectedDateStr <= today) {
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
         note: formData.note || "Hiến máu lần đầu",
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
        note: "",
      }));
      setErrors({});

    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.response.data.message || "Không thể đăng ký. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
        <h1 className="text-[32px] font-bold text-[#b30000] text-center mb-8 tracking-wide drop-shadow-sm">thông tin hiến máu</h1>

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
                disabled={!!user?.bloodType}
              >
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
                 <option value="Hồng Cầu">Hồng Cầu</option>
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
          </div>

          {/* Số điện thoại */}
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

          {/* Ghi chú */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-[#b30000] tracking-wide">Ghi chú (nếu có)</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Bệnh nền, tình trạng sức khỏe, thuốc đang sử dụng..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#b30000] transition resize-none"
              rows="3"
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