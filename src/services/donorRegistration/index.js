import { instance } from "../instance";

export const createDonorRegistration = async (data) => {
  try {
    const response = await instance.post("/DonorRegistration", data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo donor registration:", error.response?.data || error.message);
    throw error;
  }
}

export const GetAllDonorRegistration = async () => {
  try {
    const response = await instance.get("/DonorRegistration");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy donor registration with userId:", error.response?.data || error.message);
    throw error;
  }
}

export const GetAllDonorRegistrationWithUserId = async (userId) => {
  try {
    const response = await instance.get(`DonorRegistration/All/User/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy donor registration with userId:", error.response?.data || error.message);
    throw error;
  }
}

export const GetDonorRegistrationById = async (registerId) => {
  try {
    const response = await instance.get(`/DonorRegistration/${registerId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy donor registration:", error.response?.data || error.message);
    throw error;
  }
}

export const GetDonorRegistrationByUserId = async (userId) => {
  try {
    const response = await instance.get(`/DonorRegistration/User/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy donor registration by userId:", error.response?.data || error.message);
    throw error;
  }
}

export const UpdateDonorRegistration = async (id, registration) => {
  try {
    const response = await instance.put(`/DonorRegistration/${id}`, registration);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa donor registration:", error.response?.data || error.message);
    throw error;
  }
}

export const DeleteDonorRegistration = async (appointmentId) => {
  try {
    const response = await instance.delete(`/DonorRegistration/${appointmentId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa donor registration:", error.response?.data || error.message);
    throw error;
  }
}

export const postBloodDonationApplication = async (data) => {
  return instance.post('/BloodDonationApplication', data);
};

export const getAllBloodDonationApplication = async () => {
  try {
    const response = await instance.get('/BloodDonationApplication');
    return response.data?.data?.bloodDonationApplications || [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách BloodDonationApplication:', error.response?.data || error.message);
    throw error;
  }
}

export const updateBloodDonationApplicationStatus = async ({ id, status, note }) => {
  try {
    const response = await instance.put('/BloodDonationApplication/status', { id, status, note });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái BloodDonationApplication:', error.response?.data || error.message);
    throw error;
  }
};
