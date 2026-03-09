import React from "react";
import factory1 from "../../assets/images/Factory1.jpg";
import factory2 from "../../assets/images/Factory2.jpg";
import factory3 from "../../assets/images/Factory3.jpg";
import "../../styles/company.css";

const CompanyProfile = () => {
  return (
    <div className="company-profile-section company-section">
      <h2 className="mb-5 text-center">Company Profile</h2>

      {/* FACTORY CARDS */}
      <div className="row factory-cards mb-5">
        {[
          {
            img: factory1,
            name: "Factory 1",
            lot: "18,959 m²",
            building: "8,578 m²",
            address: "Block 5 Lot 1 Binary St., LISPP-1 SEPZ, Bo. Diezmo, Cabuyao, Laguna 4025",
          },
          {
            img: factory2,
            name: "Factory 2",
            lot: "10,944 m²",
            building: "7,367 m²",
            address: "Block 3 Lot 2 Binary St., LISPP-1 SEPZ, Bo. Diezmo, Cabuyao, Laguna 4025",
            built: "Dec 5, 2015",
          },
          {
            img: factory3,
            name: "Factory 3",
            lot: "16,938 m²",
            building: "14,676 m²",
            address: "Block 10 Lot 1B and 2A Mega Drive St., LISPP-4 PEZA, Brgy. Bulihan, Malvar, Batangas",
            built: "Nov. 2023",
          },
        ].map((factory, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card shadow-lg h-100 factory-card">
              <img src={factory.img} className="card-img-top" alt={factory.name} />
              <div className="card-body">
                <h5 className="card-title">{factory.name}</h5>
                <p className="card-text">
                  <span className="badge bg-danger me-1">LOT AREA:</span> {factory.lot}<br />
                  <span className="badge bg-danger me-1">BUILDING AREA:</span> {factory.building}<br />
                  <span className="badge bg-danger me-1">Address:</span> {factory.address}<br />
                  {factory.built && (
                    <>
                      <span className="badge bg-danger me-1">Built:</span> {factory.built}
                    </>
                  )}
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
              <p><span className="badge bg-danger me-2">Company:</span> Ohtsuka Poly-Tech Philippines, Inc.</p>
              <p><span className="badge bg-danger me-2">Established:</span> September 11, 1992</p>
              <p><span className="badge bg-danger me-2">Operations:</span> May 03, 1993</p>
              <p><span className="badge bg-danger me-2">Business Type:</span> Manufacture Rubber & Plastic Parts for Automobiles, Electrical & Household appliances</p>
            </div>
          </div>

          {/* Contacts */}
          <div className="col-md-6">
            <div className="info-card p-4 rounded shadow-sm h-100">
              <h5 className="info-title mb-3">Contacts</h5>
              <p><span className="badge bg-danger me-2">Telephone:</span> (049) 543-0622/23/25 loc. 809 & 810</p>
              <p><span className="badge bg-danger me-2">Smart:</span> 0939-939-3611 / 0998-974-0478</p>
              <p><span className="badge bg-danger me-2">Globe:</span> 0917-718-7284</p>
              <p><span className="badge bg-danger me-2">Manila Line:</span> (02) 475-1675</p>
            </div>
          </div>

          {/* Products */}
          <div className="col-md-6">
            <div className="info-card p-4 rounded shadow-sm h-100">
              <h5 className="info-title mb-3">Products</h5>
              <p>Rubber & Plastic parts for Automobiles, Electrical & Household appliances</p>
            </div>
          </div>

          {/* Workforce */}
          <div className="col-md-6">
            <div className="info-card p-4 rounded shadow-sm h-100">
              <h5 className="info-title mb-3">Workforce</h5>
              <p><span className="badge bg-danger me-2">Total Manpower:</span> 748 (as of December 2024)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
