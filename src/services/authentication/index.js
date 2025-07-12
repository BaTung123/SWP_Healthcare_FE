import { instance } from "../instance";

export const authenticationService = {
  login: async (email, password) => {
    try {
      const response = await instance.post("/Authentication/Login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}; 