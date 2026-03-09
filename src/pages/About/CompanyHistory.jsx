import React from "react";
import "../../styles/CompanyTimeline.css";

const CompanyHistory = () => {
  const history = [
    { year: 1948, event: "Began as a rubber factory in Ueno Taito-ku Tokyo, started supply to Honda Motors." },
    { year: 1974, event: "Completed FUKUSHIMA ONO FACTORY." },
    { year: 1985, event: "FUKUSHIMA OGOE FACTORY was established." },
    { year: 1992, event: "OHTSUKA POLY-TECH (PHILIPPINES) INC. was established." },
    { year: 1995, event: "SHANGHAI O.P.T RUBBER & PLASTIC Co., LTD. was established." },
    { year: 2005, event: "OPT Yorii Center was established." },
    { year: 2015, event: "OHTSUKA POLY-TECH (PHILIPPINES) INC. FACTORY 2 was established." },
    { year: 2018, event: "Increased OHTSUKA POLY-TECH PHILIPPINES capital to PHP 400,000,000." },
    { year: 2023, event: "OHTSUKA POLY-TECH (PHILIPPINES) INC. FACTORY 3 was established." },
  ];

  return (
    <div className="company-history-section company-section">
      <h2>Company History</h2>
      <div className="history-grid">
        {history
          .slice()
          .reverse()
          .map((item, index) => (
            <div key={index} className="history-card">
              <div className="history-year">{item.year}</div>
              <div className="history-event">{item.event}</div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyHistory;
