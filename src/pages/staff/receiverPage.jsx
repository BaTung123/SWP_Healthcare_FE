import React, { useState } from 'react';
import { Table, Input, Button, Tooltip, Modal, Select } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const receiverList = [
  {
    name: "Nguyễn Văn A",
    bloodType: "A+",
    quantity: 2,
    type: "Toàn phần",
    hospital: "Bệnh viện Chợ Rẫy",
    time: "2024-07-01 ~ 2024-07-05",
    phone: "0901234567",
    status: 'pending',
  },
  {
    name: "Trần Thị B",
    bloodType: "O-",
    quantity: 1,
    type: "Tiểu cầu",
    hospital: "Bệnh viện Bình Dân",
    time: "2024-07-01 ~ 2024-07-05",
    phone: "0912345678",
    status: 'resolved',
  },
  {
    name: "Lê Văn C",
    bloodType: "B+",
    quantity: 3,
    type: "Huyết tương",
    hospital: "Bệnh viện Nhân dân 115",
    time: "2024-08-10 ~ 2024-08-15",
    phone: "0987654321",
    status: 'pending',
  },
  {
    name: "Phạm Thị D",
    bloodType: "AB-",
    quantity: 2,
    type: "Toàn phần",
    hospital: "Bệnh viện Hùng Vương",
    time: "2024-07-01 ~ 2024-07-05",
    phone: "0934567890",
    status: 'reject',
  },
  {
    name: "Hoàng Văn E",
    bloodType: "O+",
    quantity: 1,
    type: "Tiểu cầu",
    hospital: "Bệnh viện Quận 7",
    time: "2024-09-01 ~ 2024-09-03",
    phone: "0978123456",
    status: 'pending',
  },
];

const bloodTypes = [
  '', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'
];

const ReceiverPage = () => {
  const [originalList] = useState(receiverList);
  const [filtered, setFiltered] = useState(receiverList);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBloodType, setFilterBloodType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [newStatus, setNewStatus] = useState('pending');

  const handleSearch = (value, status = filterStatus, bloodType = filterBloodType) => {
    let filteredList = originalList;
    if (value) {
      filteredList = filteredList.filter(r =>
        r.name.toLowerCase().includes(value.toLowerCase())
      );
    }
    if (status) {
      filteredList = filteredList.filter(r => r.status === status);
    }
    if (bloodType) {
      filteredList = filteredList.filter(r => r.bloodType === bloodType);
    }
    setFiltered(filteredList);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    handleSearch(search, status);
  };

  const handleBloodTypeFilter = (bloodType) => {
    setFilterBloodType(bloodType);
    handleSearch(search, filterStatus, bloodType);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setNewStatus(record.status);
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    if (editingRecord) {
      setFiltered(prev => prev.map(item =>
        item === editingRecord ? { ...item, status: newStatus } : item
      ));
    }
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleDelete = (record) => {
    setFiltered(prev => prev.filter(item => item !== record));
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      align: 'center',
      width: 70,
      render: (_, __, idx) => idx + 1,
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
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
      title: 'Số đơn vị',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 90,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: 110,
    },
    {
      title: 'Bệnh viện',
      dataIndex: 'hospital',
      key: 'hospital',
      align: 'center',
      width: 180,
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      align: 'center',
      width: 160,
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
        let text;
        switch (status) {
          case 'pending': color = 'text-orange-500'; text = 'Đang chờ'; break;
          case 'resolved': color = 'text-green-500'; text = 'Đã duyệt'; break;
          case 'reject': color = 'text-red-500'; text = 'Từ chối'; break;
          default: color = 'text-gray-500'; text = status;
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
      width: 150,
      render: (_, record) => (
        <span className="flex items-center justify-center gap-2">
          <Tooltip title="Sửa">
            <Button type="dashed" variant="dashed" color="cyan" onClick={() => handleEdit(record)}>
              <EditOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Xoá">
            <Button danger onClick={() => handleDelete(record)}>
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-10 text-center text-red-600">Thông tin nhận máu</h1>
      <div className="flex flex-shrink-0 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="w-[250px] pl-4 pr-10 py-2 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
            value={search}
            onChange={e => { setSearch(e.target.value); handleSearch(e.target.value); }}
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
            <option value="pending">Đang chờ</option>
            <option value="resolved">Đã duyệt</option>
            <option value="reject">Từ chối</option>
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
        dataSource={filtered}
        columns={columns}
        rowKey={(record, idx) => idx}
        pagination={{
          pageSize: 5,
          position: ['bottomCenter'],
        }}
        locale={{ emptyText: 'Không có dữ liệu' }}
        scroll={{ x: 'max-content' }}
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
          options={[
            { value: 'pending', label: 'Đang chờ' },
            { value: 'resolved', label: 'Đã duyệt' },
            { value: 'reject', label: 'Từ chối' },
          ]}
        />
      </Modal>
    </div>
  );
};

export default ReceiverPage;
