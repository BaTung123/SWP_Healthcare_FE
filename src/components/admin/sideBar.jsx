import { AuditOutlined, BarChartOutlined, BookOutlined, DashboardOutlined, LogoutOutlined, ProductOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd"
import { Link, useLocation, useNavigate } from "react-router-dom";

const { Sider } = Layout;

const SideBar = () => {

    const location = useLocation();
    const navigate = useNavigate();

    // Danh sách tất cả các menu item
    const allMenuItems = [
        // --- ADMIN ---
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
        // --- STOCK ---
        {
            key: "/stock/blood-stock",
            icon: <ProductOutlined />,
            label: <Link to="/stock/blood-stock">Blood Warehouse</Link>,
        },
        {
            key: "/stock/accept-blood-drop",
            icon: <BarChartOutlined />,
            label: <Link to="/stock/accept-blood-drop">Accept Blood Drop</Link>,
        },
        {
            key: "/stock/receiver",
            icon: <AuditOutlined />,
            label: <Link to="/stock/receiver">Blood Receiver</Link>,
        },
        // --- STAFF ---
        {
            key: "/staff/event",
            icon: <BookOutlined />,
            label: <Link to="/staff/event">Event Management</Link>,
        },
        {
            key: "/staff/blog",
            icon: <BookOutlined />,
            label: <Link to="/staff/blog">Blog Management</Link>,
        },
        {
            key: "/staff/send-blood",
            icon: <BarChartOutlined />,
            label: <Link to="/staff/send-blood">Blood Request</Link>,
        },
        {
            key: "/staff/blood-drop",
            icon: <BarChartOutlined />,
            label: <Link to="/staff/blood-drop">Blood Drop</Link>,
        },
        {
            key: "/staff/donor",
            icon: <AuditOutlined />,
            label: <Link to="/staff/donor">Blood Donor</Link>,
        },
        // --- LOGOUT ---
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
