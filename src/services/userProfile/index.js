import { instance } from "../instance";

export const GetUserProfileByUserId = async (userId) => {
  try {
    const response = await instance.get(`/UserProfile/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy userFrofile:", error.response?.data || error.message);
    throw error;
  }
}