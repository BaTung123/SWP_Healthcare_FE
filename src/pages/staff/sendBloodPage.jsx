//	Quản lý số lượng đơn vị máu còn lại tại cơ sở y tế.
import { useState, useCallback, useEffect } from 'react';
import '../../styles/bloodStockManagementPage.css';
import { Table, Input, Button, Tooltip, Modal, Select } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { FileTextOutlined } from '@ant-design/icons';
import { CreateBloodRequestStatus, GetAllBloodRequestApplication, UpdateBloodRequestStatus } from '../../services/bloodRequestApplication';
import dayjs from 'dayjs';
import { CreateBloodExportApplication } from '../../services/bloodExport';
import { toast } from 'react-toastify';

const bloodTypes = [
  'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'
];

const statusList = [
  'Đang Chờ', 'Chấp Nhận', 'Đã Nhận', 'Từ Chối'
];

const bloodTransferTypes = [
  'Toàn Phần', 'Hồng Cầu', 'Huyết Tương', 'Tiểu Cầu'
];

const statusOptions = [
  { value: 'Đang Chờ', label: 'Đang Chờ' },
  { value: 'Đã Nhận', label: 'Đã Nhận' },
  { value: 'Đã Duyệt', label: 'Đã Duyệt' },
  { value: 'Từ Chối', label: 'Từ Chối' },
];

// Sửa lại cho đúng các trạng thái hợp lệ
const statusOptionsWithPending = [
  { value: 'Đã Nhận', label: 'Đã Nhận' },
];

// Định nghĩa form mặc định
const initialRequestForm = {
  fullName: '',
  dob: '',
  gender: '',
  requestReason: '',
  bloodType: '',
  bloodTransferType: '',
  quantity: '',
  note: '',
  isUrged: '',
  phoneNumber: '',
  bloodRequestDate: ''
};

const SendBloodPage = () => {
  const [requests, setRequests] = useState([])
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBloodType, setFilterBloodType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [rejectReason, setRejectReason] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState(initialRequestForm);
  const [neededTimeType, setNeededTimeType] = useState('gap'); // 'gap' hoặc 'date'
  const [detailModal, setDetailModal] = useState({ open: false, reason: '' });
 
  const fetchRequestList = async () => {
    const requestListRes = await GetAllBloodRequestApplication();
    console.log("requestListRes", requestListRes.data.bloodRequestApplications)
    const requestList = requestListRes.data.bloodRequestApplications;

    const requestObjList = requestList.map(request => {
      return {
        ...request,
        bloodTransferType: bloodTransferTypes[request.bloodTransferType],
        bloodType: bloodTypes[request.bloodType],
        status: statusList[request.status]
      }
    })

    setRequests(requestObjList)
  }
  useEffect(() => {
    fetchRequestList();
  }, []);

  // Filtered data for display only
  const filteredData = requests.filter(r => {
    const matchName = search ? r.fullName.toLowerCase().includes(search.toLowerCase()) : true;
    const matchStatus = filterStatus ? r.status === filterStatus : true;
    const matchBloodType = filterBloodType ? r.bloodType === filterBloodType : true;
    return matchName && matchStatus && matchBloodType;
  });

  // Các handler sử dụng useCallback để tránh tạo lại không cần thiết
  const handleSearch = useCallback((value) => setSearch(value), []);
  const handleStatusFilter = useCallback((status) => setFilterStatus(status), []);
  const handleBloodTypeFilter = useCallback((type) => setFilterBloodType(type), []);

  const handleEdit = (record) => {
    setEditingRecord(record);
    setNewStatus(record.status);
    setRejectReason(record.note);
    setIsModalOpen(true);
  };

  console.log("editingRecord", editingRecord)
  console.log("newStatus", newStatus)
  const handleModalOk = async () => {
    if (editingRecord) {
      // Chỉ cho phép chuyển sang 'Đã Nhận' hoặc 'Từ Chối'
      let statusIdx = statusList.indexOf(newStatus);
      if (statusIdx === -1) {
        toast.error('Trạng thái không hợp lệ!');
        return;
      }
      const updateRequestObj = {
        id: editingRecord.id,
        status: statusIdx,
        note: rejectReason || ""
      };
      try {
        const updateRequestRes = await UpdateBloodRequestStatus(updateRequestObj);
        console.log("updateRequestRes", updateRequestRes)
        toast.success('Cập nhật trạng thái thành công!');
      } catch (err) {
        toast.error('Cập nhật trạng thái thất bại!');
      }
    }
    setIsModalOpen(false);
    setEditingRecord(null);
    setRejectReason('');
    fetchRequestList();
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  // Validate số lượng máu
  const validateQuantity = useCallback((quantity) => {
    const q = Number(quantity);
    return q && q >= 50 && q <= 500 && q % 50 === 0;
  }, []);

  const handleRequestFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({ ...prev, [name]: value }));
  }, []);

  // Thay đổi radio chọn loại thời gian
  const handleNeededTimeTypeChange = (e) => {
    const value = e.target.value;
    setNeededTimeType(value);
  };

  const handleRequestFormSubmit = async (e) => {
    e.preventDefault();
    // Validate họ tên
    if (!requestForm.fullName.trim()) {
      alert('Vui lòng nhập họ và tên.');
      return;
    }
    // Validate nhóm máu
    if (!requestForm.bloodType) {
      alert('Vui lòng chọn nhóm máu.');
      return;
    }
    // Validate loại
    if (!requestForm.bloodTransferType) {
      alert('Vui lòng chọn loại máu.');
      return;
    }
    // Validate ngày sinh >= 18 tuổi
    if (requestForm.dob) {
      const birth = new Date(requestForm.dob);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear() - (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate()) ? 1 : 0);
      if (age < 18) {
        alert('Người nhận máu phải đủ 18 tuổi trở lên.');
        return;
      }
    }
    // Validate số điện thoại
    if (!/^\d{10}$/.test(requestForm.phoneNumber)) {
      alert('Số điện thoại phải đủ 10 số và chỉ chứa số.');
      return;
    }
    // Validate số lượng
    if (!validateQuantity(requestForm.quantity)) {
      alert('Số lượng phải từ 50 đến 500 và là bội số của 50 (ml).');
      return;
    }
    // Validate ngày nếu chọn loại ngày
    if (neededTimeType === 'date' && !requestForm.bloodRequestDate) {
      alert('Vui lòng chọn ngày cần máu.');
      return;
    }

    const bloodRequestData = {
      ...requestForm,
      bloodType: bloodTypes.indexOf(requestForm.bloodType),
      bloodTransferType: bloodTransferTypes.indexOf(requestForm.bloodTransferType),
      isUrged: neededTimeType === 'gap',
      bloodRequestDate: neededTimeType === 'gap' ? null : requestForm.bloodRequestDate
    };

    console.log("bloodRequestData:", bloodRequestData);
    const createBloodRequestRes = await CreateBloodRequestStatus(bloodRequestData);
    console.log("createBloodRequestRes:", createBloodRequestRes);

    const createBloodExpObj = {
      bloodRequestApplicationId: createBloodRequestRes.data.id,
      note: createBloodRequestRes.data.note
    }
    console.log("createBloodExpObj:", createBloodExpObj)
    const createBloodExpRes = await CreateBloodExportApplication(createBloodExpObj);
    console.log("createBloodExpRes:", createBloodExpRes)

    setIsRequestModalOpen(false);
    setRequestForm(initialRequestForm);
    setNeededTimeType('gap');
    toast.success("Tạo yêu cầu cần máu thành công.")
    fetchRequestList();
  };

  const renderActions = (_, record) => {
    if (record.status === "Đã Nhận")
      return;

    return (
      <span className="flex items-center justify-center gap-2">
        {record.status === "Chấp Nhận" && (
          <Tooltip title="Sửa">
            <Button type="dashed" variant="dashed" color="cyan" onClick={() => handleEdit(record)}>
              <EditOutlined />
            </Button>
          </Tooltip>
        )}
        {record.status === 'Từ Chối' && (
          <Tooltip title="Xem lý do từ chối">
            <Button type="dashed" variant="dashed" color="orange" onClick={() => setDetailModal({ open: true, reason: record.note })}>
              <FileTextOutlined style={{ fontSize: 20, color: '#fa8c16' }} />
            </Button>
          </Tooltip>
        )}
      </span>
    )
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      align: 'center',
      width: 60,
      render: (_, __, idx) => idx + 1,
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      align: 'center',
      width: 140,
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      align: 'center',
      width: 90,
      render: (bloodType) => <span className="font-bold">{bloodType}</span>
    },
    {
      title: 'Loại',
      dataIndex: 'bloodTransferType',
      key: 'bloodTransferType',
      align: 'center',
      width: 110,
    },
    {
      title: 'Số lượng (ml)',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 110,
    },
    {
      title: 'Thời gian',
      dataIndex: 'bloodRequestDate',
      key: 'id',
      align: 'center',
      width: 150,
      render: (date => dayjs(date).format("DD-MM-YYYY")),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'id',
      align: 'center',
      width: 130,
    },
    {
      title: 'Lý do cần máu',
      dataIndex: 'requestReason',
      key: 'id',
      align: 'center',
      width: 160,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        let color;
        let text = status;
        switch (status) {
          case 'Đang Chờ': color = 'text-orange-500'; break;
          case 'Chấp Nhận': color = 'text-blue-500'; break;
          case 'Từ Chối': color = 'text-red-500'; break;
          default: color = 'text-green-500';
        }
        return (
          <span className={`font-bold ${color} border-2 rounded-md p-1`}>
            {text}
          </span>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      render: renderActions,
    },
  ];

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-6 text-center text-red-600">Thông tin yêu cầu nhận máu</h1>
      <div className="flex flex-shrink-0 mb-4 items-center w-full">
        <div className="flex flex-1 gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-[250px] pl-4 pr-10 py-2 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
              value={search}
              onChange={e => { handleSearch(e.target.value); }}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(e.target.value); }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SearchOutlined />
            </div>
          </div>
          <select
            className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            value={filterStatus}
            onChange={e => handleStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            value={filterBloodType}
            onChange={e => handleBloodTypeFilter(e.target.value)}
          >
            <option value="">Tất cả nhóm máu</option>
            {bloodTypes.filter(type => type).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md ml-4"
          onClick={() => setIsRequestModalOpen(true)}
        >
          Gửi yêu cầu máu
        </Button>
      </div>
      <Table
        className="rounded-2xl shadow-lg bg-white custom-ant-table"
        dataSource={filteredData}
        columns={columns}
        rowKey={(record) => record.id}
        pagination={{
          pageSize: 5,
          position: ['bottomCenter'],
        }}
        locale={{ emptyText: 'Không có dữ liệu' }}
      />
      <Modal
        title="Chỉnh sửa trạng thái"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <div className="mb-2">Chọn trạng thái mới:</div>
        <Select
          className="w-full"
          value={newStatus}
          onChange={setNewStatus}
          options={statusOptionsWithPending}
        />
        {newStatus === 'Từ Chối' && (
          <div className="mt-4">
            <label className="block font-semibold mb-1">Lý do từ chối:</label>
            <Input.TextArea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
              rows={3}
            />
          </div>
        )}
      </Modal>
      <Modal
        title={<h1 className="!text-[30px] text-[#b30000] text-center mb-6">Đăng ký Nhận Máu</h1>}
        open={isRequestModalOpen}
        onCancel={() => setIsRequestModalOpen(false)}
        footer={null}
        width={700}
      >
        <div className="max-w-2xl mx-auto p-6">
          <form className="flex flex-col gap-4" onSubmit={handleRequestFormSubmit}>
            <div>
              <label className="font-semibold mb-1 block">Họ và tên <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="fullName"
                required
                value={requestForm.fullName}
                onChange={handleRequestFormChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-base"
                placeholder="Nhập họ và tên"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="font-semibold mb-1 block">Ngày sinh</label>
                <input
                  type="date"
                  name="dob"
                  value={requestForm.dob}
                  onChange={handleRequestFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label className="font-semibold mb-1 block">Giới tính</label>
                <select
                  name="gender"
                  value={requestForm.gender}
                  onChange={handleRequestFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="font-semibold mb-1 block">Nhóm máu <span className="text-red-500">*</span></label>
                <select
                  name="bloodType"
                  value={requestForm.bloodType}
                  onChange={handleRequestFormChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="" disabled hidden>-- Chọn nhóm máu --</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="font-semibold mb-1 block">Số lượng (ml)</label>
                <input
                  type="number"
                  name="quantity"
                  min={50}
                  max={500}
                  step={50}
                  value={requestForm.quantity}
                  onChange={handleRequestFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-center"
                  placeholder="Ví dụ: 500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="font-semibold mb-1 block">Lý do cần máu</label>
                <input
                  type="text"
                  name="requestReason"
                  value={requestForm.requestReason}
                  onChange={handleRequestFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="VD: Phẫu thuật, thiếu máu..."
                />
              </div>
              <div className="flex-1">
                <label className="font-semibold mb-1 block">Loại <span className="text-red-500">*</span></label>
                <select
                  name="bloodTransferType"
                  required
                  value={requestForm.bloodTransferType}
                  onChange={handleRequestFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">-- Chọn loại --</option>
                  <option value="Toàn Phần">Toàn Phần</option>
                  <option value="Tiểu Cầu">Tiểu Cầu</option>
                  <option value="Huyết Tương">Huyết Tương</option>
                  <option value="Hồng Cầu">Hồng Cầu</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-semibold mb-1 block">Thời gian cần máu:</label>
              <div className="flex gap-8 mb-2">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="neededTimeType"
                    value="gap"
                    checked={neededTimeType === 'gap'}
                    onChange={handleNeededTimeTypeChange}
                  />
                  Gấp
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="neededTimeType"
                    value="date"
                    checked={neededTimeType === 'date'}
                    onChange={handleNeededTimeTypeChange}
                  />
                  Chọn ngày
                </label>
              </div>
              {neededTimeType === 'date' && (
                <input
                  type="date"
                  name="bloodRequestDate"
                  value={requestForm.bloodRequestDate}
                  onChange={handleRequestFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              )}
            </div>
            <div>
              <label className="font-semibold mb-1 block">Số điện thoại <span className="text-red-500">*</span></label>
              <input
                type="tel"
                name="phoneNumber"
                value={requestForm.phoneNumber}
                onChange={handleRequestFormChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="VD: 0901234567"
              />
            </div>
            <button
              type="submit"
              className="p-3 text-white bg-[#b30000] rounded-md font-bold hover:bg-[#990000] transition-colors duration-300 ease-in-out"
            >
              Gửi yêu cầu
            </button>
          </form>
        </div>
      </Modal>
      <Modal
        title="Lý do từ chối"
        open={detailModal.open}
        footer={null}
        onCancel={() => setDetailModal({ open: false, reason: '' })}
      >
        <div>{detailModal.reason || 'Không có lý do.'}</div>
      </Modal>
    </div>
  );
};

export default SendBloodPage;