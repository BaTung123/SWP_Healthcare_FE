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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("form", form)
    const registerResponse = await Register(form);
    console.log("registerResponse", registerResponse)

    // Chuyển hướng sang trang nhập OTP
    navigate('/verify-otp');
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
              <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
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