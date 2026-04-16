import React from "react";
import "../../styles/company.css";
import { useCMS } from "../../admin/context/CMSContext";

// Convert any Drive URL format to the thumbnail API so <img> renders correctly
const driveImgSrc = (url, size = 'w800') => {
  if (!url) return null;
  const m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=${size}`;
  return url;
};

const CompanyProfile = () => {
  const { state } = useCMS();
  const factories   = state.about.factories;
  const info        = state.about.companyInfo;

  return (
    <div className="company-profile-section company-section">
      <h2 className="mb-5 text-center">Company Profile</h2>

      {/* FACTORY CARDS */}
      <div className="row factory-cards mb-5">
        {factories.map((factory, index) => (
          <div className="col-md-4 mb-4" key={factory.id || index}>
            <div className="card shadow-lg h-100 factory-card">
              {factory.img
                ? <img src={driveImgSrc(factory.img, 'w800')} className="card-img-top" alt={factory.name} />
                : <div style={{ height:200, background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', color:'#9ca3af', fontSize:40 }}>🏭</div>
              }
              <div className="card-body">
                <h5 className="card-title">{factory.name}</h5>
                <p className="card-text">
                  {factory.lotArea      && <><span className="badge bg-danger me-1">LOT AREA:</span> {factory.lotArea}<br /></>}
                  {factory.buildingArea && <><span className="badge bg-danger me-1">BUILDING AREA:</span> {factory.buildingArea}<br /></>}
                  {factory.address      && <><span className="badge bg-danger me-1">Address:</span> {factory.address}<br /></>}
                  {factory.built        && <><span className="badge bg-danger me-1">Built:</span> {factory.built}</>}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* COMPANY DETAILS */}
      <div className="company-details mt-5">
        <h3 className="mb-4 text-center">Company Information</h3>
        <div className="row g-4">
          {/* General Info */}
          <div className="col-md-6">
            <div className="info-card p-4 rounded shadow-sm h-100">
              <h5 className="info-title mb-3">General Info</h5>
              <p><span className="badge bg-danger me-2">Company:</span> {info.company}</p>
              <p><span className="badge bg-danger me-2">Established:</span> {info.established}</p>
              <p><span className="badge bg-danger me-2">Operations:</span> {info.operations}</p>
              <p><span className="badge bg-danger me-2">Business Type:</span> {info.businessType}</p>
            </div>
          </div>
          {/* Contacts */}
          <div className="col-md-6">
            <div className="info-card p-4 rounded shadow-sm h-100">
              <h5 className="info-title mb-3">Contacts</h5>
              <p><span className="badge bg-danger me-2">Telephone:</span> {info.telephone}</p>
              <p><span className="badge bg-danger me-2">Smart:</span> {info.smart}</p>
              <p><span className="badge bg-danger me-2">Globe:</span> {info.globe}</p>
              <p><span className="badge bg-danger me-2">Manila Line:</span> {info.manilaLine}</p>
            </div>
          </div>
          {/* Products */}
          <div className="col-md-6">
            <div className="info-card p-4 rounded shadow-sm h-100">
              <h5 className="info-title mb-3">Products</h5>
              <p>{info.products}</p>
            </div>
          </div>
          {/* Workforce */}
          <div className="col-md-6">
            <div className="info-card p-4 rounded shadow-sm h-100">
              <h5 className="info-title mb-3">Workforce</h5>
              <p><span className="badge bg-danger me-2">Total Manpower:</span> {info.workforce}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;