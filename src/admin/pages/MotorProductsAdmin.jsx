import React, { useState, useRef } from 'react';
import { useCMS, uid } from '../../admin/context/CMSContext';
import { useToast } from '../components/Toast';
import Modal, { ModalActions } from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';
import UploadArea from '../components/UploadArea';
import CategoryManager from '../components/CategoryManager';
import MOTOR_IMAGE from '../../assets/images/motor/Motor Image.png';
import M1 from '../../assets/images/Vehicle Products/1. Exhaust Mount.png';
import M2 from '../../assets/images/Vehicle Products/2. Spring Lower Mount.png';
import M3 from '../../assets/images/Vehicle Products/3. Radiator Mount.png';
import M4 from '../../assets/images/Vehicle Products/4. Electric Serrvo Mount.png';
import M5 from '../../assets/images/Vehicle Products/5. Fuel Tank Cushion.png';
import M6 from '../../assets/images/Vehicle Products/6. Stabilizer Bushings.png';
import M7 from '../../assets/images/Vehicle Products/7. Metal Adhesion.png';
import M8 from '../../assets/images/Vehicle Products/8. Hole Grommets.png';
import M9 from '../../assets/images/Vehicle Products/9. Steering Grommet.png';
import M10 from '../../assets/images/Vehicle Products/10. Head Cover Gasket.png';
import M11 from '../../assets/images/Vehicle Products/11. Fuel Packing.png';
import M12 from '../../assets/images/Vehicle Products/12. Water Pump Gasket.png';
import M13 from '../../assets/images/Vehicle Products/13. Thermo Mount.png';
import M14 from '../../assets/images/Vehicle Products/14. Oil Filter Gasket.png';
import M15 from '../../assets/images/Vehicle Products/15. Filter Cap.png';
// Drive-aware upload adapter — stores thumbnail URL so <img> tags render correctly
const driveUpload = (setter) => (result) => {
  if (typeof result === 'string') { setter(result); return; }
  const fileId = result?.fileId;
  const url = fileId
    ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`
    : result?.url ?? null;
  setter(url);
};

// Normalise any Drive URL for <img> rendering
const driveImgSrc = (url, size = 'w400') => {
  if (!url) return null;
  const m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=${size}`;
  return url;
};

// Static fallback by part name — never goes to Firebase
const MOTOR_STATIC = {
  'Exhaust Mount':            M1,
  'Spring Lower Mount':       M2,
  'Radiator Mount':           M3,
  'Electric Servo Mount':     M4,
  'Fuel Tank Cushion':        M5,
  'Stabilizer Bushings':      M6,
  'Metal Adhesion':           M7,
  'Hole Grommets':            M8,
  'Steering Grommet':         M9,
  'Head Cover Gasket':        M10,
  'Fuel Packing':             M11,
  'Water Pump Gasket':        M12,
  'Thermo Mount':             M13,
  'Oil Filter Gasket':        M14,
  'Filter Cap':               M15,
                
};

export default function MotorProductsAdmin() {
  const { state, dispatch } = useCMS();
  const toast = useToast();

  const motorCategories = state.products.motorCategories || [];
  const motorParts      = state.products.motorParts || [];

  const catColor = (id) => motorCategories.find(c => c.id === id)?.color || '#c0392b';
  const catLabel = (id) => motorCategories.find(c => c.id === id)?.label || id;

  const [activeTab,     setActiveTab]     = useState('hotspots');
  const [modal,         setModal]         = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [form,          setForm]          = useState({});
  const [partImg,       setPartImg]       = useState(null);
  const [pendingPin,    setPendingPin]    = useState(null);

  const imgRef = useRef(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImgClick = (e) => {
    if (e.target !== imgRef.current) return;
    const rect    = imgRef.current.getBoundingClientRect();
    const pinTop  = parseFloat(((e.clientY - rect.top)  / rect.height * 100).toFixed(2));
    const pinLeft = parseFloat(((e.clientX - rect.left) / rect.width  * 100).toFixed(2));
    setPendingPin({ pinTop, pinLeft });
    const defaultCat = motorCategories[0] || { id:'', label:'', color:'#c0392b' };
    setForm({ name:'', categoryId: defaultCat.id, categoryName: defaultCat.label, desc:'' });
    setPartImg(null);
    setModal('add');
  };

  const openEdit = (pt) => {
    setForm(pt);
    setPartImg(pt.img || null);
    setPendingPin(null);
    setModal(pt.id);
  };

  const save = () => {
    if (!form.name?.trim()) { toast('Part name required', 'error'); return; }
    const cat     = motorCategories.find(c => c.id === form.categoryId) || motorCategories[0];
    const payload = {
      ...form,
      categoryId:   cat?.id    || form.categoryId,
      categoryName: cat?.label || form.categoryName,
      color:        cat?.color || '#c0392b',
      img: partImg ?? form.img ?? null,
      ...(pendingPin || {}),
    };
    if (modal === 'add') {
      dispatch({ type:'MOTOR_PART_ADD', payload:{ id:uid(), ...payload } });
      toast('Part added!');
    } else {
      dispatch({ type:'MOTOR_PART_UPDATE', payload });
      toast('Updated!');
    }
    setModal(null); setPendingPin(null);
  };

  return (
    <div>
      {/* Sub-tabs */}
      <div className="cms-tab-bar" style={{ marginBottom:18 }}>
        <button className={`cms-tab${activeTab==='hotspots'?' active':''}`} onClick={()=>setActiveTab('hotspots')}>
          📍 Hotspot Editor
        </button>
        <button className={`cms-tab${activeTab==='categories'?' active':''}`} onClick={()=>setActiveTab('categories')}>
          🎨 Manage Categories
        </button>
      </div>

      {/* ── Categories Tab ── */}
      {activeTab === 'categories' && (
        <div className="cms-card">
          <CategoryManager
            title="Motorcycle Product Categories"
            categories={motorCategories}
            onAdd={(cat)    => dispatch({ type:'MOTOR_CAT_ADD',    payload: cat })}
            onUpdate={(cat) => dispatch({ type:'MOTOR_CAT_UPDATE', payload: cat })}
            onDelete={(id)  => dispatch({ type:'MOTOR_CAT_DEL',    payload: id  })}
          />
        </div>
      )}

      {/* ── Hotspot Editor Tab ── */}
      {activeTab === 'hotspots' && (
        <div className="cms-card">
          <div className="cms-card-title">Motorcycle Parts Hotspot Editor</div>
          <p className="cms-hint">Click anywhere on the motorcycle image to drop a new pin. Click an existing pin to edit it.</p>

          {motorCategories.length === 0 && (
            <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:9, padding:'11px 14px', marginBottom:16, fontSize:13, color:'#92400e' }}>
              ⚠ No categories yet — go to <strong>Manage Categories</strong> tab to add some before placing pins.
            </div>
          )}

          {/* Motorcycle image + pins */}
          <div className="cms-hs-wrap" style={{ cursor:'crosshair' }}>
            <img
              ref={imgRef}
              src={MOTOR_IMAGE}
              alt="Motorcycle"
              className="cms-hs-img"
              onClick={handleImgClick}
              draggable={false}
            />
            {motorParts.map((pt, i) => (
              <div
                key={pt.id}
                className="cms-hs-marker"
                style={{ left:`${pt.pinLeft}%`, top:`${pt.pinTop}%`, background: pt.color || catColor(pt.categoryId) || '#c0392b' }}
                onClick={e => { e.stopPropagation(); openEdit(pt); }}
                title={pt.name}
              >
                {i + 1}
              </div>
            ))}
          </div>



          {/* Parts list */}
          {motorParts.length > 0 && (
            <div className="cms-parts-grid" style={{ marginTop:20 }}>
              {motorParts.map((pt, i) => (
                <div key={pt.id} className="cms-part-card">
                  <div className="cms-part-num" style={{ background: pt.color || catColor(pt.categoryId) || '#c0392b' }}>{i + 1}</div>
                  <div className="cms-part-info">
                    <div className="cms-part-name">{pt.name}</div>
                    <span className="cms-badge cms-badge--gray" style={{ fontSize:10 }}>{pt.categoryName || catLabel(pt.categoryId)}</span>
                    <div className="cms-part-desc">{(pt.desc||'').substring(0,60)}{(pt.desc||'').length > 60 ? '…' : ''}</div>
                    {pt.img && <img src={driveImgSrc(pt.img)} alt={pt.name} className="cms-part-thumb" />}
                    <div className="cms-part-actions">
                      <button className="cms-btn cms-btn--edit cms-btn--sm" onClick={() => openEdit(pt)}>Edit</button>
                      <button className="cms-btn cms-btn--danger cms-btn--sm" onClick={() => setConfirmTarget({ id:pt.id, label:pt.name })}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit modal */}
      {modal && (
        <Modal
          title={pendingPin ? 'Add Motorcycle Part' : `Edit: ${form.name || ''}`}
          onClose={() => { setModal(null); setPendingPin(null); }}
        >
          {pendingPin && (
            <p style={{ fontSize:12.5, color:'#6b7280', marginBottom:12 }}>
              Pin position — top: {pendingPin.pinTop}%, left: {pendingPin.pinLeft}%
            </p>
          )}

          <div className="cms-form-group">
            <label>Part Name *</label>
            <input value={form.name||''} onChange={e=>set('name',e.target.value)} placeholder="e.g. Head Cover Gasket" />
          </div>

          {/* Category selector */}
          <div className="cms-form-group">
            <label>Category</label>
            {motorCategories.length === 0 ? (
              <div style={{ fontSize:13, color:'#9ca3af', padding:'8px 0' }}>
                No categories — add them in the <strong>Manage Categories</strong> tab first.
              </div>
            ) : (
              <div style={{ position:'relative' }}>
                <select value={form.categoryId||''} onChange={e=>set('categoryId',e.target.value)}
                  style={{ paddingLeft:40 }}>
                  {motorCategories.map(cat=>(
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
                {form.categoryId && (
                  <div style={{
                    position:'absolute', left:12, top:'50%', transform:'translateY(-50%)',
                    width:16, height:16, borderRadius:'50%', pointerEvents:'none',
                    background: motorCategories.find(c=>c.id===form.categoryId)?.color||'#c0392b',
                    border:'2px solid rgba(0,0,0,0.1)',
                  }}/>
                )}
              </div>
            )}
          </div>

          <div className="cms-form-group">
            <label>Description</label>
            <textarea value={form.desc||''} onChange={e=>set('desc',e.target.value)}
              style={{ width:'100%', padding:'8px 11px', border:'1px solid #e5e7eb', borderRadius:7, fontSize:13.5, fontFamily:'inherit', resize:'vertical', minHeight:80 }} />
          </div>

          {!pendingPin && (
            <div className="cms-form-row">
              <div className="cms-form-group"><label>Pin Top (%)</label><input type="number" value={form.pinTop||''} onChange={e=>set('pinTop',Number(e.target.value))} min="0" max="100" step="0.1" /></div>
              <div className="cms-form-group"><label>Pin Left (%)</label><input type="number" value={form.pinLeft||''} onChange={e=>set('pinLeft',Number(e.target.value))} min="0" max="100" step="0.1" /></div>
            </div>
          )}

          <div className="cms-form-group">
            <label>Part Image <span style={{ fontWeight:400, color:'#9ca3af' }}>(optional — defaults to static part image)</span></label>
            <UploadArea onUpload={driveUpload(setPartImg)} preview={partImg || MOTOR_STATIC[form.name] || null} />
            {partImg && (
              <button type="button" onClick={() => setPartImg(null)}
                style={{ marginTop:6, fontSize:11.5, color:'#dc2626', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                ✕ Remove custom image (revert to default)
              </button>
            )}
          </div>

          <ModalActions>
            <button className="cms-btn cms-btn--ghost" onClick={() => { setModal(null); setPendingPin(null); }}>Cancel</button>
            <button className="cms-btn cms-btn--primary" onClick={save}>Save Part</button>
          </ModalActions>
        </Modal>
      )}

      <ConfirmDelete
        target={confirmTarget}
        onConfirm={(id) => { dispatch({ type:'MOTOR_PART_DEL', payload:id }); toast('Part removed'); }}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}