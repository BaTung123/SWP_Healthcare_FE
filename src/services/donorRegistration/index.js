import { instance } from "../instance";

export const CreateBloodDonationApplication = async (data) => {
  try {
    const response = await instance.post("/BloodDonationApplication", data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi CreateBloodDonationApplication:', error.response?.data || error.message);
    throw error;
  }
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

export const updateBloodDonationApplicationInfo = async ({ id, bloodType, bloodTransferType, quantity }) => {
  try {
    const response = await instance.put('/BloodDonationApplication', {
      id,
      bloodType,
      bloodTransferType,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin BloodDonationApplication:', error.response?.data || error.message);
    throw error;
  }
};
