import { instance } from "../instance";

export const GetAllBlood = async () => {
  try {
    const response = await instance.get("/BloodStorage");
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy bloodStorages:", error.response?.data || error.message);
    throw error;
  }
}

export const GetBloodType = async (id) => {
  try {
    const response = await instance.get(`/BloodStorage/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy BloodType:", error.response?.data || error.message);
    throw error;
  }
}

export const UpdateBloodStorage = async (id, updateData) => {
  try {
    const response = await instance.put(`/BloodStorage/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật BloodStorage:", error.response?.data || error.message);
    throw error;
  }
}

// Thêm function để cập nhật blood storage khi có đơn nhập máu
export const UpdateBloodStorageOnImport = async (bloodType, quantity) => {
  try {
    // Lấy danh sách blood storage hiện tại
    const bloodStorageRes = await GetAllBlood();
    const bloodStorages = bloodStorageRes.data.bloodStorages;
    
    // Tìm blood storage tương ứng với blood type
    const bloodStorage = bloodStorages.find(storage => 
      storage.bloodType === bloodType
    );
    
    if (bloodStorage) {
      // Cập nhật số lượng bằng cách cộng thêm
      const newQuantity = bloodStorage.quantity + quantity;
      await UpdateBloodStorage(bloodStorage.id, {
        quantity: newQuantity
      });
      
      console.log(`Đã cập nhật blood storage: ${bloodType} từ ${bloodStorage.quantity}ml thành ${newQuantity}ml`);
      return true;
    } else {
      console.error(`Không tìm thấy blood storage cho blood type: ${bloodType}`);
      return false;
    }
  } catch (error) {
    console.error("Lỗi cập nhật blood storage khi import:", error);
    throw error;
  }
}