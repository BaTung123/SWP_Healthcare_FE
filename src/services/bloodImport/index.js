import { instance } from "../instance";

export const GetBloodImportApplicationById = async (id) => {
  try {
    const response = await instance.get(`/BloodImport/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi GetBloodImportApplicationById:", error.response?.data || error.message);
    throw error;
  }
}

export const GetAllBloodImportApplication = async () => {
  try {
    const response = await instance.get("/BloodImport");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi GetAllBloodImportApplication:", error.response?.data || error.message);
    throw error;
  }
}

export const CreateBloodImportApplication = async (bloodImport) => {
  try {
    const response = await instance.post("/BloodImport", bloodImport);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi updateBloodExportApplication:", error.response?.data || error.message);
    throw error;
  }
}

export const updateBloodImportApplication = async (bloodImport) => {
  try {
    const response = await instance.put("/BloodImport/status", bloodImport);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi updateBloodExportApplication:", error.response?.data || error.message);
    throw error;
  }
}

