import React, { useState } from "react";
import CompanyProfile from "./CompanyProfile";
import OwnerMessage from "./OwnerMessage";
import CompanyHistory from "./CompanyHistory";
import OurTeam from "./OurTeam";
import OurBase from "./OurBase";
import "../../styles/company.css";

const CompanyLayout = () => {
  const [activeSection, setActiveSection] = useState("profile");

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <CompanyProfile />;
      case "owners":
        return <OwnerMessage />;
      case "history":
        return <CompanyHistory />;
      case "team":
        return <OurTeam />;
      case "base":
        return <OurBase />;
      default:
        return <CompanyProfile />;
    }
  };

  return (
    <div className="company-page container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 company-sidebar mb-4">
          <button
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => setActiveSection("profile")}
          >
            Company Profile
          </button>
          <button
            className={activeSection === "owners" ? "active" : ""}
            onClick={() => setActiveSection("owners")}
          >
            Message from the Owners
          </button>
          <button
            className={activeSection === "history" ? "active" : ""}
            onClick={() => setActiveSection("history")}
          >
            Company History
          </button>
          <button
            className={activeSection === "team" ? "active" : ""}
            onClick={() => setActiveSection("team")}
          >
            Our Team
          </button>
          <button
            className={activeSection === "base" ? "active" : ""}
            onClick={() => setActiveSection("base")}
          >
            Our Base
          </button>
        </div>

        {/* Content */}
        <div className="col-md-9 col-lg-10 company-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CompanyLayout;
