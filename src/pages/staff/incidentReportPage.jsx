//Theo dõi và xử lý các tình huống phát sinh (thiếu máu, huy động người hiến,...).
import React from 'react';
import '../../styles/incidentReportPage.css';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

function IncidentReportPage() {
  const incidents = [
    {
      id: 1,
      title: 'Sự cố thiết bị',
      description: 'Máy đo huyết áp không hoạt động',
      date: '2024-03-15',
      status: 'processing',
    },
    {
      id: 2,
      title: 'Sự cố hệ thống',
      description: 'Lỗi kết nối mạng',
      date: '2024-03-14',
      status: 'resolved',
    },
  ];

  return (
    <div className="admin-layout">
      <div className="dashboard-container">
        <h1>⚠️ Báo Cáo Sự Cố</h1>
        <p className="subtext">Theo dõi và xử lý các sự cố trong hệ thống</p>

        <div className="incident-container">
          <div className="incident-list">
            {incidents.map((incident) => (
              <div key={incident.id} className="incident-card">
                <div className="incident-header">
                  <h3>{incident.title}</h3>
                  <span className={`status ${incident.status}`}>
                    {incident.status === 'processing' ? (
                      <><FaExclamationTriangle /> Đang xử lý</>
                    ) : (
                      <><FaCheckCircle /> Đã giải quyết</>
                    )}
                  </span>
                </div>
                <p className="incident-description">{incident.description}</p>
                <div className="incident-footer">
                  <span className="incident-date">Ngày báo cáo: {incident.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentReportPage;