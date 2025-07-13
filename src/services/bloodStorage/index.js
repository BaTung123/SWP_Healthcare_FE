import { instance } from "../instance";

export const GetAllBlood = async () => {
  try {
    const response = await instance.get("/BloodStorage");
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy bloodStorages:", error.response?.data || error.message);
    throw error;
  }
}