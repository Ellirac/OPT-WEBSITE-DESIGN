import React, { useState, useRef } from 'react';
import MotorProductsAdmin from './MotorProductsAdmin';
import { useCMS, uid } from '../context/CMSContext';
import { useToast } from '../components/Toast';
import Modal, { ModalActions } from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';
import UploadArea from '../components/UploadArea';

const CATEGORIES = [
  { value:'seal',     label:'Packing and Seal' },
  { value:'mount',    label:'Damper and Mount' },
  { value:'cover',    label:'Boot and Cover' },
  { value:'others',   label:'Others' },
  { value:'products', label:'Exterior Products' },
];

const CAT_COLORS = {
  seal:'#e74c3c', mount:'#3498db', cover:'#9b59b6', others:'#f39c12', products:'#1abc9c',
};

function AutomobileProductsAdmin() {
  const { state, dispatch } = useCMS();
  const toast = useToast();
  const [modal,         setModal]         = useState(null);
  const [form,          setForm]          = useState({});
  const [partImg,       setPartImg]       = useState(null);
  const [pendingPin,    setPendingPin]    = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const imgRef = useRef(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImgClick = (e) => {
    if (e.target !== imgRef.current) return;
    const rect   = imgRef.current.getBoundingClientRect();
    const pinTop  = parseFloat(((e.clientY - rect.top)  / rect.height * 100).toFixed(2));
    const pinLeft = parseFloat(((e.clientX - rect.left) / rect.width  * 100).toFixed(2));
    setPendingPin({ pinTop, pinLeft });
    setForm({ name:'', category:'seal', categoryName:'Packing and Seal', desc:'' });
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
    const catObj  = CATEGORIES.find(c => c.value === form.category);
    const payload = { ...form, categoryName: catObj ? catObj.label : form.categoryName,
      img: partImg ?? form.img ?? null, ...(pendingPin || {}) };
    if (modal === 'add') {
      dispatch({ type:'PART_ADD', payload:{ id:uid(), ...payload } });
      toast('Part added!');
    } else {
      dispatch({ type:'PART_UPDATE', payload });
      toast('Updated!');
    }
    setModal(null); setPendingPin(null);
  };

  const parts = state.products.parts;

  return (
    <div>
      <div className="cms-card">
        <div className="cms-card-title">Automobile Product Hotspot Editor</div>
        <p className="cms-hint">Click anywhere on the car image to drop a new pin. Click an existing pin to edit it.</p>

        <div className="cms-hs-wrap" style={{ cursor:'crosshair' }}>
          <img ref={imgRef} src="/Car Image.png" alt="OPT Automobile"
            className="cms-hs-img" onClick={handleImgClick} draggable={false} />
          {parts.map((pt, i) => (
            <div key={pt.id} className="cms-hs-marker"
              style={{ left:`${pt.pinLeft}%`, top:`${pt.pinTop}%`, background: CAT_COLORS[pt.category] || '#e8a020' }}
              onClick={(e) => { e.stopPropagation(); openEdit(pt); }} title={pt.name}>
              {i + 1}
            </div>
          ))}
        </div>

        {parts.length > 0 && (
          <div className="cms-parts-grid" style={{ marginTop:20 }}>
            {parts.map((pt, i) => (
              <div key={pt.id} className="cms-part-card">
                <div className="cms-part-num" style={{ background: CAT_COLORS[pt.category] || '#e8a020' }}>{i + 1}</div>
                <div className="cms-part-info">
                  <div className="cms-part-name">{pt.name}</div>
                  <span className="cms-badge cms-badge--gray" style={{ fontSize:10 }}>{pt.categoryName}</span>
                  <div className="cms-part-desc">{(pt.desc||'').substring(0,60)}{(pt.desc||'').length > 60 ? '…' : ''}</div>
                  {pt.img && <img src={pt.img} alt={pt.name} className="cms-part-thumb" />}
                  <div className="cms-part-actions">
                    <button className="cms-btn cms-btn--edit cms-btn--sm" onClick={() => openEdit(pt)}>Edit</button>
                    <button className="cms-btn cms-btn--danger cms-btn--sm"
                      onClick={() => setConfirmTarget({ id: pt.id, label: pt.name })}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <Modal title={pendingPin ? 'Add New Part' : `Edit: ${form.name||''}`}
          onClose={() => { setModal(null); setPendingPin(null); }}>
          {pendingPin && <p style={{ fontSize:12.5, color:'#6b7280', marginBottom:12 }}>Pin position — top: {pendingPin.pinTop}%, left: {pendingPin.pinLeft}%</p>}
          <div className="cms-form-group"><label>Part Name *</label><input value={form.name||''} onChange={e=>set('name',e.target.value)} /></div>
          <div className="cms-form-group">
            <label>Category</label>
            <select value={form.category||'seal'} onChange={e=>set('category',e.target.value)}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="cms-form-group">
            <label>Description</label>
            <textarea value={form.desc||''} onChange={e=>set('desc',e.target.value)}
              style={{ width:'100%', padding:'8px 11px', border:'1px solid #e5e7eb', borderRadius:7, fontSize:13.5, fontFamily:'inherit', resize:'vertical', minHeight:80 }} />
          </div>
          {!pendingPin && (
            <div className="cms-form-row">
              <div className="cms-form-group"><label>Pin Top (%)</label><input type="number" value={form.pinTop||''} onChange={e=>set('pinTop',Number(e.target.value))} min="0" max="100" /></div>
              <div className="cms-form-group"><label>Pin Left (%)</label><input type="number" value={form.pinLeft||''} onChange={e=>set('pinLeft',Number(e.target.value))} min="0" max="100" /></div>
            </div>
          )}
          <div className="cms-form-group"><label>Part Image (optional)</label><UploadArea onUpload={setPartImg} preview={partImg} /></div>
          <ModalActions>
            <button className="cms-btn cms-btn--ghost" onClick={() => { setModal(null); setPendingPin(null); }}>Cancel</button>
            <button className="cms-btn cms-btn--primary" onClick={save}>Save</button>
          </ModalActions>
        </Modal>
      )}

      <ConfirmDelete
        target={confirmTarget}
        onConfirm={(id) => { dispatch({ type:'PART_DEL', payload:id }); toast('Part removed'); }}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}

export default function ProductsAdmin() {
  const [tab, setTab] = useState('automobile');
  return (
    <div>
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-title">Products</h1>
          <p className="cms-page-sub">Manage automobile and motorcycle product hotspots</p>
        </div>
      </div>
      <div className="cms-tab-bar">
        <button className={`cms-tab${tab==='automobile'?' active':''}`} onClick={()=>setTab('automobile')}>🚗 Automobile Products</button>
        <button className={`cms-tab${tab==='motorcycle'?' active':''}`} onClick={()=>setTab('motorcycle')}>🏍 Motorcycle Products</button>
      </div>
      {tab === 'automobile' && <AutomobileProductsAdmin />}
      {tab === 'motorcycle' && <MotorProductsAdmin />}
    </div>
  );
}
