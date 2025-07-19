import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Button, Tooltip, Modal, Select, Spin } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, AuditOutlined } from '@ant-design/icons';
import { getAllBloodDonationApplication, updateBloodDonationApplicationStatus, updateBloodDonationApplicationInfo } from '../../services/donorRegistration';
import dayjs from 'dayjs';
// Thêm import Modal, Input cho form
import { Input, Form } from 'antd';
import { CreateBloodImportApplication, GetAllBloodImportApplication, GetBloodImportApplicationById, updateBloodImportApplication } from '../../services/bloodImport';
import { toast } from 'react-toastify';

// Constants
const BLOOD_TYPES = ['', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const bloodTypes = [
  'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'
];

const bloodTransferTypes = [
  'Toàn Phần', 'Hồng Cầu', 'Huyết Tương', 'Tiểu Cầu'
];

const DONATION_TYPES = ['', 'Toàn Phần', 'Hồng Cầu', 'Huyết Tương', 'Tiểu Cầu'];
const STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    // { value: 'Đang chờ', label: 'Đang chờ' }, // Ẩn khỏi select modal
    { value: 'Đã duyệt', label: 'Đã duyệt' },
    { value: 'Từ chối', label: 'Từ chối' },
];

const DONATION_TYPE_OPTIONS = [
  { value: 0, label: 'Toàn phần' },
  { value: 1, label: 'Tiểu cầu' },
  { value: 2, label: 'Huyết tương' },
];

const statusList = [
  'Đang Chờ', 'Chấp Nhận', 'Đã Nhập', 'Từ Chối'
];

const RequesterDonorPage = () => {
    const [originalList, setOriginalList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        bloodType: '',
        type: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [newStatus, setNewStatus] = useState('pending');
    const [editBloodModalOpen, setEditBloodModalOpen] = useState(false);
    const [editingBloodRecord, setEditingBloodRecord] = useState(null);
    const [editBloodType, setEditBloodType] = useState('');
    const [editQuantity, setEditQuantity] = useState('');
    // State cho modal gửi máu vào kho
    const [isBloodDropModalOpen, setIsBloodDropModalOpen] = useState(false);
    const [bloodDropFormData, setBloodDropFormData] = useState(null);

    // Hàm mở modal gửi máu vào kho
    const handleOpenBloodDropModal = (record) => {
        setBloodDropFormData({
            bloodDonationApplicationId: record.registrationId,
            fullName: record.fullNameRegister || "",
            birthDate: record.birthDate || "",
            gender: "", 
            bloodType: record.bloodGroup || "",
            quantity: record.quantity || 0,
            hospital: "",
            phone: record.phone || "",
            type: record.type || "",
            needDate: dayjs().format("YYYY-MM-DD"),
            note: "",
        });
        setEditingRecord(record);
        setIsBloodDropModalOpen(true);
    };

    // Hàm xử lý thay đổi form gửi máu vào kho
    const handleBloodDropFormChange = (e) => {
        const { name, value } = e.target;
        setBloodDropFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Hàm submit form gửi máu vào kho
    const handleBloodDropFormSubmit = async (e) => {
        e.preventDefault();
        
        console.log("bloodDropFormData:", bloodDropFormData);
        const createBloodImportRes = await CreateBloodImportApplication(bloodDropFormData);
        console.log("createBloodImportRes:", createBloodImportRes);

        if (createBloodImportRes.code === 201) {
            toast.success("Tạo đơn thành công!");
        } else {
            toast.error("Tạo đơn không thành công. Vui lòng thử lại.");
        }
        setIsBloodDropModalOpen(false);
        await fetchRegistrationList();
    };

    // Fetch registration list
    const fetchRegistrationList = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getAllBloodDonationApplication();
            console.log("res:", res)
            // Map API data sang format bảng
            const mapped = (res || []).map((item, idx) => ({
                registrationId: item.id || idx,
                fullNameRegister: item.fullName || "",
                birthDate: item.dob,
                bloodGroup: bloodTypes[item.bloodType],
                type: bloodTransferTypes[item.bloodTransferType],
                availableDate: item.donationEndDate,
                phone: item.phoneNumber || "",
                status: statusList[item.status],
                quantity: item.quantity || ""
            }));
            setOriginalList(mapped);
            setFilteredList(mapped);
            console.log("list registration:", mapped);
        } catch (error) {
            console.error("Error fetching registration list:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRegistrationList();
    }, [fetchRegistrationList]);

    // Optimized filter function
    const applyFilters = useCallback((nextFilters) => {
        let result = originalList;
        if (nextFilters.search) {
            result = result.filter(r => 
                r.fullNameRegister.toLowerCase().includes(nextFilters.search.toLowerCase())
            );
        }
        if (nextFilters.status) {
            result = result.filter(r => r.status === nextFilters.status);
        }
        if (nextFilters.bloodType) {
            result = result.filter(r => r.bloodGroup === nextFilters.bloodType);
        }
        if (nextFilters.type) {
            result = result.filter(r => r.type === nextFilters.type);
        }
        setFilteredList(result);
    }, [originalList]);

    useEffect(() => {
        applyFilters(filters);
    }, [originalList, filters, applyFilters]);

    // Handle filter changes
    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    // Modal handlers
    const handleEdit = useCallback((record) => {
        setEditingRecord(record);
        setNewStatus(record.status);
        setIsModalOpen(true);
    }, []);

    const handleModalOk = useCallback(async () => {
        if (editingRecord) {
            setLoading(true);
            try {
                // Map status text về số
                console.log("editingRecord", editingRecord);
                const importListRes = await GetAllBloodImportApplication();
                console.log("importListRes", importListRes);
                const importList = importListRes.data.bloodImports;
                console.log("importList", importList);
                const importObj = importList.find(item => item.bloodDonationApplicationId === editingRecord.registrationId && item.status === 0);
                console.log("importObj", importObj);
                if (!importObj) {
                    toast.error("Vui lòng tạo đơn nhập máu trước khi duyệt");
                    return;
                }
                const bloodImport = await GetBloodImportApplicationById(importObj.id);
                console.log("bloodImport", bloodImport);

                
                let statusNumber = 0;
                if (newStatus === 'Đã duyệt') statusNumber = 1;
                else if (newStatus === 'Từ chối') statusNumber = 2;
                await updateBloodDonationApplicationStatus({
                    id: editingRecord.registrationId,
                    status: statusNumber,
                    note: ''
                });

                
                const bloodImportSend = {
                    id: bloodImport.data.id,
                    status: statusNumber,
                    note: ""
                }
                console.log("bloodImportSend", bloodImportSend);
                const updateBloodImportStatus = await updateBloodImportApplication(bloodImportSend);
                console.log("updateBloodImportStatus", updateBloodImportStatus);
            
                // Cập nhật lại danh sách
                await fetchRegistrationList();
            } catch (e) {
                console.error('Lỗi cập nhật trạng thái:', e);
            } finally {
                setLoading(false);
                setIsModalOpen(false);
                setEditingRecord(null);
            }
        } else {
            setIsModalOpen(false);
            setEditingRecord(null);
        }
    }, [editingRecord, newStatus, fetchRegistrationList]);

    const handleModalCancel = useCallback(() => {
        setIsModalOpen(false);
        setEditingRecord(null);
    }, []);

    const handleDelete = useCallback((record) => {
        setOriginalList(prev => prev.filter(item => item !== record));
    }, []);

    // Modal handlers for blood info
    const handleEditBlood = useCallback((record) => {
        setEditingBloodRecord(record);
        setEditBloodType(record.bloodGroup || '');
        setEditQuantity(record.quantity || '');
        setEditBloodModalOpen(true);
    }, []);

    const handleBloodModalOk = useCallback(async () => {
        if (editingBloodRecord) {
            // Map blood type and transfer type to their indexes for API
            const bloodTypeIndex = bloodTypes.indexOf(editBloodType);
            const bloodTransferTypeIndex = bloodTransferTypes.indexOf(editingBloodRecord.type);
            try {
                setLoading(true);
                await updateBloodDonationApplicationInfo({
                    id: editingBloodRecord.registrationId,
                    bloodType: bloodTypeIndex,
                    bloodTransferType: bloodTransferTypeIndex,
                    quantity: Number(editQuantity)
                });
                toast.success('Cập nhật thành công!');
                await fetchRegistrationList();
            } catch (error) {
                toast.error('Cập nhật thất bại!');
            } finally {
                setLoading(false);
                setEditBloodModalOpen(false);
                setEditingBloodRecord(null);
            }
        } else {
            setEditBloodModalOpen(false);
            setEditingBloodRecord(null);
        }
    }, [editingBloodRecord, editBloodType, editQuantity, fetchRegistrationList]);

    const handleBloodModalCancel = useCallback(() => {
        setEditBloodModalOpen(false);
        setEditingBloodRecord(null);
    }, []);

    // Memoized table columns
    const columns = useMemo(() => [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: 70,
            render: (_, __, idx) => idx + 1,
        },
        {
            title: 'Họ tên',
            dataIndex: 'fullNameRegister',
            key: 'fullNameRegister',
            align: 'center',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthDate',
            key: 'birthDate',
            align: 'center',
            render: (birthDate) => birthDate ? dayjs(birthDate).format('DD/MM/YYYY') : '',
        },
        {
            title: 'Nhóm máu',
            dataIndex: 'bloodGroup',
            key: 'bloodGroup',
            align: 'center',
            render: (bloodType) => <span className="font-bold">{bloodType}</span>
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            align: 'center',
        },
        {
            title: 'Số lượng (ml)',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            render: (quantity) => quantity ? quantity : '',
        },
        {
            title: 'Thời gian',
            dataIndex: 'availableDate',
            key: 'availableDate',
            align: 'center',
            render: (_, record) => record.availableDate ? dayjs(record.availableDate).format('DD/MM/YYYY') : '',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => {
                let color;
                switch (status) {
                    case 'Đang Chờ': color = 'text-orange-500'; break;
                    case 'Chấp Nhận': color = 'text-green-500'; break;
                    case 'Từ Chối': color = 'text-red-500'; break;
                    default: color = 'text-blue-500';
                }
                return (
                    <span className={`font-bold ${color} border-2 rounded-md p-1`}>
                        {status}
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
                if (record.status === "Đang Chờ") {
                    return (
                        <span className="flex items-center justify-center gap-2">
                            <Tooltip title="Gửi máu vào kho">
                                <Button
                                    type="dashed"
                                    variant="dashed"
                                    color="danger"
                                    onClick={() => handleOpenBloodDropModal(record)}
                                    disabled={loading}
                                >
                                    <AuditOutlined />
                                </Button>
                            </Tooltip>
                            <Tooltip title="Sửa nhóm máu & số lượng">
                                <Button
                                    type="dashed"
                                    variant="dashed"
                                    color="orange"
                                    onClick={() => handleEditBlood(record)}
                                    disabled={loading}
                                >
                                    <EditOutlined rotate={90} />
                                </Button>
                            </Tooltip>
                        </span>
                    )
                }
            },
        },
    ], [handleEdit, handleEditBlood, handleDelete, loading]);

    return (
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold mb-10 text-center text-red-600">Thông tin hiến máu</h1>
            
            {/* Filters */}
            <div className="flex flex-shrink-0 mb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm"
                        className="w-[250px] pl-4 pr-10 py-2 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
                        value={filters.search}
                        onChange={e => handleFilterChange('search', e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') applyFilters(); }}
                        disabled={loading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <SearchOutlined />
                    </div>
                </div>
                <div className="ml-2">
                    <select
                        className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm disabled:bg-gray-100"
                        value={filters.status}
                        onChange={e => handleFilterChange('status', e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Tất cả trạng thái</option>
                        {statusList.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
                <div className="ml-2">
                    <select
                        className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm disabled:bg-gray-100"
                        value={filters.bloodType}
                        onChange={e => handleFilterChange('bloodType', e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Tất cả nhóm máu</option>
                        {bloodTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div className="ml-2">
                    <select
                        className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm disabled:bg-gray-100"
                        value={filters.type}
                        onChange={e => handleFilterChange('type', e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Tất cả loại</option>
                        {DONATION_TYPES.filter(type => type).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="relative">
                {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                        <Spin size="large" />
                    </div>
                )}
                <Table
                    className="rounded-2xl shadow-lg bg-white custom-ant-table"
                    dataSource={filteredList}
                    columns={columns}
                    rowKey={(record) => record.registrationId}
                    pagination={{
                        pageSize: 5,
                        position: ['bottomCenter'],
                        showSizeChanger: false,
                    }}
                    locale={{ emptyText: 'Không có dữ liệu' }}
                    loading={loading}
                />
            </div>

            {/* Modal */}
            <Modal
                title="Chỉnh sửa trạng thái"
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Lưu"
                cancelText="Huỷ"
                confirmLoading={loading}
            >
                <div className="mb-2">Chọn trạng thái mới:</div>
                <Select
                    className="w-full"
                    value={newStatus}
                    onChange={setNewStatus}
                    options={STATUS_OPTIONS.filter(opt => opt.value && opt.value !== 'Đang chờ')}
                    disabled={loading}
                />
            </Modal>

            {/* Modal chỉnh sửa nhóm máu & số lượng */}
            <Modal
                title="Chỉnh sửa nhóm máu & số lượng"
                open={editBloodModalOpen}
                onOk={handleBloodModalOk}
                onCancel={handleBloodModalCancel}
                okText="Lưu"
                cancelText="Huỷ"
                confirmLoading={loading}
            >
                <div className="mb-2">Chọn nhóm máu mới:</div>
                <Select
                    className="w-full mb-4"
                    value={editBloodType}
                    onChange={setEditBloodType}
                    options={BLOOD_TYPES.filter(type => type).map(type => ({ value: type, label: type }))}
                    disabled={loading}
                />
                <div className="mb-2">Nhập số lượng máu hiến (ml):</div>
                <input
                    type="number"
                    min={50}
                    max={500}
                    step={50}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                    value={editQuantity}
                    onChange={e => setEditQuantity(e.target.value)}
                    placeholder="Nhập số ml (tối đa 500ml)"
                    disabled={loading}
                />
            </Modal>

            {/* Modal gửi máu vào kho */}
            <Modal
                title="Thông tin Gửi Máu vào Kho"
                open={isBloodDropModalOpen}
                onCancel={() => setIsBloodDropModalOpen(false)}
                footer={null}
            >
                {bloodDropFormData && (
                    <form className="flex flex-col gap-6" onSubmit={handleBloodDropFormSubmit}>
                        {/* họ và tên */}
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={bloodDropFormData.fullName}
                                onChange={handleBloodDropFormChange}
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                                placeholder="Nhập họ và tên"
                                style={{ width: '100%' }}
                                disabled={true}
                            />
                        </div>
                        
                        {/* Nhóm máu và số lượng */}
                        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                            <div className="flex-1 flex flex-col">
                                <label className="font-semibold mb-1">Nhóm máu <span className="text-red-500">*</span></label>
                                <select
                                    name="bloodType"
                                    value={bloodDropFormData.bloodType}
                                    onChange={handleBloodDropFormChange}
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                                    style={{ width: '100%' }}
                                    disabled={true}
                                >
                                    <option value="">-- Chọn nhóm máu --</option>
                                    {bloodTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1 flex flex-col">
                                <label className="font-semibold mb-1">Số ml cần</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    min={0}
                                    step={50}
                                    value={bloodDropFormData.quantity}
                                    onChange={handleBloodDropFormChange}
                                    className="w-full text-center border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                                    style={{ width: '100%' }}
                                    disabled={true}
                                />
                            </div>
                        </div>
                        {/* Ngày bỏ máu vào kho */}
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Ngày bỏ máu vào kho <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                name="needDate"
                                value={bloodDropFormData.needDate}
                                onChange={handleBloodDropFormChange}
                                required
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                                min={dayjs().format("YYYY-MM-DD")}
                                style={{ width: '100%' }}
                                disabled={true}
                            />
                        </div>
                        {/* Loại và số điện thoại trên cùng một dòng */}
                        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                            <div className="flex-1 flex flex-col">
                                <label className="font-semibold mb-1">Loại <span className="text-red-500">*</span></label>
                                <select
                                    name="type"
                                    required
                                    value={bloodDropFormData.type}
                                    onChange={e => setBloodDropFormData(prev => ({ ...prev, type: Number(e.target.value) }))}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                                    style={{ width: '100%' }}
                                    disabled={true}
                                >
                                    <option value="">-- Chọn loại --</option>
                                    {bloodTransferTypes.map(value => (
                                      <option key={value} value={value}>{value}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1 flex flex-col">
                                <label className="font-semibold mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={bloodDropFormData.phone}
                                    onChange={handleBloodDropFormChange}
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                                    placeholder="VD: 0901234567"
                                    style={{ width: '100%' }}
                                    disabled={true}
                                />
                            </div>
                        </div>
                        {/* Ghi chú */}
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Ghi chú</label>
                            <textarea
                                name="note"
                                value={bloodDropFormData.note}
                                onChange={handleBloodDropFormChange}
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                                placeholder="Nhập ghi chú (nếu có)"
                                style={{ width: '100%' }}
                            />
                        </div>
                        {/* Nút gửi */}
                        <button
                            type="submit"
                            className={`w-full p-3 text-white rounded-lg font-bold shadow-md transition-all duration-300 ease-in-out mt-2
                              bg-gradient-to-r from-[#b30000] to-[#ff4d4d] hover:scale-105 hover:shadow-lg`}
                        >
                            Gửi yêu cầu
                        </button>
                    </form>
                )}
            </Modal>
        </div>
    );
}

export default RequesterDonorPage;