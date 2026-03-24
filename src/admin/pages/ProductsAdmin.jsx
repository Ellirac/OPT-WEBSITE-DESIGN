import React, { useState, useRef } from 'react';
import MotorProductsAdmin from './MotorProductsAdmin';
import { useCMS, uid } from '../context/CMSContext';
import { useToast } from '../components/Toast';
import Modal, { ModalActions } from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';
import UploadArea from '../components/UploadArea';
import CategoryManager from '../components/CategoryManager';

function AutomobileProductsAdmin() {
  const { state, dispatch } = useCMS();
  const toast = useToast();

  // Categories from CMS (editable)
  const autoCategories = state.products.autoCategories || [];
  const catColor = (id) => autoCategories.find(c => c.id === id)?.color || '#e74c3c';
  const catLabel = (id) => autoCategories.find(c => c.id === id)?.label || id;

  const [activeTab,     setActiveTab]     = useState('hotspots'); // 'hotspots' | 'categories'
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
    const defaultCat = autoCategories[0] || { id:'', label:'', color:'#e74c3c' };
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
    const cat     = autoCategories.find(c => c.id === form.categoryId) || autoCategories[0];
    const payload = {
      ...form,
      categoryId:   cat?.id    || form.categoryId,
      categoryName: cat?.label || form.categoryName,
      color:        cat?.color || '#e74c3c',
      img: partImg ?? form.img ?? null,
      ...(pendingPin || {}),
    };
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
            title="Automobile Product Categories"
            categories={autoCategories}
            onAdd={(cat)    => dispatch({ type:'AUTO_CAT_ADD',    payload: cat })}
            onUpdate={(cat) => dispatch({ type:'AUTO_CAT_UPDATE', payload: cat })}
            onDelete={(id)  => dispatch({ type:'AUTO_CAT_DEL',    payload: id  })}
          />
        </div>
      )}

      {/* ── Hotspot Editor Tab ── */}
      {activeTab === 'hotspots' && (
        <div className="cms-card">
          <div className="cms-card-title">Automobile Product Hotspot Editor</div>
          <p className="cms-hint">Click anywhere on the car image to drop a new pin. Click an existing pin to edit it.</p>

          {autoCategories.length === 0 && (
            <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:9, padding:'11px 14px', marginBottom:16, fontSize:13, color:'#92400e' }}>
              ⚠ No categories yet — go to <strong>Manage Categories</strong> tab to add some before placing pins.
            </div>
          )}

          {/* Car image + pins */}
          <div className="cms-hs-wrap" style={{ cursor:'crosshair' }}>
            <img
              ref={imgRef}
              src="/Car Image.png"
              alt="OPT Automobile"
              className="cms-hs-img"
              onClick={handleImgClick}
              draggable={false}
            />
            {parts.map((pt, i) => (
              <div
                key={pt.id}
                className="cms-hs-marker"
                style={{ left:`${pt.pinLeft}%`, top:`${pt.pinTop}%`, background: pt.color || catColor(pt.categoryId) || '#e74c3c' }}
                onClick={e => { e.stopPropagation(); openEdit(pt); }}
                title={pt.name}
              >
                {i + 1}
              </div>
            ))}
          </div>



          {/* Parts list */}
          {parts.length > 0 && (
            <div className="cms-parts-grid" style={{ marginTop:20 }}>
              {parts.map((pt, i) => (
                <div key={pt.id} className="cms-part-card">
                  <div className="cms-part-num" style={{ background: pt.color || catColor(pt.categoryId) || '#e74c3c' }}>{i + 1}</div>
                  <div className="cms-part-info">
                    <div className="cms-part-name">{pt.name}</div>
                    <span className="cms-badge cms-badge--gray" style={{ fontSize:10 }}>{pt.categoryName || catLabel(pt.categoryId)}</span>
                    <div className="cms-part-desc">{(pt.desc||'').substring(0,60)}{(pt.desc||'').length > 60 ? '…' : ''}</div>
                    {pt.img && <img src={pt.img} alt={pt.name} className="cms-part-thumb" />}
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

      {/* Add / Edit pin modal */}
      {modal && (
        <Modal
          title={pendingPin ? 'Add New Part' : `Edit: ${form.name || ''}`}
          onClose={() => { setModal(null); setPendingPin(null); }}
        >
          {pendingPin && (
            <p style={{ fontSize:12.5, color:'#6b7280', marginBottom:12 }}>
              Pin position — top: {pendingPin.pinTop}%, left: {pendingPin.pinLeft}%
            </p>
          )}

          <div className="cms-form-group">
            <label>Part Name *</label>
            <input value={form.name||''} onChange={e=>set('name',e.target.value)} placeholder="e.g. Packing and Seal" />
          </div>

          {/* Category dropdown */}
          <div className="cms-form-group">
            <label>Category</label>
            {autoCategories.length === 0 ? (
              <div style={{ fontSize:13, color:'#9ca3af', padding:'8px 0' }}>
                No categories — add them in the <strong>Manage Categories</strong> tab first.
              </div>
            ) : (
              <div style={{ position:'relative' }}>
                <select
                  value={form.categoryId||''}
                  onChange={e => set('categoryId', e.target.value)}
                  style={{ paddingLeft:40 }}
                >
                  {autoCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
                {/* Color dot overlay */}
                {form.categoryId && (
                  <div style={{
                    position:'absolute', left:12, top:'50%', transform:'translateY(-50%)',
                    width:16, height:16, borderRadius:'50%', pointerEvents:'none',
                    background: autoCategories.find(c=>c.id===form.categoryId)?.color || '#e74c3c',
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
              <div className="cms-form-group"><label>Pin Top (%)</label><input type="number" value={form.pinTop||''} onChange={e=>set('pinTop',Number(e.target.value))} min="0" max="100" /></div>
              <div className="cms-form-group"><label>Pin Left (%)</label><input type="number" value={form.pinLeft||''} onChange={e=>set('pinLeft',Number(e.target.value))} min="0" max="100" /></div>
            </div>
          )}

          <div className="cms-form-group">
            <label>Part Image (optional)</label>
            <UploadArea onUpload={setPartImg} preview={partImg} />
          </div>

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
          <p className="cms-page-sub">Manage automobile and motorcycle product hotspots and categories</p>
        </div>
      </div>
      <div className="cms-tab-bar">
        <button className={`cms-tab${tab==='automobile'?' active':''}`} onClick={()=>setTab('automobile')}>🚗 Automobile</button>
        <button className={`cms-tab${tab==='motorcycle'?' active':''}`} onClick={()=>setTab('motorcycle')}>🏍 Motorcycle</button>
      </div>
      {tab === 'automobile' && <AutomobileProductsAdmin />}
      {tab === 'motorcycle' && <MotorProductsAdmin />}
    </div>
  );
}