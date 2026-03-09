import { useState, useEffect, useRef, useCallback } from "react";
import "../../styles/AutomobileProducts.css";
import BOOTCLUTCH from "../../assets/images/automobile/New Update/PACKING and SEAL.png";
import IMG2 from "../../assets/images/automobile/New Update/DAMPER and MOUNT 1.png";
import IMG3 from "../../assets/images/automobile/New Update/DAMPER and MOUNT 2.png";
import ORING from "../../assets/images/automobile/New Update/BOOT and COVER.png";
import IMG5 from "../../assets/images/automobile/New Update/BOOT and COVER (1).png";
import IMG6 from "../../assets/images/automobile/New Update/BOOT and COVER (2).png";
import IMG7 from "../../assets/images/automobile/New Update/OTHERS.png";
import IMG8 from "../../assets/images/automobile/New Update/EXTERIOR PRODUCTS.png";
import CAR_IMAGE from "../../assets/images/automobile/Car Image.png";


const PARTS = {
  1:  { name: "Packing and Seal",   img: BOOTCLUTCH,    desc: "Products for sealing applications to prevent or seal passage of oil, fuel oil, water, air, dust, and other contaminants across mating surfaces and joints.",             category: "sealing",      categoryName: "Sealing Components"   },
  2:  { name: "Damper and Mount",   img: IMG2,          desc: "Vulcanized rubber products used for the purpose of vibration transmission prevention and interference.",                                                                 category: "sealing",      categoryName: "Sealing Components"   },
  3:  { name: "Damper and Mount",   img: IMG3,          desc: "Vulcanized rubber products used for the purpose of vibration transmission prevention and interference.",                                                                 category: "protective",   categoryName: "Protective Covers"     },
  4:  { name: "Boot and Cover",     img: ORING,         desc: "Vulcanized rubber products used for the purpose of vibration transmission prevention and interference.",                                                                 category: "sealing",      categoryName: "Sealing Components"   },
  5:  { name: "Boot and Cover",     img: IMG5,          desc: "Flexible rubber boots designed to protect steering and suspension joints from dust, moisture, and road debris, ensuring reliable long-term joint performance.",          category: "sealing",      categoryName: "Sealing Components"   },
  6:  { name: "Boot and Cover",     img: IMG6,          desc: "Flexible rubber boots designed to protect steering and suspension joints from dust, moisture, and road debris, ensuring reliable long-term joint performance.",          category: "vibration",    categoryName: "Anti-Vibration"        },
  7:  { name: "Others",             img: IMG8,          desc: "Accordion-style rubber covers engineered to shield driveshaft CV joints and rack-and-pinion assemblies from contamination while retaining lubricating grease.",          category: "protective",   categoryName: "Protective Covers"     },
  8:  { name: "Exterior Products",  img: IMG7,          desc: "High-grade exterior rubber parts such as weather strips, door seals, and body moldings that provide weather resistance, acoustic insulation, and a refined finish.",     category: "fluid",        categoryName: "Fluid Transfer"        },
};

/** Pin positions as percentages of the image dimensions */
const PIN_POSITIONS = {
  1:  { top: 41, left: 35},
  2:  { top: 35, left: 58 },
  3:  { top: 49, left: 40},
  4:  { top: 53, left: 16 },
  5:  { top: 51, left: 23 },
  6:  { top: 60, left: 27},
  7:  { top: 44, left: 30 },
  8:  { top: 55, left: 20 },
};

const CATEGORY_COLORS = {
  vibration:  "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
  sealing:    "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
  protective: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
  fluid:      "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
  structural: "linear-gradient(135deg, #1abc9c 0%, #16a085 100%)",
  filtration: "linear-gradient(135deg, #34495e 0%, #2c3e50 100%)",
  general:    "linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)",

};

/** Legend data – keeps JSX clean */
const LEGEND_CATEGORIES = [
  { category: "seal",  label: "Packing and Seal",       pins: [1]        },
  { category: "mount",    label: "Damper and Mount",   pins: [2, 3]  },
  { category: "cover", label: "Boot and Cover",    pins: [4, 5, 6]  },
  { category: "others",      label: "Others",       pins: [6]  },
  { category: "products", label: "Exterior Products",   pins: [7]     },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated pin overlaid on the car image */
function Pin({ id, style, isActive, onClick }) {
  const part = PARTS[id];
  return (
    <div
      className={`auto-pin${isActive ? " active" : ""}`}
      style={{ ...style, background: CATEGORY_COLORS[part.category] }}
      onClick={() => onClick(id)}
      title={part.name}
    >
      <span className="auto-pin-number">{id}</span>
      <span className="auto-pin-pulse" />
    </div>
  );
}

/** Part detail card shown on the right */
function PartCard({ selectedId }) {
  if (!selectedId) {
    return (
      <div className="auto-part-card">
        <div className="auto-empty-state">
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

  const part = PARTS[selectedId];
  const color = CATEGORY_COLORS[part.category];

  return (
    <div className="auto-part-card">
      <div className="auto-part-content">
        <div className="auto-part-image-wrapper">
          <img src={part.img} alt={part.name} />
        </div>
        <div className="auto-part-details">
          <div className="auto-part-header">
            <div className="auto-part-number-badge" style={{ background: color }}>
              {selectedId}
            </div>
            <h2 className="auto-part-title">{part.name}</h2>
          </div>
          <div className="auto-part-category-badge" style={{ background: color }}>
            {part.categoryName}
          </div>
          <p className="auto-part-description">{part.desc}</p>
        </div>
      </div>
    </div>
  );
}

/** Legend section at the bottom */
function Legend({ onPinClick }) {
  return (
    <div className="auto-legend-container">
      <h3 className="auto-legend-title">Product Classification</h3>
      <div className="auto-legend-grid">
        {LEGEND_CATEGORIES.map(({ category, label, pins }) => {
          const color = CATEGORY_COLORS[category];
          return (
            <div key={category} className="auto-legend-item">
              <div className="auto-legend-header">
                <div className="auto-legend-color-box" style={{ background: color }} />
                <h4>{label}</h4>
              </div>
              <div className="auto-legend-products">
                {pins.map((pinId) => (
                  <button
                    key={pinId}
                    className="auto-legend-pin"
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

export default function AutomobileProducts() {
  const [selectedId, setSelectedId] = useState(null);
  const [pinStyles, setPinStyles]   = useState({});

  const imgRef     = useRef(null);
  const wrapperRef = useRef(null);

  /** Recalculate absolute pin positions whenever the image resizes */
  const positionPins = useCallback(() => {
    const img     = imgRef.current;
    const wrapper = wrapperRef.current;
    if (!img || !wrapper) return;

    const wRect = wrapper.getBoundingClientRect();
    const iRect = img.getBoundingClientRect();
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
  const observer = new ResizeObserver(() => positionPins());
  if (wrapperRef.current) observer.observe(wrapperRef.current);
  return () => observer.disconnect();
}, [positionPins]);

  const handleSelectPart = (id) => setSelectedId(id);

  const handleLegendPin = (id) => {
    setSelectedId(id);
    document
      .querySelector(".auto-part-card")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="auto-page">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="auto-product-header">
        <div className="auto-header-content">
          <h1>Automobile Products</h1>
          <p>
            Ohtsuka Poly-Tech (Philippines) Inc. handles parts for motorcycles as well as
            four-wheeled vehicles. We use the most suitable materials for the purpose, such
            as vibration isolation and sealing, to supply high-quality products.
          </p>
        </div>
        <div className="auto-header-decoration" />
      </div>

      {/* ── Car + Part Details ──────────────────────────────────────── */}
      <div className="auto-main-container">
        {/* Car */}
        <div className="auto-car-container">
          <div className="auto-car-model">
            <div className="auto-car-wrapper" ref={wrapperRef}>
              <img
                ref={imgRef}
                src={CAR_IMAGE}
                alt="Car"
                className="auto-car-img"
                onLoad={positionPins}
              />
              <div className="auto-car-glow" />

              {/* Pins */}
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

        {/* Details */}
        <div className="auto-part-container">
          <PartCard selectedId={selectedId} />
        </div>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────── */}
      <Legend onPinClick={handleLegendPin} />
    </div>
  );
}