import React from "react";
import "../../styles/CompanyTimeline.css";
import { useCMS } from "../../admin/context/CMSContext";

const CompanyHistory = () => {
  const { state } = useCMS();
  const history = [...state.about.history].sort((a, b) => a.year - b.year);

  return (
    <div className="company-history-section company-section">
      <h2>Company History</h2>
      <div className="history-grid">
        {history
          .slice()
          .reverse()
          .map((item) => (
            <div key={item.id} className="history-card">
              <div className="history-year">{item.year}</div>
              <div className="history-event">{item.event}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CompanyHistory;
