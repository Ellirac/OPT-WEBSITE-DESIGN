import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "../../styles/AutomobileProducts.css";
import { useCMS } from "../../admin/context/CMSContext";

// Static fallback images — used when no CMS image uploaded for a part
const STATIC_IMGS = {
  "seal":     "automobile/New Update/PACKING and SEAL.png",
  "mount":    "automobile/New Update/DAMPER and MOUNT 1.png",
  "cover":    "automobile/New Update/BOOT and COVER.png",
  "others":   "automobile/New Update/OTHERS.png",
  "products": "automobile/New Update/EXTERIOR PRODUCTS.png",
};

// Hardcoded fallback colors for original default parts (old category string field)
const FALLBACK_COLORS = {
  seal:     "#e74c3c",
  mount:    "#3498db",
  cover:    "#9b59b6",
  others:   "#f39c12",
  products: "#1abc9c",
};

// Resolve the correct color for any part (new CMS parts have pt.color, old ones use fallback)
function partColor(pt) {
  return pt.color || FALLBACK_COLORS[pt.category] || "#c0392b";
}

// Group key — new parts use categoryId, old ones use category string
function groupKey(pt) {
  return pt.categoryId || pt.category || "other";
}

export default function AutomobileProducts() {
  const { state } = useCMS();
  const cmsParts       = state.products.parts;
  const autoCategories = state.products.autoCategories || [];

  const [selectedPartId, setSelectedPartId] = useState(null);
  const [pinStyles,      setPinStyles]      = useState({});
  const [contentKey,     setContentKey]     = useState(0);

  const wrapperRef = useRef(null);
  const imgRef     = useRef(null);

  const positionPins = useCallback(() => {
    if (!wrapperRef.current || !imgRef.current) return;
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const imgRect     = imgRef.current.getBoundingClientRect();
    const offsetTop   = imgRect.top  - wrapperRect.top;
    const offsetLeft  = imgRect.left - wrapperRect.left;
    const styles = {};
    cmsParts.forEach(pt => {
      styles[pt.id] = {
        top:  `${offsetTop  + (pt.pinTop  / 100) * imgRect.height}px`,
        left: `${offsetLeft + (pt.pinLeft / 100) * imgRect.width}px`,
      };
    });
    setPinStyles(styles);
  }, [cmsParts]);

  useEffect(() => {
    window.addEventListener("resize", positionPins);
    return () => window.removeEventListener("resize", positionPins);
  }, [positionPins]);

  const handleSelectPart = (id) => {
    setSelectedPartId(id);
    setContentKey(k => k + 1);
  };

  const selectedPart = cmsParts.find(p => p.id === selectedPartId) || null;

  // Build legend — group by categoryId (new) or category string (old)
  const legendItems = useMemo(() => {
    const map = {};
    cmsParts.forEach((pt, i) => {
      const key = groupKey(pt);
      if (!map[key]) {
        // Try to get category desc from CMS categories list
        const cmsCat = autoCategories.find(c => c.id === key);
        map[key] = {
          key,
          categoryName: pt.categoryName || cmsCat?.label || key,
          color:        partColor(pt),
          desc:         cmsCat?.desc || "",
          parts:        [],
        };
      }
      map[key].parts.push({ ...pt, displayNum: i + 1 });
    });
    return Object.values(map);
  }, [cmsParts, autoCategories]);

  return (
    <>
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

      <div className="main-container">
        {/* Car image + pins */}
        <div className="car-container">
          <div className="car-model">
            <div className="car-wrapper" ref={wrapperRef}>
              <img ref={imgRef} src="Car Image.png" className="car-img" alt="Car" onLoad={positionPins} />
              <div className="car-glow" />
            </div>
            {cmsParts.map((pt, i) => (
              <div
                key={pt.id}
                className={`pin${selectedPartId === pt.id ? " active" : ""}`}
                style={{
                  ...pinStyles[pt.id],
                  background: partColor(pt),
                  display: pinStyles[pt.id] ? "flex" : "none",
                }}
                onClick={() => handleSelectPart(pt.id)}
              >
                <span className="pin-number">{i + 1}</span>
                <span className="pin-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Part detail panel */}
        <div className="part-container">
          <div className="part-card" id="partCard">
            {!selectedPart && (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                <h3>Select a Component</h3>
                <p>Click on any numbered pin to view product details</p>
              </div>
            )}
            {selectedPart && (
              <div key={contentKey} className="part-content active">
                <div className="part-image-wrapper">
                  <img
                    src={selectedPart.img || STATIC_IMGS[selectedPart.category] || ""}
                    alt={selectedPart.name}
                  />
                </div>
                <div className="part-details">
                  <div className="part-header">
                    <div className="part-number-badge" style={{ background: partColor(selectedPart) }}>
                      {cmsParts.findIndex(p => p.id === selectedPart.id) + 1}
                    </div>
                    <h2 className="part-title">{selectedPart.name}</h2>
                  </div>
                  <div className="part-category-badge" style={{ background: partColor(selectedPart) }}>
                    {selectedPart.categoryName}
                  </div>
                  <p className="part-description">{selectedPart.desc}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="legend-container">
        <h3 className="legend-title">Product Classification</h3>
        <div className="legend-grid">
          {legendItems.map(item => (
            <div className="legend-item" key={item.key}>
              <div className="legend-header">
                <h4>{item.categoryName}</h4>
              </div>
              <div className="legend-products">
                {item.parts.map(pt => (
                  <span
                    key={pt.id}
                    className="legend-pin"
                    style={{ background: partColor(pt), cursor: "pointer" }}
                    onClick={() => {
                      handleSelectPart(pt.id);
                      document.getElementById("partCard")?.scrollIntoView({ behavior:"smooth", block:"center" });
                    }}
                  >
                    {pt.displayNum}
                  </span>
                ))}
              </div>
              <p className="legend-main-desc" />
              <div className="legend-subdesc">
                <span className="legend-opt-label">Ohtsuka Polytech (OPT)</span>
                <p className="legend-subdesc-text">
                  {item.desc || item.parts[0]?.desc || ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}