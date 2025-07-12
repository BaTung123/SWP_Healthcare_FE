import { instance } from "../instance";

export const CreateBlog = async (blogDTO) => {
  try {
    const response = await instance.post("/Blog", blogDTO);
    return response.data;
  } catch (error) {
    console.error("Lỗi tạo blog:", error.response?.data || error.message);
    throw error;
  }
}

export const UpdateBlog = async (blogDTO) => {
  try {
    const response = await instance.put("/Blog", blogDTO);
    return response.data;
  } catch (error) {
    console.error("Lỗi tạo blog:", error.response?.data || error.message);
    throw error;
  }
}

export const GetAllBlog = async () => {
  try {
    const response = await instance.get("/Blog");
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy blogs:", error.response?.data || error.message);
    throw error;
  }
}

export const DeleteBlog = async (blogId) => {
  try {
    const response = await instance.delete(`/Blog/${blogId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy blogs:", error.response?.data || error.message);
    throw error;
  }
}