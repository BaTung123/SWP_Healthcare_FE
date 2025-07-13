import React, { useState } from 'react';
import { Table, Input, Button, Tooltip, Modal, Select } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { FileTextOutlined } from '@ant-design/icons';

const initialReceiverList = [
  {
    fullName: "Nguyễn Văn A",
    bloodType: "A+",
    quantity: 500,
    type: "Toàn phần",
    needDate: "2024-07-01",
    phone: "0901234567",
    status: 'Đang chờ',
  },
  {
    fullName: "Trần Thị B",
    bloodType: "O-",
    quantity: 350,
    type: "Tiểu cầu",
    needDate: "2024-07-01",
    phone: "0912345678",
    status: 'Đã duyệt',
  },
  {
    fullName: "Lê Văn C",
    bloodType: "B+",
    quantity: 450,
    type: "Huyết tương",
    needDate: "2024-08-10",
    phone: "0987654321",
    status: 'Đang chờ',
  },
  {
    fullName: "Phạm Thị D",
    bloodType: "AB-",
    quantity: 500,
    type: "Toàn phần",
    needDate: "2024-07-01",
    phone: "0934567890",
    status: 'Từ chối',
  },
  {
    fullName: "Hoàng Văn E",
    bloodType: "O+",
    quantity: 350,
    type: "Tiểu cầu",
    needDate: "2024-09-01",
    phone: "0978123456",
    status: 'Đang chờ',
  },
];

const bloodTypes = [
  '', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'
];

const statusOptions = [
  { value: 'Đang chờ', label: 'Đang chờ' },
  { value: 'Đã duyệt', label: 'Đã duyệt' },
  { value: 'Từ chối', label: 'Từ chối' },
];

const AcceptBloodDropPage = () => {
  const [data, setData] = useState(initialReceiverList);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBloodType, setFilterBloodType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [newStatus, setNewStatus] = useState('Đang chờ');
  const [rejectReason, setRejectReason] = useState('');
  const [detailModal, setDetailModal] = useState({ open: false, reason: '' });

  // Filtered data for display only
  const filteredData = data.filter(r => {
    const matchName = search ? r.fullName.toLowerCase().includes(search.toLowerCase()) : true;
    const matchStatus = filterStatus ? r.status === filterStatus : true;
    const matchBloodType = filterBloodType ? r.bloodType === filterBloodType : true;
    return matchName && matchStatus && matchBloodType;
  });

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };

  const handleBloodTypeFilter = (bloodType) => {
    setFilterBloodType(bloodType);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setNewStatus(record.status);
    setRejectReason(record.rejectReason || '');
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    if (editingRecord) {
      setData(prev => prev.map(item =>
        item === editingRecord
          ? { ...item, status: newStatus, rejectReason: newStatus === 'Từ chối' ? rejectReason : undefined }
          : item
      ));
      // Save to localStorage if rejected
      const uniqueKey = `blood_request_${editingRecord.phone}_${editingRecord.time}`;
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
    setData(prev => prev.filter(item => item !== record));
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
      title: 'Số lượng (ml)',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 120,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: 110,
    },
    {
      title: 'Ngày cần',
      dataIndex: 'needDate',
      key: 'needDate',
      align: 'center',
      width: 110,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
      width: 130,
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
          case 'Từ chối': color = 'text-red-500'; break;
          default: color = 'text-gray-500';
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
      width: 180,
      render: (_, record) => (
        <span className="flex items-center justify-center gap-2">
          <Tooltip title="Sửa">
            <Button type="dashed" variant="dashed" color="cyan" onClick={() => handleEdit(record)}>
              <EditOutlined />
            </Button>
          </Tooltip>
        </span>
      ),
    },
  ];

  function getRejectReasonFromLocal(record) {
    const uniqueKey = `blood_request_${record.phone}_${record.time}`;
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

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-10 text-center text-red-600">Xuất Máu</h1>
      <div className="flex flex-shrink-0 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="w-[250px] pl-4 pr-10 py-2 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(e.target.value); }}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <SearchOutlined />
          </div>
        </div>
        <div className="ml-2">
          <select
            className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            value={filterStatus}
            onChange={e => handleStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Đang chờ">Đang chờ</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Từ chối">Từ chối</option>
          </select>
        </div>
        <div className="ml-2">
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
      </div>
      <Table
        className="rounded-2xl shadow-lg bg-white custom-ant-table"
        dataSource={filteredData}
        columns={columns}
        rowKey={(record, idx) => record.phone + record.time}
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
          onChange={value => setNewStatus(value)}
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

export default AcceptBloodDropPage;
