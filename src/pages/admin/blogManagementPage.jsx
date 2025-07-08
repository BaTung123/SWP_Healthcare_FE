//Tạo, chỉnh sửa, xóa các bài viết blog.
import React, { useState, useRef } from 'react';
import '../../styles/blogManagementPage.css';
import { Button, Space, Table, Tooltip, Modal, Input, Form } from 'antd';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';

const BlogManagementPage = () => {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'Tại sao nên hiến máu định kỳ?',
      description: 'Nên hiến máu định kỳ để giúp cộng đồng và sức khoẻ bản thân.',
      date: '2025-05-15',
      status: 'Đã đăng',
      image: 'https://img.freepik.com/free-photo/young-woman-donating-blood-clinic_1303-17869.jpg',
    },
    {
      id: 2,
      title: 'Câu chuyện người hiến máu cứu sống 3 người',
      description: 'Một câu chuyện truyền cảm hứng về người hiến máu.',
      date: '2025-05-10',
      status: 'Bản nháp',
      image: 'https://img.freepik.com/free-photo/first-time-blood-donor-smiling-chair_1303-17875.jpg',
    },
  ]);
  
  // State cho modal thêm blog
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addImage, setAddImage] = useState("");

  // State cho modal sửa blog
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [editImage, setEditImage] = useState("");

  const addImageInputRef = useRef(null);
  const editImageInputRef = useRef(null);

  const showAddModal = () => {
    setAddTitle("");
    setAddDescription("");
    setAddImage("");
    setIsAddModalOpen(true);
  };
  const handleAddModalCancel = () => {
    setIsAddModalOpen(false);
    setAddTitle("");
    setAddDescription("");
    setAddImage("");
  };
  const handleAddModalOk = () => {
    if (!addTitle.trim()) return;
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    setBlogs(prev => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map(b => b.id)) + 1 : 1,
        title: addTitle,
        description: addDescription,
        date: dateStr,
        status: 'Đã đăng',
        image: addImage || 'https://i.imgur.com/1Q9Z1Zm.png',
      }
    ]);
    setIsAddModalOpen(false);
    setAddTitle("");
    setAddDescription("");
    setAddImage("");
  };

  const showEditModal = (record) => {
    setEditingBlogId(record.id);
    setEditTitle(record.title);
    setEditDescription(record.description || "");
    setEditImage(record.image || "");
    setIsEditModalOpen(true);
  };
  const handleEditModalCancel = () => {
    setIsEditModalOpen(false);
    setEditTitle("");
    setEditDescription("");
    setEditingBlogId(null);
    setEditImage("");
  };
  const handleEditModalOk = () => {
    if (!editTitle.trim() || editingBlogId === null) return;
    setBlogs(prev => prev.map(blog =>
      blog.id === editingBlogId ? { ...blog, title: editTitle, description: editDescription, image: editImage || 'https://i.imgur.com/1Q9Z1Zm.png' } : blog
    ));
    setIsEditModalOpen(false);
    setEditTitle("");
    setEditDescription("");
    setEditingBlogId(null);
    setEditImage("");
  };

  const handleDelete = (id) => {
    setBlogs(prev => prev.filter(blog => blog.id !== id));
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
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      align: 'center',
      width: 100,
      render: (img) => (
        <img
          src={img || 'https://i.imgur.com/1Q9Z1Zm.png'}
          alt="blog-thumbnail"
          style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 6, boxShadow: '0 1px 4px #ccc' }}
        />
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'id',
      width: 250,
      align: 'center',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      align: 'center',
      render: (desc) => <span style={{ wordBreak: 'break-word' }}>{desc}</span>
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'date',
      key: 'id',
      width: 200,
      align: 'center',
    },
    {
      title: "Hành động",
      key: "actions",
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Sửa">
            <Button type='dashed' variant='dashed' color='cyan' onClick={() => showEditModal(record)}>
              <EditOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Xoá">
            <Button danger onClick={() => handleDelete(record.id)}>
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const handleAddImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAddImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageClick = () => {
    if (addImageInputRef.current) addImageInputRef.current.click();
  };

  const handleEditImageClick = () => {
    if (editImageInputRef.current) editImageInputRef.current.click();
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-10 text-center text-red-600">Thông tin bài viết</h1>
      <div className="flex justify-end mb-4">
        <Button className="hover:!bg-[#073a82]" style={{gap: 10, background: "#073AAA", color: "white", border: "none"}} size='large' onClick={showAddModal}>
            <PlusCircleOutlined />
            <span>Thêm bài viết mới</span> 
        </Button>
      </div>

      <Modal
        title="Thêm bài viết mới"
        open={isAddModalOpen}
        onOk={handleAddModalOk}
        onCancel={handleAddModalCancel}
        okText="Tạo"
        cancelText="Huỷ"
      >
        <Form layout="vertical">
          <Form.Item label="Tiêu đề" required>
            <Input value={addTitle} onChange={e => setAddTitle(e.target.value)} placeholder="Nhập tiêu đề" />
          </Form.Item>
          <Form.Item label="Mô tả">
            <Input.TextArea value={addDescription} onChange={e => setAddDescription(e.target.value)} placeholder="Nhập mô tả" rows={4} />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            {!addImage && (
              <input type="file" accept="image/*" onChange={handleAddImageChange} ref={addImageInputRef} />
            )}
            {addImage && (
              <img
                src={addImage}
                alt="preview"
                style={{ marginTop: 10, width: 120, height: 80, objectFit: 'cover', borderRadius: 6, boxShadow: '0 1px 4px #ccc', cursor: 'pointer' }}
                title="Nhấn để đổi ảnh"
                onClick={handleAddImageClick}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Chỉnh sửa bài viết"
        open={isEditModalOpen}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Form layout="vertical">
          <Form.Item label="Tiêu đề" required>
            <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Nhập tiêu đề" />
          </Form.Item>
          <Form.Item label="Mô tả">
            <Input.TextArea value={editDescription} onChange={e => setEditDescription(e.target.value)} placeholder="Nhập mô tả" rows={4} />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            {!editImage && (
              <input type="file" accept="image/*" onChange={handleEditImageChange} ref={editImageInputRef} />
            )}
            {editImage && (
              <img
                src={editImage}
                alt="preview"
                style={{ marginTop: 10, width: 120, height: 80, objectFit: 'cover', borderRadius: 6, boxShadow: '0 1px 4px #ccc', cursor: 'pointer' }}
                title="Nhấn để đổi ảnh"
                onClick={handleEditImageClick}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>

      <Table
        className="rounded-2xl shadow-lg bg-white custom-table-blog"
        bordered={true}
        dataSource={blogs}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 5,
          position: ['bottomCenter'],
        }}
      />
    </div>
    // <div className="flex min-h-screen">
    //   <main className="blog-main blog-management-container">
    //     <button className="create-btn">+ Tạo bài viết mới</button>

    //     <table className="blog-table">
    //       <thead>
    //         <tr>
    //           <th>#</th>
    //           <th>Tiêu đề</th>
    //           <th>Ngày đăng</th>
    //           <th>Trạng thái</th>
    //           <th>Hành động</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {blogs.map((blog, index) => (
    //           <tr key={blog.id}>
    //             <td>{index + 1}</td>
    //             <td>{blog.title}</td>
    //             <td>{blog.date}</td>
    //             <td>
    //               <span className={`status ${blog.status === 'Đã đăng' ? 'published' : 'draft'}`}>
    //                 {blog.status}
    //               </span>
    //             </td>
    //             <td>
    //               <button className="edit-btn">✏️ Sửa</button>
    //               <button className="delete-btn">🗑️ Xóa</button>
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </main>
    // </div>
  );
}

export default BlogManagementPage;