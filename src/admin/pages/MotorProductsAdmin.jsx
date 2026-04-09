import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { useToast } from '../components/Toast';

const PRESET_COLORS = [
  '#e74c3c','#c0392b','#e67e22','#f39c12','#2ecc71',
  '#16a085','#3498db','#2980b9','#9b59b6','#8e44ad',
  '#1abc9c','#1d4ed8','#0f766e','#b45309','#374151',
];

function CategoryEditor({ categories, parts, onUpdateCat }) {
  const toast   = useToast();
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState({});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const save = () => {
    if (!form.label?.trim()) { toast('Name required','error'); return; }
    onUpdateCat({...form, label:form.label.trim()});
    toast('Category updated!');
    setEditing(null);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {categories.map(cat => {
        const count     = parts.filter(p => p.categoryId === cat.id).length;
        const isEditing = editing === cat.id;
        return (
          <div key={cat.id} style={{
            background:'#fff', border:`1.5px solid ${isEditing ? cat.color : '#e5e7eb'}`,
            borderRadius:12, overflow:'hidden',
          }}>
            <div style={{ height:4, background:cat.color }}/>
            <div style={{ padding:'16px 18px' }}>
              {isEditing ? (
                <div>
                  <div className="cms-form-group" style={{ marginBottom:10 }}>
                    <label style={{ fontSize:12, fontWeight:600 }}>Category Name</label>
                    <input value={form.label||''} onChange={e=>set('label',e.target.value)}
                      autoFocus style={{ fontSize:14, fontWeight:700 }} />
                  </div>

                  <div className="cms-form-group" style={{ marginBottom:10 }}>
                    <label style={{ fontSize:12, fontWeight:600 }}>
                      Short Description <span style={{ fontWeight:400, color:'#9ca3af' }}>(bold — first line in legend)</span>
                    </label>
                    <input value={form.shortDesc||''} onChange={e=>set('shortDesc',e.target.value)}
                      placeholder="e.g. Oil, fuel, and coolant resistance — leak-free sealing."
                      style={{ fontSize:13 }} />
                  </div>

                  <div className="cms-form-group" style={{ marginBottom:10 }}>
                    <label style={{ fontSize:12, fontWeight:600 }}>
                      Description <span style={{ fontWeight:400, color:'#9ca3af' }}>(normal weight — second line in legend)</span>
                    </label>
                    <textarea value={form.desc||''} onChange={e=>set('desc',e.target.value)}
                      style={{ width:'100%', padding:'8px 11px', border:'1px solid #e5e7eb', borderRadius:7,
                        fontSize:13, fontFamily:'inherit', resize:'vertical', minHeight:72 }} />
                  </div>

                  <div className="cms-form-group" style={{ marginBottom:14 }}>
                    <label style={{ fontSize:12, fontWeight:600 }}>Color</label>
                    <div style={{ height:34, background:form.color, borderRadius:8, marginBottom:10,
                      border:'1px solid rgba(0,0,0,0.08)', display:'flex', alignItems:'center', paddingLeft:12 }}>
                      <span style={{ color:'#fff', fontSize:12.5, fontWeight:700, textShadow:'0 1px 3px rgba(0,0,0,.3)' }}>
                        {form.label || 'Preview'} · {form.color}
                      </span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <input type="color" value={form.color||'#c0392b'} onChange={e=>set('color',e.target.value)}
                        style={{ width:40, height:34, border:'1px solid #e5e7eb', borderRadius:7, cursor:'pointer', padding:2 }} />
                      <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                        {PRESET_COLORS.map(col=>(
                          <div key={col} onClick={()=>set('color',col)} style={{
                            width:22, height:22, borderRadius:'50%', background:col, cursor:'pointer',
                            border: form.color===col ? '2.5px solid #111827' : '2px solid rgba(0,0,0,0.1)',
                            transform: form.color===col ? 'scale(1.2)' : 'scale(1)', transition:'all .1s',
                          }}/>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ display:'flex', gap:8 }}>
                    <button className="cms-btn cms-btn--ghost" onClick={()=>setEditing(null)}>Cancel</button>
                    <button className="cms-btn cms-btn--primary" onClick={save}>Save Category</button>
                  </div>
                </div>
              ) : (
                <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                  <div style={{ width:40, height:40, borderRadius:10, flexShrink:0,
                    background:cat.color+'18', border:`1px solid ${cat.color}30`,
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <div style={{ width:16, height:16, borderRadius:'50%', background:cat.color }}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14.5, fontWeight:700, color:'#111827', marginBottom:2 }}>{cat.label}</div>
                    {cat.shortDesc && (
                      <div style={{ fontSize:12.5, fontWeight:700, color:'#374151', lineHeight:1.4, marginBottom:3 }}>
                        {cat.shortDesc}
                      </div>
                    )}
                    <div style={{ fontSize:12, color:'#6b7280', lineHeight:1.5 }}>{cat.desc}</div>
                    <div style={{ fontSize:11, color:'#9ca3af', marginTop:4 }}>
                      {count} parts · <code style={{ background:'#f3f4f6', padding:'1px 5px', borderRadius:4, fontSize:10 }}>{cat.color}</code>
                    </div>
                  </div>
                  <button className="cms-btn cms-btn--edit cms-btn--sm"
                    onClick={()=>{ setForm({...cat}); setEditing(cat.id); }}>Edit</button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PartsEditor({ categories, parts, onUpdatePart }) {
  const toast   = useToast();
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState({ name:'', desc:'' });

  const save = (pt) => {
    if (!form.name.trim()) { toast('Name required','error'); return; }
    onUpdatePart({ ...pt, name: form.name.trim(), desc: form.desc });
    toast('Part updated!');
    setEditing(null);
  };

  return (
    <div>
      {categories.map(cat => {
        const catParts = parts.filter(p => p.categoryId === cat.id);
        if (!catParts.length) return null;
        return (
          <div key={cat.id} style={{ marginBottom:22 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:cat.color, flexShrink:0 }}/>
              <span style={{ fontSize:12, fontWeight:800, color:'#374151', textTransform:'uppercase', letterSpacing:0.5 }}>
                {cat.label}
              </span>
              <div style={{ flex:1, height:1, background:'#e5e7eb' }}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {catParts.map(pt => (
                <div key={pt.id} style={{ background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:9, padding:'10px 13px' }}>
                  {editing === pt.id ? (
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <div style={{ width:26, height:26, borderRadius:'50%', flexShrink:0, background:cat.color,
                          display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'#fff' }}>
                          {parts.findIndex(p=>p.id===pt.id)+1}
                        </div>
                        <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                          autoFocus placeholder="Part name" style={{ flex:1, fontSize:13.5, fontWeight:600 }}
                          onKeyDown={e=>{ if(e.key==='Escape') setEditing(null); }} />
                        <button className="cms-btn cms-btn--ghost cms-btn--sm" onClick={()=>setEditing(null)}>✕</button>
                        <button className="cms-btn cms-btn--primary cms-btn--sm" onClick={()=>save(pt)}>Save</button>
                      </div>
                      <textarea value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}
                        placeholder="Part description (shown when visitor clicks this pin)…"
                        style={{ width:'100%', padding:'7px 10px', border:'1px solid #e5e7eb', borderRadius:7,
                          fontSize:12.5, fontFamily:'inherit', resize:'vertical', minHeight:56, lineHeight:1.5 }} />
                    </div>
                  ) : (
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:26, height:26, borderRadius:'50%', flexShrink:0, background:cat.color,
                        display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'#fff' }}>
                        {parts.findIndex(p=>p.id===pt.id)+1}
                      </div>
                      <div style={{ flex:1 }}>
                        <span style={{ fontSize:13.5, fontWeight:600, color:'#111827' }}>{pt.name}</span>
                        {pt.desc && <p style={{ fontSize:11.5, color:'#9ca3af', margin:'2px 0 0', lineHeight:1.4 }}>{pt.desc.substring(0,80)}{pt.desc.length>80?'…':''}</p>}
                      </div>
                      <button className="cms-btn cms-btn--edit cms-btn--sm"
                        onClick={()=>{ setForm({name:pt.name, desc:pt.desc||''}); setEditing(pt.id); }}>Edit</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function MotorProductsAdmin() {
  const { state, dispatch } = useCMS();
  const [tab, setTab] = useState('categories');
  const categories = state.products.motorCategories || [];
  const parts      = state.products.motorParts      || [];

  return (
    <div>
      <div style={{ background:'#fff5f5', border:'1px solid #fecaca', borderRadius:10,
        padding:'11px 15px', marginBottom:18, fontSize:13, color:'#991b1b',
        display:'flex', alignItems:'flex-start', gap:9 }}>
        <span style={{ flexShrink:0 }}>ℹ️</span>
        <span>
          The motorcycle image and pin positions are fixed. You can <strong>rename any part</strong>,
          edit its description, and <strong>edit each category's name, colors, and descriptions</strong>
          — changes show instantly on the public page.
        </span>
      </div>

      <div className="cms-tab-bar" style={{ marginBottom:18 }}>
        <button className={`cms-tab${tab==='categories'?' active':''}`} onClick={()=>setTab('categories')}>
          🎨 Categories ({categories.length})
        </button>
        <button className={`cms-tab${tab==='parts'?' active':''}`} onClick={()=>setTab('parts')}>
          📌 Parts ({parts.length})
        </button>
      </div>

      {tab === 'categories' && (
        <div className="cms-card">
          <div className="cms-card-title" style={{ marginBottom:14 }}>
            Motorcycle Categories — edit name, color, and descriptions
          </div>
          <CategoryEditor
            categories={categories}
            parts={parts}
            onUpdateCat={(cat) => dispatch({ type:'MOTOR_CAT_UPDATE', payload:cat })}
          />
        </div>
      )}

      {tab === 'parts' && (
        <div className="cms-card">
          <div className="cms-card-title" style={{ marginBottom:14 }}>
            Motorcycle Parts — click Edit to rename or update description
          </div>
          <PartsEditor
            categories={categories}
            parts={parts}
            onUpdatePart={(pt) => dispatch({ type:'MOTOR_PART_UPDATE', payload:pt })}
          />
        </div>
      )}
    </div>
  );
}