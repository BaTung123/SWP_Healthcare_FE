//Xem danh sách nhóm máu phù hợp theo loại thành phần máu (toàn phần, hồng cầu, huyết tương,...).
import React, { useState } from "react";
import "../../styles/compatibleBloodPage.css";

const bloodCompatibility = {
  "Whole Blood": {
    A: ["A", "AB"],
    B: ["B", "AB"],
    AB: ["AB"],
    O: ["A", "B", "AB", "O"],
  },
  "Red Cells": {
    A: ["A", "AB"],
    B: ["B", "AB"],
    AB: ["AB"],
    O: ["A", "B", "AB", "O"],
  },
  Plasma: {
    A: ["A", "O"],
    B: ["B", "O"],
    AB: ["A", "B", "AB", "O"],
    O: ["O"],
  },
  Platelets: {
    A: ["A", "AB"],
    B: ["B", "AB"],
    AB: ["AB"],
    O: ["A", "B", "AB", "O"],
  },
};

const bloodTypes = ["A", "B", "AB", "O"];
const componentTypes = Object.keys(bloodCompatibility);

function CompatibleBloodPage() {
  const [selectedComponent, setSelectedComponent] = useState("Whole Blood");

  const handleComponentChange = (e) => {
    setSelectedComponent(e.target.value);
  };

  return (
    <div className="blood-page-container">
      <h1 className="page-title">Blood Compatibility Lookup</h1>

      <div className="search-section-1">
        <div className="left-controls">
          <label htmlFor="componentSelect">Select Blood Component:</label>
          <select
            id="componentSelect"
            value={selectedComponent}
            onChange={handleComponentChange}
          >
            {componentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="results-section">
        <h2>Compatibility Table – {selectedComponent}</h2>
        <table className="results-table">
          <thead>
            <tr>
              <th>Donor Blood Type</th>
              <th>Compatible Recipient Types</th>
            </tr>
          </thead>
          <tbody>
            {bloodTypes.map((donor) => (
              <tr key={donor}>
                <td>{donor}</td>
                <td>{bloodCompatibility[selectedComponent][donor].join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CompatibleBloodPage;

