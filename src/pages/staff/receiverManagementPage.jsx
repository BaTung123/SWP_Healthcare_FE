//Quản lý tài khoản người dùng (Member, Staff).
import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Space, Table, Tooltip, Switch } from 'antd';

const UserManagementPage = () => {
  const [userList, setUserList] = useState([
    {
      id: 1,
      name: 'Dương Thái Hoàng Nghĩa',
      email: 'n@gmail.com',
      role: 'Member',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Nguyễn Văn A',
      email: 'a@gmail.com',
      role: 'Member',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Trần Thị B',
      email: 'b@gmail.com',
      role: 'Staff',
      status: 'Inactive',
    },
    {
      id: 4,
      name: 'Lê Văn C',
      email: 'c@gmail.com',
      role: 'Member',
      status: 'Active',
    },
    {
      id: 5,
      name: 'Lê Văn C',
      email: 'c@gmail.com',
      role: 'Member',
      status: 'Active',
    },
    {
      id: 6,
      name: 'Lê Văn C',
      email: 'c@gmail.com',
      role: 'Member',
      status: 'Active',
    },
    {
      id: 7,
      name: 'Lê Văn C',
      email: 'c@gmail.com',
      role: 'Member',
      status: 'Active',
    },
  ]);

  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  const handleToggleStatus = (record) => {
    const newStatus = record.status === 'Active' ? 'Inactive' : 'Active';
    setUserList(userList.map(user => 
      user.id === record.id ? { ...user, status: newStatus } : user
    ));
  };

  // Lọc danh sách người dùng dựa trên điều kiện tìm kiếm và lọc
  const filteredUserList = userList.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                       user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchRole = filterRole === '' || user.role === filterRole;
    const matchStatus = filterStatus === '' || user.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const columns = [
    {
      title: 'Full Name',
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
      title: 'Role',
      dataIndex: 'role',
      key: 'id',
      width: 200,
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'id',
      width: 250,
      align: 'center',
      render: (status) => {
        let color;
        switch (status) {
          case 'Active': color = 'text-green-500'; break;
          default: color = 'text-red-500';
        }
        return (
          <span className={`font-bold ${color} border-2 rounded-md p-1`} >
            {status.toUpperCase()}  
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={record.status === 'Active' ? 'Set Inactive' : 'Set Active'}>
            <Switch
              checked={record.status === 'Active'}
              onChange={() => handleToggleStatus(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div className="flex flex-col">
      <div className="flex relative mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email"
            className="w-[250px] pl-4 pr-10 py-2 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <SearchOutlined />
          </div>
        </div>
        <div className="ml-2">
          <select
            className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All Role</option>
            <option value="Member">Member</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
        <div className="ml-2">
          <select
            className="text-sm border pl-4 pr-4 py-2 bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <Table
        className="rounded-2xl shadow-lg bg-white custom-table-user"
        dataSource={filteredUserList}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 5,
          position: ['bottomCenter'],
        }}
      />
    </div>
  );
}

export default UserManagementPage;