import React, { useState } from "react";
import "../../styles/OurBase.css";
import { useCMS } from "../../admin/context/CMSContext";

// Original static images as fallbacks
import factory1Img  from "../../assets/images/Factory1.jpg";
import factory3Img  from "../../assets/images/Factory3.jpg";
import japanHQImg   from "../../assets/images/HeadOffice.jpg";
import yoriiImg     from "../../assets/images/yorii1.jpg";
import ogoeImg      from "../../assets/images/Fukushima.jpg";
import iideImg      from "../../assets/images/Fukushima2.jpg";
import shanghai1Img from "../../assets/images/Shanghai.jpg";
import shanghai2Img from "../../assets/images/Shanghai2.jpg";

const FALLBACK_IMGS = {
  "OHTSUKA POLY-TECH PHILIPPINES, INC.":                         factory1Img,
  "OHTSUKA POLY-TECH (PHILIPPINES) INC. FACTORY 3":              factory3Img,
  "JAPAN HEAD OFFICE":                                            japanHQImg,
  "YORII CENTER":                                                 yoriiImg,
  "FUKUSHIMA OGOE PLANT":                                         ogoeImg,
  "FUKUSHIMA ONO PLANT":                                          iideImg,
  "SHANGHAI RISHANG AUTOMOBILE RUBBERT PRODUCTS CO., LTD":       shanghai1Img,
  "SHANGHAI O.P.T RUBBER & PLASTIC CO., LTD.":                   shanghai2Img,
};

const OurBase = () => {
  const { state } = useCMS();
  const bases = state.about.bases;
  const [activeMap, setActiveMap] = useState(null);

  // Convert any Drive URL format to the thumbnail API so <img> renders correctly
  const driveImgSrc = (url, size = 'w800') => {
    if (!url) return null;
    const m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=${size}`;
    return url;
  };

  return (
    <div className="our-base-section company-section">
      <h2>Our Base</h2>
      <div className="row">
        {bases.map((base) => {
          const imgSrc = base.img ? driveImgSrc(base.img, 'w800') : FALLBACK_IMGS[base.name] || null;
          return (
            <div key={base.id} className="col-md-3 col-sm-6 mb-4">
              <div className="base-card shadow-lg h-100">
                {imgSrc
                  ? <img src={imgSrc} alt={base.name} className="base-img" />
                  : <div style={{ height:180, background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, color:'#d1d5db' }}>📍</div>
                }
                <div className="base-info p-3">
                  <h5>{base.name}</h5>
                  <p>{base.address}</p>
                  {base.website && (
                    <p>
                      Visit Website:{" "}
                      <a href={base.website} target="_blank" rel="noopener noreferrer" className="website-link">
                        {base.websiteName || base.website}
                      </a>
                    </p>
                  )}
                  {base.mapUrl && (
                    <button className="btn btn-danger btn-sm" onClick={() => setActiveMap(base.mapUrl)}>
                      View on Map
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeMap && (
        <div className="map-modal" onClick={() => setActiveMap(null)}>
          <div className="map-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setActiveMap(null)}>&times;</button>
            <iframe
              title="Company Location Map"
              src={activeMap}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OurBase;