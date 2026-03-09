import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "../styles/company.css";

const About = () => {
  const location = useLocation();
  const current = location.pathname.split("/")[2] || "profile";

  return (
    <div className="company-page">
      <div className="container">
        <div className="row">

          {/* SIDEBAR */}
          <div className="col-md-3 mb-4">
            <div className="company-sidebar">
              <Link
                className={current === "profile" ? "active" : ""}
                to="/about/profile"
              >
                Company Profile
              </Link>
              <Link
                className={current === "owners" ? "active" : ""}
                to="/about/owners"
              >
                Message from the Owners
              </Link>
              <Link
                className={current === "history" ? "active" : ""}
                to="/about/history"
              >
                Company History
              </Link>
              <Link
                className={current === "team" ? "active" : ""}
                to="/about/team"
              >
                Our Team
              </Link>
              <Link
                className={current === "base" ? "active" : ""}
                to="/about/base"
              >
                Our Base
              </Link>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="col-md-9">
            <div className="company-content">
              {/* Render the subpage here */}
              <Outlet />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;
