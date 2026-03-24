import React, { useState } from 'react';
import { uid } from '../context/CMSContext';
import { useToast } from './Toast';
import ConfirmDelete from './ConfirmDelete';

const PRESET_COLORS = [
  '#e74c3c','#c0392b','#e67e22','#f39c12','#2ecc71',
  '#16a085','#3498db','#2980b9','#9b59b6','#8e44ad',
  '#c75194','#d4537e','#1d4ed8','#0f766e','#b45309',
  '#374151','#6b7280','#1abc9c','#f1c40f','#e91e63',
];

export default function CategoryManager({ categories, onAdd, onUpdate, onDelete, title }) {
  const toast = useToast();
  const [modal,         setModal]         = useState(null);
  const [form,          setForm]          = useState({ label:'', color:'#e74c3c', desc:'' });
  const [confirmTarget, setConfirmTarget] = useState(null);

  const openAdd  = () => { setForm({ label:'', color:'#e74c3c', desc:'' }); setModal('add'); };
  const openEdit = (cat) => { setForm({ ...cat }); setModal(cat.id); };
  const close    = () => setModal(null);
  const set      = (k,v) => setForm(f => ({ ...f, [k]: v }));

  const save = () => {
    if (!form.label.trim()) { toast('Category name required', 'error'); return; }
    if (modal === 'add') {
      onAdd({ id: uid(), ...form, label: form.label.trim() });
      toast('Category added!');
    } else {
      onUpdate({ ...form, label: form.label.trim() });
      toast('Category updated!');
    }
    close();
  };

  return (
    <>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:'#111827' }}>{title}</div>
          <div style={{ fontSize:12, color:'#9ca3af', marginTop:2 }}>
            Each category gets a color that automatically colors its pins on the product image.
          </div>
        </div>
        <button className="cms-btn cms-btn--primary cms-btn--sm" onClick={openAdd}>+ Add Category</button>
      </div>

      {/* Category list */}
      {categories.length === 0 ? (
        <div style={{ padding:'20px 0', textAlign:'center', color:'#9ca3af', fontSize:13 }}>
          No categories yet. Add one to start tagging parts.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {categories.map(cat => (
            <div key={cat.id} style={{
              display:'flex', alignItems:'center', gap:12,
              background:'#f9fafb', border:'1px solid #e5e7eb',
              borderRadius:10, padding:'11px 14px',
            }}>
              {/* Color swatch */}
              <div style={{
                width:32, height:32, borderRadius:8, flexShrink:0,
                background: cat.color,
                border:'2px solid rgba(0,0,0,0.08)',
              }}/>
              {/* Info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:'#111827' }}>{cat.label}</div>
                {cat.desc && (
                  <div style={{ fontSize:11.5, color:'#9ca3af', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {cat.desc}
                  </div>
                )}
              </div>
              {/* Hex badge */}
              <code style={{ fontSize:11, color:'#6b7280', background:'#f3f4f6', padding:'2px 8px', borderRadius:4, flexShrink:0 }}>
                {cat.color}
              </code>
              {/* Actions */}
              <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                <button className="cms-btn cms-btn--edit cms-btn--sm" onClick={() => openEdit(cat)}>Edit</button>
                <button className="cms-btn cms-btn--danger cms-btn--sm" onClick={() => setConfirmTarget({ id:cat.id, label:cat.label })}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) close(); }}
          style={{
            position:'fixed', inset:0, zIndex:2000,
            background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)',
            display:'flex', alignItems:'center', justifyContent:'center', padding:20,
          }}
        >
          <div style={{
            background:'#fff', borderRadius:16, width:'100%', maxWidth:460,
            padding:'28px 30px',
            boxShadow:'0 24px 60px rgba(0,0,0,0.18)',
            animation:'cat-in .2s ease',
          }}>
            <h3 style={{ fontSize:17, fontWeight:700, color:'#111827', marginBottom:20 }}>
              {modal === 'add' ? '+ Add Category' : 'Edit Category'}
            </h3>

            {/* Name */}
            <div className="cms-form-group">
              <label>Category Name *</label>
              <input value={form.label} onChange={e=>set('label',e.target.value)}
                placeholder="e.g. Sealing & Gaskets" autoFocus />
            </div>

            {/* Description */}
            <div className="cms-form-group">
              <label>Description <span style={{ fontWeight:400, color:'#9ca3af' }}>(shown below the part classification on the website)</span></label>
              <textarea value={form.desc||''} onChange={e=>set('desc',e.target.value)}
                placeholder="Describe what this category includes..."
                style={{ width:'100%', padding:'8px 11px', border:'1px solid #e5e7eb', borderRadius:7,
                  fontSize:13.5, fontFamily:'inherit', resize:'vertical', minHeight:68 }} />
            </div>

            {/* Color */}
            <div className="cms-form-group">
              <label>Category Color *</label>

              {/* Color preview */}
              <div style={{
                height:40, borderRadius:9, background:form.color,
                marginBottom:12, border:'1px solid rgba(0,0,0,0.08)',
                display:'flex', alignItems:'center', paddingLeft:14, gap:10,
              }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'rgba(255,255,255,0.6)' }}/>
                <span style={{ color:'#fff', fontSize:13, fontWeight:700, textShadow:'0 1px 3px rgba(0,0,0,0.3)' }}>
                  {form.label || 'Category preview'} &nbsp;·&nbsp; {form.color}
                </span>
              </div>

              {/* Preset swatches */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:12 }}>
                {PRESET_COLORS.map(col => (
                  <div key={col} onClick={() => set('color', col)} style={{
                    width:26, height:26, borderRadius:'50%', background:col,
                    cursor:'pointer',
                    border: form.color===col ? '3px solid #111827' : '2px solid rgba(0,0,0,0.1)',
                    transform: form.color===col ? 'scale(1.2)' : 'scale(1)',
                    transition:'all .1s',
                  }} title={col}/>
                ))}
              </div>

              {/* Color picker + hex input */}
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <input type="color" value={form.color} onChange={e=>set('color',e.target.value)}
                  style={{ width:44, height:36, border:'1px solid #e5e7eb', borderRadius:8,
                    cursor:'pointer', padding:2, background:'white', flexShrink:0 }}
                  title="Open color picker" />
                <input value={form.color} onChange={e => { if(/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) set('color',e.target.value); }}
                  placeholder="#e74c3c"
                  style={{ fontFamily:'monospace', letterSpacing:1, flex:1 }} />
                <span style={{ fontSize:11.5, color:'#9ca3af', flexShrink:0 }}>hex</span>
              </div>
            </div>

            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:20, paddingTop:16, borderTop:'1px solid #f3f4f6' }}>
              <button className="cms-btn cms-btn--ghost" onClick={close}>Cancel</button>
              <button className="cms-btn cms-btn--primary" onClick={save} style={{ minWidth:120 }}>
                {modal==='add' ? 'Add Category' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDelete
        target={confirmTarget}
        onConfirm={(id) => { onDelete(id); toast('Category removed'); }}
        onCancel={() => setConfirmTarget(null)}
      />

      <style>{`@keyframes cat-in{from{opacity:0;transform:scale(.95) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </>
  );
}