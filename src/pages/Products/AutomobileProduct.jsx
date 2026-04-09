import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useCMS } from "../../admin/context/CMSContext";
import "../../styles/AutomobileProducts.css";
import "../../styles/ProductLegend.css";

// ── Static product images — hardcoded imports, no Firebase storage needed ──
import C1  from "../../assets/images/Vehicle Products/1. Exhaust Mount.png";
import C2  from "../../assets/images/Vehicle Products/2. Spring Lower Mount.png";
import C3  from "../../assets/images/Vehicle Products/3. Radiator Mount.png";
import C4  from "../../assets/images/Vehicle Products/4. Electric Serrvo Mount.png";
import C5  from "../../assets/images/Vehicle Products/5. Fuel Tank Cushion.png";
import C6  from "../../assets/images/Vehicle Products/6. Stabilizer Bushings.png";
import C7  from "../../assets/images/Vehicle Products/7. Metal Adhesion.png";
import C8  from "../../assets/images/Vehicle Products/8. Hole Grommets.png";
import C9  from "../../assets/images/Vehicle Products/9. Steering Grommet.png";
import C10 from "../../assets/images/Vehicle Products/10. Head Cover Gasket.png";
import C11 from "../../assets/images/Vehicle Products/11. Fuel Packing.png";
import C12 from "../../assets/images/Vehicle Products/12. Water Pump Gasket.png";
import C13 from "../../assets/images/Vehicle Products/13. Thermo Mount.png";
import C14 from "../../assets/images/Vehicle Products/14. Oil Filter Gasket.png";
import C15 from "../../assets/images/Vehicle Products/15. Filter Cap.png";
import C16 from "../../assets/images/Vehicle Products/16. Intake Manifold Gasket.png";
import C17 from "../../assets/images/Vehicle Products/17. Tailgate Stopper.png";
import C18 from "../../assets/images/Vehicle Products/18. Door Stopper.png";
import C19 from "../../assets/images/Vehicle Products/19. Trunk Stopper.png";
import C20 from "../../assets/images/Vehicle Products/20. Oil Level Gauge.png";
import C21 from "../../assets/images/Vehicle Products/21. Ashtray.png";
import C22 from "../../assets/images/Vehicle Products/22. Boots.png";

// Keys match part IDs (p1–p22) from CMSContext
const DEFAULT_IMG = {
  p1:  C1,  p2:  C2,  p3:  C3,  p4:  C4,  p5:  C5,
  p6:  C6,  p7:  C7,  p8:  C8,  p9:  C9,  p10: C10,
  p11: C11, p12: C12, p13: C13, p14: C14, p15: C15,
  p16: C16, p17: C17, p18: C18, p19: C19, p20: C20,
  p21: C21, p22: C22,
};

export default function AutomobileProducts() {
  const { state }  = useCMS();
  const CATEGORIES = useMemo(() => state.products.autoCategories || [], [state.products.autoCategories]);
  const PARTS      = useMemo(() => state.products.parts          || [], [state.products.parts]);

  const catColor = (id) => CATEGORIES.find(c => c.id === id)?.color || '#c0392b';
  const catLabel = (id) => CATEGORIES.find(c => c.id === id)?.label || '';
  const catDesc  = (id) => CATEGORIES.find(c => c.id === id)?.desc  || '';

  // Resolve image: CMS upload takes priority, then static import, then nothing
  const imgOf = (pt) => pt.img || DEFAULT_IMG[pt.id] || null;

  const LEGEND = useMemo(() => CATEGORIES.map(cat => ({
    ...cat,
    parts: PARTS.map((p, i) => ({ ...p, num: i + 1 })).filter(p => p.categoryId === cat.id),
  })).filter(g => g.parts.length > 0), [CATEGORIES, PARTS]);

  const [selectedId, setSelectedId] = useState(null);
  const [pinStyles,  setPinStyles]  = useState({});
  const [contentKey, setContentKey] = useState(0);

  const wrapperRef  = useRef(null);
  const imgRef      = useRef(null);
  const partCardRef = useRef(null);

  const positionPins = useCallback(() => {
    if (!wrapperRef.current || !imgRef.current) return;
    const wRect = wrapperRef.current.getBoundingClientRect();
    const iRect = imgRef.current.getBoundingClientRect();
    const styles = {};
    PARTS.forEach(pt => {
      styles[pt.id] = {
        top:  `${iRect.top  - wRect.top  + (pt.pinTop  / 100) * iRect.height}px`,
        left: `${iRect.left - wRect.left + (pt.pinLeft / 100) * iRect.width}px`,
      };
    });
    setPinStyles(styles);
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

  return (
    <div className="prod-page">

      {/* ── Full-width header ── */}
      <div className="product-header">
        <div className="prod-inner">
          <div className="header-content">
            <h1>Automobile Products</h1>
            <p>
              Ohtsuka Poly-Tech (Philippines) Inc. manufactures a wide range of rubber and resin
              components for automobiles — from vibration isolation mounts to precision seals.
              Click any numbered pin on the car image to view product details.
            </p>
          </div>
        </div>
        <div className="header-decoration" />
      </div>

      {/* ── Car image + part detail ── */}
      <div className="prod-inner">
        <div className="main-container">

          {/* Car + pins */}
          <div className="car-container">
            <div className="car-model">
              <div className="car-wrapper" ref={wrapperRef}>
                <img ref={imgRef} img="OPTJ Car1.png" className="car-img" alt="Automobile" onLoad={positionPins} />
                <div className="car-glow" />
              </div>
              {PARTS.map((pt, i) => (
                <div
                  key={pt.id}
                  className={`pin${selectedId === pt.id ? ' active' : ''}`}
                  style={{ ...pinStyles[pt.id], background: catColor(pt.categoryId), display: pinStyles[pt.id] ? 'flex' : 'none' }}
                  onClick={() => select(pt.id)}
                  title={pt.name}
                >
                  <span className="pin-number">{i + 1}</span>
                  <span className="pin-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Part detail panel */}
          <div className="part-container">
            <div className="part-card" ref={partCardRef} id="partCard">
              {!selected ? (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                  <h3>Select a Component</h3>
                  <p>Click on any numbered pin to view product details</p>
                </div>
              ) : (
                <div key={contentKey} className="part-content active">
                  <div className="part-image-wrapper">
                    {imgOf(selected) && (
                      <img src={imgOf(selected)} alt={selected.name}
                        onError={e => { e.target.style.display = 'none'; }} />
                    )}
                  </div>
                  <div className="part-details">
                    <div className="part-header">
                      <div className="part-number-badge" style={{ background: catColor(selected.categoryId) }}>
                        {PARTS.findIndex(p => p.id === selected.id) + 1}
                      </div>
                      <h2 className="part-title">{selected.name}</h2>
                    </div>
                    <div className="part-category-badge" style={{ background: catColor(selected.categoryId) }}>
                      {catLabel(selected.categoryId)}
                    </div>
                    <p className="part-description">{selected.desc || catDesc(selected.categoryId)}</p>
                  </div>
                </div>
              )}
            </div>
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
                  {group.shortDesc && (
                    <p className="jleg-cat-short">{group.shortDesc}</p>
                  )}
                  {group.desc && (
                    <p className="jleg-cat-desc">{group.desc}</p>
                  )}
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
                      title={`View ${pt.name} on car`}
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