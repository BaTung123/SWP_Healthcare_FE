import { instance } from "../instance";

export const GetMedicalFacilityById = async (facilityId) => {
  try {
    const response = await instance.get(`/MedicalFacility/${facilityId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy MedicalFacility:", error.response?.data || error.message);
    throw error;
  }
}