import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useCMS } from "../../admin/context/CMSContext";
import "../../styles/MotorProducts.css";
import "../../styles/ProductLegend.css";
import MOTOR from "../../assets/images/OPTJ Motor.png";

// ── Static product images — hardcoded imports, no Firebase storage needed ──
import M1  from "../../assets/images/Motor Products/1. Throttle Body Insulator.png";
import M2  from "../../assets/images/Motor Products/2. Diaphragm.png";
import M3  from "../../assets/images/Motor Products/3. Fuel Packing.png";
import M4  from "../../assets/images/Motor Products/4. Head Cover Packing.png";
import M5  from "../../assets/images/Motor Products/5. Water Pump Packing.png";
import M6  from "../../assets/images/Motor Products/6. Oil Filter.png";
import M7  from "../../assets/images/Motor Products/7. Thermo Mount Rubber.png";
import M8  from "../../assets/images/Motor Products/8. Handle Grip.png";
import M9  from "../../assets/images/Motor Products/9. Step Rubber.png";
import M10 from "../../assets/images/Motor Products/10. Fuel Tank Tray.png";
import M11 from "../../assets/images/Motor Products/11. Fuel Tank Pads.png";
import M12 from "../../assets/images/Motor Products/12. Seat Pads.png";
import M13 from "../../assets/images/Motor Products/13. USB Charger Cover.png";
import M14 from "../../assets/images/Motor Products/14. Grommet.png";
import M15 from "../../assets/images/Motor Products/15. Heat Guard Rubber.png";

// Keys match part IDs (m1–m15) from CMSContext
const DEFAULT_IMG = {
  m1: M1,  m2: M2,  m3: M3,  m4: M4,  m5: M5,
  m6: M6,  m7: M7,  m8: M8,  m9: M9,  m10: M10,
  m11: M11, m12: M12, m13: M13, m14: M14, m15: M15,
};

// ── Pin ───────────────────────────────────────────────────────────────────────
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
function PartCard({ pt, index, color, catLabel, catDesc, imgOf }) {
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
  const src = imgOf(pt);
  return (
    <div className="moto-part-card">
      <div className="moto-part-content">
        <div className="moto-part-image-wrapper">
          {src && <img src={src} alt={pt.name} onError={e => { e.target.style.display = 'none'; }} />}
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
  const { state }  = useCMS();
  const CATEGORIES = useMemo(() => state.products.motorCategories || [], [state.products.motorCategories]);
  const PARTS      = useMemo(() => state.products.motorParts      || [], [state.products.motorParts]);

  const catColor = (id) => CATEGORIES.find(c => c.id === id)?.color || '#c0392b';
  const catLabel = (id) => CATEGORIES.find(c => c.id === id)?.label || '';
  const catDesc  = (id) => CATEGORIES.find(c => c.id === id)?.desc  || '';

  // CMS upload takes priority, then static import, then nothing
  const imgOf = (pt) => pt?.img || DEFAULT_IMG[pt?.id] || null;

  const LEGEND = useMemo(() => CATEGORIES.map(cat => ({
    ...cat,
    parts: PARTS.map((p, i) => ({ ...p, num: i + 1 })).filter(p => p.categoryId === cat.id),
  })).filter(g => g.parts.length > 0), [CATEGORIES, PARTS]);

  const [selectedId, setSelectedId] = useState(null);
  const [pinStyles,  setPinStyles]  = useState({});
  const [contentKey, setContentKey] = useState(0);

  const imgRef      = useRef(null);
  const wrapperRef  = useRef(null);
  const partCardRef = useRef(null);

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

  const select = (id) => { setSelectedId(id); setContentKey(k => k + 1); };

  const selectAndScroll = (id) => {
    select(id);
    setTimeout(() => {
      partCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  };

  const selected = PARTS.find(p => p.id === selectedId) || null;
  const selIndex = PARTS.findIndex(p => p.id === selectedId);

  return (
    <div className="moto-page">

      {/* ── Full-width header ── */}
      <div className="moto-product-header">
        <div className="prod-inner">
          <div className="moto-header-content">
            <h1>Rubber Parts for Motorcycle</h1>
            <p>
              Ohtsuka Poly-Tech (Philippines) Inc. manufactures a complete range of rubber sealing
              and frame components for motorcycles. Click any numbered pin to explore our products.
            </p>
          </div>
        </div>
        <div className="moto-header-decoration" />
      </div>

      {/* ── Motorcycle image + part detail ── */}
      <div className="prod-inner">
        <div className="moto-main-container" style={{ margin: 0, maxWidth: '100%', padding: '20px 0' }}>
          <div className="moto-car-container">
            <div className="moto-car-model">
              <div className="moto-car-wrapper" ref={wrapperRef}>
                <img ref={imgRef} src={MOTOR} alt="Motorcycle" className="moto-car-img" onLoad={positionPins} />
                <div className="moto-car-glow" />
                {PARTS.map((pt, i) => (
                  <Pin key={pt.id} pt={pt} index={i}
                    style={pinStyles[pt.id] || { display: 'none' }}
                    isActive={selectedId === pt.id}
                    color={catColor(pt.categoryId)}
                    onClick={select}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="moto-part-container" ref={partCardRef}>
            <PartCard
              key={contentKey}
              pt={selected}
              index={selIndex}
              color={catColor(selected?.categoryId)}
              catLabel={catLabel(selected?.categoryId)}
              catDesc={catDesc(selected?.categoryId)}
              imgOf={imgOf}
            />
          </div>
        </div>
      </div>

      {/* ── Japan-style legend ── */}
      <div className="prod-inner">
        <div className="jleg-wrap" style={{ padding: 0 }}>
          <h2 className="jleg-title">Product Classification</h2>

          {LEGEND.map(group => (
            <div key={group.id} className="jleg-section">
              <div className="jleg-cat-bar" style={{ borderLeftColor: group.color }}>
                <span className="jleg-cat-dot" style={{ background: group.color }} />
                <div>
                  <h3 className="jleg-cat-name">{group.label}</h3>
                  <p className="jleg-cat-desc">{group.desc}</p>
                </div>
              </div>

              <div className="jleg-parts-grid">
                {group.parts.map(pt => {
                  const src        = imgOf(pt);
                  const isSelected = selectedId === pt.id;
                  return (
                    <div
                      key={pt.id}
                      className={`jleg-part-card${isSelected ? ' jleg-part-card--active' : ''}`}
                      style={{ '--cat-color': group.color }}
                      onClick={() => selectAndScroll(pt.id)}
                      title={`View ${pt.name} on motorcycle`}
                    >
                      <div className="jleg-part-img-wrap">
                        {src ? (
                          <img src={src} alt={pt.name}
                            onError={e => { e.target.style.display = 'none'; }} />
                        ) : (
                          <div className="jleg-part-img-placeholder">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2"/>
                              <circle cx="8.5" cy="8.5" r="1.5"/>
                              <polyline points="21 15 16 10 5 21"/>
                            </svg>
                          </div>
                        )}
                        <div className="jleg-pin-badge" style={{ background: group.color }}>{pt.num}</div>
                      </div>
                      <div className="jleg-part-name">{pt.name}</div>
                      <div className="jleg-part-cta">View on image ↑</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}