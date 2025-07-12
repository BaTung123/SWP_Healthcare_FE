import { instance } from "../instance";

export const Register = async (registerDTO) => {
  try {
    const response = await instance.post("/Authentication/Register", registerDTO);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đăng kí:", error.response?.data || error.message);
    throw error;
  }
}

export const Login = async (loginDTO) => {
  try {
    const response = await instance.post("/Authentication/Login", loginDTO);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error.response?.data || error.message);
    throw error;
  }
}

export const GetAuthenByUserId = async (userId) => {
  try {
    const response = await instance.get(`/Authentication/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy user:", error.response?.data || error.message);
    throw error;
  }
}

export const updateUserInfo = async (data) => {
  return instance.put('/Authentication/information', data);
};

export const SendEmailToAdmin = async (emailData) => {
  try {
    const response = await instance.post("/Authentication/SendEmailToAdmin", emailData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gửi email:", error.response?.data || error.message);
    throw error;
  }
};