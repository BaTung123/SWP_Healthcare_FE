import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../../styles/loginPage.css";
import { Login } from "../../services/authentication";

// Login page for user accounts.
function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      // Giả lập API: email: test@gmail.com, password: 123456
      // await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("error:", error)
      if (!error) {
        console.log("form:", form)
        const loginResponse = await Login(form)
        console.log("loginResponse:", loginResponse)
        localStorage.setItem('user', JSON.stringify({ email: form.email, token: loginResponse.data.token }));
        navigate('/');
      } else {
        setError('Email hoặc mật khẩu không đúng!');
      }
    } catch (err) {
      console.log("err", err)
      setError(err.response.data.message);
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
              <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
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