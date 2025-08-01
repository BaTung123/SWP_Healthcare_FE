import { useEffect, useState, useContext } from "react";
import { Card, Badge, Button, Modal, Typography, DatePicker } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GetAllEvents, UpdateEventStatus } from "../../services/bloodDonationEvent";
import { getAllBloodDonationApplication } from "../../services/donorRegistration";
import dayjs from "dayjs";
import UserContext from "../../contexts/UserContext";

const { Title, Text } = Typography;
const bloodGroups = [
  "O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+", "Chưa biết"
];
const bloodGroupMap = {"O-":0,"O+":1,"A-":2,"A+":3,"B-":4,"B+":5,"AB-":6,"AB+":7,"Chưa biết":8};
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
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const apiEvents = await GetAllEvents();
      console.log('apiEvents:', apiEvents); 
      const eventList = apiEvents.data.events;
      console.log('eventList:', eventList); 
      const apiDonateApllication = await getAllBloodDonationApplication();
      console.log('apiDonateApllication:', apiDonateApllication);

      await Promise.all(
        eventList.map(async (event) => {
          const now = dayjs();
          const start = dayjs(event.eventStartTime);
          const end = dayjs(event.eventEndTime);
          const donateApplicationList = apiDonateApllication.filter(app => app.eventId === event.id);
          const donateApplicationCount = donateApplicationList.length;

          if (now.isAfter(start) && now.isBefore(end)) {
            const updatedEventData = {
              ...event,
              status: 1
            }
            const updatedEventRes = await UpdateEventStatus(updatedEventData)
            console.log("updatedEventRes:", updatedEventRes);
          }
          else if (now.isAfter(end)) {
            const updatedEventData = {
              ...event,
              status: 3
            }
            const updatedEventRes = await UpdateEventStatus(updatedEventData)
            console.log("updatedEventRes:", updatedEventRes);
          } 
          else if (donateApplicationCount === event.targetParticipant) {
            const updatedEventData = {
              ...event,
              status: 2
            }
            const updatedEventRes = await UpdateEventStatus(updatedEventData)
            console.log("updatedEventRes:", updatedEventRes);
          }
        })
      )

      const refreshedEvents = await GetAllEvents();
      setEvents(refreshedEvents.data.events);
    } catch (error) {
      setEvents([]);
      toast.error("Không thể tải danh sách sự kiện");
    } finally {
      setLoading(false);
    }
  };
  console.log("event:", events)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleDateChange = (date, dateString) => {
    setFormData((prev) => ({ ...prev, toDate: dateString }));
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ và tên.";
    if (!formData.birthDate) newErrors.birthDate = "Vui lòng nhập ngày sinh.";
    if (!formData.gender) newErrors.gender = "Vui lòng chọn giới tính.";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Vui lòng chọn nhóm máu.";
    if (!formData.donationType) newErrors.donationType = "Vui lòng chọn loại hiến máu.";
    if (!formData.quantity || isNaN(formData.quantity) || formData.quantity < 50 || formData.quantity > 500) newErrors.quantity = "Số lượng máu phải từ 50 đến 500ml.";
    if (!formData.toDate) {
      newErrors.toDate = "Vui lòng chọn ngày sẵn sàng hiến.";
    } else if (selectedEvent) {
      const start = dayjs(selectedEvent.eventDate, "YYYY-MM-DD");
      const end = dayjs(selectedEvent.endDate, "YYYY-MM-DD");
      const chosen = dayjs(formData.toDate, "DD/MM/YYYY");
      if (chosen.isBefore(start, 'day') || chosen.isAfter(end, 'day')) {
        newErrors.toDate = `Ngày sẵn sàng hiến phải trong khoảng từ ${start.format("DD/MM/YYYY")} đến ${end.format("DD/MM/YYYY")}`;
      }
    }
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) newErrors.phone = "Số điện thoại phải đủ 10 số và chỉ chứa số.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      // Lấy userId từ context
      const userId = user?.userId || user?.id;
      if (!userId) {
        toast.error("Vui lòng đăng nhập để đăng ký.");
        setSubmitting(false);
        return;
      }
      
      // Map bloodGroup và donationType sang số nếu cần
      const donationTypeMap = {"Toàn phần":0,"Tiểu cầu":1,"Huyết tương":2};
      // Chuyển đổi ngày sinh và ngày sẵn sàng hiến
      const dob = formData.birthDate ? new Date(formData.birthDate) : null;
      const toDate = formData.toDate ? dayjs(formData.toDate, "DD/MM/YYYY").toDate() : null;
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
        donationEndDate: toDate ? toDate.toISOString().slice(0, 10) : "1970-01-01"
      };
      await CreateBloodDonationApplication(reqBody);
      toast.success("Đăng ký thành công! Cảm ơn bạn đã tham gia hiến máu.");
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
      toast.error("Đăng ký thất bại. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  const openRegisterModal = (event) => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để đăng ký sự kiện.");
      return;
    }

    setSelectedEvent(event);
    setShowRegisterModal(true);

    // Convert dob from DD-MM-YYYY to YYYY-MM-DD for the date input
    const dobParts = user.dob ? user.dob.split("-") : null;
    const birthDate = dobParts ? `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}` : "";

    // Map gender
    let gender = user.gender || "";
    if (gender.toLowerCase() === "male") gender = "Nam";
    if (gender.toLowerCase() === "female") gender = "Nữ";

    setFormData((prev) => ({
      ...prev,
      fullName: user.name || "",
      birthDate: birthDate,
      gender: gender,
      bloodGroup: getBloodGroupStringFromType(user.bloodType),
      phone: user.phoneNumber || "",
      note: "",
      quantity: "",
      donationType: "",
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-red-600">Sự kiện hiến máu</h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...events].sort((a,b) => {
            if (a.status === b.status) 
              return 0;
            return a.status - b.status;
          })
          .map((event) => (
            <div className="group" key={event.id}>
              <Card
                className="transition-transform duration-300 hover:scale-105 hover:shadow-xl relative"
                title={event.name}
                extra={(() => {
                  const now = dayjs();
                  const start = dayjs(event.eventStartTime);
                  const end = dayjs(event.eventEndTime);

                  let badgeProps = {
                    status: "processing",
                    text: (
                      <span style={{ fontSize: 16 }}>Đang diễn ra</span>
                    ),
                  };

                  if (event.status === 4) {
                    badgeProps = {
                      status: "default",
                      text: <span style={{ fontSize: 16, color: "#888" }}>Đã hủy</span>,
                    };
                  } else if (event.status === 2) {
                    badgeProps = {
                      status: "warning",
                      text: <span style={{ fontSize: 16, color: "#faad14" }}>Đã đầy</span>,
                    };
                  } else {
                    if (now.isBefore(start)) {
                      badgeProps = {
                        status: "processing",
                        text: <span style={{ fontSize: 16 }}>Sắp diễn ra</span>,
                      };
                    } else if (now.isAfter(end)) {
                      badgeProps = {
                        status: "error",
                        text: <span style={{ fontSize: 16, color: "#ff4d4f" }}>Đã kết thúc</span>,
                      };
                    } else {
                      badgeProps = {
                        status: "success",
                        text: <span style={{ fontSize: 16, color: "#52c41a" }}>Đang diễn ra</span>,
                      };
                    }
                  }
                  return <Badge {...badgeProps} />;
                })()}
                style={{ width: "100%" }}
              >
                <p><strong>Loại sự kiện:</strong> {
                  event.type === 'emergency' ? 'Hiến máu khẩn cấp'
                  : event.type === 'regular' ? 'Hiến máu định kỳ'
                  : event.type === 'campaign' ? 'Chiến dịch hiến máu'
                  : event.type === 'festival' ? 'Sự kiện lễ hội'
                  : event.type
                }</p>
                <p><strong>Địa điểm:</strong> {event.locationName}</p>
                <p><strong>Địa chỉ:</strong> {event.locationAddress}</p>
                <p>
                  <strong>Thời gian:</strong> {dayjs(event.eventDate).format("DD/MM/YYYY")} - {dayjs(event.endDate).format("DD/MM/YYYY")}
                </p>
                <p><strong>Chỉ tiêu người tham gia:</strong> {event.targetDonors}</p>
                {event.description && <p><strong>Mô tả:</strong> {event.description}</p>}
                {(() => {
                  const now = dayjs();
                  const start = dayjs(event.eventDate);
                  const end = dayjs(event.endDate);
                  const isOngoing = now.isAfter(start) && now.isBefore(end);
                  return isOngoing ? (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        type="primary"
                        className="mt-2 w-full"
                        onClick={() => openRegisterModal(event)}
                      >
                        Đăng kí tham gia
                      </Button>
                    </div>
                  ) : null;
                })()}
              </Card>
            </div>
          ))}
        </div>
      )}
      <Modal
        open={showRegisterModal}
        onCancel={() => setShowRegisterModal(false)}
        footer={null}
        centered
      >
        <div style={{ maxWidth: 520, margin: "0 auto", padding: 12 }}>
          
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Title level={1} style={{ color: "#c82333", marginBottom: 0 }}>HIẾN MÁU</Title>
            <Text strong style={{ color: "#222", fontSize: 16 }}>HIẾN MÁU - CỨU NGƯỜI</Text>
          </div>
          {selectedEvent && (
            <div style={{ marginBottom: 16, textAlign: "center" }}>
              <Text strong>Thời gian: </Text>
              <Text>{dayjs(selectedEvent.eventDate).format("DD/MM/YYYY")} - {dayjs(selectedEvent.endDate).format("DD/MM/YYYY")}</Text><br />
              <Text strong>Địa điểm: </Text>
              <Text>{selectedEvent.locationName}</Text>
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
              <DatePicker
                format="DD/MM/YYYY"
                value={formData.toDate ? dayjs(formData.toDate, "DD/MM/YYYY") : null}
                onChange={handleDateChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                placeholder="Chọn ngày sẵn sàng hiến"
                disabledDate={date => {
                  if (!selectedEvent) return false;
                  const start = dayjs(selectedEvent.eventDate);
                  const end = dayjs(selectedEvent.endDate);
                  return date.isBefore(start, 'day') || date.isAfter(end, 'day');
                }}
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
                placeholder="Bệnh nền, tình trạng sức khỏe, thuốc đang sử dụng..."
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