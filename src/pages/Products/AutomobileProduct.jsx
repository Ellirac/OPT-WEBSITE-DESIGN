import { useState, useEffect, useRef, useCallback } from "react";
import "../../styles/AutomobileProducts.css";

// ─── Hardcoded data — no Firebase needed ─────────────────────────────────────
const CATEGORIES = [
  { id:'anti',  label:'Anti-Vibration Rubber', color:'#e74c3c', desc:'Vulcanized rubber products used for the purpose of vibration transmission prevention and interference reduction in automobile components.' },
  { id:'grommet',  label:'Grommets',              color:'#3498db', desc:'Rubber grommets and insulating parts that protect wiring harnesses, cables, and hoses from abrasion through metal panels and brackets.' },
  { id:'seal',  label:'Packing Seals',         color:'#9b59b6', desc:'Sealing products resistant to oils, fuel, water, air, and dust — preventing leakage across mating surfaces and joints.' },
  { id:'stop',  label:'Stopper',               color:'#f39c12', desc:'Rubber stoppers and bump stops that absorb impact and limit range of motion in suspension and body components.' },
  { id:'resin', label:'Resin',                 color:'#1abc9c', desc:'High-precision resin and plastic parts used in automobile assemblies requiring dimensional stability and chemical resistance.' },
];

const PARTS = [
  // Anti-Vibration Rubber
  { id:'p1',  name:'Exhaust Mount',                 cat:'anti',  pinTop:39, pinLeft:80, img:'automobile/Vehicle Products/1. Exhaust Mount.png' },
  { id:'p2',  name:'Spring Lower Mount',            cat:'anti',  pinTop:35, pinLeft:77, img:'automobile/Vehicle Products/2. Spring Lower Mount.png' },
  { id:'p3',  name:'Radiator Mount',                cat:'anti',  pinTop:78, pinLeft:22, img:'automobile/Vehicle Products/3. Radiator Mount.png' },
  { id:'p4',  name:'Electric servo mount',          cat:'anti',  pinTop:48, pinLeft:25, img:'automobile/Vehicle Products/4. Electric Serrvo Mount.png' },
  { id:'p5',  name:'Fuel Tank Cushion',             cat:'anti',  pinTop:60, pinLeft:63, img:'automobile/Vehicle Products/5. Fuel Tank Cushion.png' },
  { id:'p6',  name:'Stabilize bush',                cat:'anti',  pinTop:71, pinLeft:42, img:'automobile/Vehicle Products/6. Stabilizer Bushings.png' },
  { id:'p7',  name:'Metal Bonding',                 cat:'anti',  pinTop:57, pinLeft:41, img:'automobile/Vehicle Products//7. Metal Adhesion.png' },
  // Grommets
  { id:'p8',  name:'Hole Grommet',                  cat:'grommet',  pinTop:13, pinLeft:58, img:'automobile/Vehicle Products/8. Hole Grommets.png' },
  { id:'p9',  name:'Steering Grommets',             cat:'grommet',  pinTop:52, pinLeft:47, img:'automobile/Vehicle Products/9. Steering Grommet.png' },
  // Packing Seals
  { id:'p10', name:'Head cover packing',            cat:'seal',  pinTop:49, pinLeft:33, img:'automobile/Vehicle Products/10. Head Cover Gasket.png' },
  { id:'p11', name:'Fuel Packing',                  cat:'seal',  pinTop:64, pinLeft:60, img:'automobile/Vehicle Products/11. Fuel Packing.png' },
  { id:'p12', name:'Water Pump Packing',            cat:'seal',  pinTop:44, pinLeft:30, img:'automobile/Vehicle Products/12. Water Pump Gasket.png' },
  { id:'p13', name:'Thermomount',                   cat:'seal',  pinTop:57, pinLeft:34, img:'automobile/Vehicle Products/13. Thermo Mount.png' },
  { id:'p14', name:'Oil filter packing',            cat:'seal',  pinTop:59, pinLeft:27, img:'automobile/Vehicle Products/14. Oil Filter Gasket.png' },
  { id:'p15', name:'Filler Cap',                    cat:'seal',  pinTop:51, pinLeft:39, img:'automobile/Vehicle Products/15. Filter Cap.png' },
  { id:'p16', name:'In-mani Packing',               cat:'seal',  pinTop:53, pinLeft:30, img:'automobile/Vehicle Products/16. Intake Manifold Gasket.png' },
  // Stopper
  { id:'p17', name:'Tailgate Stopper',              cat:'stop',  pinTop:24, pinLeft:79, img:'automobile/Vehicle Products/17. Tailgate Stopper.png' },
  { id:'p18', name:'Door Stopper',                  cat:'stop',  pinTop:50, pinLeft:63, img:'automobile/Vehicle Products/18. Door Stopper.png' },
  { id:'p19', name:'Trunk Stopper',                 cat:'stop',  pinTop:32, pinLeft:82, img:'automobile/Vehicle Products/19. Trunk Stopper.png' },
  // Resin
  { id:'p20', name:'Oil Level Gauge',               cat:'resin', pinTop:54, pinLeft:23, img:'automobile/Vehicle Products/20. Oil Level Gauge.png' },
  { id:'p21', name:'Ashtray',                       cat:'resin', pinTop:39, pinLeft:40, img:'automobile/Vehicle Products/21. Ashtray.png' },
  { id:'p22', name:'Boots',                         cat:'resin', pinTop:42, pinLeft:72, img:'automobile/Vehicle Products/22. Boots.png' },
];


const catColor = (id) => CATEGORIES.find(c=>c.id===id)?.color || '#c0392b';
const catLabel = (id) => CATEGORIES.find(c=>c.id===id)?.label || '';

// Legend grouped by category
const LEGEND = CATEGORIES.map(cat => ({
  ...cat,
  parts: PARTS.filter(p=>p.cat===cat.id).map((p,i)=>({
    ...p, num: PARTS.findIndex(x=>x.id===p.id)+1
  }))
})).filter(g=>g.parts.length>0);

// ─── Component ────────────────────────────────────────────────────────────────
export default function AutomobileProducts() {
  const [selectedId,  setSelectedId]  = useState(null);
  const [pinStyles,   setPinStyles]   = useState({});
  const [contentKey,  setContentKey]  = useState(0);

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
  }, []);

  useEffect(() => {
    window.addEventListener('resize', positionPins);
    return () => window.removeEventListener('resize', positionPins);
  }, [positionPins]);

  const select = (id) => { setSelectedId(id); setContentKey(k=>k+1); };
  const selected = PARTS.find(p=>p.id===selectedId) || null;

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
              <img ref={imgRef} src="Car Image.png" className="car-img" alt="Car" onLoad={positionPins} />
              <div className="car-glow" />
            </div>
            {PARTS.map((pt, i) => (
              <div key={pt.id}
                className={`pin${selectedId===pt.id?' active':''}`}
                style={{ ...pinStyles[pt.id], background:catColor(pt.cat), display:pinStyles[pt.id]?'flex':'none' }}
                onClick={() => select(pt.id)}
              >
                <span className="pin-number">{i+1}</span>
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
                  <img src={selected.img} alt={selected.name}
                    onError={e=>{ e.target.src='automobile/New Update/OTHERS.png'; }} />
                </div>
                <div className="part-details">
                  <div className="part-header">
                    <div className="part-number-badge" style={{ background:catColor(selected.cat) }}>
                      {PARTS.findIndex(p=>p.id===selected.id)+1}
                    </div>
                    <h2 className="part-title">{selected.name}</h2>
                  </div>
                  <div className="part-category-badge" style={{ background:catColor(selected.cat) }}>
                    {catLabel(selected.cat)}
                  </div>
                  <p className="part-description">{CATEGORIES.find(c=>c.id===selected.cat)?.desc||''}</p>
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
                  <span key={pt.id} className="legend-pin"
                    style={{ background:catColor(pt.cat), cursor:'pointer' }}
                    onClick={() => { select(pt.id); document.getElementById('partCard')?.scrollIntoView({ behavior:'smooth', block:'center' }); }}>
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