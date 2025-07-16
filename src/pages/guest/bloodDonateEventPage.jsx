import { useEffect, useState } from "react";
import { Card, Badge, Button, Modal, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { GetAllBloodDonationEvents, UpdateBloodDonationEvent } from "../../services/bloodDonationEvent";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const bloodGroups = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
];
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
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    // Data giả cho test
    const mockEvents = [
      {
        eventId: 1,
        eventName: "Blood Drive 2024",
        eventDate: dayjs().subtract(1, 'day').toISOString(),
        endDate: dayjs().add(1, 'day').toISOString(),
        location: "Trường Đại học ABC",
        registeredDonors: 20,
        targetDonors: 100,
        description: "Sự kiện hiến máu lớn nhất năm 2024.",
        isActive: true,
      },
      {
        eventId: 2,
        eventName: "Hiến máu cứu người",
        eventDate: dayjs().add(2, 'day').toISOString(),
        endDate: dayjs().add(3, 'day').toISOString(),
        location: "Bệnh viện XYZ",
        registeredDonors: 10,
        targetDonors: 50,
        description: "Chương trình hiến máu định kỳ.",
        isActive: true,
      },
      {
        eventId: 3,
        eventName: "Blood Donation Marathon",
        eventDate: dayjs().subtract(5, 'day').toISOString(),
        endDate: dayjs().subtract(3, 'day').toISOString(),
        location: "Nhà văn hóa Thanh Niên",
        registeredDonors: 80,
        targetDonors: 80,
        description: "Sự kiện đã kết thúc.",
        isActive: false,
      },
    ];
    setEvents(mockEvents);
    setLoading(false);
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
      });
      setErrors({});
    } finally {
      setSubmitting(false);
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
            <div className="group">
              <Card
                className="transition-transform duration-300 hover:scale-105 hover:shadow-xl relative"
                key={event.eventId}
                title={event.eventName}
                extra={(() => {
                  const now = dayjs();
                  const isUpcoming = dayjs(event.eventDate).isAfter(now, 'day');
                  const isEnded = dayjs(event.endDate).isBefore(now, 'day');

                  let badgeProps = {
                    status: "processing",
                    text: (
                      <>
                        <span style={{ fontSize: 16 }}>Đang diễn ra</span>
                        <style>
                          {`
                            .ant-badge-status-dot {
                            width: 10px !important;
                            height: 10px !important;
                            }
                        `}
                        </style>
                      </>
                    ),
                  };

                  if (isUpcoming) {
                    badgeProps = {
                      status: "warning",
                      text: (
                        <>
                          <span style={{ fontSize: 16, color: "#faad14" }}>Sắp diễn ra</span>
                          <style>
                            {`
                            .ant-badge-status-dot {
                                width: 10px !important;
                                height: 10px !important;
                            }
                            `}
                          </style>
                        </>
                      ),
                    };
                  } else if (isEnded || !event.isActive) {
                    badgeProps = {
                      status: "error",
                      text: (
                        <>
                          <span style={{ fontSize: 16, color: "#ff4d4f" }}>Đã kết thúc</span>
                          <style>
                            {`
                            .ant-badge-status-dot {
                                width: 10px !important;
                                height: 10px !important;
                            }
                            `}
                          </style>
                        </>
                      ),
                    };
                  }
                  return <Badge {...badgeProps} />;
                })()}
                style={{ width: "100%" }}
              >
                <p><strong>Địa điểm:</strong> {event.location}</p>
                <p>
                  <strong>Thời gian:</strong> {dayjs(event.eventDate).format("DD/MM/YYYY")} -{" "}
                  {dayjs(event.endDate).format("DD/MM/YYYY")}
                </p>
                <p>
                  <strong>Số người đăng ký:</strong> {event.registeredDonors ?? 0}/{event.targetDonors ?? "?"}
                </p>
                <p>{event.description?.slice(0, 100)}...</p>
                {event.isActive &&
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      type="primary"
                      className="mt-2 w-full"
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowRegisterModal(true);
                      }}
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
