//Thống kê tổng quan: người hiến, yêu cầu máu, sự kiện.
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaUser, FaHandHoldingMedical, FaPercentage, FaTint } from 'react-icons/fa';
ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Thêm options chung cho chart
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    title: { display: false }
  },
  layout: {
    padding: 0
  }
};

const AdminDashboardPage = () => {

  const bloodDonorsByMonth = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7"],
    datasets: [
      {
        label: "Người hiến máu",
        data: [120, 150, 180, 200, 170, 210, 230],
        borderColor: "#e74c3c",
        backgroundColor: "#e74c3c33",
        tension: 0.4,
      },
      {
        label: "Yêu cầu máu",
        data: [80, 100, 130, 160, 140, 180, 190],
        borderColor: "#2980b9",
        backgroundColor: "#2980b933",
        tension: 0.4,
      },
    ],
  };

  const bloodTypeRatio = {
    labels: ["A", "B", "AB", "O"],
    datasets: [
      {
        data: [30, 25, 15, 30],
        backgroundColor: ["#e74c3c", "#f1c40f", "#8e44ad", "#2980b9"],
        hoverOffset: 4,
      },
    ],
  };

  const requestFulfillment = {
    labels: ["Đã đáp ứng", "Chưa đáp ứng"],
    datasets: [
      {
        data: [75, 25],
        backgroundColor: ["#27ae60", "#c0392b"],
        hoverOffset: 4,
      },
    ],
  };

  const eventsByWeekday = {
    labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
    datasets: [
      {
        label: "Số sự kiện hiến máu",
        data: [2, 1, 3, 2, 4, 2],
        backgroundColor: "#16a085",
        borderRadius: 6,
      },
    ],
  };

  // Dữ liệu mẫu cho Over View
  const totalUsers = 5000;
  const totalDonors = 1200;
  const donationRate = ((totalDonors / totalUsers) * 100).toFixed(1); // Tỉ lệ hiến máu
  const pendingRequests = 35;

  return (
    <>
      {/* Over View Section */}
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow transition-transform hover:scale-105 min-h-[120px]">
            <FaUser className="text-4xl text-[#2980b9] mb-2" />
            <div className="text-2xl font-bold">{totalUsers}</div>
            <div className="text-sm text-gray-600 mt-1">Tổng số người tham gia</div>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow transition-transform hover:scale-105 min-h-[120px]">
            <FaHandHoldingMedical className="text-4xl text-[#e74c3c] mb-2" />
            <div className="text-2xl font-bold">{totalDonors}</div>
            <div className="text-sm text-gray-600 mt-1">Tổng số người hiến máu</div>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow transition-transform hover:scale-105 min-h-[120px]">
            <FaPercentage className="text-4xl text-[#16a085] mb-2" />
            <div className="text-2xl font-bold">{donationRate}%</div>
            <div className="text-sm text-gray-600 mt-1">Tỉ lệ hiến máu</div>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-[#fff0f0] rounded-2xl shadow transition-transform hover:scale-105 min-h-[120px]">
            <FaTint className="text-4xl text-[#c0392b] mb-2" />
            <div className="text-2xl font-bold">{pendingRequests}</div>
            <div className="text-sm text-gray-600 mt-1">Yêu cầu máu chưa đáp ứng</div>
          </div>
        </div>
      </div>
      {/* Phần dashboard biểu đồ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#eaf3fb] text-[#e74c3c] max-h-screen">
        <div className="rounded-2xl shadow-lg p-4 bg-white col-span-1 md:col-span-2 h-[330px] flex flex-col">
          <h2 className="text-xl font-bold mb-2">Số lượng người hiến máu & yêu cầu máu theo tháng</h2>
          <div className="flex-1 flex items-center">
            <Line data={bloodDonorsByMonth} options={chartOptions} height={260} />
          </div>
        </div>

        <div className="rounded-2xl shadow-lg p-4 bg-white h-[330px]">
          <div className="h-full">
            <h2 className="text-xl font-bold mb-2">Tỉ lệ các nhóm máu đã hiến</h2>
            <div className="flex items-center justify-center h-[90%]">
              <Doughnut data={bloodTypeRatio} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl shadow-lg p-4 bg-white h-[330px]">
          <div className="h-full">
            <h2 className="text-xl font-bold mb-2">Tỉ lệ yêu cầu máu đã được đáp ứng</h2>
            <div className="flex items-center justify-center h-[90%]">
              <Doughnut data={requestFulfillment} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl shadow-lg p-4 bg-white col-span-1 md:col-span-2 h-[330px] flex flex-col">
          <h2 className="text-xl font-bold mb-2">Số lượng sự kiện hiến máu theo ngày</h2>
          <div className="flex-1 flex items-center">
            <Bar data={eventsByWeekday} options={chartOptions} height={260} />
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboardPage

