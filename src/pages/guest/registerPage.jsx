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
  // Thay error thành errors object
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Xóa lỗi khi user nhập lại
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.name) {
      newErrors.name = 'Vui lòng nhập họ và tên.';
    } else if (form.name.trim().length < 5) {
      newErrors.name = 'Họ và tên phải có ít nhất 5 ký tự.';
    }

    if (!form.email) {
      newErrors.email = 'Vui lòng nhập email.';
    } else {
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!gmailRegex.test(form.email)) {
        newErrors.email = 'Vui lòng nhập địa chỉ Gmail hợp lệ (kết thúc bằng @gmail.com).';
      }
    }

    if (!form.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu.';
    } else {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(form.password)) {
        newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự, 1 chữ in hoa, 1 ký tự đặc biệt và 1 số.';
      }
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu.';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

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
              {errors.name && <div style={{ color: 'red', marginBottom: 8 }}>{errors.name}</div>}
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
              {errors.email && <div style={{ color: 'red', marginBottom: 8 }}>{errors.email}</div>}
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
              {errors.password && <div style={{ color: 'red', marginBottom: 8 }}>{errors.password}</div>}
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
              {errors.confirmPassword && <div style={{ color: 'red', marginBottom: 8 }}>{errors.confirmPassword}</div>}
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