import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useCMS } from "../../admin/context/CMSContext"; // adjust path as needed
import "../../styles/AutomobileProducts.css";


export default function AutomobileProducts() {
  const { state } = useCMS();
  const CATEGORIES = useMemo(() => state.products.autoCategories || [], [state.products.autoCategories]);
  const PARTS      = useMemo(() => state.products.parts          || [], [state.products.parts]);

  const catColor = (id) => CATEGORIES.find(c => c.id === id)?.color || '#c0392b';
  const catLabel = (id) => CATEGORIES.find(c => c.id === id)?.label || '';
  const catDesc  = (id) => CATEGORIES.find(c => c.id === id)?.desc  || '';

  const LEGEND = CATEGORIES.map(cat => ({
    ...cat,
    parts: PARTS
      .map((p, i) => ({ ...p, num: i + 1 }))
      .filter(p => p.categoryId === cat.id),
  })).filter(g => g.parts.length > 0);

  const [selectedId, setSelectedId] = useState(null);
  const [pinStyles,  setPinStyles]  = useState({});
  const [contentKey, setContentKey] = useState(0);

  const wrapperRef = useRef(null);
  const imgRef     = useRef(null);

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

  // Re-run positionPins whenever PARTS changes (e.g. CMS update)
  useEffect(() => { positionPins(); }, [PARTS, positionPins]);

  const select   = (id) => { setSelectedId(id); setContentKey(k => k + 1); };
  const selected = PARTS.find(p => p.id === selectedId) || null;

  return (
    <>
      <div className="product-header">
        <div className="header-content">
          <h1>Automobile Products</h1>
          <p>
            Ohtsuka Poly-Tech (Philippines) Inc. manufactures a wide range of rubber and resin
            components for automobiles — from vibration isolation mounts to precision seals.
            Click any pin to view product details.
          </p>
        </div>
        <div className="header-decoration" />
      </div>

      <div className="main-container">
        {/* Car + pins */}
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
            {PARTS.map((pt, i) => (
              <div
                key={pt.id}
                className={`pin${selectedId === pt.id ? ' active' : ''}`}
                style={{
                  ...pinStyles[pt.id],
                  background: catColor(pt.categoryId),
                  display: pinStyles[pt.id] ? 'flex' : 'none',
                }}
                onClick={() => select(pt.id)}
              >
                <span className="pin-number">{i + 1}</span>
                <span className="pin-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Part detail */}
        <div className="part-container">
          <div className="part-card" id="partCard">
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
                  <img
                    src={selected.img}
                    alt={selected.name}
                    onError={e => { e.target.src = 'automobile/New Update/OTHERS.png'; }}
                  />
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
                  {/* Show part-level desc if present, else fall back to category desc */}
                  <p className="part-description">
                    {selected.desc || catDesc(selected.categoryId)}
                  </p>
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
          {LEGEND.map(g => (
            <div className="legend-item" key={g.id}>
              <div className="legend-header"><h4>{g.label}</h4></div>
              <div className="legend-products">
                {g.parts.map(pt => (
                  <span
                    key={pt.id}
                    className="legend-pin"
                    style={{ background: catColor(pt.categoryId), cursor: 'pointer' }}
                    onClick={() => {
                      select(pt.id);
                      document.getElementById('partCard')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                  >
                    {pt.num}
                  </span>
                ))}
              </div>
              <p className="legend-main-desc" />
              <div className="legend-subdesc">
                <span className="legend-opt-label">Ohtsuka Polytech (OPT)</span>
                <p className="legend-subdesc-text">{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}