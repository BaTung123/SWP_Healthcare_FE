import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../../styles/loginPage.css";
import { Register } from "../../services/authentication";

// User account registration page.
const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    // Email phải là Gmail
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(form.email)) {
      setError('Vui lòng nhập địa chỉ Gmail hợp lệ (kết thúc bằng @gmail.com).');
      return;
    }
    // Password: 1 chữ in hoa, 1 ký tự đặc biệt, 1 số, >=8 ký tự
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError('Mật khẩu phải có ít nhất 8 ký tự, 1 chữ in hoa, 1 ký tự đặc biệt và 1 số.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setError('');
    
    console.log("form", form)
    const registerResponse = await Register(form);
    console.log("registerResponse", registerResponse)

    // Chuyển hướng sang trang nhập OTP
    navigate('/verify-otp', { state: { email: form.email, purposeType: 'VerifyEmail' } });
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
            <h2 style={{ marginBottom: 24, color: '#1976d2' }}>Register</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
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
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', paddingRight: 36 }}
                />
                <span
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
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
                  aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  <i className={showConfirmPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'}></i>
                </span>
              </div>
              {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
              <button className="login-btn" type="submit">Register</button>
              <div className="login-link">
                Already have an account?{" "}
                <span onClick={() => navigate('/login')}>Login</span>
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

export default RegisterPage;