import { useEffect, useState } from 'react';
import { Table, Input, Button, Tooltip, Modal, Select } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { GetAllBloodRequestApplication, UpdateBloodRequestStatus } from '../../services/bloodRequestApplication';
import dayjs from 'dayjs';

const bloodTypes = [
  'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'Chưa biết'
];

const statusList = [
  'Đang Chờ', 'Chấp Nhận', 'Đã Xuất', 'Từ Chối'
];

const bloodTransferTypes = [
  'Toàn Phần', 'Hồng Cầu', 'Huyết Tương', 'Tiểu Cầu'
];

const statusOptions = [
  { value: 'Chấp Nhận', label: 'Chấp Nhận' },
  { value: 'Từ Chối', label: 'Từ Chối' },
];

const AcceptBloodDropPage = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBloodType, setFilterBloodType] = useState("");
  const [filterTransferType, setFilterTransferType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [newStatus, setNewStatus] = useState('Đang chờ');
  const [rejectReason, setRejectReason] = useState('');
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

    setData(requestObjList)
  }
  useEffect(() => {
    fetchRequestList()
  }, [])

  // Filtered data for display only
  const filteredData = data.filter(r => {
    const matchName = search ? r.fullName.toLowerCase().includes(search.toLowerCase()) : true;
    const matchStatus = filterStatus ? r.status === filterStatus : true;
    const matchBloodType = filterBloodType ? r.bloodType === filterBloodType : true;
    const matchTransferType = filterTransferType ? r.bloodTransferType === filterTransferType : true;
    return matchName && matchStatus && matchBloodType && matchTransferType;
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

  const handleTransferTypeFilter = (transferType) => {
    setFilterTransferType(transferType);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setNewStatus(record.status);
    setRejectReason(record.rejectReason || '');
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    if (editingRecord) {
      const updateRequestObj = {
        id: editingRecord.id,
        status: statusList.indexOf(newStatus),
        note: rejectReason || ""
      };
      console.log("updateRequestObj", updateRequestObj)
      const updateRequestRes = await UpdateBloodRequestStatus(updateRequestObj);
      console.log("updateRequestRes", updateRequestRes)
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
      dataIndex: 'bloodTransferType',
      key: 'bloodTransferType',
      align: 'center',
      width: 110,
    },
    {
      title: 'Ngày cần',
      dataIndex: 'bloodRequestDate',
      key: 'bloodRequestDate',
      align: 'center',
      width: 110,
      render: (date) => dayjs(date).format('DD-MM-YYYY'),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
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
      width: 180,
      render: (_, record) => {
        if (record.status === "Đã Xuất" || record.status === "Từ Chối")
          return;

        return (
          <span className="flex items-center justify-center gap-2">
            <Tooltip title="Sửa">
              <Button type="dashed" variant="dashed" color="cyan" onClick={() => handleEdit(record)}>
                <EditOutlined />
              </Button>
            </Tooltip>
          </span>
        )
      },
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
      <h1 className="text-2xl font-bold mb-10 text-center text-red-600">Thông tin cần máu</h1>
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
         <div className="ml-2">
           <select
             className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
             value={filterTransferType}
             onChange={e => handleTransferTypeFilter(e.target.value)}
           >
             <option value="">Tất cả loại</option>
             {bloodTransferTypes.map(type => (
               <option key={type} value={type}>{type}</option>
             ))}
           </select>
         </div>
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
          onChange={value => setNewStatus(value)}
          options={statusOptions}
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
