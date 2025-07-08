import { useEffect, useState } from "react";
import { Card, Badge, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { GetAllBloodDonationEvents, UpdateBloodDonationEvent } from "../../services/bloodDonationEvent";
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
      const eventsRes = await GetAllBloodDonationEvents();
      const now = dayjs()
      console.log("date now:", now)
      console.log("eventsRes:", eventsRes)

      const eventsToUpdate = eventsRes.filter(event => dayjs(event.endDate).isBefore(now, 'day') && event.isActive)
      console.log("eventsToUpdate:", eventsToUpdate)

      await Promise.all(
        eventsToUpdate.map(async (event) => {
            const updateEventObj = {
                ...event,
                isActive: false
            }
            console.log("eventId:", event.eventId)
            console.log("updateEventObj:", updateEventObj)
            const updateEventRes = await UpdateBloodDonationEvent(event.eventId, updateEventObj)
            console.log("updateEventRes:", updateEventRes)
        })
      )

      const updatedEvents = eventsRes.map(event => {
          const wasUpdated = eventsToUpdate.find(e => e.eventId === event.eventId);
          return wasUpdated ? { ...event, isActive: false } : event;
      });

      setEvents(updatedEvents);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sự kiện:", error);
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
            if (a.isActive === b.isActive) 
              return 0;
            return a.isActive ? -1 : 1;
          })
          .map((event) => (
            <div className="group">
              <Card
                className="transition-transform duration-300 hover:scale-105 hover:shadow-xl relative"
                key={event.eventId}
                title={event.eventName}
                extra={(() => {
                  const now = dayjs();
                  const isUpcoming = dayjs(event.eventDate).isAfter(now, 'day');
                  const isEnded = dayjs(event.endDate).isBefore(now, 'day');

                  let badgeProps = {
                    status: "processing",
                    text: (
                      <>
                        <span style={{ fontSize: 16 }}>Đang diễn ra</span>
                        <style>
                          {`
                            .ant-badge-status-dot {
                            width: 10px !important;
                            height: 10px !important;
                            }
                        `}
                        </style>
                      </>
                    ),
                  };

                  if (isUpcoming) {
                    badgeProps = {
                      status: "warning",
                      text: (
                        <>
                          <span style={{ fontSize: 16, color: "#faad14" }}>Sắp diễn ra</span>
                          <style>
                            {`
                            .ant-badge-status-dot {
                                width: 10px !important;
                                height: 10px !important;
                            }
                            `}
                          </style>
                        </>
                      ),
                    };
                  } else if (isEnded || !event.isActive) {
                    badgeProps = {
                      status: "error",
                      text: (
                        <>
                          <span style={{ fontSize: 16, color: "#ff4d4f" }}>Đã kết thúc</span>
                          <style>
                            {`
                            .ant-badge-status-dot {
                                width: 10px !important;
                                height: 10px !important;
                            }
                            `}
                          </style>
                        </>
                      ),
                    };
                  }
                  return <Badge {...badgeProps} />;
                })()}
                style={{ width: "100%" }}
              >
                <p><strong>Địa điểm:</strong> {event.location}</p>
                <p>
                  <strong>Thời gian:</strong> {dayjs(event.eventDate).format("DD/MM/YYYY")} -{" "}
                  {dayjs(event.endDate).format("DD/MM/YYYY")}
                </p>
                <p>
                  <strong>Số người đăng ký:</strong> {event.registeredDonors ?? 0}/{event.targetDonors ?? "?"}
                </p>
                <p>{event.description?.slice(0, 100)}...</p>
                {event.isActive &&
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      type="primary"
                      className="mt-2 w-full"
                      onClick={() => navigate(`/member/register-donation?eventId=${event.eventId}`)}
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
