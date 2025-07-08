import { useState } from "react";
import BloodDropBadge from "../../components/bloodDropBadge"
import { BiCalendar, BiFemale, BiMale, BiSolidDonateBlood, BiSolidHome, BiSolidPhone } from "react-icons/bi"
import { Button, Modal, Select } from "antd";
import dayjs from "dayjs"


const RequesterDonorCard = ({ requesterDonor, onStatusUpdate }) => {

  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState(requesterDonor.status);

  const userInfo = [
    { icon: requesterDonor.gender === "Male" ? BiMale : BiFemale, text: `${requesterDonor.gender}, ${requesterDonor.age}` },
    { icon: BiSolidPhone, text: requesterDonor.phone },
    { icon: BiSolidHome, text: requesterDonor.location },
    { icon: BiCalendar, text: requesterDonor.availableFromDate !== requesterDonor.availableToDate ? `${dayjs(requesterDonor.availableFromDate).format("DD")} - ${dayjs(requesterDonor.availableToDate).format("DD/MM/YYYY")}` : dayjs(requesterDonor.availableFromDate).format("DD/MM/YYYY")},
    { icon: BiSolidDonateBlood, text: `${requesterDonor.donationCount} donations | ${requesterDonor.reciptionCount} reciptions` },
  ];

  const handleSave = () => {
    onStatusUpdate(status); 
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className={`${requesterDonor.status === "Receiver" ? "bg-red-100" : "bg-white"} z-0 rounded-xl shadow-md p-4 h-fit flex flex-col relative transition-all hover:shadow-lg`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`absolute flex items-center justify-center bottom-0 left-0 w-full z-10 rounded-xl transition-all duration-500 ease-in-out ${isHovered ? "h-[35%]" : "h-0"}`}>
          <div className="absolute inset-0 opacity-80 bg-gray-300 rounded-xl"></div>
          <div className={`absolute z-20 transition-all duration-500 ease-in-out ${isHovered ? "" : "opacity-0"}`}>
            <Button type="primary" onClick={() => {setIsModalOpen(true)}}>Chi tiết</Button>
          </div>
        </div>

        <div className="flex justify-between mb-2">
          <img
              src={requesterDonor.avatar}
              alt={requesterDonor.fullNameRegister}
              className="w-16 h-16 rounded-full object-cover"
          />
          <BloodDropBadge type={requesterDonor.bloodGroup}/>
        </div>
        <h3 className="font-semibold text-center text-gray-800 text-[17px]">{requesterDonor.fullNameRegister}</h3>
        <div className="relative flex justify-between items-center">
          <div>
              {userInfo.map((item, index) => (
                  <div key={index} className="flex items-center mb-1.5">
                      <item.icon style={{ height: 20, width: 20 }} />
                      <p className="text-sm text-gray-700 ml-1.5 !mb-0 truncate overflow-hidden whitespace-nowrap max-w-[180px]">{item.text}</p>
                  </div>
              ))}
          </div>
          <span className={`absolute right-0 top-0 rounded-2xl p-1 h-fit text-center text-white font-bold
              ${requesterDonor.status === "Canceled" ? "w-20 bg-red-500" : 
                requesterDonor.status === "In-Process" ? "w-20 bg-orange-500" : 
                "w-20 bg-green-500"}`}
          >
            {requesterDonor.status}
          </span>
        </div>
      </div>

      <Modal
        title="Cập nhật trạng thái"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Hủy"
      >
        <p><strong>Tên:</strong> {requesterDonor.fullNameRegister}</p>
        <p><strong>Ngày hẹn:</strong> {requesterDonor.availableFromDate !== requesterDonor.availableToDate ? `${dayjs(requesterDonor.availableFromDate).format("DD")} - ${dayjs(requesterDonor.availableToDate).format("DD/MM/YYYY")}` : dayjs(requesterDonor.availableFromDate).format("DD/MM/YYYY")}</p>
        <p><strong>Địa điểm:</strong> {requesterDonor.location}</p>
        <Select
          className="w-full mt-3"
          value={status}
          onChange={(value) => setStatus(value)}
          disabled={requesterDonor.status === "Canceled"}
          options={[
            { value: "Canceled", label: "Canceled" },
            { value: "Scheduled", label: "Scheduled" },
            { value: "Completed", label: "Completed" },
          ]}
        />
      </Modal>
    </>
  )
}

export default RequesterDonorCard
