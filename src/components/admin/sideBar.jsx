import { AuditOutlined, BarChartOutlined, BookOutlined, DashboardOutlined, LogoutOutlined, ProductOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd"
import { Link, useLocation, useNavigate } from "react-router-dom";

const { Sider } = Layout;

const SideBar = () => {

    const location = useLocation();
    const navigate = useNavigate();

    // Danh sách tất cả các menu item
    const allMenuItems = [
        {
            key: "/admin",
            icon: <DashboardOutlined />,
            label: <Link to="/admin">Dashboard</Link>,
        },
        {
            key: "/admin/user",
            icon: <UserOutlined />,
            label: <Link to="/admin/user">User Management</Link>,
        },
        {
            key: "/admin/blog",
            icon: <BookOutlined />,
            label: <Link to="/admin/blog">Blog Management</Link>,
        },
        {
            key: "/staff/event",
            icon: <BookOutlined />,
            label: <Link to="/staff/event">Event Management</Link>,
        },
        {
            key: "/staff/blood-stock",
            icon: <ProductOutlined />,
            label: <Link to="/staff/blood-stock">Blood Warehouse</Link>,
        },
        {
            key: "/staff/send-blood",
            icon: <BarChartOutlined />,
            label: <Link to="/staff/send-blood">Send Blood</Link>,
        },
        {
            key: "/staff/donor",
            icon: <AuditOutlined />,
            label: <Link to="/staff/donor">Blood Donor</Link>,
        },
        {
            key: "/staff/receiver",
            icon: <AuditOutlined />,
            label: <Link to="/staff/receiver">Blood Receiver</Link>,
        },
        {
            key: "/staff/emergency-handling",
            icon: <AuditOutlined />,
            label: <Link to="/staff/emergency-handling">Emergency Requester</Link>,
        },
        {
            key: "/staff/blood-drop",
            icon: <BarChartOutlined />,
            label: <Link to="/staff/blood-drop">Blood Drop</Link>,
        },
        {
            key: "/staff/blood-request",
            icon: <BarChartOutlined />,
            label: <Link to="/staff/blood-request">Blood Request</Link>,
        },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            style: { color: "red" },
            onClick: () => {
                // localStorage.clear();
                navigate("/login");
            },
        },
    ]
    
    return (
        <Sider
            width={250}
            style={{
                background: "#073a82",
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 1,
            }}
        >
            <div className="p-2 flex items-center justify-center">
                <div className="w-full">
                    <div className="flex items-center justify-center h-[60px]">
                        <span className="text-2xl font-bold text-white text-center">HealthCare</span>
                    </div>
                </div>
            </div>

            <Menu
                theme="dark"
                mode="vertical"
                selectedKeys={[location.pathname]}
                items={allMenuItems}
                style={{ borderRight: 0, backgroundColor: "#073a82", color: "#fff" }}
            />

        </Sider>
    )
}

export default SideBar
