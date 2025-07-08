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
        const res = await GetAllDonorRegistration()
        setOriginalList(res)
        setFilteredList(res)
        console.log("list registration:", res)
    }

    // Tối ưu filter: gom tất cả filter vào 1 hàm
    const applyFilters = (nextFilters = filters) => {
        let result = originalList;
        if (nextFilters.search) {
            result = result.filter(r => r.name.toLowerCase().includes(nextFilters.search.toLowerCase()));
        }
        if (nextFilters.status) {
            result = result.filter(r => r.status === nextFilters.status);
        }
        if (nextFilters.bloodType) {
            result = result.filter(r => r.bloodType === nextFilters.bloodType);
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
            title: 'Thời gian sẵn sàng',
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
            title: 'Địa điểm',
            dataIndex: 'location',
            key: 'location',
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