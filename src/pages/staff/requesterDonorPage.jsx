import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Button, Tooltip, Modal, Select, Spin } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, AuditOutlined, ReadOutlined } from '@ant-design/icons';
import { getAllBloodDonationApplication, updateBloodDonationApplicationStatus, updateBloodDonationApplicationInfo } from '../../services/donorRegistration';
import dayjs from 'dayjs';
// Thêm import Modal, Input cho form
import { Input, Form } from 'antd';
import { CreateBloodImportApplication, GetAllBloodImportApplication, GetBloodImportApplicationById, updateBloodImportApplication } from '../../services/bloodImport';
import { toast } from 'react-toastify';

// Constants
const BLOOD_TYPES = ['', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Chưa biết'];
const bloodTypes = [
  'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'Chưa biết'
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

const CLASSIFY_OPTIONS = [
    { value: 'Tất cả', label: 'Tất cả' },
    { value: true, label: 'Sự kiện' },
    { value: false, label: 'Thường' },
]

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
        isEvent: 'Tất cả'
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [newStatus, setNewStatus] = useState('pending');
    const [editBloodModalOpen, setEditBloodModalOpen] = useState(false);
    const [editingBloodRecord, setEditingBloodRecord] = useState(null);
    const [editQuantity, setEditQuantity] = useState('');
    const [editBloodType, setEditBloodType] = useState('');
    // State cho modal gửi máu vào kho
    const [isBloodDropModalOpen, setIsBloodDropModalOpen] = useState(false);
    const [bloodDropFormData, setBloodDropFormData] = useState(null);
    
    // State cho modal mới
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [newModalData, setNewModalData] = useState(null);
    const [error, setError] = useState("");

    // State cho modal kiểm tra sức khỏe
    const [isHealthCheckModalOpen, setIsHealthCheckModalOpen] = useState(false);
    const [healthCheckData, setHealthCheckData] = useState(null);
    const [healthCheckError, setHealthCheckError] = useState("");

    // State cho modal ghi chú
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [noteData, setNoteData] = useState("");

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
        setError("");
        setIsBloodDropModalOpen(true);
    };

    // Hàm xử lý thay đổi form gửi máu vào kho
    const handleBloodDropFormChange = (e) => {
        const { name, value } = e.target;
        
        // Prevent negative values for quantity field
        if (name === 'quantity') {
            const numValue = parseFloat(value);
            if (value !== '' && (isNaN(numValue) || numValue < 0)) {
                return; // Don't update if negative or invalid
            }
        }
        
        setBloodDropFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Hàm submit form gửi máu vào kho
    const handleBloodDropFormSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate required fields
        if (!bloodDropFormData.fullName?.trim()) {
            setError("Vui lòng nhập họ và tên!");
            return;
        }

        if (!bloodDropFormData.bloodType) {
            setError("Vui lòng chọn nhóm máu!");
            return;
        }

        if (!bloodDropFormData.quantity || bloodDropFormData.quantity <= 0) {
            setError("Vui lòng nhập số lượng máu hợp lệ!");
            return;
        }

        if (!bloodDropFormData.needDate) {
            setError("Vui lòng chọn ngày bỏ máu vào kho!");
            return;
        }

        if (!bloodDropFormData.type) {
            setError("Vui lòng chọn loại máu!");
            return;
        }

        if (!bloodDropFormData.phone?.trim()) {
            setError("Vui lòng nhập số điện thoại!");
            return;
        }

        // Validate phone number format
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(bloodDropFormData.phone.replace(/\s/g, ''))) {
            setError("Số điện thoại phải có 10-11 chữ số!");
            return;
        }

        try {
            console.log("bloodDropFormData:", bloodDropFormData);
            const createBloodImportRes = await CreateBloodImportApplication(bloodDropFormData);
            console.log("createBloodImportRes:", createBloodImportRes);

            if (createBloodImportRes.code === 201) {
                toast.success("Tạo đơn thành công!");
                setIsBloodDropModalOpen(false);
                await fetchRegistrationList();
            } else {
                toast.error("Tạo đơn không thành công. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error('Lỗi tạo đơn nhập máu:', error);
            toast.error("Tạo đơn không thành công. Vui lòng thử lại.");
        }
    };

    // Hàm mở modal mới
    const handleOpenNewModal = (record) => {
        setNewModalData({
            registrationId: record.registrationId,
            fullName: record.fullNameRegister || "",
            bloodType: record.bloodGroup || "",
            status: record.status || "",
            newStatus: record.status || "",
            note: ""
        });
        setError("");
        setIsNewModalOpen(true);
    };

    // Hàm submit form modal mới
    const handleNewModalFormSubmit = async () => {
        setError("");

        if (!newModalData.newStatus) {
            setError("Vui lòng chọn trạng thái mới!");
            return;
        }

        // Validate note when status is "Từ Chối"
        if (newModalData.newStatus === 'Từ Chối' && !newModalData.note?.trim()) {
            setError("Vui lòng nhập lý do từ chối!");
            return;
        }

        try {
            setLoading(true);
            
            // Map status text về số
            let statusNumber = 0;
            if (newModalData.newStatus === 'Chấp Nhận') statusNumber = 1;
            else if (newModalData.newStatus === 'Từ Chối') statusNumber = 2;

            // Cập nhật trạng thái đơn hiến máu
            await updateBloodDonationApplicationStatus({
                id: newModalData.registrationId,
                status: statusNumber,
                note: newModalData.note || ''
            });

            toast.success("Cập nhật trạng thái thành công!");
            setIsNewModalOpen(false);
            await fetchRegistrationList();
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
            toast.error("Cập nhật trạng thái thất bại!");
        } finally {
            setLoading(false);
        }
    };

    // Hàm mở modal kiểm tra sức khỏe
    const handleOpenHealthCheckModal = (record) => {
        setHealthCheckData({
            registrationId: record.registrationId,
            fullName: record.fullNameRegister || "",
            bloodType: record.bloodGroup || "",
            phone: record.phone || "",
            healthCheckResult: "",
            bloodPressure: "",
            heartRate: "",
            temperature: "",
            hemoglobin: "",
            weight: "",
            height: "",
            note: ""
        });
        setHealthCheckError("");
        setIsHealthCheckModalOpen(true);
    };

    // Hàm xử lý thay đổi giá trị trong form
    const handleHealthCheckChange = (field, value) => {
        // Prevent negative values for numeric fields
        if (['heartRate', 'temperature', 'hemoglobin', 'weight', 'height'].includes(field)) {
            const numValue = parseFloat(value);
            if (value !== '' && (isNaN(numValue) || numValue < 0)) {
                return; // Don't update if negative or invalid
            }
        }
        
        setHealthCheckData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (healthCheckError) {
            setHealthCheckError("");
        }
    };

    // Hàm mở modal ghi chú
    const handleOpenNoteModal = useCallback((record) => {
        const note = record.note || "";
        setNoteData(note);
        setIsNoteModalOpen(true);
    }, []);

    const handleNoteModalCancel = useCallback(() => {
        setIsNoteModalOpen(false);
        setNoteData("");
    }, []);

    // Hàm submit form kiểm tra sức khỏe
    const handleHealthCheckFormSubmit = async () => {
        setHealthCheckError("");

        // Kiểm tra kết quả kiểm tra sức khỏe (bắt buộc)
        if (!healthCheckData.healthCheckResult) {
            setHealthCheckError("Vui lòng chọn kết quả kiểm tra sức khỏe!");
            return;
        }

        // Kiểm tra huyết áp (bắt buộc)
        if (!healthCheckData.bloodPressure?.trim()) {
            setHealthCheckError("Vui lòng nhập huyết áp!");
            return;
        }

        if (!/^\d{2,3}\/\d{2,3}$/.test(healthCheckData.bloodPressure)) {
            setHealthCheckError("Huyết áp phải có định dạng: số/số (VD: 120/80)");
            return;
        }

        // Kiểm tra nhịp tim (bắt buộc)
        if (!healthCheckData.heartRate?.trim()) {
            setHealthCheckError("Vui lòng nhập nhịp tim!");
            return;
        }

        const heartRate = parseInt(healthCheckData.heartRate);
        if (isNaN(heartRate) || heartRate < 40 || heartRate > 200) {
            setHealthCheckError("Nhịp tim phải từ 40-200 lần/phút");
            return;
        }

        // Kiểm tra nhiệt độ (bắt buộc)
        if (!healthCheckData.temperature?.trim()) {
            setHealthCheckError("Vui lòng nhập nhiệt độ!");
            return;
        }

        const temperature = parseFloat(healthCheckData.temperature);
        if (isNaN(temperature) || temperature < 35 || temperature > 42) {
            setHealthCheckError("Nhiệt độ phải từ 35-42°C");
            return;
        }

        // Kiểm tra hemoglobin (bắt buộc)
        if (!healthCheckData.hemoglobin?.trim()) {
            setHealthCheckError("Vui lòng nhập hemoglobin!");
            return;
        }

        const hemoglobin = parseFloat(healthCheckData.hemoglobin);
        if (isNaN(hemoglobin) || hemoglobin < 7 || hemoglobin > 20) {
            setHealthCheckError("Hemoglobin phải từ 7-20 g/dL");
            return;
        }

        // Kiểm tra cân nặng (bắt buộc)
        if (!healthCheckData.weight?.trim()) {
            setHealthCheckError("Vui lòng nhập cân nặng!");
            return;
        }

        const weight = parseFloat(healthCheckData.weight);
        if (isNaN(weight) || weight < 30 || weight > 200) {
            setHealthCheckError("Cân nặng phải từ 30-200 kg");
            return;
        }

        // Kiểm tra chiều cao (bắt buộc)
        if (!healthCheckData.height?.trim()) {
            setHealthCheckError("Vui lòng nhập chiều cao!");
            return;
        }

        const height = parseInt(healthCheckData.height);
        if (isNaN(height) || height < 100 || height > 250) {
            setHealthCheckError("Chiều cao phải từ 100-250 cm");
            return;
        }

        // Kiểm tra BMI nếu có cả cân nặng và chiều cao
        const bmi = weight / (height / 100 * height / 100);
        if (bmi < 18.5 || bmi > 35) {
            setHealthCheckError(`BMI phải từ 18.5-35 (Hiện tại: ${bmi.toFixed(1)})`);
            return;
        }

        try {
            setLoading(true);
            
            // Ở đây có thể thêm API call để lưu thông tin kiểm tra sức khỏe
            console.log("Health check data:", healthCheckData);
            
            toast.success("Lưu thông tin kiểm tra sức khỏe thành công!");
            setIsHealthCheckModalOpen(false);
            setHealthCheckError(""); // Clear error after successful save
        } catch (error) {
            console.error('Lỗi lưu thông tin kiểm tra sức khỏe:', error);
            toast.error("Lưu thông tin kiểm tra sức khỏe thất bại!");
        } finally {
            setLoading(false);
        }
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
                quantity: item.quantity || "",
                isEvent: !!item.eventId,
                note: item.note || ""
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
        if (nextFilters.isEvent !== 'Tất cả') {
            result = result.filter(r => r.isEvent === nextFilters.isEvent)
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
                toast.success("Cập nhật trạng thái thành công!");
            } catch (e) {
                console.error('Lỗi cập nhật trạng thái:', e);
                toast.error("Cập nhật trạng thái thất bại!");
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
        setEditQuantity(record.quantity || '');
        setEditBloodType(record.bloodGroup || '');
        setEditBloodModalOpen(true);
    }, []);

    const handleBloodModalOk = useCallback(async () => {
        if (editingBloodRecord) {
            // Validate quantity
            if (!editQuantity || editQuantity < 50 || editQuantity > 500) {
                toast.error('Số lượng máu phải từ 50-500ml!');
                return;
            }

            // Validate quantity is a number
            if (isNaN(Number(editQuantity))) {
                toast.error('Số lượng máu phải là số!');
                return;
            }

            // Validate blood type
            if (!editBloodType) {
                toast.error('Vui lòng chọn nhóm máu!');
                return;
            }

            // Map transfer type to its index for API
            const bloodTransferTypeIndex = bloodTransferTypes.indexOf(editingBloodRecord.type);
            try {
                setLoading(true);
                await updateBloodDonationApplicationInfo({
                    id: editingBloodRecord.registrationId,
                    bloodType: bloodTypes.indexOf(editBloodType),
                    bloodTransferType: bloodTransferTypeIndex,
                    quantity: Number(editQuantity)
                });
                toast.success('Cập nhật thành công!');
                await fetchRegistrationList();
            } catch (error) {
                console.error('Lỗi cập nhật thông tin máu:', error);
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
    }, [editingBloodRecord, editQuantity, editBloodType, fetchRegistrationList]);

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
            title: 'Phân loại',
            dataIndex: 'isEvent',
            key: 'isEvent',
            align: 'center',
            render: (isEvent) => {
                return (
                    <span className={`font-bold ${isEvent ? 'text-blue-500' : 'text-purple-500'} border-2 rounded-md p-1`}>
                        {isEvent ? 'Sự kiện' : 'Thường'}
                    </span>
                );
            }
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
                width: 280,
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
                                <Tooltip title="Thông tin máu">
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
                                <Tooltip title="Trạng thái">
                                    <Button
                                        type="dashed"
                                        variant="dashed"
                                        color="blue"
                                        onClick={() => handleOpenNewModal(record)}
                                        disabled={loading}
                                    >
                                        <AuditOutlined />
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Thông tin sức khỏe">
                                    <Button
                                        type="dashed"
                                        variant="dashed"
                                        color="purple"
                                        onClick={() => handleOpenHealthCheckModal(record)}
                                        disabled={loading}
                                    >
                                        <AuditOutlined />
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Ghi chú">
                                    <Button
                                        type="dashed"
                                        variant="dashed"
                                        color="cyan"
                                        onClick={() => handleOpenNoteModal(record)}
                                        disabled={loading}
                                    >
                                        <ReadOutlined />
                                    </Button>
                                </Tooltip>
                            </span>
                        )
                    }
                },
            },
    ], [handleEdit, handleEditBlood, handleDelete, loading, handleOpenNoteModal]);

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
                <div className="ml-2">
                    <select
                        className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm disabled:bg-gray-100"
                        value={filters.isEvent}
                        onChange={e => handleFilterChange('isEvent', e.target.value === 'true' ? true : e.target.value === 'false' ? false : 'Tất cả')}
                        disabled={loading}
                    >
                        {CLASSIFY_OPTIONS.map(opt => (
                            <option key={opt.label} value={opt.value}>{opt.label}</option>
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

            {/* Modal chỉnh sửa số lượng */}
            <Modal
                title="Chỉnh sửa thông tin máu"
                open={editBloodModalOpen}
                onOk={handleBloodModalOk}
                onCancel={handleBloodModalCancel}
                okText="Lưu"
                cancelText="Huỷ"
                confirmLoading={loading}
            >
                <div className="space-y-4">
                    {/* Blood Type Selection */}
                    <div>
                        <div className="mb-2">Chọn nhóm máu:</div>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                            value={editBloodType}
                            onChange={e => setEditBloodType(e.target.value)}
                            disabled={loading}
                        >
                            {bloodTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Quantity Input */}
                    <div>
                        <div className="mb-2">Nhập số lượng máu hiến (ml):</div>
                        <input
                            type="number"
                            min="50"
                            max="500"
                            step="50"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000]"
                            value={editQuantity}
                            onChange={e => setEditQuantity(e.target.value)}
                            placeholder="Nhập số ml (tối đa 500ml)"
                            disabled={loading}
                            onKeyDown={(e) => {
                                if (e.key === '-' || e.key === 'e') {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>
                </div>
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
                                 <label className="font-semibold mb-1">Số ml cần <span className="text-red-500">*</span></label>
                                 <input
                                     type="number"
                                     name="quantity"
                                     min="0"
                                     step={50}
                                     value={bloodDropFormData.quantity}
                                     onChange={handleBloodDropFormChange}
                                     className="w-full text-center border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#b30000] transition"
                                     style={{ width: '100%' }}
                                     disabled={true}
                                     onKeyDown={(e) => {
                                         if (e.key === '-' || e.key === 'e') {
                                             e.preventDefault();
                                         }
                                     }}
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
                                placeholder="Bệnh nền, tình trạng sức khỏe, thuốc đang sử dụng..."
                                style={{ width: '100%' }}
                            />
                        </div>

                        {/* Error display */}
                        {error && (
                            <div className="text-red-500 font-semibold text-center mt-2">{error}</div>
                        )}

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

            {/* Modal chỉnh sửa trạng thái */}
            <Modal
                title="Chỉnh sửa trạng thái"
                open={isNewModalOpen}
                onOk={handleNewModalFormSubmit}
                onCancel={() => setIsNewModalOpen(false)}
                okText="Lưu"
                cancelText="Huỷ"
                confirmLoading={loading}
            >
                <div className="mb-2">Chọn trạng thái mới:</div>
                <Select
                    className="w-full"
                    value={newModalData?.newStatus}
                    onChange={(value) => setNewModalData(prev => ({ ...prev, newStatus: value }))}
                    options={[
                        { value: 'Chấp Nhận', label: 'Chấp Nhận' },
                        { value: 'Từ Chối', label: 'Từ Chối' },
                    ]}
                    disabled={loading}
                />
                {newModalData?.newStatus === 'Từ Chối' && (
                    <div className="mt-4">
                        <label className="block font-semibold mb-1">Lý do từ chối:</label>
                        <Input.TextArea
                            value={newModalData?.note || ''}
                            onChange={e => setNewModalData(prev => ({ ...prev, note: e.target.value }))}
                            placeholder="Nhập lý do từ chối..."
                            rows={3}
                        />
                    </div>
                )}
                
                {error && (
                    <div className="text-red-500 font-semibold text-center mt-2">{error}</div>
                )}
            </Modal>

            {/* Modal kiểm tra sức khỏe */}
            <Modal
                title="Thông tin Kiểm Tra Sức Khỏe"
                open={isHealthCheckModalOpen}
                onOk={handleHealthCheckFormSubmit}
                onCancel={() => setIsHealthCheckModalOpen(false)}
                okText="Lưu"
                cancelText="Huỷ"
                confirmLoading={loading}
                width={600}
            >
                                 {healthCheckData && (
                     <div className="space-y-4">
                         {/* Thông tin cơ bản */}
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

                                                 {/* Các chỉ số sức khỏe */}
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
                                     onKeyDown={(e) => {
                                         if (e.key === '-' || e.key === 'e') {
                                             e.preventDefault();
                                         }
                                     }}
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
                                     onKeyDown={(e) => {
                                         if (e.key === '-' || e.key === 'e') {
                                             e.preventDefault();
                                         }
                                     }}
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
                                     onKeyDown={(e) => {
                                         if (e.key === '-' || e.key === 'e') {
                                             e.preventDefault();
                                         }
                                     }}
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
                                     onKeyDown={(e) => {
                                         if (e.key === '-' || e.key === 'e') {
                                             e.preventDefault();
                                         }
                                     }}
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
                                     onKeyDown={(e) => {
                                         if (e.key === '-' || e.key === 'e') {
                                             e.preventDefault();
                                         }
                                     }}
                                 />
                             </div>
                         </div>

                                                 {/* Kết quả kiểm tra */}
                         <div>
                             <label className="block font-semibold mb-1">Kết quả kiểm tra sức khỏe: <span className="text-red-500">*</span></label>
                             <Select
                                 className="w-full"
                                 value={healthCheckData.healthCheckResult}
                                 onChange={(value) => handleHealthCheckChange('healthCheckResult', value)}
                                 options={[
                                     { value: 'Đạt', label: 'Đạt - Có thể hiến máu' },
                                     { value: 'Không đạt', label: 'Không đạt - Không thể hiến máu' },
                                     { value: 'Cần kiểm tra thêm', label: 'Cần kiểm tra thêm' },
                                 ]}
                                 disabled={loading}
                             />
                         </div>

                         {/* Hiển thị BMI nếu có cả cân nặng và chiều cao */}
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

                                                                          {/* Ghi chú */}
                         <div>
                             <label className="block font-semibold mb-1">Ghi chú:</label>
                             <Input.TextArea
                                 value={healthCheckData.note || ''}
                                 onChange={e => handleHealthCheckChange('note', e.target.value)}
                                 placeholder="Nhập ghi chú về tình trạng sức khỏe..."
                                 rows={3}
                             />
                         </div>

                         {/* Error display */}
                         {healthCheckError && (
                             <div className="text-red-500 font-semibold text-center mt-2">{healthCheckError}</div>
                         )}
                     </div>
                 )}
             </Modal>

            {/* Modal ghi chú */}
            <Modal
                title="Ghi chú"
                open={isNoteModalOpen}
                onCancel={handleNoteModalCancel}
                footer={[
                    <Button key="close" onClick={handleNoteModalCancel}>
                        Đóng
                    </Button>
                ]}
            >
                <div className="p-4">
                    {noteData?.trim() ? (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-800 whitespace-pre-wrap">{noteData}</p>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 italic">
                            Không có ghi chú
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}

export default RequesterDonorPage;