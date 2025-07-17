//	Quản lý số lượng đơn vị máu còn lại tại cơ sở y tế.
import { useEffect, useState } from 'react';
import '../../styles/bloodStockManagementPage.css';
import { Table, Input, Button, Tooltip, Modal, Select } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { GetAllBlood } from '../../services/bloodStorage';
import { toast } from 'react-toastify';

const bloodTypeList = [
  'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'
];

// const initialBloodTypes = [
//   {
//     bloodType: 'A+',
//     volume: 450,
//     // status sẽ được tính tự động
//   },
//   {
//     bloodType: 'A-',
//     volume: 350,
//   },
//   {
//     bloodType: 'B+',
//     volume: 250,
//   },
//   {
//     bloodType: 'B-',
//     volume: 200,
//   },
//   {
//     bloodType: 'AB+',
//     volume: 500,
//   },
//   {
//     bloodType: 'AB-',
//     volume: 0,
//   },
//   {
//     bloodType: 'O+',
//     volume: 600,
//   },
//   {
//     bloodType: 'O-',
//     volume: 100,
//   },
// ];

// Hàm tính trạng thái dựa trên volume
const getStatus = (volume) => (volume > 0 ? 'Enough' : 'Not Enough');

const BloodStockManagementPage = () => {
  // Khởi tạo dữ liệu với status tự động
  const [originalList, setOriginalList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBloodType, setFilterBloodType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [newStatus, setNewStatus] = useState('Enough');
  const [newVolume, setNewVolume] = useState(0);


  const fetchBloodStorage = async () => {
    const bloodStorageRes = await GetAllBlood();
    console.log("bloodStorageRes", bloodStorageRes)
    setOriginalList(bloodStorageRes.data.bloodStorages.map(item => ({ ...item, status: getStatus(item.quantity) })))
    setFiltered(bloodStorageRes.data.bloodStorages.map(item => ({ ...item, status: getStatus(item.quantity) })))
  }
  useEffect(() => {
    fetchBloodStorage();
  }, [])

  console.log("originalList", originalList)
  console.log("filtered", filtered)

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
      filteredList = filteredList.filter(r => bloodTypeList[r.bloodType] === bloodType);
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

  // Khi chỉnh sửa volume, cập nhật lại status
  const handleEdit = (record) => {
    setEditingRecord(record);
    setNewVolume(record.volume);
    setNewStatus(getStatus(record.volume));
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    if (editingRecord) {
      const updatedStatus = getStatus(newVolume);
      setFiltered(prev => prev.map(item =>
        item === editingRecord
          ? { ...item, volume: newVolume, status: updatedStatus }
          : item
      ));
      toast.success('Cập nhật số lượng/thông tin kho máu thành công!');
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
      render: (bloodType) => <span className="font-bold">{bloodTypeList[bloodType]}</span>
    },
    {
      title: 'Số lượng (ml)',
      dataIndex: 'quantity',
      key: 'quantity',
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
        rowKey={(record, idx) => `${record.bloodType}-${record.volume}`}
        pagination={{
          pageSize: 8,
          position: ['bottomCenter'],
        }}
        locale={{ emptyText: 'Không có dữ liệu' }}
        scroll={{ x: 'max-content' }}
      />
      <Modal
        title="Chỉnh sửa thông tin kho máu"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Lưu"
        cancelText="Huỷ"
      >
        {editingRecord && (
          <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
            <div className="mb-1"><b>Nhóm máu:</b> {editingRecord.bloodType}</div>
            <div className="mb-1"><b>Số lượng (ml):</b> {editingRecord.volume}</div>
            <div className="mb-1 flex items-center gap-2">
              <b>Trạng thái:</b>
              {editingRecord.status === 'Not Enough' ? (
                <span className="font-bold text-[#e53935] bg-[#ffebee] border-2 rounded-md p-1">Không đủ</span>
              ) : (
                <span className="font-bold text-[#4caf50] bg-[#e8f5e9] border-2 rounded-md p-1">Đủ</span>
              )}
            </div>
          </div>
        )}
        <div className="mb-2">Nhập số lượng (ml):</div>
        <Input
          type="number"
          min={0}
          step={50}
          className="w-full mb-4"
          value={newVolume}
          onChange={e => {
            const val = Number(e.target.value);
            setNewVolume(val);
            setNewStatus(getStatus(val));
          }}
        />
        <div className="mb-2">Trạng thái:</div>
        <Select
          className="w-full"
          value={newStatus}
          onChange={setNewStatus}
          options={[
            { value: 'Enough', label: 'Đủ' },
            { value: 'Not Enough', label: 'Không đủ' },
          ]}
          disabled
        />
      </Modal>
    </div>
  );
};

export default BloodStockManagementPage;