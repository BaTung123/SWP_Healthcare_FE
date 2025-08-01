import { useEffect, useState } from 'react';
import { Table, Input, Button, Tooltip, Modal, Select } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, DownOutlined } from '@ant-design/icons';
import { GetAllBloodRequestApplication, UpdateBloodRequestStatus } from '../../services/bloodRequestApplication';
import { getAllBloodDonationApplication } from '../../services/donorRegistration';
import { GetAllBloodImportApplication } from '../../services/bloodImport';
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

  // State cho modal chi tiết theo nhóm máu
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState([]);
  const [selectedBloodType, setSelectedBloodType] = useState(null);
  const [detailSearch, setDetailSearch] = useState("");
  const [detailFilterStatus, setDetailFilterStatus] = useState("");
  const [detailFilterTransferType, setDetailFilterTransferType] = useState("");

  
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

  // Hàm lấy dữ liệu chi tiết theo nhóm máu
  const fetchDetailData = async (bloodTypeIndex) => {
    try {
      // Lấy danh sách đơn hiến máu đã thành công
      const donateListRes = await getAllBloodDonationApplication();
      const importListRes = await GetAllBloodImportApplication();
      const importList = importListRes.data.bloodImports;
      
      console.log('bloodTypeIndex:', bloodTypeIndex);
      console.log('bloodTypeName:', bloodTypes[bloodTypeIndex]);
      console.log('donateListRes:', donateListRes);
      console.log('importList:', importList);
      
      // Lọc dữ liệu theo nhóm máu và chỉ lấy những đơn hiến máu đã thành công (có bloodImportApplication)
      const filteredData = donateListRes
        .filter(donate => {
          console.log('donate.bloodType:', donate.bloodType, 'bloodTypeIndex:', bloodTypeIndex);
          return donate.bloodType === bloodTypeIndex && 
                 importList.some(importItem => importItem.bloodDonationApplicationId === donate.id);
        })
        .map(donate => ({
          ...donate,
          bloodTransferType: bloodTransferTypes[donate.bloodTransferType],
          bloodType: bloodTypes[donate.bloodType],
          status: statusList[donate.status]
        }));

      console.log('filteredData:', filteredData);
      
      if (filteredData.length === 0) {
        console.log('Không có dữ liệu phù hợp cho nhóm máu này');
        // Vẫn mở modal nhưng hiển thị thông báo không có dữ liệu
      }
      
      setDetailData(filteredData);
      setSelectedBloodType(bloodTypeIndex);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu chi tiết:', error);
    }
  };

  // Hàm xử lý tìm kiếm trong modal chi tiết
  const handleDetailSearch = (value) => {
    setDetailSearch(value);
  };

  // Hàm xử lý filter trong modal chi tiết
  const handleDetailStatusFilter = (status) => {
    setDetailFilterStatus(status);
  };

  const handleDetailTransferTypeFilter = (transferType) => {
    setDetailFilterTransferType(transferType);
  };

  // Dữ liệu đã filter cho modal chi tiết
  const filteredDetailData = detailData.filter(r => {
    const matchName = detailSearch ? r.fullName.toLowerCase().includes(detailSearch.toLowerCase()) : true;
    const matchStatus = detailFilterStatus ? r.status === detailFilterStatus : true;
    const matchTransferType = detailFilterTransferType ? r.bloodTransferType === detailFilterTransferType : true;
    return matchName && matchStatus && matchTransferType;
  });

  // Hàm đóng modal chi tiết
  const handleDetailModalCancel = () => {
    setIsDetailModalOpen(false);
    setDetailData([]);
    setSelectedBloodType(null);
    setDetailSearch("");
    setDetailFilterStatus("");
    setDetailFilterTransferType("");
  };

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
      width: 220,
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
                         <Tooltip title="Xem chi tiết">
               <Button 
                 type="dashed" 
                 variant="dashed" 
                 color="blue" 
                 onClick={() => {
                   // Tìm index của nhóm máu từ tên nhóm máu
                   const bloodTypeIndex = bloodTypes.indexOf(record.bloodType);
                   if (bloodTypeIndex !== -1) {
                     fetchDetailData(bloodTypeIndex);
                   } else {
                     console.error('Không tìm thấy nhóm máu:', record.bloodType);
                   }
                 }}
               >
                 <DownOutlined />
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

      {/* Modal chi tiết theo nhóm máu */}
      <Modal
        title={`Máu đã hiến thành công - Nhóm máu ${selectedBloodType !== null ? bloodTypes[selectedBloodType] : ''}`}
        open={isDetailModalOpen}
        onCancel={handleDetailModalCancel}
        footer={null}
        width={1200}
        destroyOnClose={true}
      >
        <div className="mb-4">
          <div className="flex flex-shrink-0 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên"
                className="w-[250px] pl-4 pr-10 py-2 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
                value={detailSearch}
                onChange={e => handleDetailSearch(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <SearchOutlined />
              </div>
            </div>
            <div className="ml-2">
              <select
                className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                value={detailFilterStatus}
                onChange={e => handleDetailStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                {statusList.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="ml-2">
              <select
                className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                value={detailFilterTransferType}
                onChange={e => handleDetailTransferTypeFilter(e.target.value)}
              >
                <option value="">Tất cả loại</option>
                {bloodTransferTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
                     <div className={`p-3 rounded-lg mb-4 ${filteredDetailData.length > 0 ? 'bg-green-50' : 'bg-yellow-50'}`}>
             <p className={`text-sm ${filteredDetailData.length > 0 ? 'text-green-800' : 'text-yellow-800'}`}>
               <strong>{filteredDetailData.length > 0 ? 'Thông tin:' : 'Lưu ý:'}</strong> 
               {filteredDetailData.length > 0 
                 ? `Danh sách này hiển thị các đơn hiến máu đã thành công thuộc nhóm máu ${selectedBloodType !== null ? bloodTypes[selectedBloodType] : ''}. Đây là những túi máu có thể xuất cho người cần máu có cùng nhóm máu.`
                 : `Hiện tại không có túi máu nào thuộc nhóm máu ${selectedBloodType !== null ? bloodTypes[selectedBloodType] : ''} đã hiến thành công và có thể xuất.`
               }
             </p>
             {filteredDetailData.length > 0 && (
               <div className="mt-2 flex gap-4 text-sm">
                 <span className="font-semibold text-green-900">
                   Tổng số túi máu: {filteredDetailData.length}
                 </span>
                 <span className="font-semibold text-green-900">
                   Tổng lượng máu có sẵn: {filteredDetailData.reduce((sum, item) => sum + (item.quantity || 0), 0)} ml
                 </span>
               </div>
             )}
           </div>
        </div>
        
        <Table
          className="rounded-2xl shadow-lg bg-white custom-ant-table"
          dataSource={filteredDetailData}
          columns={[
            {
              title: 'STT',
              key: 'stt',
              align: 'center',
              width: 70,
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
              width: 120,
            },
            {
              title: 'Ngày hiến',
              dataIndex: 'donationEndDate',
              key: 'donationEndDate',
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
              width: 120,
              render: (_, record) => (
                <span className="flex items-center justify-center gap-2">
                  <Tooltip title="Xuất máu">
                    <Button 
                      type="dashed" 
                      variant="dashed" 
                      color="green" 
                      size="small"
                    >
                      <SearchOutlined />
                    </Button>
                  </Tooltip>
                </span>
              ),
            },
          ]}
          rowKey={(record) => record.id}
          pagination={{
            pageSize: 5,
            position: ['bottomCenter'],
          }}
          locale={{ emptyText: 'Không có dữ liệu' }}
        />
      </Modal>
    </div>
  );
};

export default AcceptBloodDropPage;
