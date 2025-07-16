import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Button, Tooltip, Modal, Select, Spin } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, AuditOutlined } from '@ant-design/icons';
import { getAllBloodDonationApplication, updateBloodDonationApplicationStatus } from '../../services/donorRegistration';
import dayjs from 'dayjs';
// Thêm import Modal, Input cho form
import { Input, Form } from 'antd';

// Constants
const BLOOD_TYPES = ['', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const DONATION_TYPES = ['', 'Toàn Phần', 'Tiểu Cầu', 'Huyết Tương'];
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
            fullName: record.fullNameRegister || "",
            birthDate: record.birthDate || "",
            gender: "", // Nếu có thì truyền vào
            bloodType: record.bloodGroup || "",
            quantity: record.quantity || 0,
            hospital: "",
            phone: record.phone || "",
            type: record.type || "",
            needDate: dayjs().format("YYYY-MM-DD"),
            note: "",
        });
        setIsBloodDropModalOpen(true);
    };

    // Hàm xử lý thay đổi form gửi máu vào kho
    const handleBloodDropFormChange = (e) => {
        const { name, value } = e.target;
        setBloodDropFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Hàm submit form gửi máu vào kho
    const handleBloodDropFormSubmit = (e) => {
        e.preventDefault();
        // Xử lý gửi dữ liệu tại đây
        console.log("Submitted blood drop form data:", bloodDropFormData);
        setIsBloodDropModalOpen(false);
    };

    // Fetch registration list
    const fetchRegistrationList = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getAllBloodDonationApplication();
            // Map API data sang format bảng
            const mapped = (res || []).map((item, idx) => ({
                registrationId: item.id || idx,
                fullNameRegister: item.fullName || "",
                birthDate: item.dob ? dayjs(item.dob).format('DD/MM/YYYY') : "",
                bloodGroup: (typeof item.bloodType === 'number') ? ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][item.bloodType] : '',
                type: (typeof item.bloodTransferType === 'number') ? ['Toàn Phần', 'Tiểu Cầu', 'Huyết Tương'][item.bloodTransferType] : '',
                availableDate: item.donationEndDate ? (dayjs(item.donationEndDate).isValid() ? dayjs(item.donationEndDate).format('DD/MM/YYYY') : "") : '',
                phone: item.phoneNumber || "",
                status: typeof item.status === 'number' ? (item.status === 0 ? 'Đang chờ' : item.status === 1 ? 'Đã duyệt' : 'Từ chối') : 'Đang chờ',
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
                let statusNumber = 0;
                if (newStatus === 'Đã duyệt') statusNumber = 1;
                else if (newStatus === 'Từ chối') statusNumber = 2;
                await updateBloodDonationApplicationStatus({
                    id: editingRecord.registrationId,
                    status: statusNumber,
                    note: ''
                });
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

    const handleBloodModalOk = useCallback(() => {
        if (editingBloodRecord) {
            setOriginalList(prev => prev.map(item =>
                item === editingBloodRecord ? { ...item, bloodGroup: editBloodType, quantity: editQuantity } : item
            ));
        }
        setEditBloodModalOpen(false);
        setEditingBloodRecord(null);
    }, [editingBloodRecord, editBloodType, editQuantity]);

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
            key: 'availableTime',
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
                    case 'Đang chờ': color = 'text-orange-500'; break;
                    case 'Đã duyệt': color = 'text-green-500'; break;
                    default: color = 'text-red-500';
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
            render: (_, record) => (
                <span className="flex items-center justify-center gap-2">
                    {/* Sửa trạng thái */}
                    <Tooltip title="Sửa trạng thái">
                        <Button 
                            type="dashed" 
                            variant="dashed" 
                            color="cyan" 
                            onClick={() => handleEdit(record)}
                            disabled={loading}
                        >
                            <EditOutlined />
                        </Button>
                    </Tooltip>
                    {/* Sửa nhóm máu & số lượng */}
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
                    {/* Gửi máu vào kho */}
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
                </span>
            ),
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
                        {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
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
                        {BLOOD_TYPES.filter(type => type).map(type => (
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
                            />
                        </div>
                        {/* ngày sinh và giới tính */}
                        {/**
                        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                            <div className="flex-1 flex flex-col">
                                <label className="font-semibold mb-1">Ngày sinh</label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={bloodDropFormData.birthDate}
                                    onChange={handleBloodDropFormChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div className="flex-1 flex flex-col">
                                <label className="font-semibold mb-1">Giới tính</label>
                                <select
                                    name="gender"
                                    value={bloodDropFormData.gender}
                                    onChange={handleBloodDropFormChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                                    style={{ width: '100%' }}
                                >
                                    <option value="">-- Chọn giới tính --</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                        </div>
                        */}
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
                                >
                                    <option value="">-- Chọn nhóm máu --</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
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
                                >
                                    <option value="">-- Chọn loại --</option>
                                    {DONATION_TYPE_OPTIONS.map(opt => (
                                      <option key={opt.value} value={opt.value}>{opt.label}</option>
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