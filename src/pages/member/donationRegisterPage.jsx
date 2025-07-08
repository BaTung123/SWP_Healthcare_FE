//Đăng ký nhóm máu, thời gian sẵn sàng hiến máu.
import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { GetUserProfileByUserId } from "../../services/userProfile";
import { GetBloodDonationEventById } from "../../services/bloodDonationEvent";
import { GetMedicalFacilityById } from "../../services/medicalFacility";
import { createDonorRegistration, DeleteDonorRegistration } from "../../services/donorRegistration";
import { CreateDonationAppointment, CreateDonationAppointmentByEvent } from "../../services/donationAppointment";
import { DatePicker } from "antd";

// Dữ liệu mẫu các quận và bệnh viện
const areaHospitalData = {
  "Quận 1": [
    "Bệnh viện Đa khoa Sài Gòn",
    "Bệnh viện Bệnh Nhiệt Đới"
  ],
  "Quận 3": [
    "Bệnh viện Bình Dân",
    "Bệnh viện Tai Mũi Họng"
  ],
  "Quận 4": [
    "Bệnh viện Quận 4"
  ],
  "Quận 5": [
    "Bệnh viện Chợ Rẫy",
    "Bệnh viện Hùng Vương",
    "Bệnh viện Nguyễn Tri Phương"
  ],
  "Quận 6": [
    "Bệnh viện Quận 6"
  ],
  "Quận 7": [
    "Bệnh viện Quận 7"
  ],
  "Quận 8": [
    "Bệnh viện Quận 8"
  ],
  "Quận 10": [
    "Bệnh viện Nhân dân 115",
    "Bệnh viện Nhiệt Đới"
  ],
  "Quận 11": [
    "Bệnh viện Quận 11"
  ],
  "Quận 12": [
    "Bệnh viện Quận 12"
  ],
  "Quận Bình Thạnh": [
    "Bệnh viện Nhân dân Gia Định"
  ],
  "Quận Gò Vấp": [
    "Bệnh viện Gò Vấp"
  ],
  "Quận Phú Nhuận": [
    "Bệnh viện Quận Phú Nhuận"
  ],
  "Quận Tân Bình": [
    "Bệnh viện Thống Nhất"
  ],
  "Quận Tân Phú": [
    "Bệnh viện Quận Tân Phú"
  ],
  "Quận Bình Tân": [
    "Bệnh viện Bình Tân"
  ],
  "Quận Thủ Đức": [
    "Bệnh viện Thủ Đức"
  ],
  "Huyện Bình Chánh": [
    "Bệnh viện Bình Chánh"
  ],
  "Huyện Củ Chi": [
    "Bệnh viện Củ Chi"
  ],
  "Huyện Hóc Môn": [
    "Bệnh viện Hóc Môn"
  ],
  "Huyện Nhà Bè": [
    "Bệnh viện Nhà Bè"
  ],
  "Huyện Cần Giờ": [
    "Bệnh viện Cần Giờ"
  ]
};
const areaList = Object.keys(areaHospitalData);

const DonationRegisterPage = () => {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [donateEvent, setDonateEvent] = useState(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const eventId = params.get("eventId");

  const [formData, setFormData] = useState({
    userId: "",
    fullName: "",
    bloodType: "",
    type: "",
    fromDate: "",
    toDate: "",
    phone: "",
    location: "",
  });

  // Gọi API để lấy danh sách tỉnh/thành
  useEffect(() => {
    const fetchCities = async () => {
      const response = await axios.get("https://provinces.open-api.vn/api/?depth=1")
      setCities(response.data);
    }
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfile = await GetUserProfileByUserId(1);
      console.log("userProfile:", userProfile);

      if (eventId) {
        const event = await GetBloodDonationEventById(eventId);
        setDonateEvent(event);
        console.log("event:", event);
        const facility = await GetMedicalFacilityById(event.facilityId);
        console.log("facility:", facility);

        const cityList = await axios.get("https://provinces.open-api.vn/api/?depth=1")

        const matchedCity = cityList.data.find(city =>
          city.name.toLowerCase().includes(facility.city.toLowerCase())
        );
        console.log("matchedCity:", matchedCity);

        if (matchedCity) {
          await cityChange(matchedCity.code, cityList.data);
          districtChange(facility.district);
        }
      }

      setFormData((prev) => ({
        ...prev,
        userId: userProfile.userId,
        fullName: userProfile.firstName + " " + userProfile.lastName,
        phone: userProfile.phoneNumber,
      }));
    }
    fetchUserProfile();
  }, []);
  console.log("formData:", formData);
  console.log("donationEvent:", donateEvent);

  const cityChange = async (cityCode, cityList) => {
    const selectedCity = cityList.find(city => city.code === Number(cityCode));
    console.log("cityCode:", cityCode);
    console.log("selectedCity:", selectedCity);

    if (selectedCity) {
      const response = await axios.get(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`);

      setDistricts(response.data.districts);
      setFormData((prev) => ({
        ...prev,
        location: "",
        selectedCityCode: cityCode,
        selectedDistrictName: "",
        selectedCityName: selectedCity.name,
      }));
    }
  };

  const districtChange = async (districtName) => {
    setFormData((prev) => ({
      ...prev,
      location: `${districtName}, ${prev.selectedCityName || ""}`,
      selectedDistrictName: districtName,
    }));
  };

  // Khi chọn tỉnh/thành, lấy danh sách quận/huyện tương ứng
  const handleCityChange = async (e) => {
    cityChange(e.target.value, cities);
  }

  const handleDistrictChange = (e) => {
    districtChange(e.target.value);
  }

  const handleFromDateChange = (date) => {
    const updatedFormData = {
      ...formData,
      fromDate: date,
    };
    setFormData(updatedFormData);

    if (updatedFormData.toDate) {
      isValidDateRange(date, updatedFormData.toDate);
    }
  };

  const handleToDateChange = (date) => {
    const updatedFormData = {
      ...formData,
      toDate: date,
    };
    setFormData(updatedFormData);

    if (updatedFormData.fromDate) {
      isValidDateRange(updatedFormData.fromDate, date);
    }
  };

  const disabledDate = (current) => {

    return (current &&
      (
        current < dayjs(donateEvent.eventDate, "YYYY-MM-DD") ||
        current > dayjs(donateEvent.endDate, "YYYY-MM-DD")
      )
    );
  };


  const isValidDateRange = (availableFromDate, availableToDate) => {

    console.log("chooseFromDate:", availableFromDate);
    console.log("chooseToDate:", availableToDate);
    
    if (availableFromDate === null || availableToDate === null) {
      toast.error("Vui lòng chọn đầy đủ.");
      return false;
    }

    let from = dayjs(availableFromDate).format("YYYY-MM-DD");
    let to = dayjs(availableToDate).format("YYYY-MM-DD");

    if (from > to) {
      toast.warn("Ngày bắt đầu không được sau ngày kết thúc.")
      return false;
    }

    if (donateEvent !== null) {
      let eventStartDate = dayjs(donateEvent.eventDate).format("YYYY-MM-DD");
      let eventEndDate = dayjs(donateEvent.endDate).format("YYYY-MM-DD");

      console.log("eventStartDate:", eventStartDate);
      console.log("eventEndDate:", eventEndDate);

      if (from < eventStartDate || from > eventEndDate) {
        toast.error(`Ngày bắt đầu phải từ ${eventStartDate} đến ${eventEndDate}`);
        return false;
      }

      if (to < eventStartDate || to > eventEndDate) {
        toast.error(`Ngày kết thúc phải từ ${eventStartDate} đến ${eventEndDate}`);
        return false;
      }
    }
    return true;
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const updateFormData = { 
      ...formData,
      [name]: value,
    }
    setFormData(updateFormData);

    if (updateFormData.fromDate && updateFormData.toDate) {
      isValidDateRange(
        updateFormData.fromDate, 
        updateFormData.toDate,
      )
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("formDate:", formData.fromDate);
    console.log("toDate:", formData.toDate);
    
    if (!isValidDateRange(formData.fromDate, formData.toDate)) {
      return; 
    }

    const dataToSend = {
      registrationId: 0,
      userId: 1, 
      fullNameRegister: formData.fullName,
      bloodGroup: formData.bloodType,
      type: formData.type,
      availableFromDate: dayjs(formData.fromDate).format("YYYY-MM-DD"),
      availableToDate: dayjs(formData.toDate).format("YYYY-MM-DD"),
      phone: formData.phone,
      location: formData.location,
    };

    try {
      let createAppointment = true;
      let response = null;

      try {
        response = await createDonorRegistration(dataToSend);
        console.log("Phản hồi từ server:", response);
        toast.success("Đăng ký thành công!");
        
        // console.log("UserId:", dataToSend.userId);     
        // if (response !== null) {
        //   if (eventId) {
        //     const appointmentData = await CreateDonationAppointmentByEvent(dataToSend.userId, eventId);
        //     console.log("Phản hồi từ server:", appointmentData);
        //     toast.success("Đăng ký thành công!");
        //   } else {
        //     const appointmentData = await CreateDonationAppointment(dataToSend.userId);
        //     console.log("Phản hồi từ server:", appointmentData);
        //     toast.success("Đăng ký thành công!");
        //   }
        // }
      } catch (error) {
        console.error("Lỗi khi tạo đăng ký:", error);
        toast.error(error.response.data);
        createAppointment = false;
      }
      console.log("createAppointment:", createAppointment);
      if (!createAppointment) {
        console.error("registrationId:", response.registrationId);
        const deleteResponse = await DeleteDonorRegistration(response.registrationId);
        console.log("Đã xóa đăng ký:", deleteResponse);
      }
    } catch (error) {
      console.error("Lỗi khi gửi đăng ký:", error);
      toast.error("Không thể lên lịch cho bạn được.");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-[#eaf3fb]">
      <div className="rounded-lg shadow-md bg-[#fffafa] p-6">
        <h1 className="!text-[30px] text-[#b30000] text-center">Đăng ký Hiến Máu</h1>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Họ và tên</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              disabled={formData.fullName !== "" ? true : false}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-base"
            />
          </div>

          <div className="flex flex-row gap-14">
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Nhóm máu:</label>
              <select
                name="bloodType"
                required
                value={formData.bloodType}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md text-base"
              >
                <option value="">-- Chọn nhóm máu --</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Loại:</label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md text-base"
              >
                <option value="">-- Chọn loại --</option>
                <option value="Toàn Phần">Toàn Phần</option>
                <option value="Tiểu Cầu">Tiểu Cầu</option>
                <option value="Huyết Tương">Huyết Tương</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Thời gian sẵn sàng hiến:</label>
            <div className="flex justify-around">
              <div>
                <DatePicker
                  style={{ marginTop: 10, backgroundColor: "#fffafa", padding: 12 }}
                  format="DD/MM/YYYY"
                  onChange={handleFromDateChange}
                  disabledDate={eventId ? disabledDate : false}
                  placeholder="Từ ngày"
                />
              </div>
              <div>
                <DatePicker
                  style={{ marginTop: 10, backgroundColor: "#fffafa", padding: 12 }}
                  format="DD/MM/YYYY"
                  onChange={handleToDateChange}
                  disabledDate={eventId ? disabledDate : false}
                  placeholder="Đến ngày"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Số điện thoại:</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="VD: 0987654321"
              disabled={formData.phone !== "" ? true : false}
              className="p-3 border border-gray-300 rounded-md text-base"
            />
          </div>

          {donateEvent !== null ? (
            <>
              <div className="flex flex-col">
                <label className="mb-2 font-semibold text-gray-700">Địa chỉ:</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={donateEvent.location}
                  onChange={handleChange}
                  placeholder="Địa chỉ"
                  disabled={donateEvent.location !== "" ? true : false}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-base"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col">
                <label className="mb-2 font-semibold text-gray-700">Tỉnh/Thành phố:</label>
                <select
                  value={formData.selectedCityCode || ""}
                  onChange={handleCityChange}
                  className="p-3 border border-gray-300 rounded-md text-base"
                  required
                  disabled={eventId !== null ? true : false}
                >
                  <option value="">-- Chọn tỉnh/thành phố --</option>
                  {cities.map((city) => (
                    <option key={city.code} value={city.code}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-2 font-semibold text-gray-700">Quận/Huyện:</label>
                <select
                  value={formData.selectedDistrictName}
                  onChange={handleDistrictChange}
                  className="p-3 border border-gray-300 rounded-md text-base"
                  required
                  disabled={districts.length === 0 || eventId !== null ? true : false}
                >
                  <option value="">-- Chọn quận/huyện --</option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-2 font-semibold text-gray-700">Bệnh viện:</label>
                <select
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: `${e.target.value}, ${prev.selectedDistrictName}, ${prev.selectedCityName || ""}`
                    }))
                  }
                  className="p-3 border border-gray-300 rounded-md text-base"
                  required
                  disabled={areaHospitalData[formData.selectedDistrictName] === null}
                >
                  <option value="">-- Chọn bệnh viện --</option>
                  {areaHospitalData[formData.selectedDistrictName]?.map((hospital) => (
                    <option key={hospital} value={hospital}>
                      {hospital}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="p-3 !text-white !bg-[#b30000] rounded-md font-bold hover:!bg-[#990000] transition-colors duration-300 ease-in-out"
          >
            Gửi đăng ký
          </button>
        </form>
      </div>
    </div>
  );
}

export default DonationRegisterPage;