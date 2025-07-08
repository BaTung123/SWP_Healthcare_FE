import { Layout } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const MemberPage = () => {
  return (
    <Layout
      style={{
        background: "#eaf3fb",
        minHeight: "100vh",
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
  )
}

export default MemberPage 