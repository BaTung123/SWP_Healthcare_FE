import { instance } from "../instance";

export const GetAllBloodDonationEvents = async () => {
  try {
    const response = await instance.get("/BloodDonationEvent");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy list event:", error.response?.data || error.message);
    throw error;
  }
}

export const GetBloodDonationEventById = async (eventId) => {
  try {
    const response = await instance.get(`/BloodDonationEvent/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy event:", error.response?.data || error.message);
    throw error;
  }
}

export const GetEventByFacilityId = async (facilityId) => {
  try {
    const response = await instance.get(`/BloodDonationEvent/Facility/${facilityId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy event:", error.response?.data || error.message);
    throw error;
  }
}

export const UpdateBloodDonationEvent = async (eventId, updateEvent) => {
  try {
    const response = await instance.put(`/BloodDonationEvent/${eventId}`, updateEvent);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy event:", error.response?.data || error.message);
    throw error;
  }
}

export const CreateEvent = async (eventData) => {
  try {
    const response = await instance.post("/Event", eventData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo sự kiện:", error.response?.data || error.message);
    throw error;
  }
}