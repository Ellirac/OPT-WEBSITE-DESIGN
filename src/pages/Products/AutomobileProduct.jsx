import { useState, useEffect, useRef, useCallback } from "react";
import "../../styles/AutomobileProducts.css";

// ─── DATA ────────────────────────────────────────────────────────────────────

const parts = {
  1: { name: "Packing and Seal",  displayNum: 1, img: "automobile/New Update/PACKING and SEAL.png",
       desc: "Products for sealing applications to prevent or seal passage of oil, fuel oil, water, air, dust, and other contaminants across mating surfaces and joints.",
       category: "seal",     categoryName: "Packing and Seal" },
  2: { name: "Damper and Mount",  displayNum: 2, img: "automobile/New Update/DAMPER and MOUNT 1.png",
       desc: "Vulcanized rubber products used for the purpose of vibration transmission prevention and interference.",
       category: "mount",    categoryName: "Damper and Mount" },
  3: { name: "Damper and Mount",  displayNum: 3, img: "automobile/New Update/DAMPER and MOUNT 2.png",
       desc: "Vulcanized rubber products used for the purpose of vibration transmission prevention and interference.",
       category: "mount",    categoryName: "Damper and Mount" },
  4: { name: "Damper and Mount",  displayNum: 3, img: "automobile/New Update/DAMPER and MOUNT 2.png",
       desc: "Vulcanized rubber products used for the purpose of vibration transmission prevention and interference.",
       category: "mount",    categoryName: "Damper and Mount" },
  5: { name: "Boot and Cover",    displayNum: 4, img: "automobile/New Update/BOOT and COVER.png",
       desc: "Flexible rubber boots designed to protect steering and suspension joints from dust, moisture, and road debris, ensuring reliable long-term joint performance.",
       category: "cover",    categoryName: "Boot and Cover" },
  6: { name: "Boot and Cover",    displayNum: 5, img: "automobile/New Update/BOOT and COVER (1).png",
       desc: "Accordion-style rubber covers engineered to shield driveshaft CV joints and rack-and-pinion assemblies from contamination while retaining lubricating grease.",
       category: "cover",    categoryName: "Boot and Cover" },
  7: { name: "Boot and Cover",    displayNum: 6, img: "automobile/New Update/BOOT and COVER (2).png",
       desc: "Protective rubber covers for brake and clutch components, preventing fluid contamination and extending service life under repeated thermal cycling.",
       category: "cover",    categoryName: "Boot and Cover" },
  8: { name: "Others",            displayNum: 6, img: "automobile/New Update/OTHERS.png",
       desc: "Specialized components including grommets, bushings, bump stops, and custom-molded rubber-to-metal parts suited for diverse automotive and industrial applications.",
       category: "others",   categoryName: "Others" },
  9: { name: "Exterior Products", displayNum: 7, img: "automobile/New Update/EXTERIOR PRODUCTS.png",
       desc: "High-grade exterior rubber parts such as weather strips, door seals, and body moldings that provide weather resistance, acoustic insulation, and a refined finish.",
       category: "products", categoryName: "Exterior Products" },
};

const pinPositions = {
  1: { top: 57, left: 30 },
  2: { top: 63, left: 59 },
  3: { top: 54, left: 42 },
  4: { top: 33, left: 77 },
  5: { top: 77, left: 39 },
  6: { top: 59, left: 65 },
  7: { top: 51, left: 48 },
  8: { top: 30, left: 81 },
  9: { top: 22, left: 55 },
};

const categoryColors = {
  seal:     "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
  mount:    "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
  cover:    "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
  others:   "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
  products: "linear-gradient(135deg, #1abc9c 0%, #16a085 100%)",
};

const legendItems = [
  {
    gradient: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
    title: "Packing and Seal",
    pins: [{ partId: 1, label: 1 }],
    subdesc: "has packing and sealing materials that are resistant to oils, fuel oil, water, and handles not only O-rings, but can also provide optimized design and material selection for irregular-shaped seal shapes.",
  },
  {
    gradient: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
    title: "Damper and Mount",
    pins: [{ partId: 2, label: 2 }, { partId: 3, label: 3 }],
    subdesc: "can suppress vibration transmission and reduce noise by optimizing the shape and material properties for applications that supports various functional units such as passenger cars and trucks",
  },
  {
    gradient: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
    title: "Boot and Cover",
    pins: [{ partId: 5, label: 4 }, { partId: 6, label: 5 }, { partId: 7, label: 6 }],
    subdesc: "rubber products understand the functions and characteristics that customers demand and are constantly researching and developing to realize the optimum specifications by the most economical method, making rapid progress in the world.",
  },
  {
    gradient: "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
    title: "Others",
    pins: [{ partId: 8, label: 6 }],
    subdesc: "Responds quickly to customer requests by making full use of our track record of mass production of materials with special functions, optimal shape design, and technology for vulcanizing and bonding rubber to metal fittings and resin. In addition, regarding the materials handled, we have a track record of mass production for various rubber materials.",
  },
  {
    gradient: "linear-gradient(135deg, #1abc9c 0%, #16a085 100%)",
    title: "Exterior Products",
    pins: [{ partId: 9, label: 7 }],
    subdesc: "understand the quality of exterior products that customers require, and is constantly conducting research and development to realize the optimal specifications in the most economical way, resulting in the development of rubber products that are the forefront of the world.",
  },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function AutomobileProducts() {
  const [selectedPartId, setSelectedPartId] = useState(null);
  const [pinStyles, setPinStyles]           = useState({});
  const [contentKey, setContentKey]         = useState(0); // force re-animation

  const wrapperRef = useRef(null);
  const imgRef     = useRef(null);

  const positionPins = useCallback(() => {
    if (!wrapperRef.current || !imgRef.current) return;
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const imgRect     = imgRef.current.getBoundingClientRect();
    const offsetTop   = imgRect.top  - wrapperRect.top;
    const offsetLeft  = imgRect.left - wrapperRect.left;

    const styles = {};
    Object.keys(pinPositions).forEach((id) => {
      const pos = pinPositions[id];
      const top  = offsetTop  + (pos.top  / 100) * imgRef.current.height;
      const left = offsetLeft + (pos.left / 100) * imgRef.current.width;
      styles[id] = { top: `${top}px`, left: `${left}px` };
    });
    setPinStyles(styles);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", positionPins);
    return () => window.removeEventListener("resize", positionPins);
  }, [positionPins]);

  const handleSelectPart = (id) => {
    setSelectedPartId(id);
    setContentKey((k) => k + 1);
  };

  const handleLegendPinClick = (partId) => {
    handleSelectPart(partId);
    document.getElementById("partCard")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const selectedPart = selectedPartId ? parts[selectedPartId] : null;

  return (
    <>
      {/* HEADER */}
      <div className="product-header">
        <div className="header-content">
          <h1>Automobile Products</h1>
          <p>
            Ohtsuka Poly-Tech (Philippines) Inc. handles parts for motorcycles as well as four-wheeled vehicles.
            We use the most suitable materials for the purpose, such as vibration isolation
            and sealing, to supply high-quality products.
          </p>
        </div>
        <div className="header-decoration" />
      </div>

      {/* MAIN CONTENT */}
      <div className="main-container">

        {/* LEFT: CAR IMAGE */}
        <div className="car-container">
          <div className="car-model">
            <div className="car-wrapper" ref={wrapperRef}>
              <img
                ref={imgRef}
                src="Car Image.png"
                className="car-img"
                alt="Car"
                onLoad={positionPins}
              />
              <div className="car-glow" />
            </div>

            {/* PINS */}
            {Object.keys(parts).map((id) => {
              const numId = parseInt(id);
              const part  = parts[numId];
              const style = pinStyles[numId] || {};
              return (
                <div
                  key={numId}
                  className={`pin${selectedPartId === numId ? " active" : ""}`}
                  data-id={numId}
                  data-category={part.category}
                  style={{
                    ...style,
                    background: categoryColors[part.category],
                    display: pinStyles[numId] ? "flex" : "none",
                  }}
                  onClick={() => handleSelectPart(numId)}
                >
                  <span className="pin-number">{part.displayNum}</span>
                  <span className="pin-pulse" />
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: PART DETAILS */}
        <div className="part-container">
          <div className="part-card" id="partCard">
            {!selectedPart && (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                <h3>Select a Component</h3>
                <p>Click on any numbered pin to view product details</p>
              </div>
            )}

            {selectedPart && (
              <div key={contentKey} className="part-content active">
                <div className="part-image-wrapper">
                  <img id="partImg" src={selectedPart.img} alt="Product" />
                </div>
                <div className="part-details">
                  <div className="part-header">
                    <div
                      className="part-number-badge"
                      style={{ background: categoryColors[selectedPart.category] }}
                    >
                      {selectedPart.displayNum}
                    </div>
                    <h2 className="part-title">{selectedPart.name}</h2>
                  </div>
                  <div
                    className="part-category-badge"
                    style={{ background: categoryColors[selectedPart.category] }}
                  >
                    {selectedPart.categoryName}
                  </div>
                  <p className="part-description">{selectedPart.desc}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CLASSIFICATION LEGEND */}
      <div className="legend-container">
        <h3 className="legend-title">Product Classification</h3>
        <div className="legend-grid">
          {legendItems.map((item, idx) => (
            <div className="legend-item" key={idx}>
              <div className="legend-header">
                <div className="legend-color-box" style={{ background: item.gradient }} />
                <h4>{item.title}</h4>
              </div>
              <div className="legend-products">
                {item.pins.map((pin) => (
                  <span
                    key={pin.partId}
                    className="legend-pin"
                    data-part-id={pin.partId}
                    style={{ background: item.gradient }}
                    onClick={() => handleLegendPinClick(pin.partId)}
                  >
                    {pin.label}
                  </span>
                ))}
              </div>
              <p className="legend-main-desc" />
              <div className="legend-subdesc">
                <span className="legend-opt-label">Ohtsuka Polytech (OPT)</span>
                <p className="legend-subdesc-text">{item.subdesc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}