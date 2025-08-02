import { instance } from "../instance";

export const CreateEvent = async (eventData) => {
  try {
    const response = await instance.post("/Event", eventData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo sự kiện:", error.response?.data || error.message);
    throw error;
  }
}

export const UpdateEventStatus = async (eventData) => {
  try {
    const response = await instance.put("/Event/status", eventData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo sự kiện:", error.response?.data || error.message);
    throw error;
  }
}

export const GetAllEvents = async () => {
  try {
    const response = await instance.get("/Event");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy list Event:", error.response?.data || error.message);
    throw error;
  }
};

export const GetEventById = async (eventId) => {
  try {
    const response = await instance.get(`/Event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin Event:", error.response?.data || error.message);
    throw error;
  }
};