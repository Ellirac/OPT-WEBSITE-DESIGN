import React, { useState, useRef } from 'react';
import { useCMS, uid } from '../context/CMSContext';
import { useToast } from '../components/Toast';
import Modal, { ModalActions } from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';
import UploadArea from '../components/UploadArea';
import MOTOR_IMAGE from '../../assets/images/motor/Motor Image.png';

const CATEGORIES = [
  { value:'sealing',  label:'Sealing & Gaskets',   color:'#3498db' },
  { value:'heat',     label:'Heat Management',      color:'#e67e22' },
  { value:'mounting', label:'Mounting & Support',   color:'#c0392b' },
  { value:'damping',  label:'Vibration Damping',    color:'#9b59b6' },
  { value:'lighting', label:'Lighting Protection',  color:'#c75194' },
  { value:'fuel',     label:'Fuel System',          color:'#16a085' },
];

const catColor = (cat) => CATEGORIES.find(c => c.value === cat)?.color || '#c0392b';

export default function MotorProductsAdmin() {
  const { state, dispatch } = useCMS();
  const toast = useToast();

  const motorParts = state.products.motorParts || [];

  const [modal,      setModal]      = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);   // null | 'add' | part.id
  const [form,       setForm]       = useState({});
  const [partImg,    setPartImg]    = useState(null);
  const [pendingPin, setPendingPin] = useState(null);

  const imgRef = useRef(null);
  const set    = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImgClick = (e) => {
    const rect   = imgRef.current.getBoundingClientRect();
    const pinTop  = parseFloat(((e.clientY - rect.top)  / rect.height * 100).toFixed(2));
    const pinLeft = parseFloat(((e.clientX - rect.left) / rect.width  * 100).toFixed(2));
    setPendingPin({ pinTop, pinLeft });
    setForm({ name:'', category:'sealing', categoryName:'Sealing & Gaskets', desc:'' });
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
    const catObj = CATEGORIES.find(c => c.value === form.category);
    const payload = {
      ...form,
      categoryName: catObj?.label || form.categoryName,
      img: partImg ?? form.img ?? null,
      ...(pendingPin || {}),
    };
    if (modal === 'add') {
      dispatch({ type:'MOTOR_PART_ADD', payload:{ id:uid(), ...payload } });
      toast('Motorcycle part added!');
    } else {
      dispatch({ type:'MOTOR_PART_UPDATE', payload });
      toast('Updated!');
    }
    setModal(null); setPendingPin(null);
  };

  const del = (id, name) => setConfirmTarget({ id, label: name || 'this part' });

  return (
    <div>
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-title">Motorcycle Products</h1>
          <p className="cms-page-sub">Click the motorcycle image to place a hotspot pin and tag a part</p>
        </div>
      </div>

      <div className="cms-card">
        <div className="cms-card-title">Motorcycle Parts Hotspot Editor</div>
        <p className="cms-hint">Click anywhere on the motorcycle image to drop a new pin. Click an existing pin to edit it.</p>

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
              style={{
                left: `${pt.pinLeft}%`,
                top:  `${pt.pinTop}%`,
                background: catColor(pt.category),
              }}
              onClick={e => { e.stopPropagation(); openEdit(pt); }}
              title={pt.name}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Parts grid */}
        {motorParts.length > 0 && (
          <div className="cms-parts-grid" style={{ marginTop:20 }}>
            {motorParts.map((pt, i) => (
              <div key={pt.id} className="cms-part-card">
                <div className="cms-part-num" style={{ background: catColor(pt.category) }}>{i + 1}</div>
                <div className="cms-part-info">
                  <div className="cms-part-name">{pt.name}</div>
                  <span className="cms-badge cms-badge--gray" style={{ fontSize:10 }}>{pt.categoryName}</span>
                  <div className="cms-part-desc">{(pt.desc||'').substring(0,60)}{(pt.desc||'').length>60?'…':''}</div>
                  {pt.img && <img src={pt.img} alt={pt.name} className="cms-part-thumb" />}
                  <div className="cms-part-actions">
                    <button className="cms-btn cms-btn--edit cms-btn--sm" onClick={() => openEdit(pt)}>Edit</button>
                    <button className="cms-btn cms-btn--danger cms-btn--sm" onClick={() => del(pt.id, pt.name)}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
            <input value={form.name||''} onChange={e => set('name', e.target.value)} placeholder="e.g. Head Cover Gasket" />
          </div>

          <div className="cms-form-group">
            <label>Category</label>
            <select value={form.category||'sealing'} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div className="cms-form-group">
            <label>Description</label>
            <textarea value={form.desc||''} onChange={e => set('desc', e.target.value)}
              placeholder="Describe this motorcycle part…"
              style={{ width:'100%', padding:'8px 11px', border:'1px solid #e5e7eb', borderRadius:7,
                fontSize:13.5, fontFamily:'inherit', resize:'vertical', minHeight:80 }} />
          </div>

          {/* Manual pin position editing when editing existing */}
          {!pendingPin && (
            <div className="cms-form-row">
              <div className="cms-form-group">
                <label>Pin Top (%)</label>
                <input type="number" value={form.pinTop||''} onChange={e => set('pinTop', Number(e.target.value))} min="0" max="100" step="0.1" />
              </div>
              <div className="cms-form-group">
                <label>Pin Left (%)</label>
                <input type="number" value={form.pinLeft||''} onChange={e => set('pinLeft', Number(e.target.value))} min="0" max="100" step="0.1" />
              </div>
            </div>
          )}

          <div className="cms-form-group">
            <label>Part Image (optional)</label>
            <UploadArea onUpload={setPartImg} preview={partImg} />
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
