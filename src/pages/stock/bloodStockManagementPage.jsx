//	Quản lý số lượng đơn vị máu còn lại tại cơ sở y tế.
import { useEffect, useState } from 'react';
import '../../styles/bloodStockManagementPage.css';
import { Table, Input, Button, Tooltip, Modal, Select } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { GetAllBlood, UpdateBloodStorage } from '../../services/bloodStorage';
import { getAllBloodDonationApplication } from '../../services/donorRegistration';
import { GetAllBloodImportApplication } from '../../services/bloodImport';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const bloodTypeList = [
  'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'Chưa biết'
];

const bloodTransferTypes = [
  'Toàn Phần', 'Hồng Cầu', 'Huyết Tương', 'Tiểu Cầu'
];

const statusList = [
  'Đang Chờ', 'Chấp Nhận', 'Đã Nhập', 'Từ Chối'   
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

  // State cho modal chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState([]);
  const [selectedBloodType, setSelectedBloodType] = useState(null);
  const [detailSearch, setDetailSearch] = useState("");
  const [detailFilterStatus, setDetailFilterStatus] = useState("");
  const [detailFilterTransferType, setDetailFilterTransferType] = useState("");


  const fetchBloodStorage = async () => {
    const bloodStorageRes = await GetAllBlood();
    console.log("bloodStorageRes", bloodStorageRes)
    setOriginalList(bloodStorageRes.data.bloodStorages.map(item => ({ ...item, status: getStatus(item.quantity) })))
    setFiltered(bloodStorageRes.data.bloodStorages.map(item => ({ ...item, status: getStatus(item.quantity) })))
  }
  useEffect(() => {
    fetchBloodStorage();
  }, [])

  // Thêm function để refresh data từ bên ngoài
  const refreshBloodStorage = () => {
    fetchBloodStorage();
  }

  // Hàm lấy dữ liệu chi tiết theo nhóm máu
  const fetchDetailData = async (bloodTypeIndex) => {
    try {
      const donateListRes = await getAllBloodDonationApplication();
      const importListRes = await GetAllBloodImportApplication();
      const importList = importListRes.data.bloodImports;
      
      // Lọc dữ liệu theo nhóm máu và chỉ lấy những đơn có bloodImportApplication
      const filteredData = donateListRes
        .filter(donate => {
          return donate.bloodType === bloodTypeIndex && 
                 importList.some(importItem => importItem.bloodDonationApplicationId === donate.id);
        })
        .map(donate => ({
          ...donate,
          bloodTransferType: bloodTransferTypes[donate.bloodTransferType],
          bloodType: bloodTypeList[donate.bloodType],
          status: statusList[donate.status]
        }));

      setDetailData(filteredData);
      setSelectedBloodType(bloodTypeIndex);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu chi tiết:', error);
      toast.error('Có lỗi xảy ra khi lấy dữ liệu chi tiết!');
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

  // Tự động refresh blood storage mỗi 30 giây để cập nhật dữ liệu real-time
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBloodStorage();
    }, 30000); // 30 giây

    return () => clearInterval(interval);
  }, []);

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
    setNewVolume(record.quantity);
    setNewStatus(getStatus(record.quantity));
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    if (editingRecord) {
      try {
        // Gọi API để update
        await UpdateBloodStorage(editingRecord.id, {
          quantity: newVolume
        });
        
        const updatedStatus = getStatus(newVolume);
        const updatedRecord = { ...editingRecord, quantity: newVolume, status: updatedStatus };
        
        // Cập nhật cả originalList và filtered
        setOriginalList(prev => prev.map(item =>
          item.id === editingRecord.id
            ? updatedRecord
            : item
        ));
        setFiltered(prev => prev.map(item =>
          item.id === editingRecord.id
            ? updatedRecord
            : item
        ));
        
        toast.success('Cập nhật số lượng/thông tin kho máu thành công!');
      } catch (error) {
        console.error('Lỗi khi cập nhật:', error);
        toast.error('Có lỗi xảy ra khi cập nhật thông tin kho máu!');
      }
    }
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleDetailModalCancel = () => {
    setIsDetailModalOpen(false);
    setDetailData([]);
    setSelectedBloodType(null);
    setDetailSearch("");
    setDetailFilterStatus("");
    setDetailFilterTransferType("");
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
      width: 200,
      render: (_, record) => (
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
              onClick={() => fetchDetailData(record.bloodType)}
            >
              <DownOutlined />
            </Button>
          </Tooltip>
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-10 text-center text-red-600">Quản lý kho máu</h1>
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
                 rowKey={(record, idx) => record.id || `${record.bloodType}-${record.quantity}`}
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
             <div className="mb-1"><b>ID:</b> {editingRecord.id}</div>
             <div className="mb-1"><b>Nhóm máu:</b> {bloodTypeList[editingRecord.bloodType]}</div>
             <div className="mb-1"><b>Số lượng hiện tại (ml):</b> {editingRecord.quantity}</div>
             <div className="mb-1 flex items-center gap-2">
               <b>Trạng thái hiện tại:</b>
               {editingRecord.status === 'Not Enough' ? (
                 <span className="font-bold text-[#e53935] bg-[#ffebee] border-2 rounded-md p-1">Không đủ</span>
               ) : (
                 <span className="font-bold text-[#4caf50] bg-[#e8f5e9] border-2 rounded-md p-1">Đủ</span>
               )}
             </div>
           </div>
         )}
        <div className="mb-2">Nhập số lượng mới (ml):</div>
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
          placeholder="Nhập số lượng máu mới"
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

      {/* Modal chi tiết theo nhóm máu */}
      <Modal
        title={`Chi tiết các túi máu ${selectedBloodType !== null ? bloodTypeList[selectedBloodType] : ''}`}
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
              title: 'Thời gian',
              dataIndex: 'donationEndDate',
              key: 'donationEndDate',
              align: 'center',
              width: 160,
              render: (date) => dayjs(date).format("DD-MM-YYYY")
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
                   <Tooltip title="Xem chi tiết">
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

export default BloodStockManagementPage;