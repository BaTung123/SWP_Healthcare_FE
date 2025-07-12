import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { instance } from '../../services/instance';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const purposeType = location.state?.purposeType || 'register';

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Tự động chuyển sang ô tiếp theo
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Xử lý phím Backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      alert('Vui lòng nhập đầy đủ 6 số OTP');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      // Gọi API xác thực OTP
      const response = await instance.put('/Authentication/verify', {
        email,
        otpCode: otpString,
        purposeType
      });
      // Thành công
      alert('Xác thực OTP thành công!');
      navigate('/login');
    } catch (error) {
      console.error('OTP verification failed:', error);
      setError(
        error?.response?.data?.message || 'Xác thực OTP thất bại. Vui lòng thử lại.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    // Xử lý gửi lại OTP qua email
    console.log('Resending OTP to email...');
    alert('Mã OTP mới đã được gửi đến email của bạn.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Xác thực OTP
            </h1>
            <p className="text-gray-600">
              Nhập mã 6 số đã được gửi đến email của bạn
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input Fields */}
            <div>
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    name={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength="1"
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    placeholder="•"
                  />
                ))}
              </div>
            </div>
            {error && <div style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>{error}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xác thực...
                </div>
              ) : (
                'Xác thực OTP'
              )}
            </button>

            {/* Resend OTP - Left aligned */}
            <div className="text-left mt-5">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition duration-200 cursor-pointer"
              >
                Gửi lại mã OTP
              </button>
            </div>

            {/* Timer */}
            <div className="text-center text-sm text-gray-500">
              Mã OTP có hiệu lực trong 5 phút
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Không nhận được email? 
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-blue-600 hover:text-blue-800 font-medium ml-1 cursor-pointer"
              >
                Liên hệ hỗ trợ
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP; 