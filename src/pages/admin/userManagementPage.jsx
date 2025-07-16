//Quản lý tài khoản người dùng (Member, Staff).
import { useState, useEffect } from 'react';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import { Space, Table, Tooltip, Switch, Modal, Button, message } from 'antd';
import { instance } from '../../services/instance';
// import axios from 'axios';
import { toast } from 'react-toastify';

const UserManagementPage = () => {
  const [originalList, setOriginalList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  // Refactor fetchUsers to be callable from anywhere
  const fetchUsers = async () => {
    try {
      const res = await instance.get('/Authentication');
      let users = res.data?.data?.users || [];
      users = users.filter(user => user.role !== 'Admin'); // Ẩn admin
      setOriginalList(users);
      setUserList(users);
    } catch (err) {
      console.error('Không thể lấy danh sách người dùng:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Tối ưu filter/search
  const filterUsers = (search = searchText, role = filterRole, status = filterStatus) => {
    let result = originalList;
    if (search) {
      result = result.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (role) {
      result = result.filter(user => user.role === role);
    }
    if (status) {
      result = result.filter(user => user.status === status);
    }
    setUserList(result);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    filterUsers(value, filterRole, filterStatus);
  };

  const handleRoleFilter = (value) => {
    setFilterRole(value);
    filterUsers(searchText, value, filterStatus);
  };

  const handleStatusFilter = (value) => {
    setFilterStatus(value);
    filterUsers(searchText, filterRole, value);
  };

//   useEffect(()=>{
//     getUserListFromApi()
// // chạy 1 lần duy nhất
//   },[filterRole, filterStatus]) // dependency

//   // Hàm lấy danh sách người dùng từ API sử dụng axios
//   const getUserListFromApi = async () => {
//     try {
//       const response = await axios.get('/api/users?role=user'); // Đổi endpoint phù hợp với backend của bạn
//       setUserList(response.data);
//     } catch (error) {
//       console.error('Không thể lấy danh sách người dùng:', error);
//       // Có thể hiển thị thông báo lỗi cho người dùng ở đây nếu cần
//     }
//   };

  const handleToggleStatus = async (record) => {
    const newStatus = record.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await instance.put('/Authentication/status', {
        id: record.id,
        isBanned: newStatus === 'Inactive'
      });
      setUserList(userList.map(user => 
        user.id === record.id ? { ...user, status: newStatus } : user
      ));
      if (newStatus === 'Active') {
        toast.success('Đã chuyển sang trạng thái hoạt động!');
      } else {
        toast.error('Đã chuyển sang trạng thái ngưng hoạt động!');
      }
    } catch (err) {
      toast.error('Cập nhật trạng thái thất bại!');
    }
  };

  // Ánh xạ role string sang số cho API
  const roleStringToNumber = (role) => {
    switch (role) {
      case 'Customer': return 1;
      case 'Staff': return 2;
      case 'StorageManager': return 3;
      default: return 0;
    }
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
      dataIndex: 'name',
      key: 'id',
      width: 250,
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'id',
      width: 200,
      align: 'center',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'id',
      width: 200,
      align: 'center',
      render: (role) => {
        switch (role) {
          case 'Admin': return 'Quản trị viên';
          case 'Staff': return 'Nhân viên';
          case 'StorageManager': return 'Thủ kho';
          case 'Customer': return 'Khách hàng';
          default: return role;
        }
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'id',
      width: 250,
      align: 'center',
      render: (status) => {
        let color;
        let text;
        switch (status) {
          case 'Active': color = 'text-green-500'; text = 'Đang hoạt động'; break;
          default: color = 'text-red-500'; text = 'Ngưng hoạt động';
        }
        return (
          <span className={`font-bold ${color} border-2 rounded-md p-1`} >
            {text}
          </span>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={record.status === 'Active' ? 'Chuyển sang ngưng hoạt động' : 'Chuyển sang hoạt động'}>
            <Switch
              checked={record.status === 'Active'}
              onChange={() => handleToggleStatus(record)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              type="dashed"
              variant="dashed"
              color="cyan"
              onClick={() => showRoleModal(record)}
            >
              <EditOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const showRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsModalOpen(true);
  };

  const handleRoleChange = (e) => {
    setNewRole(e.target.value);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    try {
      await instance.put('/Authentication/role', {
        id: selectedUser.id,
        role: roleStringToNumber(newRole)
      });
      setIsModalOpen(false);
      // Reload lại danh sách user
      fetchUsers();
      setTimeout(() => {
        toast.success('Cập nhật vai trò thành công!');
      }, 300);
    } catch (error) {
      toast.error('Cập nhật vai trò thất bại!');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-10 text-center text-red-600">Thông tin người dùng</h1>
      <div className="flex relative mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email"
            className="w-[250px] pl-4 pr-10 py-2 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); handleSearch(e.target.value); }}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(e.target.value); }}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <SearchOutlined />
          </div>
        </div>
        <div className="ml-2">
          <select
            className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            value={filterRole}
            onChange={(e) => handleRoleFilter(e.target.value)}
          >
            <option value="">Tất cả vai trò</option>
            <option value="Member">Thành viên</option>
            <option value="Staff">Nhân viên</option>
            <option value="Stock">Thủ kho</option>
          </select>
        </div>
        <div className="ml-2">
          <select
            className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            value={filterStatus}
            onChange={(e) => handleStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Active">Đang hoạt động</option>
            <option value="Inactive">Ngưng hoạt động</option>
          </select>
        </div>
      </div>

      <Table
        className="rounded-2xl shadow-lg bg-white custom-ant-table"
        dataSource={userList}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 5,
          position: ['bottomCenter'],
        }}
        locale={{ emptyText: 'Không có dữ liệu' }}
      />

      <Modal
        title="Cập nhật vai trò"
        open={isModalOpen}
        onOk={handleUpdateRole}
        onCancel={() => setIsModalOpen(false)}
        okText="Cập nhật"
        cancelText="Huỷ"
      >
        <div>
          <p><b>Họ tên:</b> {selectedUser?.name}</p>
          <p><b>Email:</b> {selectedUser?.email}</p>
          <select
            className="w-full border rounded p-2 mt-2"
            value={newRole}
            onChange={handleRoleChange}
          >
            <option value="Customer">Khách hàng</option>
            <option value="Staff">Nhân viên</option>
            <option value="StorageManager">Thủ kho</option>
          </select>
        </div>
      </Modal>
    </div>
  );
}

export default UserManagementPage;