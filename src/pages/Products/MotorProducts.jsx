import { useState, useEffect, useRef, useCallback } from "react";
import "../../styles/MotorProducts.css";

import M1     from "../../assets/images/motor/1.png";
import M2     from "../../assets/images/motor/2.png";
import M3     from "../../assets/images/motor/3.png";
import M4     from "../../assets/images/motor/4.png";
import M5     from "../../assets/images/motor/5.png";
import M6     from "../../assets/images/motor/6.png";
import M7     from "../../assets/images/motor/7.png";
import M8     from "../../assets/images/motor/8.png";
import M9     from "../../assets/images/motor/9.png";
import MTRAY  from "../../assets/images/motor/TRAY FUEL.png";
import MOTOR  from "../../assets/images/motor/Motor Image.png";

// ─── Hardcoded data — no Firebase needed ─────────────────────────────────────
const CATEGORIES = [
  { id:'seal',  label:'Packing Seals',  color:'#3498db', desc:'Rubber sealing components that prevent leakage of oil, fuel, coolant, and other fluids across motorcycle engine and body joints.' },
  { id:'frame', label:'Frame Parts',    color:'#c0392b', desc:'Rubber and composite parts mounted to the motorcycle frame — including mounts, dampers, grommets, covers, and body-protection components.' },
];

const PARTS = [
  // Packing Seals — 7 pins
  { id:'m1',  name:'Head Cover Gasket',                              cat:'seal',  pinTop:42, pinLeft:44, img:M1   },
  { id:'m2',  name:'Insulator Carb',                                 cat:'seal',  pinTop:52, pinLeft:37, img:M3   },
  { id:'m3',  name:'Cylinder Head Gasket',                           cat:'seal',  pinTop:48, pinLeft:50, img:M4   },
  { id:'m4',  name:'Oil Drain Gasket',                               cat:'seal',  pinTop:65, pinLeft:46, img:M2   },
  { id:'m5',  name:'Exhaust Pipe Gasket',                            cat:'seal',  pinTop:60, pinLeft:58, img:M8   },
  { id:'m6',  name:'Fuel Tank Seal',                                 cat:'seal',  pinTop:22, pinLeft:50, img:MTRAY },
  { id:'m7',  name:'Coolant Hose Seal',                              cat:'seal',  pinTop:36, pinLeft:28, img:M5   },
  // Frame Parts — 8 pins
  { id:'m8',  name:'Plug, Rubber Stand & Band Tool',                 cat:'frame', pinTop:68, pinLeft:50, img:M4   },
  { id:'m9',  name:'Rubber Radiator Mount & Damper Connector',       cat:'frame', pinTop:38, pinLeft:26, img:M5   },
  { id:'m10', name:'Damper, Rubber Side Cover & Damper Connector',   cat:'frame', pinTop:50, pinLeft:62, img:M6   },
  { id:'m11', name:'Rubber Radiator Mount, Band Tool & Dust Cover',  cat:'frame', pinTop:30, pinLeft:30, img:M7   },
  { id:'m12', name:'Rubber Tail Light',                              cat:'frame', pinTop:28, pinLeft:80, img:M9   },
  { id:'m13', name:'Frame Grommet Set',                              cat:'frame', pinTop:44, pinLeft:72, img:M6   },
  { id:'m14', name:'Handlebar Grip & Damper',                        cat:'frame', pinTop:16, pinLeft:16, img:M7   },
  { id:'m15', name:'Footpeg Rubber & Bracket',                       cat:'frame', pinTop:72, pinLeft:34, img:M8   },
];

const catColor = (id) => CATEGORIES.find(c=>c.id===id)?.color || '#c0392b';
const catLabel = (id) => CATEGORIES.find(c=>c.id===id)?.label || '';

const LEGEND = CATEGORIES.map(cat => ({
  ...cat,
  parts: PARTS.filter(p=>p.cat===cat.id).map(p=>({ ...p, num: PARTS.findIndex(x=>x.id===p.id)+1 }))
}));

// ─── Pin ──────────────────────────────────────────────────────────────────────
function Pin({ pt, index, style, isActive, onClick }) {
  return (
    <div className={`moto-pin${isActive?' active':''}`}
      style={{ ...style, background:catColor(pt.cat) }}
      onClick={() => onClick(pt.id)} title={pt.name}>
      <span className="moto-pin-number">{index+1}</span>
      <span className="moto-pin-pulse" />
    </div>
  );
}

// ─── Part card ────────────────────────────────────────────────────────────────
function PartCard({ pt, index }) {
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
  const color = catColor(pt.cat);
  return (
    <div className="moto-part-card">
      <div className="moto-part-content">
        <div className="moto-part-image-wrapper"><img src={pt.img} alt={pt.name} /></div>
        <div className="moto-part-details">
          <div className="moto-part-header">
            <div className="moto-part-number-badge" style={{ background:color }}>{index+1}</div>
            <h2 className="moto-part-title">{pt.name}</h2>
          </div>
          <div className="moto-part-category-badge" style={{ background:color }}>{catLabel(pt.cat)}</div>
          <p className="moto-part-description">{CATEGORIES.find(c=>c.id===pt.cat)?.desc||''}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MotorcycleProducts() {
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
        position:'absolute',
        top:  `${iRect.top  - wRect.top  + (pt.pinTop  / 100) * iRect.height}px`,
        left: `${iRect.left - wRect.left + (pt.pinLeft / 100) * iRect.width}px`,
      };
    });
    setPinStyles(next);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', positionPins);
    return () => window.removeEventListener('resize', positionPins);
  }, [positionPins]);

  const select = (id) => { setSelectedId(id); setContentKey(k=>k+1); };
  const selected = PARTS.find(p=>p.id===selectedId) || null;
  const selIndex = PARTS.findIndex(p=>p.id===selectedId);

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
              <img ref={imgRef} src={MOTOR} alt="Motorcycle" className="moto-car-img" onLoad={positionPins} />
              <div className="moto-car-glow" />
              {PARTS.map((pt, i) => (
                <Pin key={pt.id} pt={pt} index={i}
                  style={pinStyles[pt.id] || { display:'none' }}
                  isActive={selectedId===pt.id}
                  onClick={select} />
              ))}
            </div>
          </div>
        </div>
        <div className="moto-part-container">
          <PartCard key={contentKey} pt={selected} index={selIndex} />
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
                  <button key={pt.id} className="moto-legend-pin"
                    style={{ background:catColor(pt.cat) }}
                    onClick={() => { select(pt.id); document.querySelector('.moto-part-card')?.scrollIntoView({ behavior:'smooth', block:'center' }); }}>
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