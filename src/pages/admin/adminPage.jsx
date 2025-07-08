import { Layout } from 'antd'
import React from 'react'
import SideBar from '../../components/admin/sideBar'
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const AdminPage = () => {
  return (
    <Layout>
        <SideBar />
        <Layout
          style={{
            marginLeft: 250,
            transition: "all 0.2s",
            background: "#eaf3fb",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
            <Content
                style={{
                    margin: "24px 16px 0",
                    padding: 24,
                    minHeight: 280,
                    background: "#eaf3fb",
                    borderRadius: "8px",
                }}
            >
                <Outlet />
            </Content>
        </Layout>
    </Layout>
  )
}

export default AdminPage
