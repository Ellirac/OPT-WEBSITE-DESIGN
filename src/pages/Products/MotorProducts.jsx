import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useCMS } from "../../admin/context/CMSContext"; // adjust path as needed
import "../../styles/MotorProducts.css";
import MOTOR from "../../assets/images/motor/Motor Image.png";

// Static image map — keeps existing motor images as defaults when CMS img is null
import M1    from "../../assets/images/motor/1.png";
import M2    from "../../assets/images/motor/2.png";
import M3    from "../../assets/images/motor/3.png";
import M4    from "../../assets/images/motor/4.png";
import M5    from "../../assets/images/motor/5.png";
import M6    from "../../assets/images/motor/6.png";
import M7    from "../../assets/images/motor/7.png";
import M8    from "../../assets/images/motor/8.png";
import M9    from "../../assets/images/motor/9.png";
import MTRAY from "../../assets/images/motor/TRAY FUEL.png";

// Map part id → default static image (matches original MotorProducts.jsx order)
const DEFAULT_IMG = {
  m1: M1, m2: M3, m3: M4, m4: M2, m5: M8,
  m6: MTRAY, m7: M5, m8: M4, m9: M5, m10: M6,
  m11: M7, m12: M9, m13: M6, m14: M7, m15: M8,
};

// ── Pin ──────────────────────────────────────────────────────────────────────
function Pin({ pt, index, style, isActive, color, onClick }) {
  return (
    <div
      className={`moto-pin${isActive ? ' active' : ''}`}
      style={{ ...style, background: color }}
      onClick={() => onClick(pt.id)}
      title={pt.name}
    >
      <span className="moto-pin-number">{index + 1}</span>
      <span className="moto-pin-pulse" />
    </div>
  );
}

// ── Part card ─────────────────────────────────────────────────────────────────
function PartCard({ pt, index, color, catLabel, catDesc }) {
  if (!pt) return (
    <div className="moto-part-card">
      <div className="moto-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
        <h3>Select a Component</h3>
        <p>Click on any numbered pin to view product details</p>
      </div>
    </div>
  );

  const imgSrc = pt.img || DEFAULT_IMG[pt.id] || null;

  return (
    <div className="moto-part-card">
      <div className="moto-part-content">
        <div className="moto-part-image-wrapper">
          {imgSrc && <img src={imgSrc} alt={pt.name} />}
        </div>
        <div className="moto-part-details">
          <div className="moto-part-header">
            <div className="moto-part-number-badge" style={{ background: color }}>{index + 1}</div>
            <h2 className="moto-part-title">{pt.name}</h2>
          </div>
          <div className="moto-part-category-badge" style={{ background: color }}>{catLabel}</div>
          <p className="moto-part-description">{pt.desc || catDesc}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function MotorcycleProducts() {
  const { state } = useCMS();
  const CATEGORIES = useMemo(() => state.products.motorCategories || [], [state.products.motorCategories]);
  const PARTS      = useMemo(() => state.products.motorParts      || [], [state.products.motorParts]);

  const catColor = (id) => CATEGORIES.find(c => c.id === id)?.color || '#c0392b';
  const catLabel = (id) => CATEGORIES.find(c => c.id === id)?.label || '';
  const catDesc  = (id) => CATEGORIES.find(c => c.id === id)?.desc  || '';

  const LEGEND = CATEGORIES.map(cat => ({
    ...cat,
    parts: PARTS
      .map((p, i) => ({ ...p, num: i + 1 }))
      .filter(p => p.categoryId === cat.id),
  }));

  const [selectedId, setSelectedId] = useState(null);
  const [pinStyles,  setPinStyles]  = useState({});
  const [contentKey, setContentKey] = useState(0);

  const imgRef     = useRef(null);
  const wrapperRef = useRef(null);

  const positionPins = useCallback(() => {
    const img = imgRef.current; const wrapper = wrapperRef.current;
    if (!img || !wrapper) return;
    const wRect = wrapper.getBoundingClientRect();
    const iRect = img.getBoundingClientRect();
    const next  = {};
    PARTS.forEach(pt => {
      next[pt.id] = {
        position: 'absolute',
        top:  `${iRect.top  - wRect.top  + (pt.pinTop  / 100) * iRect.height}px`,
        left: `${iRect.left - wRect.left + (pt.pinLeft / 100) * iRect.width}px`,
      };
    });
    setPinStyles(next);
  }, [PARTS]);

  useEffect(() => {
    window.addEventListener('resize', positionPins);
    return () => window.removeEventListener('resize', positionPins);
  }, [positionPins]);

  useEffect(() => { positionPins(); }, [PARTS, positionPins]);

  const select   = (id) => { setSelectedId(id); setContentKey(k => k + 1); };
  const selected  = PARTS.find(p => p.id === selectedId) || null;
  const selIndex  = PARTS.findIndex(p => p.id === selectedId);

  return (
    <div className="moto-page">
      <div className="moto-product-header">
        <div className="moto-header-content">
          <h1>Motorcycle Products</h1>
          <p>
            Ohtsuka Poly-Tech (Philippines) Inc. manufactures a complete range of rubber sealing
            and frame components for motorcycles. Click any pin on the image to explore our products.
          </p>
        </div>
        <div className="moto-header-decoration" />
      </div>

      <div className="moto-main-container">
        <div className="moto-car-container">
          <div className="moto-car-model">
            <div className="moto-car-wrapper" ref={wrapperRef}>
              <img
                ref={imgRef}
                src={MOTOR}
                alt="Motorcycle"
                className="moto-car-img"
                onLoad={positionPins}
              />
              <div className="moto-car-glow" />
              {PARTS.map((pt, i) => (
                <Pin
                  key={pt.id}
                  pt={pt}
                  index={i}
                  style={pinStyles[pt.id] || { display: 'none' }}
                  isActive={selectedId === pt.id}
                  color={catColor(pt.categoryId)}
                  onClick={select}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="moto-part-container">
          <PartCard
            key={contentKey}
            pt={selected}
            index={selIndex}
            color={catColor(selected?.categoryId)}
            catLabel={catLabel(selected?.categoryId)}
            catDesc={catDesc(selected?.categoryId)}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="moto-legend-container">
        <h3 className="moto-legend-title">Product Classifications</h3>
        <div className="moto-legend-grid">
          {LEGEND.map(g => (
            <div key={g.id} className="moto-legend-item">
              <div className="moto-legend-header"><h4>{g.label}</h4></div>
              <div className="moto-legend-products">
                {g.parts.map(pt => (
                  <button
                    key={pt.id}
                    className="moto-legend-pin"
                    style={{ background: catColor(pt.categoryId) }}
                    onClick={() => {
                      select(pt.id);
                      document.querySelector('.moto-part-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                  >
                    {pt.num}
                  </button>
                ))}
              </div>
              {g.desc && (
                <div className="moto-legend-subdesc">
                  <span className="moto-legend-opt-label">Ohtsuka Polytech (OPT)</span>
                  <p>{g.desc}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}