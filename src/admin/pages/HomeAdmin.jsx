import React, { useState } from 'react';
import { useCMS, uid } from '../context/CMSContext';
import { useToast } from '../components/Toast';
import Modal, { ModalActions } from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';
import UploadArea from '../components/UploadArea';

// Drive-aware upload adapter — stores thumbnail URL so <img> tags render correctly
const driveUpload = (setter) => (result) => {
  if (typeof result === 'string') { setter(result); return; }
  const fileId = result?.fileId;
  const url = fileId
    ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`
    : result?.url ?? null;
  setter(url);
};

// Normalise any Drive URL (old uc?export=view or new thumbnail) for <img> rendering
const driveImgSrc = (url, size = 'w400') => {
  if (!url) return null;
  const m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=${size}`;
  return url;
};

// ─── Certifications ───────────────────────────────────────────────────────────
function CertSection() {
  const { state, dispatch } = useCMS();
  const toast = useToast();
  const [modal,         setModal]         = useState(null);
  const [form,          setForm]          = useState({});
  const [imgSrc,        setImgSrc]        = useState(null);
  const [preview,       setPreview]       = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openAdd  = () => { setForm({ code:'', label:'', issuedBy:'', validUntil:'' }); setImgSrc(null); setModal('add'); };
  const openEdit = (c) => { setForm(c); setImgSrc(c.img||null); setModal(c.id); };

  const save = () => {
    if (!form.code.trim()) { toast('Code required','error'); return; }
    const payload = { ...form, img: imgSrc ?? form.img ?? null };
    if (modal === 'add') { dispatch({ type:'HOME_ADD_CERT', payload:{ id:uid(), ...payload } }); toast('Certification added!'); }
    else                 { dispatch({ type:'HOME_UPDATE_CERT', payload }); toast('Updated!'); }
    setModal(null);
  };

  const certs = state.home.certifications;

  return (
    <div className="cms-card">
      <div className="cms-card-title">
        Certifications
        <button className="cms-btn cms-btn--primary cms-btn--sm" onClick={openAdd}>+ Add</button>
      </div>
      <p className="cms-hint">
        Upload the actual certificate image for each — visitors can click a cert card on the Home page to view the full certificate.
      </p>

      {certs.length === 0
        ? <div className="cms-empty"><div className="cms-empty-icon">🏅</div><p>No certifications yet.</p></div>
        : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14 }}>
            {certs.map(c => (
              <div key={c.id} style={{ background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:10, overflow:'hidden' }}>
                {/* Certificate image preview */}
                <div
                  onClick={() => c.img && setPreview(c)}
                  style={{
                    height:110, background: c.img ? '#000' : '#f3f4f6',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    cursor: c.img ? 'zoom-in' : 'default', position:'relative', overflow:'hidden',
                  }}
                >
                  {c.img
                    ? <img src={driveImgSrc(c.img, 'w400')} alt={c.code} style={{ width:'100%', height:'100%', objectFit:'contain', padding:8 }} />
                    : <div style={{ textAlign:'center', color:'#9ca3af' }}>
                        <div style={{ fontSize:28 }}>🏅</div>
                        <div style={{ fontSize:11, marginTop:4 }}>No image</div>
                      </div>
                  }
                  {c.img && (
                    <div style={{ position:'absolute', top:6, right:6, background:'rgba(0,0,0,0.55)',
                      borderRadius:4, padding:'2px 7px', fontSize:10.5, color:'#fff' }}>
                      🔍 Click to view
                    </div>
                  )}
                </div>

                <div style={{ padding:'10px 12px' }}>
                  <div style={{ fontWeight:700, fontSize:14, color:'#111827' }}>{c.code}</div>
                  <div style={{ fontSize:12, color:'#6b7280', marginTop:1 }}>{c.label}</div>
                  {c.issuedBy && <div style={{ fontSize:11, color:'#9ca3af', marginTop:3 }}>by {c.issuedBy}</div>}
                  {c.validUntil && <div style={{ fontSize:11, color:'#9ca3af' }}>Valid until: {c.validUntil}</div>}
                  <div style={{ display:'flex', gap:5, marginTop:9 }}>
                    <button className="cms-btn cms-btn--edit cms-btn--sm" style={{ flex:1 }} onClick={() => openEdit(c)}>Edit</button>
                    <button className="cms-btn cms-btn--danger cms-btn--sm" onClick={() => setConfirmTarget({ id: c.id, label: c.code })}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Edit / Add Modal */}
      {modal && (
        <Modal title={modal==='add'?'Add Certification':'Edit Certification'} onClose={()=>setModal(null)} wide>
          <div className="cms-form-row">
            <div className="cms-form-group"><label>Code * (e.g. ISO 9001)</label><input value={form.code||''} onChange={e=>set('code',e.target.value)} /></div>
            <div className="cms-form-group"><label>Label (e.g. Quality Management)</label><input value={form.label||''} onChange={e=>set('label',e.target.value)} /></div>
          </div>
          <div className="cms-form-row">
            <div className="cms-form-group"><label>Issued By</label><input value={form.issuedBy||''} onChange={e=>set('issuedBy',e.target.value)} placeholder="e.g. Bureau Veritas" /></div>
            <div className="cms-form-group"><label>Valid Until</label><input value={form.validUntil||''} onChange={e=>set('validUntil',e.target.value)} placeholder="e.g. Dec 2026" /></div>
          </div>
          <div className="cms-form-group">
            <label>Certificate Image <span style={{fontWeight:400,color:'#9ca3af'}}>(upload a scan or photo of the certificate)</span></label>
            <UploadArea onUpload={driveUpload(setImgSrc)} preview={imgSrc} height={150} label="Upload certificate scan / photo" />
          </div>
          <ModalActions>
            <button className="cms-btn cms-btn--ghost" onClick={()=>setModal(null)}>Cancel</button>
            <button className="cms-btn cms-btn--primary" onClick={save}>Save</button>
          </ModalActions>
        </Modal>
      )}

      {/* Lightbox preview */}
      {preview && (
        <div onClick={()=>setPreview(null)} style={{
          position:'fixed', inset:0, zIndex:2000, background:'rgba(0,0,0,0.88)',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24,
        }}>
          <div onClick={e=>e.stopPropagation()} style={{ maxWidth:800, width:'100%' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div>
                <div style={{ color:'#fff', fontSize:18, fontWeight:700 }}>{preview.code}</div>
                <div style={{ color:'rgba(255,255,255,0.6)', fontSize:13 }}>{preview.label}{preview.issuedBy ? ` · ${preview.issuedBy}` : ''}</div>
              </div>
              <button onClick={()=>setPreview(null)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', borderRadius:8, padding:'6px 14px', cursor:'pointer', fontSize:14 }}>✕ Close</button>
            </div>
            <img src={driveImgSrc(preview.img, 'w1600')} alt={preview.code} style={{ width:'100%', borderRadius:10, display:'block', maxHeight:'72vh', objectFit:'contain' }} />
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDelete
        target={confirmTarget}
        onConfirm={(id) => { dispatch({ type:'HOME_DEL_CERT', payload:id }); toast('Certification removed'); }}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}

// ─── Partners ─────────────────────────────────────────────────────────────────
function PartnersSection() {
  const { state, dispatch } = useCMS();
  const toast = useToast();
  const [modal,         setModal]         = useState(null);
  const [name,          setName]          = useState('');
  const [confirmTarget, setConfirmTarget] = useState(null);

  const openAdd  = () => { setName(''); setModal('add'); };
  const openEdit = (item) => { setName(item.name); setModal(item.id); };

  const save = () => {
    if (!name.trim()) { toast('Name required', 'error'); return; }
    if (modal === 'add') {
      dispatch({ type: 'HOME_ADD_PARTNER', payload: { id: uid(), name: name.trim() } });
      toast('Partner added!');
    } else {
      dispatch({ type: 'HOME_UPDATE_PARTNER', payload: { id: modal, name: name.trim() } });
      toast('Updated!');
    }
    setModal(null);
  };

  return (
    <div className="cms-card">
      <div className="cms-card-title">
        Trusted by Industry Leaders — Partner Companies
        <button className="cms-btn cms-btn--primary cms-btn--sm" onClick={openAdd}>+ Add Partner</button>
      </div>
      <p className="cms-hint">These scroll across the marquee rows at the bottom of the Home page.</p>

      {state.home.partners.length === 0
        ? <div className="cms-empty"><div className="cms-empty-icon">🤝</div><p>No partners yet.</p></div>
        : (
          <table className="cms-table">
            <thead><tr><th>#</th><th>Company Name</th><th>Actions</th></tr></thead>
            <tbody>
              {state.home.partners.map((p, i) => (
                <tr key={p.id}>
                  <td style={{ color: '#9ca3af', width: 40 }}>{i + 1}</td>
                  <td><strong>{p.name}</strong></td>
                  <td className="cms-td-actions">
                    <button className="cms-btn cms-btn--edit cms-btn--sm" onClick={() => openEdit(p)}>Edit</button>
                    <button className="cms-btn cms-btn--danger cms-btn--sm" onClick={() => setConfirmTarget({ id: p.id, label: p.name })}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      {modal && (
        <Modal title={modal === 'add' ? 'Add Partner' : 'Edit Partner'} onClose={() => setModal(null)}>
          <div className="cms-form-group"><label>Company Name *</label><input value={name} onChange={e => setName(e.target.value)} /></div>
          <ModalActions>
            <button className="cms-btn cms-btn--ghost" onClick={() => setModal(null)}>Cancel</button>
            <button className="cms-btn cms-btn--primary" onClick={save}>Save</button>
          </ModalActions>
        </Modal>
      )}

      {/* Delete confirmation */}
      <ConfirmDelete
        target={confirmTarget}
        onConfirm={(id) => { dispatch({ type:'HOME_DEL_PARTNER', payload:id }); toast('Partner removed'); }}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}

export default function HomeAdmin() {
  return (
    <div>
      <div className="cms-page-header">
        <div><h1 className="cms-page-title">Home</h1><p className="cms-page-sub">Manage certifications and trusted partner companies</p></div>
      </div>
      <CertSection />
      <PartnersSection />
    </div>
  );
}