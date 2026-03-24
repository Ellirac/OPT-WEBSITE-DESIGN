import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "../../styles/MotorProducts.css";
import { useCMS } from "../../admin/context/CMSContext";

import HEADCOVER  from "../../assets/images/motor/1.png";
import CARB       from "../../assets/images/motor/3.png";
import PLUG       from "../../assets/images/motor/4.png";
import RADIATOR   from "../../assets/images/motor/5.png";
import DAMPER     from "../../assets/images/motor/6.png";
import RADIATOR2  from "../../assets/images/motor/7.png";
import TAILLIGHT  from "../../assets/images/motor/9.png";
import FUELTRAY   from "../../assets/images/motor/TRAY FUEL.png";
import MOTOR_IMAGE from "../../assets/images/motor/Motor Image.png";

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

// Fallback colors for original default parts (old category string field)
const FALLBACK_COLORS = {
  sealing: "#3498db", heat:"#e67e22", mounting:"#c0392b",
  damping: "#9b59b6", lighting:"#c75194", fuel:"#16a085",
};

function partColor(pt) {
  return pt.color || FALLBACK_COLORS[pt.category] || "#c0392b";
}

function groupKey(pt) {
  return pt.categoryId || pt.category || "other";
}

// ─── Pin ──────────────────────────────────────────────────────────────────────
function Pin({ part, index, style, isActive, onClick }) {
  return (
    <div
      className={`moto-pin${isActive ? " active" : ""}`}
      style={{ ...style, background: partColor(part) }}
      onClick={() => onClick(part.id)}
      title={part.name}
    >
      <span className="moto-pin-number">{index + 1}</span>
      <span className="moto-pin-pulse" />
    </div>
  );
}

// ─── Part card ────────────────────────────────────────────────────────────────
function PartCard({ part, index }) {
  if (!part) {
    return (
      <div className="moto-part-card">
        <div className="moto-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
          <h3>Select a Component</h3>
          <p>Click on any numbered pin to view product details</p>
        </div>
      </div>
    );
  }
  const color  = partColor(part);
  const imgSrc = part.img || FALLBACK_BY_NAME[part.name] || null;
  return (
    <div className="moto-part-card">
      <div className="moto-part-content">
        {imgSrc && <div className="moto-part-image-wrapper"><img src={imgSrc} alt={part.name} /></div>}
        <div className="moto-part-details">
          <div className="moto-part-header">
            <div className="moto-part-number-badge" style={{ background: color }}>{index + 1}</div>
            <h2 className="moto-part-title">{part.name}</h2>
          </div>
          <div className="moto-part-category-badge" style={{ background: color }}>{part.categoryName}</div>
          <p className="moto-part-description">{part.desc}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function Legend({ motorParts, motorCategories, onPinClick }) {
  const items = useMemo(() => {
    const map = {};
    motorParts.forEach((pt, i) => {
      const key = groupKey(pt);
      if (!map[key]) {
        const cmsCat = motorCategories.find(c => c.id === key);
        map[key] = {
          key,
          categoryName: pt.categoryName || cmsCat?.label || key,
          color:        partColor(pt),
          desc:         cmsCat?.desc || "",
          parts:        [],
        };
      }
      map[key].parts.push({ ...pt, index: i });
    });
    return Object.values(map);
  }, [motorParts, motorCategories]);

  return (
    <div className="moto-legend-container">
      <h3 className="moto-legend-title">Product Classifications</h3>
      <div className="moto-legend-grid">
        {items.map(item => (
          <div key={item.key} className="moto-legend-item">
            <div className="moto-legend-header">
              <h4>{item.categoryName}</h4>
            </div>
            <div className="moto-legend-products">
              {item.parts.map(pt => (
                <button
                  key={pt.id}
                  className="moto-legend-pin"
                  style={{ background: partColor(pt) }}
                  onClick={() => onPinClick(pt.id)}
                >
                  {pt.index + 1}
                </button>
              ))}
            </div>
            {item.desc && (
              <div className="moto-legend-subdesc">
                <span className="moto-legend-opt-label">Ohtsuka Polytech (OPT)</span>
                <p>{item.desc}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MotorcycleProducts() {
  const { state }       = useCMS();
  const motorParts      = useMemo(() => state.products.motorParts || [], [state.products.motorParts]);
  const motorCategories = state.products.motorCategories || [];

  const [selectedId, setSelectedId] = useState(null);
  const [pinStyles,  setPinStyles]  = useState({});
  const [contentKey, setContentKey] = useState(0);

  const imgRef     = useRef(null);
  const wrapperRef = useRef(null);

  const positionPins = useCallback(() => {
    const img     = imgRef.current;
    const wrapper = wrapperRef.current;
    if (!img || !wrapper) return;
    const wRect = wrapper.getBoundingClientRect();
    const iRect = img.getBoundingClientRect();
    const next  = {};
    motorParts.forEach(pt => {
      next[pt.id] = {
        position: "absolute",
        top:  `${iRect.top  - wRect.top  + (pt.pinTop  / 100) * iRect.height}px`,
        left: `${iRect.left - wRect.left + (pt.pinLeft / 100) * iRect.width}px`,
      };
    });
    setPinStyles(next);
  }, [motorParts]);

  useEffect(() => {
    window.addEventListener("resize", positionPins);
    return () => window.removeEventListener("resize", positionPins);
  }, [positionPins]);

  const handleSelect = (id) => { setSelectedId(id); setContentKey(k => k + 1); };
  const handleLegendPin = (id) => {
    handleSelect(id);
    document.querySelector(".moto-part-card")?.scrollIntoView({ behavior:"smooth", block:"center" });
  };

  const selectedPart  = motorParts.find(p => p.id === selectedId) || null;
  const selectedIndex = motorParts.findIndex(p => p.id === selectedId);

  return (
    <div className="moto-page">
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

      <div className="moto-main-container">
        <div className="moto-car-container">
          <div className="moto-car-model">
            <div className="moto-car-wrapper" ref={wrapperRef}>
              <img ref={imgRef} src={MOTOR_IMAGE} alt="Motorcycle" className="moto-car-img" onLoad={positionPins} />
              <div className="moto-car-glow" />
              {motorParts.map((pt, i) => (
                <Pin key={pt.id} part={pt} index={i}
                  style={pinStyles[pt.id] || { display:"none" }}
                  isActive={selectedId === pt.id}
                  onClick={handleSelect} />
              ))}
            </div>
          </div>
        </div>
        <div className="moto-part-container">
          <PartCard key={contentKey} part={selectedPart} index={selectedIndex} />
        </div>
      </div>

      <Legend motorParts={motorParts} motorCategories={motorCategories} onPinClick={handleLegendPin} />
    </div>
  );
}