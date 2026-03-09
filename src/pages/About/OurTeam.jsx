import React from "react";
import "../../styles/OurTeam.css";
import ownerImg from "../../assets/images/Owner.jpg";
import keImage from "../../assets/images/Chairman.jpg";
import mariettaImg from "../../assets/images/Opt-P Director.jpg"; 
import kikuoImg from "../../assets/images/Vice President.jpg";

const OurTeam = () => {
  const organization = [
    { name: "MR. KO OTSUKA", role: "OWNER", img: ownerImg },
    { name: "MR. KEI OTSUKA", role: "CHAIRMAN & PRESIDENT", img: keImage },
    { name: "MS. MARIETTA CANAYON", role: "OPT-P DIRECTOR", img: mariettaImg },
    { name: "MR. KIKUO NAKAYAMA", role: "VICE-PRESIDENT", img: kikuoImg },
  ];

  const management = [
    { department: "ADMINISTRATION", teams: ["Human Resources", "Accounting", "IT"] },
    { department: "PLANNING", teams: ["Planning", "Purchasing"] },
    { department: "SALES", teams: ["Sales", "DCC"] },
    { department: "PRODUCTION", teams: ["Production 1", "Production 2", "Finishing, Inspection & Packing"] },
    { department: "TECHNICAL", teams: ["Technical", "Maintenance"] },
  ];


  return (
    <div className="our-team-section company-section">
      <h2>Our Team</h2>

      {/* ORGANIZATION */}
      <div className="organization-section mb-5">
        <h3 className="section-title">Organization</h3>
        <div className="row">
          {organization.map((person, index) => (
            <div key={index} className="col-md-3 col-sm-6 mb-4">
              <div className="team-card shadow-lg h-100">
                <img src={person.img} alt={person.name} className="team-img" />
                <div className="team-info">
                  <h5 className="team-name">{person.name}</h5>
                  <p className="team-role">{person.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MANAGEMENT TEAM */}
      <div className="management-section">
        <h3 className="section-title">Management Team</h3>
        <div className="row">
          {management.map((dept, index) => (
            <div key={index} className="col-md-4 col-sm-6 mb-4">
              <div className="management-card shadow-sm h-100 p-3">
                <h5 className="management-dept">{dept.department}</h5>
                <ul className="management-teams">
                  {dept.teams.map((team, idx) => (
                    <li key={idx}>{team}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
