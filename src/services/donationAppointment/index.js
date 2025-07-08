import { instance } from "../instance";

export const CreateDonationAppointmentByEvent = async (userId, eventId) => {
  try {
    const response = await instance.post(`/DonationAppointment/Event?userId=${userId}&eventId=${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo donor appointment by event:", error.response?.data || error.message);
    throw error;
  }
}

export const CreateDonationAppointment = async (userId) => {
  try {
    const response = await instance.post(`/DonationAppointment?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo donor appointment:", error.response?.data || error.message);
    throw error;
  }
}

export const CreateDonationAppointmentWithDate = async (appointment) => {
  try {
    const response = await instance.post("/DonationAppointment/Date", appointment);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo donor appointment:", error.response?.data || error.message);
    throw error;
  }
}

export const GetAllDonationAppointments = async () => {
  try {
    const response = await instance.get("/DonationAppointment");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo donor appointment:", error.response?.data || error.message);
    throw error;
  }
}

export const GetAllAppointmentWithRegistrationId = async (registrationId) => {
  try {
    const response = await instance.get(`DonationAppointment/All/Registration/${registrationId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo donor appointment:", error.response?.data || error.message);
    throw error;
  }
}

export const GetAppointmentsByRegistrationId = async (registrationId) => {
  try {
    const response = await instance.get(`/DonationAppointment/Registration/${registrationId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo donor appointment:", error.response?.data || error.message);
    throw error;
  }
}

export const UpdateDonationAppointment = async (appointmentId, updatedAppoiment) => {
  try {
    const response = await instance.put(`/DonationAppointment/${appointmentId}`, updatedAppoiment);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi update donor appointment:", error.response?.data || error.message);
    throw error;
  }
}