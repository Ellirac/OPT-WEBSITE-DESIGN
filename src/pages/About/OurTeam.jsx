import React from "react";
import "../../styles/OurTeam.css";
import { useCMS } from "../../admin/context/CMSContext";

import ownerImg    from "../../assets/images/Owner.png";
import keImage     from "../../assets/images/Chairman.png";
import mariettaImg from "../../assets/images/President.png";
import kikuoImg    from "../../assets/images/Vice President.png";

const FALLBACK_IMGS = {
  "MR. KO OTSUKA":        ownerImg,
  "MR. KEI OTSUKA":       keImage,
  "MS. MARIETTA CANAYON": mariettaImg,
  "MR. KIKUO NAKAYAMA":   kikuoImg,
};

const OurTeam = () => {
  const { state } = useCMS();
  const organization = state.about.organization;
  const management   = state.about.management;

  // Convert any Drive URL format to the thumbnail API so <img> renders correctly
  const driveImgSrc = (url, size = 'w400') => {
    if (!url) return null;
    const m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=${size}`;
    return url;
  };

  return (
    <div className="our-team-section company-section">
      <h2>Our Team</h2>

      <div className="organization-section mb-5">
        <h3 className="section-title">Organization</h3>
        <div className="row justify-content-center">
          {organization.map((person) => {
            const imgSrc = person.img ? driveImgSrc(person.img, 'w400') : FALLBACK_IMGS[person.name] || null;
            return (
              <div key={person.id} className="col-6 col-sm-6 col-md-3 mb-4">
                <div className="team-card shadow-lg h-100">
                  <div className="team-img-wrapper">
                    {imgSrc
                      ? <img src={imgSrc} alt={person.name} className="team-img"
                          onError={e => {
                            const m = imgSrc && (imgSrc.match(/[?&]id=([a-zA-Z0-9_-]+)/) || imgSrc.match(/\/d\/([a-zA-Z0-9_-]+)/));
                            if (m && !e.target.dataset.fallback) { e.target.dataset.fallback='1'; e.target.src=`https://drive.google.com/uc?export=view&id=${m[1]}`; }
                            else { e.target.style.opacity='0.3'; }
                          }}
                        />
                      : <div style={{ height:200, background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:50, color:'#d1d5db' }}>👤</div>
                    }
                  </div>
                  <div className="team-info">
                    <h5 className="team-name">{person.name}</h5>
                    <p className="team-role">{person.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="management-section">
        <h3 className="section-title">Management Team</h3>
        <div className="row">
          {management.map((dept) => (
            <div key={dept.id} className="col-12 col-sm-6 col-md-4 mb-4">
              <div className="management-card shadow-sm h-100 p-3">
                <h5 className="management-dept">{dept.department}</h5>
                <ul className="management-teams">
                  {(dept.teams || []).map((team, idx) => (
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