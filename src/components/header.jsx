import { useState, useEffect, useRef } from "react";
import { Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import img from "../assets/react.svg";

const Header = () => {
  const currentPath = window.location.pathname;
  const [user, setUser] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const items = [
    {
      key: '1',
      label: <a href="/blood">Services</a>,
    },
    {
      key: '2',
      label: <a href="/doctors">Doctors</a>,
    },
    {
      key: '3',
      label: <a href="/appointments">Appointments</a>,
    }
  ];

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Event', href: '/event' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/news' },
  ];

  return (
    <header className="bg-white px-5 py-3 sticky top-0 z-50 shadow">
      <nav className="flex justify-between items-center flex-wrap">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
              alt="logo"
              className="w-10 h-10"
            />
            <span className="text-2xl font-bold text-blue-600 ml-2">Healthcare</span>
          </a>
        </div>

        {/* Main menu */}
        <ul className="flex space-x-6 list-none !m-0 p-0">
          {menuItems.map((item, index) => {
            const isActive = item.href && currentPath === item.href;

            return (
              <li key={index}>
                {item.dropdown ? (
                  <Dropdown menu={{ items: item.menuItems }}>
                    <a className="!font-medium !text-gray-800 hover:!text-blue-600 transition-colors duration-300 ease-in-out cursor-pointer">
                      <Space>
                        {item.label}
                        <DownOutlined />
                      </Space>
                    </a>
                  </Dropdown>
                ) : (
                  <a
                    href={item.href}
                    className={`!font-medium transition-colors duration-300 ease-in-out ${isActive ? "!text-blue-600" : "!text-gray-800 hover:!text-blue-600"}`}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* Right side buttons */}
        <div className="flex items-center gap-10">
          <a
            href="/member/register-donation"
            className="bg-gradient-to-r from-[#D32F2F] to-[#F44336] !text-white p-2.5 rounded-md hover:from-[#a32121] hover:to-[#f24040] transition-colors duration-300 ease-in-out"
          >
            🩸Donate Now
          </a>
          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                className="cursor-pointer px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 font-semibold text-sm shadow-md flex items-center transition-colors duration-300 ease-in-out"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <img
                  src={img}
                  alt="User Avatar"
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="ml-2 text-white">TTH</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 transition-all duration-300 border border-gray-200">
                  <a
                    href="/member/profile"
                    className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    <i className="fa-solid fa-user"></i>
                    Thông tin cá nhân
                  </a>
                  <button
                    onClick={() => {
                      setUser(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 !text-white font-semibold text-sm shadow-md hover:from-blue-700 hover:to-cyan-500 hover:shadow-lg transition-transform transform hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-user"></i>
              Đăng nhập
            </a>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;