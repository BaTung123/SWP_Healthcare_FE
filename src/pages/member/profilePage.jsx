// Hồ sơ người dùng, thông tin cá nhân.
import { useState, useRef, useEffect } from 'react';
import { GetAllDonorRegistrationWithUserId, GetDonorRegistrationByUserId } from '../../services/donorRegistration';
import { Button, DatePicker, Modal, Table } from 'antd';
import { CreateDonationAppointmentWithDate, GetAllAppointmentWithRegistrationId, GetAllDonationAppointments, GetAppointmentsByRegistrationId } from '../../services/donationAppointment';
import { GetEventByFacilityId } from '../../services/bloodDonationEvent';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const ProfilePage = () => {
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('profile');
  const [registrationList, setRegistrationList] = useState([]);
  const [registration, setRegistration] = useState(null);
  const [appointmentList, setAppointmentList] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [event, setEvent] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [showChangeDate, setShowChangeDate] = useState(false);
  const [showAppointList, setShowAppointList] = useState(false);
  const [showAppointForRegister, setShowAppointForRegister] = useState(null);

  const [user, setUser] = useState({
    fullName: 'Nguyễn Văn A',
    email: 'vana@example.com',
    phone: '0901234567',
    bloodType: 'O+',
    birthDate: '1990-05-15',
    donationCount: 5,
    receptionCount: 2,
    avatarUrl: '',
    gender: 'male',
    donationHistory: [
      { stt: 1, volume: 350, type: 'Toàn phần', date: '2024-11-15' },
      { stt: 2, volume: 350, type: 'Toàn phần', date: '2024-07-10' },
      { stt: 3, volume: 350, type: 'Toàn phần', date: '2024-03-02' },
    ]
  });

  const [form, setForm] = useState(user);

  const columns = [
    {
      title: 'Họ và Tên',
      dataIndex: 'fullNameRegister',
      key: 'id',
      width: 250,
      align: 'center',
    },
    {
      title: 'Nhóm Máu',
      dataIndex: 'bloodGroup',
      key: 'id',
      width: 200,
      align: 'center',
    },
    {
      title: 'Thời Gian',
      key: 'id',
      width: 200,
      align: 'center',
      render: (record) => {
        if (record.availableFromDate === record.availableToDate) {
          return dayjs(record.availableFromDate).format('DD/MM/YYYY')
        } else {
          return `${dayjs(record.availableFromDate).format('DD')} - ${dayjs(record.availableToDate).format('DD/MM/YYYY')}`;
        }
      }
    },
    {
      title: 'Địa Chỉ',
      dataIndex: 'location',
      key: 'id',
      width: 200,
      align: 'center',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'id',
      width: 250,
      align: 'center',
      render: (status) => {
        let color;
        switch (status) {
          case 'Done': color = 'text-green-500'; break;
          default: color = 'text-orange-500';
        }
        return (
          <span className={`font-bold ${color} border-2 rounded-md p-1`} >
            {status.toUpperCase()}  
          </span>
        );
      },
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   width: 200,
    //   align: 'center',
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Tooltip title={record.status === 'Active' ? 'Set Inactive' : 'Set Active'}>
    //         <Switch
    //           checked={record.status === 'Active'}
    //           onChange={() => handleToggleStatus(record)}
    //         />
    //       </Tooltip>
    //       <Tooltip title="Edit">
    //         <Button
    //           type='dashed'
    //           variant='dashed'
    //           color='cyan'
    //           style={{ border: "none", color: "#073AAA" }}
    //           onClick={() => showRoleModal(record)}
    //         >
    //           <EditOutlined />
    //         </Button>
    //       </Tooltip>
    //     </Space>
    //   ),
    // },
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

  useEffect(() => {
    const fetchRegistration = async () => {
      const listRegisterWithUserId = await GetAllDonorRegistrationWithUserId(1);
      setRegistrationList(listRegisterWithUserId);
      console.log("listRegisterWithUserId:", listRegisterWithUserId);
      const res = await GetDonorRegistrationByUserId(1);
      setRegistration(res);
      console.log("registration:", res);
      const appointmentRes = await GetAppointmentsByRegistrationId(res.registrationId);
      setAppointment(appointmentRes);
      console.log("appointmentRes:", appointmentRes);
      const event = await GetEventByFacilityId(appointmentRes.facilityId);
      setEvent(event);
      console.log("event:", event);
    };
    fetchRegistration();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = () => {
    setUser(form);
    alert('Cập nhật thông tin thành công!');
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, avatarUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShowAppointmentList = async (registrationId) => {
    setShowAppointList(true);
    if (showAppointForRegister === registrationId) {
      setShowAppointList(false);
      setShowAppointForRegister(null);
      return;
    }

    const appointments = await GetAllAppointmentWithRegistrationId(registrationId)
    console.log("Appointments received:", appointments);
    setAppointmentList(appointments);
    setShowAppointForRegister(registrationId);
  }

  return (
    <div className="max-w-[1200px] mx-auto p-8">
      <div className="rounded-lg shadow-md bg-white p-6">
        <h2 className="text-4xl font-bold text-indigo-900 mb-6">About You</h2>

        <div className="flex border-b-2 border-indigo-100 mb-10">
          <div
            className={`py-2 font-semibold text-indigo-600 cursor-pointer border-b-3 mr-8 text-[16px] tracking-wider transition-all ${activeTab === 'profile' ? 'text-indigo-900 border-b-3 border-indigo-900' : 'border-transparent'}`}
            onClick={() => setActiveTab('profile')}
          >
            PROFILE
          </div>
          <div
            className={`py-2 font-semibold text-indigo-600 cursor-pointer border-b-3 mr-8 text-[16px] tracking-wider transition-all ${activeTab === 'history' ? 'text-indigo-900 border-b-3 border-indigo-900' : 'border-transparent'}`}
            onClick={() => setActiveTab('history')}
          >
            HISTORY
          </div>
          <div
            className={`py-2 font-semibold text-indigo-600 cursor-pointer border-b-3 mr-8 text-[16px] tracking-wider transition-all ${activeTab === 'registration' ? 'text-indigo-900 border-b-3 border-indigo-900' : 'border-transparent'}`}
            onClick={() => setActiveTab('registration')}
          >
            REGISTRATION
          </div>
        </div>

        {activeTab === 'profile' && (
          <div className="flex items-start mb-8">
            <div className="flex flex-col items-center flex-[0_0_200px] ml-12">
              <img
                src={form.avatarUrl || 'https://i.imgur.com/1Q9Z1Zm.png'}
                alt="Avatar"
                className="w-[250px] h-[250px] rounded-full object-cover border-4 border-indigo-100 mb-6 shadow-md transition-all hover:scale-105 hover:border-indigo-900"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                className="bg-indigo-900 text-white border-none rounded-lg py-3 px-6 font-semibold cursor-pointer mt-4 w-full max-w-[130px] transition-all hover:bg-indigo-800 hover:-translate-y-0.5 shadow-md hover:shadow-lg active:translate-y-0"
                onClick={handleAvatarClick}
              >
                CHANGE
              </button>
            </div>

            <div className="flex-1 w-full max-w-xl mx-auto">
              <div className="flex flex-row justify-around gap-5 max-w-xl mx-auto">
                <div>
                  <div className="flex flex-col gap-1 w-full mb-3">
                    <label className="text-base font-semibold uppercase tracking-wider min-w-[180px] text-left">NAME</label>
                    <input
                      name="fullName"
                      value={form.fullName}
                      readOnly
                      className="py-3 px-4 border-2 border-indigo-100 rounded-lg text-lg transition-all flex-1 max-w-[700px] hover:border-indigo-200 focus:border-indigo-900 focus:outline-none focus:shadow-[0_0_0_3px_rgba(26,35,126,0.1)] cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full mb-3">
                    <label className="text-base font-semibold uppercase tracking-wider min-w-[180px] text-left">PHONE</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="py-3 px-4 border-2 border-indigo-100 rounded-lg text-lg transition-all flex-1 max-w-[700px] hover:border-indigo-200 focus:border-indigo-900 focus:outline-none focus:shadow-[0_0_0_3px_rgba(26,35,126,0.1)]"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full mb-3">
                    <label className="text-base font-semibold uppercase tracking-wider min-w-[180px] text-left">BLOOD TYPE</label>
                    <select
                      name="bloodType"
                      value={form.bloodType}
                      onChange={handleChange}
                      className="py-3.5 px-4 border-2 border-indigo-100 rounded-lg text-lg bg-white transition-all flex-1 max-w-[700px] hover:border-indigo-200 focus:border-indigo-900 focus:outline-none focus:shadow-[0_0_0_3px_rgba(26,35,126,0.1)]"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex flex-col gap-1 w-full mb-3">
                    <label className="text-base font-semibold uppercase tracking-wider min-w-[180px] text-left">EMAIL</label>
                    <input
                      name="email"
                      value={form.email}
                      readOnly
                      className="py-3 px-4 border-2 border-indigo-100 rounded-lg text-lg transition-all flex-1 max-w-[700px] hover:border-indigo-200 focus:border-indigo-900 focus:outline-none focus:shadow-[0_0_0_3px_rgba(26,35,126,0.1)] cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full mb-3">
                    <label className="text-base font-semibold uppercase tracking-wider min-w-[180px] text-left">GENDER</label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="py-3.5 px-4 border-2 border-indigo-100 rounded-lg text-lg bg-white transition-all flex-1 max-w-[700px] hover:border-indigo-200 focus:border-indigo-900 focus:outline-none focus:shadow-[0_0_0_3px_rgba(26,35,126,0.1)]"
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 w-full mb-3">
                    <label className="text-base font-semibold uppercase tracking-wider min-w-[180px] text-left">BIRTH DATE</label>
                    <input
                      name="birthDate"
                      value={form.birthDate}
                      type="date"
                      onChange={handleChange}
                      className="py-3 px-4 border-2 border-indigo-100 rounded-lg text-lg transition-all flex-1 max-w-[700px] hover:border-indigo-200 focus:border-indigo-900 focus:outline-none focus:shadow-[0_0_0_3px_rgba(26,35,126,0.1)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h3 className="text-2xl font-semibold mb-6">Lịch sử hiến máu</h3>
            <Table
              className="rounded-2xl shadow-lg bg-white custom-table-user"
              dataSource={user.donationHistory}
              columns={historyColumns}
              rowKey={(record, idx) => idx}
              pagination={{
                pageSize: 5,
                position: ['bottomCenter'],
              }}
            />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="flex justify-center mt-10 gap-4">
            <button
              className="!bg-indigo-900 !text-white border-none font-semibold text-lg py-3 px-12 rounded-lg shadow-md transition-all hover:!bg-indigo-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              onClick={handleSave}
            >
              SAVE
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
      </div>
    </div>
  )
}

export default ProfilePage