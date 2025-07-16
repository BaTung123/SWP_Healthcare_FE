import { instance } from "../instance";

export const GetAllBloodRequestApplication = async () => {
  try {
    const response = await instance.get("/BloodRequestApplication");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy GetAllBloodRequestApplication:", error.response?.data || error.message);
    throw error;
  }
}

export const GetBloodRequestApplicationById = async (id) => {
  try {
    const response = await instance.get(`/BloodRequestApplication/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy BloodRequestApplication:", error.response?.data || error.message);
    throw error;
  }
}

export const UpdateBloodRequestStatus = async (updateRequest) => {
  try {
    const response = await instance.put("/BloodRequestApplication/status", updateRequest);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi UpdateBloodRequestStatus:", error.response?.data || error.message);
    throw error;
  }
}

export const CreateBloodRequestStatus = async (obj) => {
  try {
    const response = await instance.post("/BloodRequestApplication", obj);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi CreateBloodRequestStatus:", error.response?.data || error.message);
    throw error;
  }
}