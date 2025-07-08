import React, { useState } from 'react';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tooltip, Modal, Select } from 'antd';
import { searchByName } from '../../utils/searchByName';

const EmergencyHandlingPage = () => {

  const initialRequests = [
    {
      id: 1,
      requester: 'Dương Thái Hoàng Nghĩa',
      bloodType: 'B+',
      units: 5,
      status: 'pending',
      date: '2024-03-18',
      hospital: 'Bệnh viện Chợ Rẫy',
    },
    {
      id: 2,
      requester: 'Nguyễn Văn A',
      bloodType: 'O-',
      units: 2,
      status: 'resolved',
      date: '2024-03-17',
      hospital: 'Bệnh viện Bình Dân',
    },
    {
      id: 3,
      requester: 'Nguyễn Văn A',
      bloodType: 'A+',
      units: 2,
      status: 'reject',
      date: '2024-03-17',
      hospital: 'Bệnh viện Nhân dân 115',
    },
    {
      id: 4,
      requester: 'Nguyễn Văn A',
      bloodType: 'AB+',
      units: 2,
      status: 'resolved',
      date: '2024-03-17',
      hospital: 'Bệnh viện Hùng Vương',
    },
    {
      id: 5,
      requester: 'Nguyễn Văn A',
      bloodType: 'O+',
      units: 2,
      status: 'resolved',
      date: '2024-03-17',
      hospital: 'Bệnh viện Quận 7',
    },
    {
      id: 6,
      requester: 'Nguyễn Văn A',
      bloodType: 'AB-',
      units: 2,
      status: 'resolved',
      date: '2024-03-17',
      hospital: 'Bệnh viện Chợ Rẫy',
    },
    {
      id: 7,
      requester: 'Nguyễn Văn A',
      bloodType: 'O-',
      units: 2,
      status: 'resolved',
      date: '2024-03-17',
      hospital: 'Bệnh viện Bình Dân',
    },
    {
      id: 8,
      requester: 'Nguyễn Văn A',
      bloodType: 'O-',
      units: 2,
      status: 'resolved',
      date: '2024-03-17',
      hospital: 'Bệnh viện Nhân dân 115',
    },
    {
      id: 9,
      requester: 'Nguyễn Văn A',
      bloodType: 'O-',
      units: 2,
      status: 'resolved',
      date: '2024-03-17',
      hospital: 'Bệnh viện Hùng Vương',
    },
    {
      id: 10,
      requester: 'Nguyễn Văn A',
      bloodType: 'O-',
      units: 2,
      status: 'resolved',
      date: '2024-03-17',
      hospital: 'Bệnh viện Quận 7',
    },
    {
      id: 11,
      requester: 'Nguyễn Văn A',
      bloodType: 'O-',
      units: 2,
      status: 'resolved',
      date: '2024-03-17',
      hospital: 'Bệnh viện Chợ Rẫy',
    },
  ];

  const [originalRequests] = useState(initialRequests);
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");

  const bloodTypes = [
    '', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'
  ];

  const [filterBloodType, setFilterBloodType] = useState("");

  const handleBloodTypeFilter = (bloodType) => {
    setFilterBloodType(bloodType);
    handleSearch(search, filterStatus, bloodType);
  };

  const handleSearch = (value, status = filterStatus, bloodType = filterBloodType) => {
    let filteredList = originalRequests;
    if (value) {
      filteredList = filteredList.filter(r =>
        r.requester.toLowerCase().includes(value.toLowerCase())
      );
    }
    if (status) {
      filteredList = filteredList.filter(r => r.status === status);
    }
    if (bloodType) {
      filteredList = filteredList.filter(r => r.bloodType === bloodType);
    }
    setRequests(filteredList);
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
      title: 'Người yêu cầu',
      dataIndex: 'requester',
      key: 'requester',
      width: 250,
      align: 'center',
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      width: 200,
      align: 'center',
      render: (bloodType) => {
        return (
          <span className="font-bold text-black">
            {bloodType}
          </span>
        );
      }
    },
    {
      title: 'Đơn vị',
      dataIndex: 'units',
      key: 'units',
      width: 200,
      align: 'center',
      render: (units) => {
        return (
          <span className="font-bold">
            {units}
          </span>
        );
      }
    },
    {
      title: 'Bệnh viện',
      dataIndex: 'hospital',
      key: 'hospital',
      width: 200,
      align: 'center',
      render: (hospital) => <span>{hospital}</span>,
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      width: 250,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 250,
      align: 'center',
      render: (status) => {
        let color;
        let text;
        switch (status) {
          case 'pending': color = 'text-orange-500'; text = 'Đang chờ'; break;
          case 'resolved': color = 'text-green-500'; text = 'Đã duyệt'; break;
          default: color = 'text-red-500'; text = 'Từ chối';
        }
        return (
          <span className={`font-bold ${color} border-2 rounded-md p-1`} >
            {text}
          </span>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Sửa">
            <Button type='dashed' variant='dashed' color='cyan' onClick={() => handleEdit(record)}>
              <EditOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Xoá">
            <Button danger onClick={() => handleDelete(record)}>
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const [filterStatus, setFilterStatus] = useState("");

  // State cho modal sửa trạng thái
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [newStatus, setNewStatus] = useState('pending');

  const handleEdit = (record) => {
    setEditingRecord(record);
    setNewStatus(record.status);
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    if (editingRecord) {
      setRequests(prev => prev.map(item =>
        item.id === editingRecord.id ? { ...item, status: newStatus } : item
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
    setRequests(prev => prev.filter(item => item.id !== record.id));
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-10 text-center text-red-600">Nhận máu khẩn cấp</h1>
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
            onChange={(e) => handleStatusFilter(e.target.value)}
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
        dataSource={requests}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 5,
          position: ['bottomCenter'],
        }}
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
}

export default EmergencyHandlingPage;