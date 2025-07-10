//	Quản lý số lượng đơn vị máu còn lại tại cơ sở y tế.
import { useState, useMemo, useCallback, useEffect } from 'react';
import '../../styles/bloodStockManagementPage.css';
import { Table, Input, Button, Tooltip, Modal, Select } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { FileTextOutlined } from '@ant-design/icons';

const bloodTypes = [
  '', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'
];

const initialRequests = [
  {
    fullName: 'Nguyễn Văn A',
    birthday: '1990-01-01',
    gender: 'Nam',
    bloodType: 'A+',
    quantity: 500,
    reason: 'Phẫu thuật tim',
    type: 'Toàn phần',
    neededTime: '2024-06-10',
    phone: '0901234567',
    status: 'Đang chờ',
  },
  {
    fullName: 'Trần Thị B',
    birthday: '1985-05-12',
    gender: 'Nữ',
    bloodType: 'O-',
    quantity: 350,
    reason: 'Tai nạn giao thông',
    type: 'Tiểu cầu',
    neededTime: '2024-06-11',
    phone: '0912345678',
    status: 'Từ chối',
  },
];

const statusOptions = [
  { value: 'Đang chờ', label: 'Đang chờ' },
  { value: 'Đã nhận', label: 'Đã nhận' },
  { value: 'Đã duyệt', label: 'Đã duyệt' },
  { value: 'Từ chối', label: 'Từ chối' },
];

const SendBloodPage = () => {
  const [requests, setRequests] = useState(initialRequests.map(r => ({
    ...r,
    status:
      r.status === 'Đang chờ' ? 'Đang chờ' :
      r.status === 'Đã nhận' ? 'Đã nhận' :
      r.status === 'Đã duyệt' ? 'Đã duyệt' :
      r.status === 'Từ chối' ? 'Từ chối' :
      'Đang chờ'
  })));
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBloodType, setFilterBloodType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [newStatus, setNewStatus] = useState('Đang chờ');
  const [rejectReason, setRejectReason] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    fullName: '',
    birthday: '',
    gender: '',
    bloodType: '',
    quantity: '',
    reason: '',
    type: '',
    neededTime: '',
    phone: '',
  });
  const [neededTimeType, setNeededTimeType] = useState('gap'); // 'gap' hoặc 'date'
  const [detailModal, setDetailModal] = useState({ open: false, reason: '' });

  useEffect(() => {
    setRequests(prevRequests => prevRequests.map(req => {
      const uniqueKey = `blood_request_${req.phone}_${req.neededTime}`;
      const local = localStorage.getItem(uniqueKey);
      if (local) {
        const { status, rejectReason } = JSON.parse(local);
        return { ...req, status, rejectReason };
      }
      return req;
    }));
  }, []);

  // Tính toán danh sách đã lọc
  const filtered = useMemo(() => {
    return requests.filter(r =>
      (!search || r.fullName.toLowerCase().includes(search.toLowerCase())) &&
      (!filterStatus || r.status === filterStatus) &&
      (!filterBloodType || r.bloodType === filterBloodType)
    );
  }, [requests, search, filterStatus, filterBloodType]);

  // Các handler sử dụng useCallback để tránh tạo lại không cần thiết
  const handleSearch = useCallback((value) => setSearch(value), []);
  const handleStatusFilter = useCallback((status) => setFilterStatus(status), []);
  const handleBloodTypeFilter = useCallback((type) => setFilterBloodType(type), []);

  const handleEdit = (record) => {
    setEditingRecord(record);
    setNewStatus(record.status);
    setRejectReason(record.rejectReason || getRejectReasonFromLocal(record));
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    if (editingRecord) {
      setRequests(prev => prev.map(item =>
        item === editingRecord ? { ...item, status: newStatus, rejectReason: newStatus === 'Từ chối' ? rejectReason : undefined } : item
      ));
      // Save to localStorage if rejected
      const uniqueKey = `blood_request_${editingRecord.phone}_${editingRecord.neededTime}`;
      if (newStatus === 'Từ chối') {
        localStorage.setItem(uniqueKey, JSON.stringify({ status: 'Từ chối', rejectReason }));
      } else {
        localStorage.removeItem(uniqueKey);
      }
    }
    setIsModalOpen(false);
    setEditingRecord(null);
    setRejectReason('');
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleDelete = (record) => {
    setRequests(prev => prev.filter(item => item !== record));
  };

  const handleRequestFormChange = (e) => {
    const { name, value } = e.target;
    setRequestForm((prev) => ({ ...prev, [name]: value }));
  };

  // Thay đổi radio chọn loại thời gian
  const handleNeededTimeTypeChange = (e) => {
    const value = e.target.value;
    setNeededTimeType(value);
    setRequestForm((prev) => ({
      ...prev,
      neededTime: value === 'gap' ? 'Gấp' : '',
    }));
  };

  const handleRequestFormSubmit = (e) => {
    e.preventDefault();
    setRequests(prev => [
      ...prev,
      {
        ...requestForm,
        status: 'Đang chờ',
      },
    ]);
    setIsRequestModalOpen(false);
    setRequestForm({
      fullName: '',
      birthday: '',
      gender: '',
      bloodType: '',
      quantity: '',
      reason: '',
      type: '',
      neededTime: '',
      phone: '',
    });
    setNeededTimeType('gap');
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
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: 110,
    },
    {
      title: 'Số lượng (ml)',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 110,
      render: (quantity) => <span>{quantity}</span>
    },
    {
      title: 'Thời gian',
      dataIndex: 'neededTime',
      key: 'neededTime',
      align: 'center',
      width: 150,
      render: (neededTime) => {
        if (!neededTime) return '';
        if (neededTime === 'Gấp') return <span className="text-red-600 font-bold">Gấp</span>;
        const date = neededTime.split('T')[0] || neededTime.split(' ')[0] || neededTime;
        return <span>{date}</span>;
      }
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
      width: 130,
    },
    {
      title: 'Lý do cần máu',
      dataIndex: 'reason',
      key: 'reason',
      align: 'center',
      width: 160,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 110,
      render: (status) => {
        let color;
        let text = status;
        switch (status) {
          case 'Đang chờ': color = 'text-orange-500'; break;
          case 'Đã duyệt': color = 'text-blue-500'; break;
          case 'Đã nhận': color = 'text-green-600'; break;
          case 'Từ chối': color = 'text-red-500'; break;
          default: color = 'text-gray-500';
        }
        return (
          <span
            className={`font-bold ${color} border-2 rounded-md p-1`}
            style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      width: 150,
      render: (_, record) => (
        <span className="flex items-center justify-center gap-2">
          <Tooltip title="Sửa">
            <Button type="dashed" variant="dashed" color="cyan" onClick={() => handleEdit(record)}>
              <EditOutlined />
            </Button>
          </Tooltip>
          {record.status === 'Từ chối' && (
            <Tooltip title="Xem lý do từ chối">
              <Button type="dashed" variant="dashed" color="orange" onClick={() => setDetailModal({ open: true, reason: record.rejectReason || getRejectReasonFromLocal(record) })}>
                <FileTextOutlined style={{ fontSize: 20, color: '#fa8c16' }} />
              </Button>
            </Tooltip>
          )}
        </span>
      ),
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
        dataSource={filtered}
        columns={columns}
        rowKey={record => record.phone + record.neededTime}
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
          options={statusOptions}
        />
        {newStatus === 'Từ chối' && (
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
        bodyStyle={{ padding: 0 }}
        width={700}
      >
        <div className="max-w-2xl mx-auto p-6">
          <form className="flex flex-col space-y-4" onSubmit={handleRequestFormSubmit}>
            {/* họ và tên */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={requestForm.fullName}
                onChange={handleRequestFormChange}
                className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2 text-base"
                placeholder="Nhập họ và tên"
              />
            </div>
            {/* ngày sinh và giới tính */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-1">Ngày sinh</label>
                <input
                  type="date"
                  name="birthday"
                  value={requestForm.birthday}
                  onChange={handleRequestFormChange}
                  className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-1">Giới tính</label>
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
            {/* Nhóm máu và số lượng */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-1">
                  Nhóm máu <span className="text-red-500">*</span>
                </label>
                <select
                  name="bloodType"
                  value={requestForm.bloodType}
                  onChange={handleRequestFormChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">-- Chọn nhóm máu --</option>
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
              <div className="flex-1">
                <label className="block font-semibold mb-1">Số đơn vị cần</label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={requestForm.quantity}
                  onChange={handleRequestFormChange}
                  className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Ví dụ: 2"
                />
              </div>
            </div>
            {/* Lý do và loại */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-1">Lý do cần máu</label>
                <input
                  type="text"
                  name="reason"
                  value={requestForm.reason}
                  onChange={handleRequestFormChange}
                  className="w-full h-[36.8px] border border-gray-300 rounded-md px-3 py-2"
                  placeholder="VD: Phẫu thuật, thiếu máu..."
                />
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-1">
                  Loại <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  required
                  value={requestForm.type}
                  onChange={handleRequestFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">-- Chọn loại --</option>
                  <option value="Toàn phần">Toàn phần</option>
                  <option value="Tiểu cầu">Tiểu cầu</option>
                  <option value="Huyết tương">Huyết tương</option>
                </select>
              </div>
            </div>
            {/* Thời gian cần máu */}
            <div>
              <label className="block font-semibold mb-1">Thời gian cần máu:</label>
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
                  name="neededTime"
                  value={requestForm.neededTime}
                  onChange={handleRequestFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              )}
            </div>
            {/* Số điện thoại */}
            <div>
              <label className="block font-semibold mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={requestForm.phone}
                onChange={handleRequestFormChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="VD: 0901234567"
              />
            </div>
            {/* Nút gửi */}
            <button
              type="submit"
              className="p-3 !text-white !bg-[#b30000] rounded-md font-bold hover:!bg-[#990000] transition-colors duration-300 ease-in-out"
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

function getRejectReasonFromLocal(record) {
  const uniqueKey = `blood_request_${record.phone}_${record.neededTime}`;
  const local = localStorage.getItem(uniqueKey);
  if (local) {
    try {
      const { rejectReason } = JSON.parse(local);
      return rejectReason || '';
    } catch {
      return '';
    }
  }
  return '';
}