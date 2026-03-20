import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "../../styles/MotorProducts.css";
import { useCMS } from "../../admin/context/CMSContext";

// Static image imports — used as fallbacks when no CMS image is uploaded
import HEADCOVER  from "../../assets/images/motor/1.png";
import CARB       from "../../assets/images/motor/3.png";
import PLUG       from "../../assets/images/motor/4.png";
import RADIATOR   from "../../assets/images/motor/5.png";
import DAMPER     from "../../assets/images/motor/6.png";
import RADIATOR2  from "../../assets/images/motor/7.png";
import TAILLIGHT  from "../../assets/images/motor/9.png";
import FUELTRAY   from "../../assets/images/motor/TRAY FUEL.png";
import MOTOR_IMAGE from "../../assets/images/motor/Motor Image.png";

// Map part names to their fallback images
const FALLBACK_BY_NAME = {
  "HEAD COVER GASKET":                                HEADCOVER,
  "INSULATOR CARB":                                   CARB,
  "PLUG, RUBBER STAND & BAND TOOL":                   PLUG,
  "RUBBER RADIATOR MT, DAMPER CONNECTOR & GROMMET":   RADIATOR,
  "DAMPER, RUBBER SIDE COVER & DAMPER CONNECTOR":     DAMPER,
  "RUBBER RADIATOR MOUNT & BAND TOOL, DAMPER & DUST": RADIATOR2,
  "RUBBER TAIL LIGHT":                                TAILLIGHT,
  "TRAY FUEL":                                        FUELTRAY,
};

const CATEGORY_COLORS = {
  sealing:  "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
  heat:     "linear-gradient(135deg, #e67e22 0%, #d35400 100%)",
  mounting: "linear-gradient(135deg, #ad2f21 0%, #c0392b 100%)",
  damping:  "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
  lighting: "linear-gradient(135deg, #c75194 0%, #db4366 100%)",
  fuel:     "linear-gradient(135deg, #16a085 0%, #1abc9c 100%)",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Pin({ part, index, style, isActive, onClick }) {
  const color = CATEGORY_COLORS[part.category] || "linear-gradient(135deg,#c0392b,#8f0a00)";
  return (
    <div
      className={`moto-pin${isActive ? " active" : ""}`}
      style={{ ...style, background: color }}
      onClick={() => onClick(part.id)}
      title={part.name}
    >
      <span className="moto-pin-number">{index + 1}</span>
      <span className="moto-pin-pulse" />
    </div>
  );
}

function PartCard({ part, index }) {
  if (!part) {
    return (
      <div className="moto-part-card">
        <div className="moto-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
          <h3>Select a Component</h3>
          <p>Click on any numbered pin to view product details</p>
        </div>
      </div>
    );
  }

  const color  = CATEGORY_COLORS[part.category] || "linear-gradient(135deg,#c0392b,#8f0a00)";
  const imgSrc = part.img || FALLBACK_BY_NAME[part.name] || null;

  return (
    <div className="moto-part-card">
      <div className="moto-part-content">
        {imgSrc && (
          <div className="moto-part-image-wrapper">
            <img src={imgSrc} alt={part.name} />
          </div>
        )}
        <div className="moto-part-details">
          <div className="moto-part-header">
            <div className="moto-part-number-badge" style={{ background: color }}>
              {index + 1}
            </div>
            <h2 className="moto-part-title">{part.name}</h2>
          </div>
          <div className="moto-part-category-badge" style={{ background: color }}>
            {part.categoryName}
          </div>
          <p className="moto-part-description">{part.desc}</p>
        </div>
      </div>
    </div>
  );
}

function Legend({ motorParts, onPinClick }) {
  // Build unique category groups
  const legendMap = {};
  motorParts.forEach((pt, i) => {
    if (!legendMap[pt.category]) {
      legendMap[pt.category] = { category: pt.category, categoryName: pt.categoryName, parts: [] };
    }
    legendMap[pt.category].parts.push({ ...pt, index: i });
  });

  return (
    <div className="moto-legend-container">
      <h3 className="moto-legend-title">Product Classifications</h3>
      <div className="moto-legend-grid">
        {Object.values(legendMap).map(({ category, categoryName, parts }) => {
          const color = CATEGORY_COLORS[category] || "linear-gradient(135deg,#c0392b,#8f0a00)";
          return (
            <div key={category} className="moto-legend-item">
              <div className="moto-legend-header">
                <div className="moto-legend-color-box" style={{ background: color }} />
                <h4>{categoryName}</h4>
              </div>
              <div className="moto-legend-products">
                {parts.map(pt => (
                  <button
                    key={pt.id}
                    className="moto-legend-pin"
                    style={{ background: color }}
                    onClick={() => onPinClick(pt.id)}
                  >
                    {pt.index + 1}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MotorcycleProducts() {
  const { state }  = useCMS();
  const motorParts = useMemo(
    () => state.products.motorParts || [],
    [state.products.motorParts]
  );

  const [selectedId, setSelectedId] = useState(null);
  const [pinStyles,  setPinStyles]  = useState({});
  const [contentKey, setContentKey] = useState(0);

  const imgRef     = useRef(null);
  const wrapperRef = useRef(null);

  const positionPins = useCallback(() => {
    const img     = imgRef.current;
    const wrapper = wrapperRef.current;
    if (!img || !wrapper) return;

    const wRect      = wrapper.getBoundingClientRect();
    const iRect      = img.getBoundingClientRect();
    const offsetTop  = iRect.top  - wRect.top;
    const offsetLeft = iRect.left - wRect.left;

    const next = {};
    motorParts.forEach(pt => {
      next[pt.id] = {
        position: "absolute",
        top:  `${offsetTop  + (pt.pinTop  / 100) * iRect.height}px`,
        left: `${offsetLeft + (pt.pinLeft / 100) * iRect.width}px`,
      };
    });
    setPinStyles(next);
  }, [motorParts]);

  useEffect(() => {
    window.addEventListener("resize", positionPins);
    return () => window.removeEventListener("resize", positionPins);
  }, [positionPins]);

  const handleSelect = (id) => {
    setSelectedId(id);
    setContentKey(k => k + 1);
  };

  const handleLegendPin = (id) => {
    handleSelect(id);
    document.querySelector(".moto-part-card")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const selectedPart  = motorParts.find(p => p.id === selectedId) || null;
  const selectedIndex = motorParts.findIndex(p => p.id === selectedId);

  return (
    <div className="moto-page">

      {/* ── Header ── */}
      <div className="moto-product-header">
        <div className="moto-header-content">
          <h1>Motorcycle Products</h1>
          <p>
            Ohtsuka Poly-Tech (Philippines) Inc. handles parts for motorcycles as well as
            four-wheeled vehicles. We use the most suitable materials for the purpose, such
            as vibration isolation and sealing, to supply high-quality products.
          </p>
        </div>
        <div className="moto-header-decoration" />
      </div>

      {/* ── Motorcycle image + part details ── */}
      <div className="moto-main-container">
        <div className="moto-car-container">
          <div className="moto-car-model">
            <div className="moto-car-wrapper" ref={wrapperRef}>
              <img
                ref={imgRef}
                src={MOTOR_IMAGE}
                alt="Motorcycle"
                className="moto-car-img"
                onLoad={positionPins}
              />
              <div className="moto-car-glow" />

              {motorParts.map((pt, i) => (
                <Pin
                  key={pt.id}
                  part={pt}
                  index={i}
                  style={pinStyles[pt.id] || { display: "none" }}
                  isActive={selectedId === pt.id}
                  onClick={handleSelect}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="moto-part-container">
          <PartCard key={contentKey} part={selectedPart} index={selectedIndex} />
        </div>
      </div>

      {/* ── Legend ── */}
      <Legend motorParts={motorParts} onPinClick={handleLegendPin} />
    </div>
  );
}