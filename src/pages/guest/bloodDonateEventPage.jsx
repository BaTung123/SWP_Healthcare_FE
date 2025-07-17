import { useEffect, useState } from "react";
import { Card, Badge, Button, Modal, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { GetAllBloodDonationEvents, UpdateBloodDonationEvent, GetAllEvents } from "../../services/bloodDonationEvent";
import { CreateBloodDonationApplication } from "../../services/donorRegistration";
import dayjs from "dayjs";
import { GetUserProfileByUserId } from "../../services/userProfile";

const { Title, Text } = Typography;
const bloodGroups = [
  "O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"
];
const bloodGroupMap = {"O-":0,"O+":1,"A-":2,"A+":3,"B-":4,"B+":5,"AB-":6,"AB+":7};
function getBloodGroupStringFromType(type) {
  if (typeof type === 'number' && type >= 0 && type < bloodGroups.length) return bloodGroups[type];
  return "";
}
const donationTypes = [
  "Toàn phần", "Tiểu cầu", "Huyết tương"
];
const genders = ["Nam", "Nữ", "Khác"];

const BloodDonationEventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    gender: "",
    bloodGroup: "",
    donationType: "",
    quantity: "",
    toDate: "",
    phone: "",
    note: ""
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState(0);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const apiEvents = await GetAllEvents();
      console.log('apiEvents:', apiEvents); // Debug log
      // Fix: unwrap data.events or data
      let eventArray = [];
      if (Array.isArray(apiEvents)) {
        eventArray = apiEvents;
      } else if (apiEvents && Array.isArray(apiEvents.data?.events)) {
        eventArray = apiEvents.data.events;
      } else if (apiEvents && Array.isArray(apiEvents.data)) {
        eventArray = apiEvents.data;
      }
      const mappedEvents = eventArray.map(event => ({
        eventId: event.id,
        eventName: event.name,
        eventDate: event.eventStartTime,
        endDate: event.eventEndTime,
        type: event.type,
        locationName: event.locationName,
        locationAddress: event.locationAddress,
        targetDonors: event.targetParticipant,
        status: event.status,
        description: event.description,
      }));
      setEvents(mappedEvents);
    } catch (error) {
      setEvents([]);
      message.error("Không thể tải danh sách sự kiện");
    } finally {
      setLoading(false);
    }
  };
  console.log("event:", events)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleDateChange = (e) => {
    setFormData((prev) => ({ ...prev, toDate: e.target.value }));
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ và tên.";
    if (!formData.birthDate) newErrors.birthDate = "Vui lòng nhập ngày sinh.";
    if (!formData.gender) newErrors.gender = "Vui lòng chọn giới tính.";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Vui lòng chọn nhóm máu.";
    if (!formData.donationType) newErrors.donationType = "Vui lòng chọn loại hiến máu.";
    if (!formData.quantity || isNaN(formData.quantity) || formData.quantity < 50 || formData.quantity > 500) newErrors.quantity = "Số lượng máu phải từ 50 đến 500ml.";
    if (!formData.toDate) newErrors.toDate = "Vui lòng chọn ngày sẵn sàng hiến.";
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) newErrors.phone = "Số điện thoại phải đủ 10 số và chỉ chứa số.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      // Lấy userId từ localStorage nếu có
      let userId = 0;
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userObj = JSON.parse(userStr);
          userId = userObj.userId || userObj.id || 0;
        }
      } catch {}
      // Map bloodGroup và donationType sang số nếu cần
      const donationTypeMap = {"Toàn phần":0,"Tiểu cầu":1,"Huyết tương":2};
      // Chuyển đổi ngày sinh và ngày sẵn sàng hiến
      const dob = formData.birthDate ? new Date(formData.birthDate) : null;
      const toDate = formData.toDate ? new Date(formData.toDate) : null;
      const reqBody = {
        userId,
        eventId: selectedEvent?.eventId || 0,
        fullName: formData.fullName,
        dob: dob ? dob.toISOString() : null,
        gender: formData.gender,
        bloodType: bloodGroupMap[formData.bloodGroup] ?? 0,
        bloodTransferType: donationTypeMap[formData.donationType] ?? 0,
        quantity: Number(formData.quantity),
        request: formData.note || "",
        phoneNumber: formData.phone,
        donationEndDate: toDate ? {
          year: toDate.getFullYear(),
          month: toDate.getMonth() + 1,
          day: toDate.getDate(),
          dayOfWeek: toDate.getDay()
        } : { year: 1970, month: 1, day: 1, dayOfWeek: 4 }
      };
      await CreateBloodDonationApplication(reqBody);
      message.success("Đăng ký thành công! Cảm ơn bạn đã tham gia hiến máu.");
      setShowRegisterModal(false);
      setFormData({
        fullName: "",
        birthDate: "",
        gender: "",
        bloodGroup: "",
        donationType: "",
        quantity: "",
        toDate: "",
        phone: "",
        note: ""
      });
      setErrors({});
    } catch (error) {
      message.error("Đăng ký thất bại. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  const openRegisterModal = async (event) => {
    setSelectedEvent(event);
    setShowRegisterModal(true);
    // Prefill userId and user info
    let uid = 0;
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        uid = userObj.userId || userObj.id || 0;
        setUserId(uid);
      }
    } catch {}
    if (uid) {
      try {
        const profileRes = await GetUserProfileByUserId(uid);
        const profile = profileRes.data || profileRes; // fallback if no .data
        setUserProfile(profile);
        setFormData((prev) => ({
          ...prev,
          fullName: profile.fullName || "",
          birthDate: profile.dob ? profile.dob.slice(0, 10) : "",
          gender: profile.gender || "",
          bloodGroup: getBloodGroupStringFromType(profile.bloodType),
          phone: profile.phoneNumber || "",
        }));
      } catch (err) {
        setUserProfile(null);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sự kiện hiến máu</h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...events].sort((a,b) => {
            if (a.isActive === b.isActive) 
              return 0;
            return a.isActive ? -1 : 1;
          })
          .map((event) => (
            <div className="group" key={event.eventId}>
              <Card
                className="transition-transform duration-300 hover:scale-105 hover:shadow-xl relative"
                title={event.eventName}
                extra={(() => {
                  // status: 0=active, 1=ended, 2=cancelled
                  let badgeProps = {
                    status: "processing",
                    text: (
                      <span style={{ fontSize: 16 }}>Đang diễn ra</span>
                    ),
                  };
                  if (event.status === 1) {
                    badgeProps = {
                      status: "error",
                      text: (
                        <span style={{ fontSize: 16, color: "#ff4d4f" }}>Đã kết thúc</span>
                      ),
                    };
                  } else if (event.status === 2) {
                    badgeProps = {
                      status: "default",
                      text: (
                        <span style={{ fontSize: 16, color: "#888" }}>Đã hủy</span>
                      ),
                    };
                  }
                  return <Badge {...badgeProps} />;
                })()}
                style={{ width: "100%" }}
              >
                <p><strong>Loại sự kiện:</strong> {event.type}</p>
                <p><strong>Địa điểm:</strong> {event.locationName}</p>
                <p><strong>Địa chỉ:</strong> {event.locationAddress}</p>
                <p>
                  <strong>Thời gian:</strong> {dayjs(event.eventDate).format("DD/MM/YYYY HH:mm")} - {dayjs(event.endDate).format("DD/MM/YYYY HH:mm")}
                </p>
                <p><strong>Chỉ tiêu người tham gia:</strong> {event.targetDonors}</p>
                {event.description && <p><strong>Mô tả:</strong> {event.description}</p>}
                {event.status === 0 &&
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      type="primary"
                      className="mt-2 w-full"
                      onClick={() => openRegisterModal(event)}
                    >
                      Đăng kí tham gia
                    </Button>
                  </div>
                }
              </Card>
            </div>
          ))}
        </div>
      )}
      <Modal
        open={showRegisterModal}
        onCancel={() => setShowRegisterModal(false)}
        footer={null}
        destroyOnClose
        centered
      >
        <div style={{ maxWidth: 520, margin: "0 auto", padding: 12 }}>
          {/* Hiển thị userId nếu có */}
          {userId ? (
            <div className="mb-2 text-sm text-gray-600">Mã người dùng: <b>{userId}</b></div>
          ) : null}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Title level={1} style={{ color: "#c82333", marginBottom: 0 }}>HIẾN</Title>
            <Title level={2} style={{ color: "#222", marginTop: 0 }}>MÁU</Title>
            <Text strong style={{ color: "#c82333", fontSize: 16 }}>HIẾN MÁU - CỨU NGƯỜI</Text>
          </div>
          {selectedEvent && (
            <div style={{ marginBottom: 16, textAlign: "center" }}>
              <Text strong>Thời gian: </Text>
              <Text>{dayjs(selectedEvent.eventDate).format("DD/MM/YYYY")} - {dayjs(selectedEvent.endDate).format("DD/MM/YYYY")}</Text><br />
              <Text strong>Địa điểm: </Text>
              <Text>{selectedEvent.location}</Text>
            </div>
          )}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#b30000]">Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#b30000]"
              />
              {errors.fullName && <span className="text-red-500 text-xs mt-1">{errors.fullName}</span>}
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col flex-1">
                <label className="mb-1 font-semibold text-[#b30000]">Ngày sinh</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                />
                {errors.birthDate && <span className="text-red-500 text-xs mt-1">{errors.birthDate}</span>}
              </div>
              <div className="flex flex-col flex-1">
                <label className="mb-1 font-semibold text-[#b30000]">Giới tính</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                >
                  <option value="">-- Chọn giới tính --</option>
                  {genders.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                {errors.gender && <span className="text-red-500 text-xs mt-1">{errors.gender}</span>}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col flex-1">
                <label className="mb-1 font-semibold text-[#b30000]">Nhóm máu</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                >
                  <option value="">-- Chọn nhóm máu --</option>
                  {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
                {errors.bloodGroup && <span className="text-red-500 text-xs mt-1">{errors.bloodGroup}</span>}
              </div>
              <div className="flex flex-col flex-1">
                <label className="mb-1 font-semibold text-[#b30000]">Loại hiến máu</label>
                <select
                  name="donationType"
                  value={formData.donationType}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                >
                  <option value="">-- Chọn loại hiến máu --</option>
                  {donationTypes.map(dt => <option key={dt} value={dt}>{dt}</option>)}
                </select>
                {errors.donationType && <span className="text-red-500 text-xs mt-1">{errors.donationType}</span>}
              </div>
              <div className="flex flex-col flex-1">
                <label className="mb-1 font-semibold text-[#b30000]">Số lượng (ml)</label>
                <input
                  type="number"
                  name="quantity"
                  min={50}
                  max={500}
                  step={50}
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Nhập số ml (từ 50 đến 500)"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                />
                {errors.quantity && <span className="text-red-500 text-xs mt-1">{errors.quantity}</span>}
              </div>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#b30000]">Thời gian sẵn sàng hiến</label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleDateChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000]"
              />
              {errors.toDate && <span className="text-red-500 text-xs mt-1">{errors.toDate}</span>}
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#b30000]">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại (10 số)"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#b30000]"
              />
              {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone}</span>}
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-[#b30000]">Ghi chú (nếu có)</label>
              <input
                type="text"
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Nhập ghi chú (tùy chọn)"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#b30000]"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full p-3 text-white rounded-lg font-bold shadow-md transition-all duration-300 ease-in-out mt-2 ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#b30000] to-[#ff4d4d] hover:scale-105 hover:shadow-lg'}`}
            >
              {submitting ? "Đang xử lý..." : "Đăng ký ngay"}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default BloodDonationEventPage;
