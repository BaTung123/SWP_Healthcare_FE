import { instance } from "../instance";

export const GetAllBloodExportApplication = async () => {
  try {
    const response = await instance.get("/BloodExport");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy list BloodExport:", error.response?.data || error.message);
    throw error;
  }
}

export const GetBloodExportApplicationById = async (id) => {
  try {
    const response = await instance.get(`/BloodExport/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy BloodExportById:", error.response?.data || error.message);
    throw error;
  }
}

export const CreateBloodExportApplication = async (bloodExport) => {
  try {
    const response = await instance.post("/BloodExport", bloodExport);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo BloodExport:", error.response?.data || error.message);
    throw error;
  }
}

export const updateBloodExportApplication = async (bloodExport) => {
  try {
    const response = await instance.put("/BloodExport/status", bloodExport);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi updateBloodExportApplication:", error.response?.data || error.message);
    throw error;
  }
}