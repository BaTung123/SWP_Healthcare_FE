import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Button, Tooltip, Modal, Select, Spin } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { GetAllDonorRegistration } from '../../services/donorRegistration';
import dayjs from 'dayjs';

// Constants
const BLOOD_TYPES = ['', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const DONATION_TYPES = ['', 'Toàn Phần', 'Tiểu Cầu', 'Huyết Tương'];
const STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'pending', label: 'Đang chờ' },
    { value: 'resolved', label: 'Đã duyệt' },
    { value: 'reject', label: 'Từ chối' },
];

// Mock data
const MOCK_DATA = [
    {
        registrationId: 1,
        fullNameRegister: "Nguyễn Văn An",
        birthDate: "1995-04-12",
        bloodGroup: "A+",
        type: "Toàn Phần",
        availableDate: "2024-01-15",
        phone: "0987654321",
        status: "pending"
    },
    {
        registrationId: 2,
        fullNameRegister: "Trần Thị Bình",
        birthDate: "1992-09-23",
        bloodGroup: "O+",
        type: "Tiểu Cầu",
        availableDate: "2024-01-20",
        phone: "0123456789",
        status: "resolved"
    },
    {
        registrationId: 3,
        fullNameRegister: "Lê Văn Cường",
        birthDate: "1988-12-05",
        bloodGroup: "B+",
        type: "Huyết Tương",
        availableDate: "2024-01-18",
        phone: "0369852147",
        status: "pending"
    },
    {
        registrationId: 4,
        fullNameRegister: "Phạm Thị Dung",
        birthDate: "1990-07-30",
        bloodGroup: "AB+",
        type: "Toàn Phần",
        availableDate: "2024-01-22",
        phone: "0587412369",
        status: "reject"
    },
    {
        registrationId: 5,
        fullNameRegister: "Hoàng Văn Em",
        birthDate: "1993-11-11",
        bloodGroup: "A-",
        type: "Tiểu Cầu",
        availableDate: "2024-01-25",
        phone: "0741258963",
        status: "resolved"
    },
    {
        registrationId: 6,
        fullNameRegister: "Vũ Thị Phương",
        birthDate: "1997-03-18",
        bloodGroup: "O-",
        type: "Huyết Tương",
        availableDate: "2024-01-28",
        phone: "0963258741",
        status: "pending"
    },
    {
        registrationId: 7,
        fullNameRegister: "Đỗ Văn Giang",
        birthDate: "1985-09-09",
        bloodGroup: "B-",
        type: "Toàn Phần",
        availableDate: "2024-01-30",
        phone: "0321654987",
        status: "resolved"
    },
    {
        registrationId: 8,
        fullNameRegister: "Ngô Thị Hoa",
        birthDate: "1991-05-22",
        bloodGroup: "AB-",
        type: "Tiểu Cầu",
        availableDate: "2024-02-01",
        phone: "0789456123",
        status: "pending"
    }
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

    // Fetch registration list
    const fetchRegistrationList = useCallback(async () => {
        try {
            setLoading(true);
            const res = await GetAllDonorRegistration();
            
            if (res && res.length > 0) {
                setOriginalList(res);
                setFilteredList(res);
                console.log("list registration:", res);
            } else {
                setOriginalList(MOCK_DATA);
                setFilteredList(MOCK_DATA);
                console.log("Using mock data:", MOCK_DATA);
            }
        } catch (error) {
            console.error("Error fetching registration list:", error);
            // Fallback to mock data if API fails
            setOriginalList(MOCK_DATA.slice(0, 3));
            setFilteredList(MOCK_DATA.slice(0, 3));
            console.log("Using fallback mock data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRegistrationList();
    }, [fetchRegistrationList]);

    // Optimized filter function
    const applyFilters = useCallback((nextFilters = filters) => {
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
    }, [originalList, filters]);

    // Handle filter changes
    const handleFilterChange = useCallback((key, value) => {
        const nextFilters = { ...filters, [key]: value };
        setFilters(nextFilters);
        applyFilters(nextFilters);
    }, [filters, applyFilters]);

    // Modal handlers
    const handleEdit = useCallback((record) => {
        setEditingRecord(record);
        setNewStatus(record.status);
        setIsModalOpen(true);
    }, []);

    const handleModalOk = useCallback(() => {
        if (editingRecord) {
            setFilteredList(prev => prev.map(item =>
                item === editingRecord ? { ...item, status: newStatus } : item
            ));
            setOriginalList(prev => prev.map(item =>
                item === editingRecord ? { ...item, status: newStatus } : item
            ));
        }
        setIsModalOpen(false);
        setEditingRecord(null);
    }, [editingRecord, newStatus]);

    const handleModalCancel = useCallback(() => {
        setIsModalOpen(false);
        setEditingRecord(null);
    }, []);

    const handleDelete = useCallback((record) => {
        setFilteredList(prev => prev.filter(item => item !== record));
        setOriginalList(prev => prev.filter(item => item !== record));
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
            title: 'Thời gian',
            key: 'availableTime',
            align: 'center',
            render: (_, record) => record.availableDate ? dayjs(record.availableDate).format('DD/MM/YYYY') : '',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: 200,
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
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
                </span>
            ),
        },
    ], [handleEdit, handleDelete, loading]);

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
                    options={STATUS_OPTIONS.filter(opt => opt.value)}
                    disabled={loading}
                />
            </Modal>
        </div>
    );
}

export default RequesterDonorPage;