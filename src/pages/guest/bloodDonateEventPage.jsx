import { useEffect, useState } from "react";
import { Card, Badge, Button, message, } from "antd";
import { useNavigate } from "react-router-dom";
import { GetAllEvents, UpdateEventStatus } from "../../services/bloodDonationEvent";
import { getAllBloodDonationApplication } from "../../services/donorRegistration";
import dayjs from "dayjs";

const BloodDonationEventPage = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const apiEvents = await GetAllEvents();
      console.log('apiEvents:', apiEvents); 
      const eventList = apiEvents.data.events;
      console.log('eventList:', eventList); 
      const apiDonateApllication = await getAllBloodDonationApplication();
      console.log('apiDonateApllication:', apiDonateApllication);

      await Promise.all(
        eventList.map(async (event) => {
          const now = dayjs();
          const start = dayjs(event.eventStartTime);
          const end = dayjs(event.eventEndTime);
          const donateApplicationList = apiDonateApllication.filter(app => app.eventId === event.id);
          const donateApplicationCount = donateApplicationList.length;

          if (now.isAfter(start) && now.isBefore(end)) {
            const updatedEventData = {
              ...event,
              status: 1
            }
            const updatedEventRes = await UpdateEventStatus(updatedEventData)
            console.log("updatedEventRes:", updatedEventRes);
          }
          else if (now.isAfter(end)) {
            const updatedEventData = {
              ...event,
              status: 3
            }
            const updatedEventRes = await UpdateEventStatus(updatedEventData)
            console.log("updatedEventRes:", updatedEventRes);
          } 
          else if (donateApplicationCount === event.targetParticipant) {
            const updatedEventData = {
              ...event,
              status: 2
            }
            const updatedEventRes = await UpdateEventStatus(updatedEventData)
            console.log("updatedEventRes:", updatedEventRes);
          }
        })
      )

      const refreshedEvents = await GetAllEvents();
      setEvents(refreshedEvents.data.events);
    } catch (error) {
      setEvents([]);
      message.error("Không thể tải danh sách sự kiện");
      console.error("Lỗi khi lấy danh sách sự kiện:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log("event:", events)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sự kiện hiến máu</h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...events].sort((a,b) => {
            if (a.status === b.status) 
              return 0;
            return a.status - b.status;
          })
          .map((event) => (
            <div className="group" key={event.id}>
              <Card
                className="transition-transform duration-300 hover:scale-105 hover:shadow-xl relative"
                title={event.name}
                extra={(() => {
                  const now = dayjs();
                  const start = dayjs(event.eventStartTime);
                  const end = dayjs(event.eventEndTime);

                  let badgeProps = {
                    status: "processing",
                    text: (
                      <span style={{ fontSize: 16 }}>Đang diễn ra</span>
                    ),
                  };

                  if (event.status === 4) {
                    badgeProps = {
                      status: "default",
                      text: <span style={{ fontSize: 16, color: "#888" }}>Đã hủy</span>,
                    };
                  } else if (event.status === 2) {
                    badgeProps = {
                      status: "warning",
                      text: <span style={{ fontSize: 16, color: "#faad14" }}>Đã đầy</span>,
                    };
                  } else {
                    if (now.isBefore(start)) {
                      badgeProps = {
                        status: "processing",
                        text: <span style={{ fontSize: 16 }}>Sắp diễn ra</span>,
                      };
                    } else if (now.isAfter(end)) {
                      badgeProps = {
                        status: "error",
                        text: <span style={{ fontSize: 16, color: "#ff4d4f" }}>Đã kết thúc</span>,
                      };
                    } else {
                      badgeProps = {
                        status: "success",
                        text: <span style={{ fontSize: 16, color: "#52c41a" }}>Đang diễn ra</span>,
                      };
                    }
                  }
                  return <Badge {...badgeProps} />;
                })()}
                style={{ width: "100%" }}
              >
                <p><strong>Loại sự kiện:</strong> {event.type}</p>
                <p><strong>Địa điểm:</strong> {event.locationName}</p>
                <p><strong>Địa chỉ:</strong> {event.locationAddress}</p>
                <p>
                  <strong>Thời gian:</strong> {dayjs(event.eventStartTime).format("DD/MM/YYYY")} - {dayjs(event.eventEndTime).format("DD/MM/YYYY")}
                </p>
                <p><strong>Chỉ tiêu người tham gia:</strong> {event.targetParticipant}</p>
                {event.status === 1 &&
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      type="primary"
                      className="mt-2 w-full"
                      onClick={() => navigate(`/member/register-donation?eventId=${event.id}`)}
                    >
                      Đăng kí tham gia
                    </Button>
                  </div>
                }
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BloodDonationEventPage;
