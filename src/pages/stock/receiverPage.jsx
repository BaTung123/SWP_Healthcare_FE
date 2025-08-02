import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Tooltip, Modal, Select } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, AuditOutlined } from '@ant-design/icons';
import { FileTextOutlined } from '@ant-design/icons';
import { getAllBloodDonationApplication, updateBloodDonationApplicationStatus } from '../../services/donorRegistration';
import { GetAllBloodImportApplication, GetBloodImportApplicationById, updateBloodImportApplication } from '../../services/bloodImport';
import { UpdateBloodStorageOnImport } from '../../services/bloodStorage';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { GetHealthCheckByUserId } from '../../services/healthCheck';

const bloodTypes = [
  'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'Chưa biết'
];

const bloodTransferTypes = [
  'Toàn Phần', 'Hồng Cầu', 'Huyết Tương', 'Tiểu Cầu'
];

const statusList = [
  'Đang Chờ', 'Chấp Nhận', 'Đã Nhập', 'Từ Chối'   
];

const statusOptions = [
  { value: 'Đã Nhập', label: 'Đã Nhập' },
  // { value: 'Từ Chối', label: 'Từ Chối' },
];

const ReceiverPage = () => {
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

  // State cho modal kiểm tra sức khỏe
  const [isHealthCheckModalOpen, setIsHealthCheckModalOpen] = useState(false);
  const [healthCheckData, setHealthCheckData] = useState(null);
  const [healthCheckError, setHealthCheckError] = useState("");


  const fetchDonateList = async () => {
    const donateListRes = await getAllBloodDonationApplication();
    console.log("donateListRes", donateListRes)
    const donateList = donateListRes;
    
    // Lấy danh sách bloodImportApplication để kiểm tra đơn nào đã được gửi vào kho
    const importListRes = await GetAllBloodImportApplication();
    console.log("importListRes", importListRes);
    const importList = importListRes.data.bloodImports;
    console.log("importList", importList);
    
    // Chỉ lấy những đơn đăng ký có bloodImportApplication tương ứng (đã được gửi vào kho)
    const donateObjList = donateList
      .filter(donate => {
        // Kiểm tra xem đơn này có bloodImportApplication không
        return importList.some(importItem => importItem.bloodDonationApplicationId === donate.id);
      })
      .map(donate => {
        return {
          ...donate,
          bloodTransferType: bloodTransferTypes[donate.bloodTransferType],
          bloodType: bloodTypes[donate.bloodType],
          status: statusList[donate.status]
        }
      });

    setData(donateObjList)
  }
  useEffect(() => {
    fetchDonateList();
  }, [])

  // Filtered data for display only
  const filteredData = data.filter(r => {
    const matchName = search ? r.fullName.toLowerCase().includes(search.toLowerCase()) : true;
    const matchStatus = filterStatus ? r.status === filterStatus : true;
    const matchBloodType = filterBloodType ? r.bloodType === filterBloodType : true;
    const matchTransferType = filterTransferType ? r.bloodTransferType === filterTransferType : true;
    return matchName && matchStatus && matchBloodType && matchTransferType;
  });

  console.log("filteredData", filteredData)
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
      console.log("editingRecord", editingRecord)
      const updateDonateObj = {
        id: editingRecord.id,
        status: statusList.indexOf(newStatus),
        note: rejectReason || ""
      };
      const importListRes = await GetAllBloodImportApplication();
      console.log("importListRes", importListRes);
      const importList = importListRes.data.bloodImports;
      console.log("importList", importList);
      const importObj = importList.find(item => item.bloodDonationApplicationId === editingRecord.id && item.status === 1);
      console.log("importObj", importObj);
      if (!importObj) {
        toast.error("Vui lòng chờ y tá tạo đơn nhập máu.");
        return;
      }

      console.log("updateRequestObj", updateDonateObj)
      const updateDonateRes = await updateBloodDonationApplicationStatus(updateDonateObj);
      console.log("updateDonateRes", updateDonateRes)

      const bloodImport = await GetBloodImportApplicationById(importObj.id);
      console.log("bloodImport", bloodImport);
      const bloodImportSend = {
        id: bloodImport.data.id,
        status: updateDonateObj.status,
        note: updateDonateObj.note || ""
      }
      console.log("bloodImportSend", bloodImportSend);
      const updateBloodImportStatus = await updateBloodImportApplication(bloodImportSend);
      console.log("updateBloodImportStatus", updateBloodImportStatus);
      
      // Tự động cập nhật blood storage khi duyệt đơn nhập máu
      if (newStatus === 'Chấp Nhận') {
        try {
          // Lấy thông tin chi tiết của blood import để có quantity
          const bloodImportDetail = await GetBloodImportApplicationById(importObj.id);
          const quantity = bloodImportDetail.data.quantity || 0;
          const bloodType = bloodTypes[editingRecord.bloodType];
          
          if (quantity > 0) {
            await UpdateBloodStorageOnImport(editingRecord.bloodType, quantity);
            console.log(`Đã cập nhật blood storage khi duyệt: ${bloodType} +${quantity}ml`);
          }
        } catch (storageError) {
          console.error('Lỗi cập nhật blood storage khi duyệt:', storageError);
          // Không throw error vì duyệt đơn đã thành công
        }
      }
      
      toast.success('Cập nhật trạng thái thành công!');
    }
    setIsModalOpen(false);
    setEditingRecord(null);
    setRejectReason('');
    fetchDonateList();
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleDelete = (record) => {
    setData(prev => prev.filter(item => item !== record));
  };

  // Hàm mở modal kiểm tra sức khỏe
  const handleOpenHealthCheckModal = async (record) => {
    const getHealthCheckByUserIdRes = await GetHealthCheckByUserId(record.userId);
    console.log("getHealthCheckByUserIdRes:", getHealthCheckByUserIdRes.data);

    const matchedHealthCheck = getHealthCheckByUserIdRes.data.find(
      item => item.bloodDonationApplicationId === record.id
    );
    setHealthCheckData({
      userId: matchedHealthCheck.userId,
      bloodDonationApplicationId: matchedHealthCheck.bloodDonationApplicationId,
      fullName: matchedHealthCheck.fullName || "",
      bloodType: matchedHealthCheck.bloodType || "",
      phone: matchedHealthCheck.phone || "",
      healthCheckResult: matchedHealthCheck.healthCheckResult || "",
      bloodPressure: matchedHealthCheck.bloodPressure || "",
      heartRate: matchedHealthCheck.heartRate || "",
      temperature: matchedHealthCheck.temperature || "",
      hemoglobin: matchedHealthCheck.hemoglobin || "",
      weight: matchedHealthCheck.weight || "",
      height: matchedHealthCheck.height || "",
      note: matchedHealthCheck.note || ""
    });
    setHealthCheckError("");
    setIsHealthCheckModalOpen(true);
  };

  // Hàm xử lý thay đổi giá trị trong form
  const handleHealthCheckChange = (field, value) => {
    if (['heartRate', 'temperature', 'hemoglobin', 'weight', 'height'].includes(field)) {
      const numValue = parseFloat(value);
      if (value !== '' && (isNaN(numValue) || numValue < 0)) {
        return;
      }
    }
    setHealthCheckData(prev => ({ ...prev, [field]: value }));
    if (healthCheckError) setHealthCheckError("");
  };

  // Hàm submit form kiểm tra sức khỏe
  const handleHealthCheckFormSubmit = () => {
    setHealthCheckError("");
    if (!healthCheckData.healthCheckResult) {
      setHealthCheckError("Vui lòng chọn kết quả kiểm tra sức khỏe!");
      return;
    }
    if (!healthCheckData.bloodPressure?.trim()) {
      setHealthCheckError("Vui lòng nhập huyết áp!");
      return;
    }
    if (!/^\d{2,3}\/\d{2,3}$/.test(healthCheckData.bloodPressure)) {
      setHealthCheckError("Huyết áp phải có định dạng: số/số (VD: 120/80)");
      return;
    }
    if (!healthCheckData.heartRate?.trim()) {
      setHealthCheckError("Vui lòng nhập nhịp tim!");
      return;
    }
    const heartRate = parseInt(healthCheckData.heartRate);
    if (isNaN(heartRate) || heartRate < 40 || heartRate > 200) {
      setHealthCheckError("Nhịp tim phải từ 40-200 lần/phút");
      return;
    }
    if (!healthCheckData.temperature?.trim()) {
      setHealthCheckError("Vui lòng nhập nhiệt độ!");
      return;
    }
    const temperature = parseFloat(healthCheckData.temperature);
    if (isNaN(temperature) || temperature < 35 || temperature > 42) {
      setHealthCheckError("Nhiệt độ phải từ 35-42°C");
      return;
    }
    if (!healthCheckData.hemoglobin?.trim()) {
      setHealthCheckError("Vui lòng nhập hemoglobin!");
      return;
    }
    const hemoglobin = parseFloat(healthCheckData.hemoglobin);
    if (isNaN(hemoglobin) || hemoglobin < 7 || hemoglobin > 20) {
      setHealthCheckError("Hemoglobin phải từ 7-20 g/dL");
      return;
    }
    if (!healthCheckData.weight?.trim()) {
      setHealthCheckError("Vui lòng nhập cân nặng!");
      return;
    }
    const weight = parseFloat(healthCheckData.weight);
    if (isNaN(weight) || weight < 30 || weight > 200) {
      setHealthCheckError("Cân nặng phải từ 30-200 kg");
      return;
    }
    if (!healthCheckData.height?.trim()) {
      setHealthCheckError("Vui lòng nhập chiều cao!");
      return;
    }
    const height = parseInt(healthCheckData.height);
    if (isNaN(height) || height < 100 || height > 250) {
      setHealthCheckError("Chiều cao phải từ 100-250 cm");
      return;
    }
    const bmi = weight / (height / 100 * height / 100);
    if (bmi < 18.5 || bmi > 35) {
      setHealthCheckError(`BMI phải từ 18.5-35 (Hiện tại: ${bmi.toFixed(1)})`);
      return;
    }
    // Nếu cần gọi API lưu thì thêm ở đây
    toast.success("Lưu thông tin kiểm tra sức khỏe thành công!");
    setIsHealthCheckModalOpen(false);
    setHealthCheckError("");
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
    // Bỏ cột Bệnh viện
    {
      title: 'Thời gian',
      dataIndex: 'donationEndDate',
      key: 'donationEndDate',
      align: 'center',
      width: 160,
      render: (date) => dayjs(date).format("DD-MM-YYYY")
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
      render: (status) => {
        let color;
        let text = status;
        switch (status) {
          case 'Đang Chờ': color = 'text-orange-500'; break;
          case 'Đã Nhập': color = 'text-blue-500'; break;
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
      render: (_, record) => (
        <span className="flex items-center justify-center gap-2">
          {record.status === "Chấp Nhận" && (
            <Tooltip title="Sửa trạng thái">
              <Button type="dashed" variant="dashed" color="cyan" onClick={() => handleEdit(record)}>
                <EditOutlined />
              </Button>
            </Tooltip>
          )}
          <Tooltip title="Kiểm tra sức khỏe">
            <Button
              type="dashed"
              variant="dashed"
              color="purple"
              style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}
              onClick={() => handleOpenHealthCheckModal(record)}
            >
              <AuditOutlined />
            </Button>
          </Tooltip>
        </span>
      )
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
      <h1 className="text-2xl font-bold mb-10 text-center text-red-600">Thông tin nhận máu</h1>
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
            {statusList.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
                 <div className="ml-2">
           <select
             className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
             value={filterBloodType}
             onChange={e => handleBloodTypeFilter(e.target.value)}
           >
             <option value="">Tất cả nhóm máu</option>
             {bloodTypes.map(type => (
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

      {/* Modal kiểm tra sức khỏe */}
      <Modal
        title="Thông tin Kiểm Tra Sức Khỏe"
        open={isHealthCheckModalOpen}
        onCancel={() => setIsHealthCheckModalOpen(false)}
        width={600}
        destroyOnClose={true}
        footer={null}
      >
        {healthCheckData && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Họ và tên:</label>
                <input
                  type="text"
                  value={healthCheckData.fullName}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                  disabled
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Nhóm máu:</label>
                <input
                  type="text"
                  value={healthCheckData.bloodType}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                  disabled
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Huyết áp (mmHg): <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={healthCheckData.bloodPressure}
                  onChange={e => handleHealthCheckChange('bloodPressure', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="VD: 120/80"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Nhịp tim (lần/phút): <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="0"
                  value={healthCheckData.heartRate}
                  onChange={e => handleHealthCheckChange('heartRate', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="VD: 72"
                  required
                  onKeyDown={e => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Nhiệt độ (°C): <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={healthCheckData.temperature}
                  onChange={e => handleHealthCheckChange('temperature', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="VD: 36.5"
                  required
                  onKeyDown={e => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Hemoglobin (g/dL): <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={healthCheckData.hemoglobin}
                  onChange={e => handleHealthCheckChange('hemoglobin', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="VD: 13.5"
                  required
                  onKeyDown={e => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Cân nặng (kg): <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={healthCheckData.weight}
                  onChange={e => handleHealthCheckChange('weight', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="VD: 65"
                  required
                  onKeyDown={e => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Chiều cao (cm): <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="0"
                  value={healthCheckData.height}
                  onChange={e => handleHealthCheckChange('height', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="VD: 170"
                  required
                  onKeyDown={e => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Kết quả kiểm tra sức khỏe: <span className="text-red-500">*</span></label>
              <Select
                className="w-full"
                value={healthCheckData.healthCheckResult}
                onChange={value => handleHealthCheckChange('healthCheckResult', value)}
                options={[
                  { value: 'Đạt', label: 'Đạt - Có thể hiến máu' },
                  { value: 'Không đạt', label: 'Không đạt - Không thể hiến máu' },
                  { value: 'Cần kiểm tra thêm', label: 'Cần kiểm tra thêm' },
                ]}
              />
            </div>
            {healthCheckData.weight && healthCheckData.height && (
              <div className="bg-blue-50 p-3 rounded-lg">
                {(() => {
                  const weight = parseFloat(healthCheckData.weight);
                  const height = parseInt(healthCheckData.height) / 100;
                  const bmi = weight / (height * height);
                  const isBMIOk = bmi >= 18.5 && bmi <= 35.0;
                  return (
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-blue-800">
                        BMI: {bmi.toFixed(1)}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        isBMIOk 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isBMIOk ? 'Đạt' : 'Không đạt'}
                      </span>
                    </div>
                  );
                })()}
              </div>
            )}
            <div>
              <label className="block font-semibold mb-1">Ghi chú:</label>
              <Input.TextArea
                value={healthCheckData.note || ''}
                onChange={e => handleHealthCheckChange('note', e.target.value)}
                placeholder="Nhập ghi chú về tình trạng sức khỏe..."
                rows={3}
              />
            </div>
            {healthCheckError && (
              <div className="text-red-500 font-semibold text-center mt-2">{healthCheckError}</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReceiverPage;
