import React, { useState } from "react";
import AutomobileProduct from "./AutomobileProduct";
import MotorParts from "./MotorProducts";
import "../../styles/company.css";

const ProductLayout = () => {
  const [activeSection, setActiveSection] = useState("automobile");

  const renderContent = () => {
    switch (activeSection) {
      case "automobile":
        return <AutomobileProduct />;
      case "motorcycle":
        return <MotorParts />;
      default:
        return <AutomobileProduct />;
    }
  };

  return (
    <div className="company-page container-fluid">
      <div className="row">

        {/* SIDEBAR */}
        <div className="col-md-3 col-lg-2 company-sidebar mb-4">
          <button
            className={activeSection === "automobile" ? "active" : ""}
            onClick={() => setActiveSection("automobile")}
          >
            Automobile Products
          </button>

          <button
            className={activeSection === "motorcycle" ? "active" : ""}
            onClick={() => setActiveSection("motorcycle")}
          >
            Rubber Parts for Motorcycle
          </button>
        </div>

        {/* CONTENT */}
        <div className="col-md-9 col-lg-10 company-content">
          {renderContent()}
        </div>

      </div>
    </div>
  );
};

export default ProductLayout;