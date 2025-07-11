import React, { useEffect, useState } from 'react';
import { Table, Button, Tooltip, Modal, Select } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { GetAllDonorRegistration } from '../../services/donorRegistration';
import dayjs from 'dayjs';


const bloodTypes = ['', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const donationTypes = ['', 'Toàn Phần', 'Tiểu Cầu', 'Huyết Tương'];
const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'pending', label: 'Đang chờ' },
    { value: 'resolved', label: 'Đã duyệt' },
    { value: 'reject', label: 'Từ chối' },
];

const RequesterDonorPage = () => {
    const [originalList, setOriginalList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        bloodType: '',
        type: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [newStatus, setNewStatus] = useState('pending');

    useEffect(() => {
        fetchRegistrationList();
    }, [])

    const fetchRegistrationList = async () => {
        try {
            const res = await GetAllDonorRegistration()
            if (res && res.length > 0) {
                setOriginalList(res)
                setFilteredList(res)
                console.log("list registration:", res)
            } else {
                // Mock data khi API không trả về dữ liệu
                const mockData = [
                    {
                        registrationId: 1,
                        fullNameRegister: "Nguyễn Văn An",
                        bloodGroup: "A+",
                        type: "Toàn Phần",
                        availableFromDate: "2024-01-15",
                        availableToDate: "2024-01-15",
                        phone: "0987654321",
                        status: "pending"
                    },
                    {
                        registrationId: 2,
                        fullNameRegister: "Trần Thị Bình",
                        bloodGroup: "O+",
                        type: "Tiểu Cầu",
                        availableFromDate: "2024-01-20",
                        availableToDate: "2024-01-25",
                        phone: "0123456789",
                        status: "resolved"
                    },
                    {
                        registrationId: 3,
                        fullNameRegister: "Lê Văn Cường",
                        bloodGroup: "B+",
                        type: "Huyết Tương",
                        availableFromDate: "2024-01-18",
                        availableToDate: "2024-01-18",
                        phone: "0369852147",
                        status: "pending"
                    },
                    {
                        registrationId: 4,
                        fullNameRegister: "Phạm Thị Dung",
                        bloodGroup: "AB+",
                        type: "Toàn Phần",
                        availableFromDate: "2024-01-22",
                        availableToDate: "2024-01-22",
                        phone: "0587412369",
                        status: "reject"
                    },
                    {
                        registrationId: 5,
                        fullNameRegister: "Hoàng Văn Em",
                        bloodGroup: "A-",
                        type: "Tiểu Cầu",
                        availableFromDate: "2024-01-25",
                        availableToDate: "2024-01-30",
                        phone: "0741258963",
                        status: "resolved"
                    },
                    {
                        registrationId: 6,
                        fullNameRegister: "Vũ Thị Phương",
                        bloodGroup: "O-",
                        type: "Huyết Tương",
                        availableFromDate: "2024-01-28",
                        availableToDate: "2024-01-28",
                        phone: "0963258741",
                        status: "pending"
                    },
                    {
                        registrationId: 7,
                        fullNameRegister: "Đỗ Văn Giang",
                        bloodGroup: "B-",
                        type: "Toàn Phần",
                        availableFromDate: "2024-01-30",
                        availableToDate: "2024-02-05",
                        phone: "0321654987",
                        status: "resolved"
                    },
                    {
                        registrationId: 8,
                        fullNameRegister: "Ngô Thị Hoa",
                        bloodGroup: "AB-",
                        type: "Tiểu Cầu",
                        availableFromDate: "2024-02-01",
                        availableToDate: "2024-02-01",
                        phone: "0789456123",
                        status: "pending"
                    }
                ];
                setOriginalList(mockData)
                setFilteredList(mockData)
                console.log("Using mock data:", mockData)
            }
        } catch (error) {
            console.error("Error fetching registration list:", error)
            // Fallback to mock data if API fails
            const mockData = [
                {
                    registrationId: 1,
                    fullNameRegister: "Nguyễn Văn An",
                    bloodGroup: "A+",
                    type: "Toàn Phần",
                    availableFromDate: "2024-01-15",
                    availableToDate: "2024-01-15",
                    phone: "0987654321",
                    status: "pending"
                },
                {
                    registrationId: 2,
                    fullNameRegister: "Trần Thị Bình",
                    bloodGroup: "O+",
                    type: "Tiểu Cầu",
                    availableFromDate: "2024-01-20",
                    availableToDate: "2024-01-25",
                    phone: "0123456789",
                    status: "resolved"
                },
                {
                    registrationId: 3,
                    fullNameRegister: "Lê Văn Cường",
                    bloodGroup: "B+",
                    type: "Huyết Tương",
                    availableFromDate: "2024-01-18",
                    availableToDate: "2024-01-18",
                    phone: "0369852147",
                    status: "pending"
                }
            ];
            setOriginalList(mockData)
            setFilteredList(mockData)
            console.log("Using fallback mock data:", mockData)
        }
    }

    // Tối ưu filter: gom tất cả filter vào 1 hàm
    const applyFilters = (nextFilters = filters) => {
        let result = originalList;
        if (nextFilters.search) {
            result = result.filter(r => r.fullNameRegister.toLowerCase().includes(nextFilters.search.toLowerCase()));
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
    };

    // Cập nhật filter và lọc lại
    const handleFilterChange = (key, value) => {
        const nextFilters = { ...filters, [key]: value };
        setFilters(nextFilters);
        applyFilters(nextFilters);
    };

    // Modal & thao tác
    const handleEdit = (record) => {
        setEditingRecord(record);
        setNewStatus(record.status);
        setIsModalOpen(true);
    };
    const handleModalOk = () => {
        if (editingRecord) {
            setFilteredList(prev => prev.map(item =>
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
        setFilteredList(prev => prev.filter(item => item !== record));
    };

    // Table columns
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
            dataIndex: 'fullNameRegister',
            key: 'fullNameRegister',
            align: 'center',
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
            render: (record) => {
                if (record.availableFromDate === record.availableToDate) {
                    return dayjs(record.availableFromDate).format('DD/MM/YYYY')
                } else {
                    return `${dayjs(record.availableFromDate).format('DD/MM/YYYY')} - ${dayjs(record.availableToDate).format('DD/MM/YYYY')}`;
                }
            }
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
            <h1 className="text-2xl font-bold mb-10 text-center text-red-600">Thông tin hiến máu</h1>
            <div className="flex flex-shrink-0 mb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm"
                        className="w-[250px] pl-4 pr-10 py-2 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
                        value={filters.search}
                        onChange={e => handleFilterChange('search', e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') applyFilters(); }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <SearchOutlined />
                    </div>
                </div>
                <div className="ml-2">
                    <select
                        className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                        value={filters.status}
                        onChange={e => handleFilterChange('status', e.target.value)}
                    >
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="ml-2">
                    <select
                        className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                        value={filters.bloodType}
                        onChange={e => handleFilterChange('bloodType', e.target.value)}
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
                        value={filters.type}
                        onChange={e => handleFilterChange('type', e.target.value)}
                    >
                        <option value="">Tất cả loại</option>
                        {donationTypes.filter(type => type).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>
            <Table
                className="rounded-2xl shadow-lg bg-white custom-ant-table"
                dataSource={filteredList}
                columns={columns}
                rowKey={(record, idx) => idx}
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
                    onChange={setNewStatus}
                    options={statusOptions.filter(opt => opt.value)}
                />
            </Modal>
        </div>
    );
}

export default RequesterDonorPage;