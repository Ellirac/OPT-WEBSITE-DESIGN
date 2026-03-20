import React, { useState } from 'react';
import { useCMS, uid } from '../context/CMSContext';
import { useToast } from '../components/Toast';
import Modal, { ModalActions } from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';
import UploadArea from '../components/UploadArea';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Textarea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
    style={{ width: '100%', padding: '8px 11px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 13.5, fontFamily: 'inherit', resize: 'vertical' }} />
);

// ─── FACTORIES ────────────────────────────────────────────────────────────────
function FactoriesTab() {
  const { state, dispatch } = useCMS();
  const toast = useToast();
  const [modal,         setModal]         = useState(null);
  const [form,          setForm]          = useState({});
  const [img,           setImg]           = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openAdd  = () => { setForm({ name:'', lotArea:'', buildingArea:'', address:'', built:'' }); setImg(null); setModal('add'); };
  const openEdit = (f) => { setForm(f); setImg(f.img||null); setModal(f.id); };

  const save = () => {
    if (!form.name?.trim()) { toast('Name required','error'); return; }
    const payload = { ...form, img: img ?? form.img ?? null };
    if (modal === 'add') { dispatch({ type:'ABOUT_ADD_FACTORY', payload:{ id:uid(), ...payload } }); toast('Factory added!'); }
    else { dispatch({ type:'ABOUT_UPDATE_FACTORY', payload }); toast('Updated!'); }
    setModal(null);
  };

  return (
    <>
      <div className="cms-card">
        <div className="cms-card-title">Factories / Facilities <button className="cms-btn cms-btn--primary cms-btn--sm" onClick={openAdd}>+ Add Factory</button></div>
        {state.about.factories.length === 0
          ? <div className="cms-empty"><div className="cms-empty-icon">🏭</div><p>No factories yet.</p></div>
          : <div className="cms-grid-3">{state.about.factories.map(f => (
              <div key={f.id} className="cms-item-card">
                {f.img ? <img src={f.img} alt={f.name} className="cms-item-card-img" /> : <div className="cms-item-card-no-img">🏭</div>}
                <div className="cms-item-card-body">
                  <div className="cms-item-card-title">{f.name}</div>
                  <div className="cms-item-card-meta" style={{fontSize:11.5}}>{f.address}</div>
                  {f.lotArea && <div style={{fontSize:11.5,color:'#6b7280',marginTop:3}}>Lot: {f.lotArea} | Bldg: {f.buildingArea}</div>}
                  <div className="cms-item-card-actions">
                    <button className="cms-btn cms-btn--edit cms-btn--sm" onClick={() => openEdit(f)}>Edit</button>
                    <button className="cms-btn cms-btn--danger cms-btn--sm" onClick={() => setConfirmTarget({ id: f.id, label: f.name })}>Delete</button>
                  </div>
                </div>
              </div>
            ))}</div>}
      </div>

      <ConfirmDelete
        target={confirmTarget}
        onConfirm={(id) => { dispatch({type:'ABOUT_DEL_FACTORY',payload:id}); toast('Factory removed'); }}
        onCancel={() => setConfirmTarget(null)}
      />
      <ConfirmDelete
        target={confirmTarget}
        onConfirm={(id) => { dispatch({type:'ABOUT_DEL_FACTORY',payload:id}); toast('Factory removed'); }}
        onCancel={() => setConfirmTarget(null)}
      />
      {modal && (
        <Modal title={modal==='add'?'Add Factory':'Edit Factory'} onClose={()=>setModal(null)} wide>
          <div className="cms-form-row">
            <div className="cms-form-group"><label>Factory Name *</label><input value={form.name||''} onChange={e=>set('name',e.target.value)} /></div>
            <div className="cms-form-group"><label>Date Built</label><input value={form.built||''} onChange={e=>set('built',e.target.value)} placeholder="e.g. Dec 5, 2015" /></div>
          </div>
          <div className="cms-form-row">
            <div className="cms-form-group"><label>Lot Area</label><input value={form.lotArea||''} onChange={e=>set('lotArea',e.target.value)} placeholder="e.g. 18,959 m²" /></div>
            <div className="cms-form-group"><label>Building Area</label><input value={form.buildingArea||''} onChange={e=>set('buildingArea',e.target.value)} placeholder="e.g. 8,578 m²" /></div>
          </div>
          <div className="cms-form-group"><label>Address</label><input value={form.address||''} onChange={e=>set('address',e.target.value)} /></div>
          <div className="cms-form-group"><label>Photo</label><UploadArea onUpload={setImg} preview={img} /></div>
          <ModalActions>
            <button className="cms-btn cms-btn--ghost" onClick={()=>setModal(null)}>Cancel</button>
            <button className="cms-btn cms-btn--primary" onClick={save}>Save</button>
          </ModalActions>
        </Modal>
      )}
    </>
  );
}

// ─── COMPANY INFO ─────────────────────────────────────────────────────────────
function CompanyInfoTab() {
  const { state, dispatch } = useCMS();
  const toast = useToast();
  const [form, setForm] = useState(state.about.companyInfo);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = () => { dispatch({ type:'ABOUT_UPDATE_INFO', payload:form }); toast('Company info saved!'); };

  const fields = [
    { k:'company',      l:'Company Name' },
    { k:'established',  l:'Date Established' },
    { k:'operations',   l:'Date Operations Started' },
    { k:'businessType', l:'Business Type' },
    { k:'telephone',    l:'Telephone' },
    { k:'smart',        l:'Smart Number' },
    { k:'globe',        l:'Globe Number' },
    { k:'manilaLine',   l:'Manila Line' },
    { k:'products',     l:'Products / Services' },
    { k:'workforce',    l:'Total Workforce' },
  ];

  return (
    <div className="cms-card">
      <div className="cms-card-title">Company Information</div>
      <p className="cms-hint">Edits here update the "Company Information" section inside Company Profile.</p>
      <div className="cms-form-row">
        {fields.map(f => (
          <div key={f.k} className="cms-form-group">
            <label>{f.l}</label>
            <input value={form[f.k]||''} onChange={e=>set(f.k,e.target.value)} />
          </div>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}>
        <button className="cms-btn cms-btn--primary" onClick={save}>Save Company Info</button>
      </div>
    </div>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function HistoryTab() {
  const { state, dispatch } = useCMS();
  const toast = useToast();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [confirmTarget, setConfirmTarget] = useState(null);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const openAdd  = () => { setForm({ year: new Date().getFullYear(), event:'' }); setModal('add'); };
  const openEdit = (h) => { setForm(h); setModal(h.id); };

  const save = () => {
    if (!form.event?.trim()) { toast('Event text required','error'); return; }
    if (modal==='add') { dispatch({type:'ABOUT_ADD_HISTORY',payload:{id:uid(),...form,year:Number(form.year)}}); toast('Milestone added!'); }
    else { dispatch({type:'ABOUT_UPDATE_HISTORY',payload:{...form,year:Number(form.year)}}); toast('Updated!'); }
    setModal(null);
  };

  const sorted = [...state.about.history].sort((a,b)=>a.year-b.year);

  return (
    <>
      <div className="cms-card">
        <div className="cms-card-title">Company History &amp; Milestones <button className="cms-btn cms-btn--primary cms-btn--sm" onClick={openAdd}>+ Add Milestone</button></div>
        {sorted.length === 0
          ? <div className="cms-empty"><div className="cms-empty-icon">🏆</div><p>No milestones yet.</p></div>
          : <div className="cms-timeline">{sorted.map(h=>(
              <div key={h.id} className="cms-timeline-item">
                <div className="cms-timeline-dot"/>
                <div className="cms-timeline-card">
                  <div>
                    <div className="cms-timeline-year">{h.year}</div>
                    <div className="cms-timeline-desc" style={{marginTop:2}}>{h.event}</div>
                  </div>
                  <div className="cms-timeline-actions">
                    <button className="cms-btn cms-btn--edit cms-btn--sm" onClick={()=>openEdit(h)}>Edit</button>
                    <button className="cms-btn cms-btn--danger cms-btn--sm" onClick={()=> setConfirmTarget({ id: h.id, label: `${h.year} — ${h.event?.substring(0,40)}` })}>✕</button>
                  </div>
                </div>
              </div>
            ))}</div>}
      </div>

      <ConfirmDelete
        target={confirmTarget}
        onConfirm={(id) => { dispatch({type:'ABOUT_DEL_HISTORY',payload:id}); toast('Milestone removed'); }}
        onCancel={() => setConfirmTarget(null)}
      />
      <ConfirmDelete
        target={confirmTarget}
        onConfirm={(id) => { dispatch({type:'ABOUT_DEL_HISTORY',payload:id}); toast('Milestone removed'); }}
        onCancel={() => setConfirmTarget(null)}
      />
      {modal && (
        <Modal title={modal==='add'?'Add Milestone':'Edit Milestone'} onClose={()=>setModal(null)}>
          <div className="cms-form-row">
            <div className="cms-form-group"><label>Year *</label><input type="number" value={form.year||''} onChange={e=>set('year',e.target.value)} min="1900" max="2100" /></div>
          </div>
          <div className="cms-form-group"><label>Event / Achievement *</label><Textarea value={form.event||''} onChange={e=>set('event',e.target.value)} rows={3} /></div>
          <ModalActions>
            <button className="cms-btn cms-btn--ghost" onClick={()=>setModal(null)}>Cancel</button>
            <button className="cms-btn cms-btn--primary" onClick={save}>Save</button>
          </ModalActions>
        </Modal>
      )}
    </>
  );
}

// ─── TEAM (Organization + Management) ─────────────────────────────────────────
function TeamTab() {
  const { state, dispatch } = useCMS();
  const toast = useToast();
  const [orgModal, setOrgModal] = useState(null);
  const [orgForm, setOrgForm] = useState({});
  const [orgImg, setOrgImg] = useState(null);
  const [mgmtModal, setMgmtModal] = useState(null);
  const [mgmtForm, setMgmtForm] = useState({});
  const [confirmOrg, setConfirmOrg] = useState(null);
  const [confirmMgmt, setConfirmMgmt] = useState(null);

  // ── Organization ──
  const openOrgAdd  = () => { setOrgForm({name:'',role:''}); setOrgImg(null); setOrgModal('add'); };
  const openOrgEdit = (m) => { setOrgForm(m); setOrgImg(m.img||null); setOrgModal(m.id); };
  const saveOrg = () => {
    if (!orgForm.name?.trim()) { toast('Name required','error'); return; }
    const payload = { ...orgForm, img: orgImg ?? orgForm.img ?? null };
    if (orgModal==='add') { dispatch({type:'ABOUT_ADD_ORG',payload:{id:uid(),...payload}}); toast('Member added!'); }
    else { dispatch({type:'ABOUT_UPDATE_ORG',payload}); toast('Updated!'); }
    setOrgModal(null);
  };

  // ── Management ──
  const openMgmtAdd  = () => { setMgmtForm({department:'',teamsText:''}); setMgmtModal('add'); };
  const openMgmtEdit = (m) => { setMgmtForm({...m, teamsText:(m.teams||[]).join('\n')}); setMgmtModal(m.id); };
  const saveMgmt = () => {
    if (!mgmtForm.department?.trim()) { toast('Department required','error'); return; }
    const teams = mgmtForm.teamsText.split('\n').map(s=>s.trim()).filter(Boolean);
    const payload = { department: mgmtForm.department, teams };
    if (mgmtModal==='add') { dispatch({type:'ABOUT_ADD_MGMT',payload:{id:uid(),...payload}}); toast('Department added!'); }
    else { dispatch({type:'ABOUT_UPDATE_MGMT',payload:{id:mgmtModal,...payload}}); toast('Updated!'); }
    setMgmtModal(null);
  };

  return (
    <>
      {/* Organization */}
      <div className="cms-card">
        <div className="cms-card-title">Organization (with Photos) <button className="cms-btn cms-btn--primary cms-btn--sm" onClick={openOrgAdd}>+ Add Person</button></div>
        <p className="cms-hint">Top leadership shown with profile photos on the Our Team page.</p>
        {state.about.organization.length===0
          ? <div className="cms-empty"><div className="cms-empty-icon">👤</div><p>No members yet.</p></div>
          : <div className="cms-grid-team">{state.about.organization.map(m=>(
              <div key={m.id} className="cms-team-card">
                {m.img ? <img src={m.img} alt={m.name} className="cms-team-card-img" /> : <div className="cms-team-card-no-img">👤</div>}
                <div className="cms-team-card-body">
                  <div className="cms-team-name">{m.name}</div>
                  <div className="cms-team-role">{m.role}</div>
                  <div className="cms-team-actions">
                    <button className="cms-btn cms-btn--edit cms-btn--sm" onClick={()=>openOrgEdit(m)}>Edit</button>
                    <button className="cms-btn cms-btn--danger cms-btn--sm" onClick={()=> setConfirmOrg({ id: m.id, label: m.name })}>✕</button>
                  </div>
                </div>
              </div>
            ))}</div>}
      </div>

      {/* Management */}
      <div className="cms-card">
        <div className="cms-card-title">Management Departments <button className="cms-btn cms-btn--primary cms-btn--sm" onClick={openMgmtAdd}>+ Add Department</button></div>
        <p className="cms-hint">Management team listed by department. Teams inside each department are listed as bullet points.</p>
        {state.about.management.length===0
          ? <div className="cms-empty"><div className="cms-empty-icon">🏢</div><p>No departments yet.</p></div>
          : <table className="cms-table">
              <thead><tr><th>Department</th><th>Teams</th><th>Actions</th></tr></thead>
              <tbody>{state.about.management.map(m=>(
                <tr key={m.id}>
                  <td><strong>{m.department}</strong></td>
                  <td style={{fontSize:12.5}}>{(m.teams||[]).join(' • ')}</td>
                  <td className="cms-td-actions">
                    <button className="cms-btn cms-btn--edit cms-btn--sm" onClick={()=>openMgmtEdit(m)}>Edit</button>
                    <button className="cms-btn cms-btn--danger cms-btn--sm" onClick={()=> setConfirmMgmt({ id: m.id, label: m.department })}>Delete</button>
                  </td>
                </tr>
              ))}</tbody>
            </table>}
      </div>

      <ConfirmDelete
        target={confirmOrg}
        onConfirm={(id) => { dispatch({type:'ABOUT_DEL_ORG',payload:id}); toast('Member removed'); }}
        onCancel={() => setConfirmOrg(null)}
      />
      <ConfirmDelete
        target={confirmMgmt}
        onConfirm={(id) => { dispatch({type:'ABOUT_DEL_MGMT',payload:id}); toast('Department removed'); }}
        onCancel={() => setConfirmMgmt(null)}
      />
      <ConfirmDelete target={confirmOrg} onConfirm={(id) => { dispatch({type:'ABOUT_DEL_ORG',payload:id}); toast('Member removed'); }} onCancel={() => setConfirmOrg(null)} />
      <ConfirmDelete target={confirmMgmt} onConfirm={(id) => { dispatch({type:'ABOUT_DEL_MGMT',payload:id}); toast('Department removed'); }} onCancel={() => setConfirmMgmt(null)} />
      {/* Org Modal */}
      {orgModal && (
        <Modal title={orgModal==='add'?'Add Member':'Edit Member'} onClose={()=>setOrgModal(null)}>
          <div className="cms-form-group"><label>Full Name *</label><input value={orgForm.name||''} onChange={e=>setOrgForm(f=>({...f,name:e.target.value}))} /></div>
          <div className="cms-form-group"><label>Role / Title</label><input value={orgForm.role||''} onChange={e=>setOrgForm(f=>({...f,role:e.target.value}))} /></div>
          <div className="cms-form-group"><label>Profile Photo</label><UploadArea onUpload={setOrgImg} preview={orgImg} height={90} circle /></div>
          <ModalActions>
            <button className="cms-btn cms-btn--ghost" onClick={()=>setOrgModal(null)}>Cancel</button>
            <button className="cms-btn cms-btn--primary" onClick={saveOrg}>Save</button>
          </ModalActions>
        </Modal>
      )}

      {/* Mgmt Modal */}
      {mgmtModal && (
        <Modal title={mgmtModal==='add'?'Add Department':'Edit Department'} onClose={()=>setMgmtModal(null)}>
          <div className="cms-form-group"><label>Department Name *</label><input value={mgmtForm.department||''} onChange={e=>setMgmtForm(f=>({...f,department:e.target.value}))} /></div>
          <div className="cms-form-group">
            <label>Teams (one per line)</label>
            <Textarea value={mgmtForm.teamsText||''} onChange={e=>setMgmtForm(f=>({...f,teamsText:e.target.value}))} placeholder={"Human Resources\nAccounting\nIT"} rows={5} />
          </div>
          <ModalActions>
            <button className="cms-btn cms-btn--ghost" onClick={()=>setMgmtModal(null)}>Cancel</button>
            <button className="cms-btn cms-btn--primary" onClick={saveMgmt}>Save</button>
          </ModalActions>
        </Modal>
      )}
    </>
  );
}

// ─── BASES ────────────────────────────────────────────────────────────────────
function BasesTab() {
  const { state, dispatch } = useCMS();
  const toast = useToast();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [img, setImg] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const openAdd  = () => { setForm({name:'',address:'',website:'',websiteName:'',mapUrl:''}); setImg(null); setModal('add'); };
  const openEdit = (b) => { setForm(b); setImg(b.img||null); setModal(b.id); };

  const save = () => {
    if (!form.name?.trim()) { toast('Name required','error'); return; }
    const payload = { ...form, img: img ?? form.img ?? null };
    if (modal==='add') { dispatch({type:'ABOUT_ADD_BASE',payload:{id:uid(),...payload}}); toast('Base added!'); }
    else { dispatch({type:'ABOUT_UPDATE_BASE',payload}); toast('Updated!'); }
    setModal(null);
  };

  return (
    <>
      <div className="cms-card">
        <div className="cms-card-title">Our Bases / Locations <button className="cms-btn cms-btn--primary cms-btn--sm" onClick={openAdd}>+ Add Base</button></div>
        <p className="cms-hint">Each base shows a photo, address, optional website link, and a Google Maps embed.</p>
        {state.about.bases.length===0
          ? <div className="cms-empty"><div className="cms-empty-icon">📍</div><p>No bases yet.</p></div>
          : <div className="cms-grid-3">{state.about.bases.map(b=>(
              <div key={b.id} className="cms-item-card">
                {b.img ? <img src={b.img} alt={b.name} className="cms-item-card-img" /> : <div className="cms-item-card-no-img">📍</div>}
                <div className="cms-item-card-body">
                  <div className="cms-item-card-title">{b.name}</div>
                  <div className="cms-item-card-meta" style={{fontSize:11.5}}>{b.address}</div>
                  {b.mapUrl && <span className="cms-badge cms-badge--green" style={{marginTop:5}}>Map URL set</span>}
                  <div className="cms-item-card-actions">
                    <button className="cms-btn cms-btn--edit cms-btn--sm" onClick={()=>openEdit(b)}>Edit</button>
                    <button className="cms-btn cms-btn--danger cms-btn--sm" onClick={()=> setConfirmTarget({ id: b.id, label: b.name })}>Delete</button>
                  </div>
                </div>
              </div>
            ))}</div>}
      </div>

      <ConfirmDelete
        target={confirmTarget}
        onConfirm={(id) => { dispatch({type:'ABOUT_DEL_BASE',payload:id}); toast('Base removed'); }}
        onCancel={() => setConfirmTarget(null)}
      />
      <ConfirmDelete
        target={confirmTarget}
        onConfirm={(id) => { dispatch({type:'ABOUT_DEL_BASE',payload:id}); toast('Base removed'); }}
        onCancel={() => setConfirmTarget(null)}
      />
      {modal && (
        <Modal title={modal==='add'?'Add Base':'Edit Base'} onClose={()=>setModal(null)} wide>
          <div className="cms-form-group"><label>Base Name *</label><input value={form.name||''} onChange={e=>set('name',e.target.value)} /></div>
          <div className="cms-form-group"><label>Address</label><input value={form.address||''} onChange={e=>set('address',e.target.value)} /></div>
          <div className="cms-form-row">
            <div className="cms-form-group"><label>Website URL (optional)</label><input value={form.website||''} onChange={e=>set('website',e.target.value)} placeholder="https://..." /></div>
            <div className="cms-form-group"><label>Website Display Name</label><input value={form.websiteName||''} onChange={e=>set('websiteName',e.target.value)} /></div>
          </div>
          <div className="cms-form-group">
            <label>Google Maps Embed URL</label>
            <input value={form.mapUrl||''} onChange={e=>set('mapUrl',e.target.value)} placeholder="Paste the embed src URL from Google Maps → Share → Embed" />
            <p style={{fontSize:11.5,color:'#9ca3af',marginTop:4}}>Go to Google Maps → Share → Embed a map → copy the src="..." URL only.</p>
          </div>
          <div className="cms-form-group"><label>Photo</label><UploadArea onUpload={setImg} preview={img} /></div>
          <ModalActions>
            <button className="cms-btn cms-btn--ghost" onClick={()=>setModal(null)}>Cancel</button>
            <button className="cms-btn cms-btn--primary" onClick={save}>Save</button>
          </ModalActions>
        </Modal>
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id:'factories',   label:'Factories',       Component: FactoriesTab },
  { id:'companyInfo', label:'Company Info',     Component: CompanyInfoTab },
  { id:'history',     label:'History',          Component: HistoryTab },
  { id:'team',        label:'Team',             Component: TeamTab },
  { id:'bases',       label:'Our Bases',        Component: BasesTab },
];

export default function AboutAdmin() {
  const [tab, setTab] = useState('factories');
  const { Component } = TABS.find(t => t.id === tab);
  return (
    <div>
      <div className="cms-page-header">
        <div><h1 className="cms-page-title">About Us</h1><p className="cms-page-sub">Factories, company info, history, team and global bases</p></div>
      </div>
      <div className="cms-tab-bar">
        {TABS.map(t => <button key={t.id} className={`cms-tab${tab===t.id?' active':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
      </div>
      <Component />
    </div>
  );
}
