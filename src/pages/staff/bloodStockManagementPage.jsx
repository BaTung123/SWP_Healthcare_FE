//	Quản lý số lượng đơn vị máu còn lại tại cơ sở y tế.
import { useState } from 'react';
import '../../styles/bloodStockManagementPage.css';
import { Table, Input, Button, Tooltip, Modal, Select } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const bloodTypeList = [
  'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'
];

const initialBloodTypes = [
  {
    bloodType: 'A+',
    units: 12,
    status: 'Enough',
  },
  {
    bloodType: 'A-',
    units: 3,
    status: 'Not Enough',
  },
  {
    bloodType: 'B+',
    units: 8,
    status: 'Enough',
  },
  {
    bloodType: 'B-',
    units: 1,
    status: 'Not Enough',
  },
  {
    bloodType: 'AB+',
    units: 6,
    status: 'Enough',
  },
  {
    bloodType: 'AB-',
    units: 0,
    status: 'Not Enough',
  },
  {
    bloodType: 'O+',
    units: 16,
    status: 'Enough',
  },
  {
    bloodType: 'O-',
    units: 3,
    status: 'Not Enough',
  },
];

const BloodStockManagementPage = () => {
  const [originalList] = useState(initialBloodTypes);
  const [filtered, setFiltered] = useState(initialBloodTypes);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBloodType, setFilterBloodType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [newStatus, setNewStatus] = useState('Enough');

  const handleSearch = (value, status = filterStatus, bloodType = filterBloodType) => {
    let filteredList = originalList;
    if (value) {
      filteredList = filteredList.filter(r =>
        r.bloodType.toLowerCase().includes(value.toLowerCase())
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
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      align: 'center',
      width: 120,
      render: (bloodType) => <span className="font-bold">{bloodType}</span>
    },
    {
      title: 'Số lượng (túi)',
      dataIndex: 'units',
      key: 'units',
      align: 'center',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 150,
      render: (status) => {
        let color;
        let text;
        switch (status) {
          case 'Not Enough': color = 'text-[#e53935] bg-[#ffebee]'; text = 'Không đủ'; break;
          default: color = 'text-[#4caf50] bg-[#e8f5e9]'; text = 'Đủ';
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
      <h1 className="text-2xl font-bold mb-10 text-center text-red-600">Thông tin kho máu</h1>
      <div className="flex flex-shrink-0 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm nhóm máu"
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
            <option value="Enough">Đủ</option>
            <option value="Not Enough">Không đủ</option>
          </select>
        </div>
        <div className="ml-2">
          <select
            className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            value={filterBloodType}
            onChange={e => handleBloodTypeFilter(e.target.value)}
          >
            <option value="">Tất cả nhóm máu</option>
            {bloodTypeList.map(type => (
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
          pageSize: 8,
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
            { value: 'Enough', label: 'Đủ' },
            { value: 'Not Enough', label: 'Không đủ' },
          ]}
        />
      </Modal>
    </div>
  );
};

export default BloodStockManagementPage;