import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../../styles/loginPage.css";
import { GetAuthenByUserId, Login } from "../../services/authentication";
import UserContext from "../../contexts/UserContext";
import { toast } from 'react-toastify';

// Login page for user accounts.
function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Thêm state này

  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Kiểm tra định dạng
      if (!form.email || !form.password) {
        setError('Vui lòng nhập đầy đủ email và mật khẩu.');
        setLoading(false);
        return;
      }
 
      // Kiểm tra email phải là Gmail
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!gmailRegex.test(form.email)) {
        setError('Vui lòng nhập địa chỉ Gmail hợp lệ (kết thúc bằng @gmail.com).');
        setLoading(false);
        return;
      }
      // Kiểm tra password >= 8 ký tự
      if (form.password.length < 8) {
        setError('Mật khẩu phải có ít nhất 8 ký tự.');
        setLoading(false);
        return;
      }
      // Giả lập API: email: test@gmail.com, password: 123456
      // await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("error:", error)
      if (!error) {
        console.log("form:", form)
        const loginResponse = await Login(form)
        console.log("loginResponse:", loginResponse)
        const token = loginResponse.data.token;
        console.log("token:", token)
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("payload:", payload)
        const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        const userResponse = await GetAuthenByUserId(userId)
        setUser(userResponse.data);
        localStorage.setItem('user', JSON.stringify({ email: form.email, token, role }));

        toast.success('Đăng nhập thành công!');

        switch (role) {
          case "Admin":
            navigate('/admin');
            break;
          
          case "Staff":
            navigate('/staff/event');
            break;

          case "StorageManager":
            navigate('/stock/blood-stock');
            break;

          default:
            navigate("/");
            break;
        }
      } else {
        toast.error('Email hoặc mật khẩu không đúng!');
        setError('Email hoặc mật khẩu không đúng!');
      }
    } catch (err) {
      console.log("err", err)
      let errorMsg = err.response?.data?.message || 'Đăng nhập thất bại!';
      if (errorMsg === 'Invalid email or password') {
        errorMsg = 'Email hoặc mật khẩu không đúng!';
      }
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        {/* Left side: Image */}
        <div className="login-left">
          <img
            src="https://media.istockphoto.com/id/1319068178/vector/medical-concept-people-make-blood-transfusion.jpg?s=612x612&w=0&k=20&c=fnkSiT9UVEg9YwGm3jcmkyiKctQMrBJPS-q2D9B8CMw="
            alt="Doctor"
            className="login-img"
          />
          <div className="login-brand">HealthCare</div>
          <div className="login-copyright">
            © 2025 HealthCare. All rights reserved.
          </div>
        </div>

        {/* Right side: Form */}
        <div className="login-right">
          <div className="login-form-box">
            <h2 style={{ marginBottom: 24, color: '#1976d2' }}>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', paddingRight: 36 }}
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#888',
                    fontSize: 18
                  }}
                  tabIndex={0}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  <i className={showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}></i>
                </span>
              </div>
              {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Login'}
              </button>
              <div className="login-link">
                Don’t have an account?{" "}
                <span onClick={() => navigate('/register')}>Register</span>
              </div>
            </form>

            <div className="login-socials">
              <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
              <a href="#"><i className="fa-brands fa-instagram"></i></a>
              <a href="#"><i className="fa-brands fa-twitter"></i></a>
              <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;