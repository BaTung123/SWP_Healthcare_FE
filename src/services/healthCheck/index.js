import { instance } from "../instance";

const userData = JSON.parse(localStorage.getItem("user"));
console.log("userData:", userData);
const token = userData?.token || "";

export const GetHealthCheckByUserId = async (userId) => {
    try {
        const response = await instance.get(`/HealthCheck/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi GetHealthCheckByUserId:', error.response?.data || error.message);
        throw error;
    }
};

export const CreateHealthCheck = async (data) => {
    try {
        const response = await instance.post("/HealthCheck", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi CreateHealthCheck:', error.response?.data || error.message);
        throw error;
    }
};

export const UpdateHealthCheck = async (data) => {
    try {
        const response = await instance.put("/HealthCheck", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi CreateHealthCheck:', error.response?.data || error.message);
        throw error;
    }
};