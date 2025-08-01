// Hồ sơ người dùng, thông tin cá nhân.
import { useState, useRef, useEffect, useContext } from 'react';
import { getAllBloodDonationApplication } from '../../services/donorRegistration';
import { Button, DatePicker, Modal, Table, Tooltip } from 'antd';
import { ReadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { GetAuthenByUserId, updateUserInfo } from '../../services/authentication';
import UserContext from '../../contexts/UserContext';

// Constants và helper functions để ngoài component
const BLOOD_TYPE_MAP = {
  "O-": 0, "O+": 1, "A-": 2, "A+": 3, "B-": 4, "B+": 5, "AB-": 6, "AB+": 7, "Chưa biết": 8
};
const BLOOD_TYPE_REVERSE_MAP = [
  "O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+", "Chưa biết"
];

const bloodTransferTypes = [
  'Toàn Phần', 'Hồng Cầu', 'Huyết Tương', 'Tiểu Cầu'
];

const statusList = [
  'Đang Chờ', 'Chấp Nhận', 'Đã Xuất', 'Từ Chối'
];

function normalizeGender(gender) {
  if (!gender) return 'male';
  if (["Nam", "Male", "male", "nam"].includes(gender)) return 'Males';
  if (["Nữ", "Female", "female", "nữ"].includes(gender)) return 'Female';
  return 'Other';
}
function normalizeBloodType(bloodType) {
  if (typeof bloodType === 'number') return BLOOD_TYPE_REVERSE_MAP[bloodType] || '';
  return bloodType || '';
}
function normalizeDob(dob) {
  if (!dob) return '';
  if (/^\d{2}-\d{2}-\d{4}$/.test(dob)) {
    const [day, month, year] = dob.split('-');
    return `${year}-${month}-${day}`;
  }
  return dob;
}
function validatePhone(phone) {
  return /^\d{10}$/.test(phone);
}
function validateAge(dob) {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 18;
}

const ProfilePage = () => {
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('profile');
  const [registrationList, setRegistrationList] = useState([]);
  // const [registration, setRegistration] = useState(null);
  // const [appointmentList, setAppointmentList] = useState([]);
  // const [appointment, setAppointment] = useState(null);
  // const [event, setEvent] = useState(null);
  // const [newDate, setNewDate] = useState(null);
  // const [showChangeDate, setShowChangeDate] = useState(false);
  // const [showAppointList, setShowAppointList] = useState(false);
  const [showAppointForRegister, setShowAppointForRegister] = useState(null);

  const [userItem, setUserItem] = useState();
  const [form, setForm] = useState({});

  // State cho modal ghi chú
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteData, setNoteData] = useState('');

  // Thêm khai báo bloodTypes
  const bloodTypes = [
    'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'Chưa biết'
  ];

  const columns = [
    {
      title: 'Họ và Tên',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
      align: 'center',
    },
    {
      title: 'Phân loại',
      key: 'type',
      align: 'center',
      width: 160,
      render: (record) => {
        if (record.eventId) {
          return <span className="font-bold text-blue-500 border-2 rounded-md p-1">Sự kiện</span>;
        }
        return <span className="font-bold text-purple-500 border-2 rounded-md p-1">Thường</span>;
      }
    },
    {
      title: 'Nhóm Máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      width: 100,
      align: 'center',
      render: (bloodType) => bloodTypes[bloodType]
    },
    {
      title: 'Loại',
      dataIndex: 'bloodTransferType',
      key: 'bloodTransferType',
      width: 120,
      align: 'center',
      render: (type) => bloodTransferTypes[type]
    },
    {
      title: 'Số lượng (ml)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      align: 'center',
      render: (quantity) => quantity ? `${quantity} ml` : '-',
    },
    {
      title: 'Ngày đã chọn',
      dataIndex: 'donationEndDate',
      key: 'donationEndDate',
      width: 200,
      align: 'center',
      render: (record) => record ? dayjs(record).format('DD/MM/YYYY') : '',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      align: 'center',
      render: (status) => {
        let color;
        const text = statusList[status];
        switch (text) {
          case 'Đang Chờ': color = 'text-orange-500'; break;
          case 'Chấp Nhận': color = 'text-green-500'; break;
          case 'Từ Chối': color = 'text-red-500'; break;
          default: color = 'text-blue-500';
        }
        return (
          <span className={`font-bold ${color} border-2 rounded-md p-1`} >
            {text}
          </span>
        );
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 150,
      align: 'center',
      render: (note, record) => {
        if (note && note.trim() !== '') {
          return (
            <Tooltip title="Xem ghi chú">
              <Button
                type="dashed"
                variant="dashed"
                color="cyan"
                onClick={() => handleOpenNoteModal(record)}
              >
                <ReadOutlined />
              </Button>
            </Tooltip>
          );
        }
        return <span className="text-gray-400">-</span>;
      },
    },
  ]

  // Thêm columns cho bảng lịch sử hiến máu
  const historyColumns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      align: 'center',
    },
    {
      title: 'Số lượng (ml)',
      dataIndex: 'volume',
      key: 'volume',
      align: 'center',
    },
    {
      title: 'Loại hiến',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
    },
    {
      title: 'Ngày hiến',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
    },
  ];

  // Đưa fetchUser ra ngoài useEffect để có thể gọi lại
  const fetchUser = async () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const payload = JSON.parse(atob(savedUser.token.split('.')[1]));
    const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    const userResponse = await GetAuthenByUserId(userId);
    const userData = userResponse.data;
    setUserItem(userData);
    setForm({
      ...userData,
      gender: normalizeGender(userData.gender),
      phone: userData.phoneNumber || '',
      bloodType: normalizeBloodType(userData.bloodType),
      dob: normalizeDob(userData.dob),
    });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const { user } = useContext(UserContext);
  console.log("user:", user);
  useEffect(() => {
    const fetchDonateApplication = async () => {
      try {
        const donateApplicationRes = await getAllBloodDonationApplication();
        console.log("donateApplicationRes:", donateApplicationRes);

        // Filter by current user's name
        const donateList = donateApplicationRes.filter(app => app.fullName === user.name);
        console.log("donateList:", donateList);
        setRegistrationList(donateList);
      } catch (error) {
        console.error("Error fetching donation applications:", error);
        toast.error("Không thể tải danh sách đơn đăng ký hiến máu");
      }
    }
    
    if (user && user.name) {
      fetchDonateApplication();
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (!form.name || form.name.trim().length < 5) {
        toast.error('Tên phải có ít nhất 5 ký tự!');
        return;
      }
      if (!form.gender) {
        toast.error('Vui lòng chọn giới tính!');
        return;
      }
      if (!validatePhone(form.phone)) {
        toast.error('Số điện thoại phải đủ 10 số!');
        return;
      }
      if (!validateAge(form.dob)) {
        toast.error('Bạn phải đủ 18 tuổi trở lên!');
        return;
      }
      // Lấy id từ user object
      const id = user?.id;
      const bloodTypeNumber = BLOOD_TYPE_MAP[form.bloodType];
      if (bloodTypeNumber === undefined) {
        toast.error('Vui lòng chọn nhóm máu hợp lệ!');
        return;
      }
      // Không cần map lại gender, giữ nguyên tiếng Anh
      const dataToSend = {
        id,
        name: form.name,
        gender: form.gender?.toLowerCase(), // chuyển về lower-case
        dob: form.dob,
        phoneNumber: form.phone,
        bloodType: bloodTypeNumber
      };
      console.log('Dữ liệu gửi lên:', dataToSend);
      await updateUserInfo(dataToSend);
      // Gọi lại API lấy user mới nhất
      const userResponse = await GetAuthenByUserId(id);
      const updatedUser = userResponse.data;
      setUserItem(updatedUser);
      setForm({
        ...updatedUser,
        gender: normalizeGender(updatedUser.gender),
        phone: updatedUser.phoneNumber || '',
        bloodType: normalizeBloodType(updatedUser.bloodType),
        dob: normalizeDob(updatedUser.dob),
      });
      // Lưu vào localStorage nếu muốn
      const savedUser = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem("user", JSON.stringify({
        ...savedUser,
        ...updatedUser
      }));
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.log('Lỗi cập nhật:', error.response?.data || error.message);
      toast.error('Cập nhật thông tin thất bại!');
    }
  };

  // Handler cho modal ghi chú
  const handleOpenNoteModal = (record) => {
    setNoteData(record.note || '');
    setIsNoteModalOpen(true);
  };

  const handleNoteModalCancel = () => {
    setIsNoteModalOpen(false);
    setNoteData('');
  };


  return (
    <div className="max-w-[1200px] mx-auto p-8">
      <div className="rounded-lg shadow-md bg-white p-6">
        <h2 className="text-4xl font-bold text-indigo-900 mb-6">Thông tin cá nhân</h2>

        <div className="flex border-b-2 border-indigo-100 mb-10">
          <div
            className={`py-2 font-semibold text-indigo-600 cursor-pointer border-b-3 mr-8 text-[16px] tracking-wider transition-all ${activeTab === 'profile' ? 'text-indigo-900 border-b-3 border-indigo-900' : 'border-transparent'}`}
            onClick={() => setActiveTab('profile')}
          >
            HỒ SƠ
          </div>
          <div
            className={`py-2 font-semibold text-indigo-600 cursor-pointer border-b-3 mr-8 text-[16px] tracking-wider transition-all ${activeTab === 'registration' ? 'text-indigo-900 border-b-3 border-indigo-900' : 'border-transparent'}`}
            onClick={() => setActiveTab('registration')}
          >
            LỊCH SỬ HIẾN MÁU
          </div>
        </div>

        {activeTab === 'profile' && user && (
          <div className="flex items-start mb-8">
            {/* Hiển thị avatar nếu có */}
            {user.avatarImageUrl && (
              <div className="mr-8 flex-shrink-0">
                <img
                  src={user.avatarImageUrl}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-md"
                />
              </div>
            )}
            <div className="flex-1 w-full max-w-xl mx-auto">
              <div className="grid grid-cols-2 gap-x-12 gap-y-6 w-full max-w-2xl mx-auto">
                <div>
                  <div className="flex flex-col gap-1 w-full mb-3">
                    <label className="text-base font-semibold uppercase tracking-wider min-w-[180px] text-left">HỌ VÀ TÊN</label>
                    <input
                      name="name"
                      value={form.name || form.fullName || ''}
                      onChange={handleChange}
                      className="py-3 px-4 border-2 border-indigo-100 rounded-lg text-lg transition-all flex-1 max-w-[700px] hover:border-indigo-200 focus:border-indigo-900 focus:outline-none focus:shadow-[0_0_0_3px_rgba(26,35,126,0.1)]"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full mb-3">
                    <label className="text-base font-semibold uppercase tracking-wider min-w-[180px] text-left">SỐ ĐIỆN THOẠI</label>
                    <input
                      name="phone"
                      value={form.phone || ''}
                      onChange={handleChange}
                      className="py-3 px-4 border-2 border-indigo-100 rounded-lg text-lg transition-all flex-1 max-w-[700px] hover:border-indigo-200 focus:border-indigo-900 focus:outline-none focus:shadow-[0_0_0_3px_rgba(26,35,126,0.1)]"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full mb-3">
                    <label className="text-base font-semibold uppercase tracking-wider min-w-[180px] text-left">NHÓM MÁU</label>
                    <select
                      name="bloodType"
                      value={form.bloodType || ''}
                      onChange={handleChange}
                      className="py-3.5 px-4 border-2 border-indigo-100 rounded-lg text-lg bg-white transition-all flex-1 max-w-[700px] hover:border-indigo-200 focus:border-indigo-900 focus:outline-none focus:shadow-[0_0_0_3px_rgba(26,35,126,0.1)]"
                    >
                      {bloodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold uppercase tracking-wider mb-1 text-left">EMAIL</label>
                  <input
                    name="email"
                    value={user.email}
                    readOnly
                    className="w-full py-3 px-4 border-2 border-indigo-100 rounded-lg text-lg transition-all hover:border-indigo-200 focus:border-indigo-900 focus:outline-none focus:shadow-[0_0_0_3px_rgba(26,35,126,0.1)] cursor-not-allowed"
                  />
                  <div className="flex flex-col gap-1 w-full mb-3 mt-3">
                    <label className="block text-base font-semibold uppercase tracking-wider mb-1 text-left">GIỚI TÍNH</label>
                    <select
                      name="gender"
                      value={form.gender || ''}
                      onChange={handleChange}
                      className="w-full py-3.5 px-4 border-2 border-indigo-100 rounded-lg text-lg bg-white transition-all hover:border-indigo-200 focus:border-indigo-900 focus:outline-none focus:shadow-[0_0_0_3px_rgba(26,35,126,0.1)]"
                    >
                      <option value="Male">Nam</option>
                      <option value="Female">Nữ</option>
                      <option value="Other">Khác</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 w-full mb-3">
                    <label className="block text-base font-semibold uppercase tracking-wider mb-1 text-left">NGÀY SINH</label>
                    <input
                      name="dob"
                      value={form.dob || ''}
                      type="date"
                      onChange={handleChange}
                      className="w-full py-3 px-4 border-2 border-indigo-100 rounded-lg text-lg transition-all hover:border-indigo-200 focus:border-indigo-900 focus:outline-none focus:shadow-[0_0_0_3px_rgba(26,35,126,0.1)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="flex justify-center mt-10 gap-4">
            <button
              className="!bg-indigo-900 !text-white border-none font-semibold text-lg py-3 px-12 rounded-lg shadow-md transition-all hover:!bg-indigo-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              onClick={handleSave}
            >
              LƯU
            </button>
          </div>
        )}
        {console.log("registrationList:", registrationList)}
        {activeTab === 'registration' && registrationList && (
          <>
            <h3 className="text-2xl font-semibold mb-4">Đơn đăng ký hiến máu</h3>
            <Table
              className="rounded-2xl shadow-lg bg-white custom-table-user"
              dataSource={registrationList}
              columns={columns}
              rowKey="registrationId"
              pagination={{
                pageSize: 5,
                position: ['bottomCenter'],
              }}
            />
            {/* {registrationList.map((registration) => (
              <div key={registration.registrationId}>
                <div className="border border-indigo-200 p-6 rounded-lg">
                  <p><strong>Họ tên:</strong> {registration.fullNameRegister}</p>
                  <p>
                    <strong>Thời gian: </strong>
                    {
                      registration.availableFromDate !== registration.availableToDate 
                        ? `${dayjs(registration.availableFromDate).format("DD/MM/YYYY")} - ${dayjs(registration.availableToDate).format("DD/MM/YYYY")}`
                        : dayjs(registration.availableFromDate).format("DD/MM/YYYY")
                    }
                  </p>
                  <p><strong>Nhóm máu:</strong> {registration.bloodGroup}</p>
                  <p>
                    <strong>Trạng thái lịch hẹn:</strong>
                    <span className="text-red-600 font-semibold">
                      {registration.status === 'Cancelled' ? 'Đã huỷ' : registration.status}
                    </span>
                  </p>
                </div>

                {console.log("showAppointList", showAppointList)}
                <Modal
                  title="Danh sách lịch hẹn"
                  open={showAppointList}
                  onCancel={() => setShowAppointList(false)}
                  footer={[
                    <Button key="cancel" onClick={() => setShowAppointList(false)}>
                      Thoát
                    </Button>
                  ]}
                >
                  <div className="mt-4">
                    {appointmentList.map((appointment) => (
                      <div key={appointment.appointmentId} className="border border-indigo-200 p-4 rounded-lg mb-2">
                        <p><strong>Ngày hẹn:</strong> {dayjs(appointment.appointmentDate).format("DD/MM/YYYY")}</p>
                        <p><strong>Địa điểm:</strong> {appointment.facilityName}</p>
                        <p><strong>Trạng thái:</strong> {appointment.status}</p>
                      </div>
                    ))}
                  </div>
                </Modal>
              </div>
            ))} */}
          </>
        )}

        {/* Modal ghi chú */}
          <Modal
            title="Ghi chú"
            open={isNoteModalOpen}
            onCancel={handleNoteModalCancel}
            footer={[]}
          >
            <div className="p-4">
              {noteData?.trim() ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">{noteData}</p>
                </div>
              ) : (
                <div className="text-center text-gray-500 italic">
                  Không có ghi chú
                </div>
              )}
            </div>
          </Modal>
      </div>
    </div>
  )
}

export default ProfilePage