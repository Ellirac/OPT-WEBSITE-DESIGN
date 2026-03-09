import { useState, useEffect, useRef, useCallback } from "react";
import "../../styles/MotorProducts.css";
import HEADCOVER from "../../assets/images/motor/1.png";
import CARB from "../../assets/images/motor/3.png";
import PLUG from "../../assets/images/motor/4.png";
import RADIATOR from "../../assets/images/motor/5.png";
import DAMPER from "../../assets/images/motor/6.png";
import RADIATOR2 from "../../assets/images/motor/7.png";
import TAILLIGHT from "../../assets/images/motor/9.png";
import FUELTRAY from "../../assets/images/motor/TRAY FUEL.png";   
import MOTOR_IMAGE from "../../assets/images/motor/Motor Image.png";


// ─── Data ─────────────────────────────────────────────────────────────────────

const PARTS = {
  1: { name: "HEAD COVER GASKET",                                      img: HEADCOVER,          desc: "Seals the head cover to prevent oil leaks.",                    category: "sealing",   categoryName: "Sealing & Gaskets"   },
  2: { name: "INSULATOR CARB",                                         img: CARB,               desc: "Reduces heat transfer to maintain carburetor performance.",     category: "heat",      categoryName: "Heat Management"     },
  3: { name: "PLUG, RUBBER STAND & BAND TOOL",                         img: PLUG,               desc: "Provides secure mounting and vibration reduction.",             category: "mounting",  categoryName: "Mounting & Support"   },
  4: { name: "RUBBER RADIATOR MT, DAMPER CONNECTOR & GROMMET",         img: RADIATOR,           desc: "Stabilizes radiator and protects connections.",                 category: "mounting",  categoryName: "Mounting & Support"   },
  5: { name: "DAMPER, RUBBER SIDE COVER & DAMPER CONNECTOR",           img: DAMPER,             desc: "Reduces vibration and improves durability.",                    category: "damping",   categoryName: "Vibration Damping"    },
  6: { name: "RUBBER RADIATOR MOUNT & BAND TOOL, DAMPER & DUST",       img: RADIATOR2 ,         desc: "Secures radiator and prevents dust intrusion.",                 category: "mounting",  categoryName: "Mounting & Support"   },
  7: { name: "RUBBER TAIL LIGHT",                                      img: TAILLIGHT,          desc: "Absorbs vibration and protects the tail light.",                category: "lighting",  categoryName: "Lighting Protection"  },
  8: { name: "TRAY FUEL",                                              img: FUELTRAY,           desc: "Provides secure mounting for fuel system components.",          category: "fuel",      categoryName: "Fuel System"          },
};

const PIN_POSITIONS = {
  1: { top: 10, left: 1 },
  2: { top: 10, left: 6 },
  3: { top: 10, left: 11 },
  4: { top: 10, left: 16 },
  5: { top: 10, left: 21 },
  6: { top: 10, left: 26 },
  7: { top: 10, left: 31 },
  8: { top: 10, left: 36 },
};

const CATEGORY_COLORS = {
  sealing:  "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
  heat:     "linear-gradient(135deg, #e67e22 0%, #d35400 100%)",
  mounting: "linear-gradient(135deg, #ad2f21 0%, #c0392b 100%)",
  damping:  "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
  lighting: "linear-gradient(135deg, #c75194 0%, #db4366 100%)",
  fuel:     "linear-gradient(135deg, #16a085 0%, #1abc9c 100%)",
};

const LEGEND_CATEGORIES = [
  { category: "sealing",  label: "Sealing & Gaskets",   pins: [1]       },
  { category: "heat",     label: "Heat Management",      pins: [2]       },
  { category: "mounting", label: "Mounting & Support",   pins: [3, 4, 6] },
  { category: "damping",  label: "Vibration Damping",    pins: [5]       },
  { category: "lighting", label: "Lighting Protection",  pins: [7]       },
  { category: "fuel",     label: "Fuel System",          pins: [8]       },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Pin({ id, style, isActive, onClick }) {
  const part = PARTS[id];
  return (
    <div
      className={`moto-pin${isActive ? " active" : ""}`}
      style={{ ...style, background: CATEGORY_COLORS[part.category] }}
      onClick={() => onClick(id)}
      title={part.name}
    >
      <span className="moto-pin-number">{id}</span>
      <span className="moto-pin-pulse" />
    </div>
  );
}

function PartCard({ selectedId }) {
  if (!selectedId) {
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

  const part  = PARTS[selectedId];
  const color = CATEGORY_COLORS[part.category];

  return (
    <div className="moto-part-card">
      <div className="moto-part-content">
        <div className="moto-part-image-wrapper">
          <img src={part.img} alt={part.name} />
        </div>
        <div className="moto-part-details">
          <div className="moto-part-header">
            <div className="moto-part-number-badge" style={{ background: color }}>
              {selectedId}
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

function Legend({ onPinClick }) {
  return (
    <div className="moto-legend-container">
      <h3 className="moto-legend-title">Product Classifications</h3>
      <div className="moto-legend-grid">
        {LEGEND_CATEGORIES.map(({ category, label, pins }) => {
          const color = CATEGORY_COLORS[category];
          return (
            <div key={category} className="moto-legend-item">
              <div className="moto-legend-header">
                <div className="moto-legend-color-box" style={{ background: color }} />
                <h4>{label}</h4>
              </div>
              <div className="moto-legend-products">
                {pins.map((pinId) => (
                  <button
                    key={pinId}
                    className="moto-legend-pin"
                    style={{ background: color }}
                    onClick={() => onPinClick(pinId)}
                  >
                    {pinId}
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
  const [selectedId, setSelectedId] = useState(null);
  const [pinStyles, setPinStyles]   = useState({});

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
    Object.entries(PIN_POSITIONS).forEach(([id, pos]) => {
      next[id] = {
        position: "absolute",
        top:  `${offsetTop  + (pos.top  / 100) * iRect.height}px`,
        left: `${offsetLeft + (pos.left / 100) * iRect.width}px`,
      };
    });
    setPinStyles(next);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", positionPins);
    return () => window.removeEventListener("resize", positionPins);
  }, [positionPins]);

  const handleSelectPart = (id) => setSelectedId(id);

  const handleLegendPin = (id) => {
    setSelectedId(id);
    document
      .querySelector(".moto-part-card")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="moto-page">
      {/* ── Header ─────────────────────────────────────────────────── */}
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

      {/* ── Motorcycle + Part Details ───────────────────────────────── */}
      <div className="moto-main-container">
        {/* Motorcycle image with pins */}
        <div className="moto-car-container">
          <div className="moto-car-model">
            <div className="moto-car-wrapper" ref={wrapperRef}>
              <img
                ref={imgRef}
                src={MOTOR_IMAGE}
                alt="Motor"
                className="moto-car-img"
                onLoad={positionPins}
              />
              <div className="moto-car-glow" />

              {Object.keys(PARTS).map((id) => (
                <Pin
                  key={id}
                  id={Number(id)}
                  style={pinStyles[id] || { display: "none" }}
                  isActive={selectedId === Number(id)}
                  onClick={handleSelectPart}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Part detail panel */}
        <div className="moto-part-container">
          <PartCard selectedId={selectedId} />
        </div>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────── */}
      <Legend onPinClick={handleLegendPin} />
    </div>
  );
}