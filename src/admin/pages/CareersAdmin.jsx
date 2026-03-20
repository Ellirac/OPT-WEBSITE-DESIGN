import React, { useState } from 'react';
import { useCMS, uid } from '../context/CMSContext';
import { useToast } from '../components/Toast';
import Modal, { ModalActions } from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';

const JOB_TYPES = ['Full-time','Part-time','Contract','Internship'];

/* Textarea helper */
const TA = ({ value, onChange, placeholder, rows=4 }) => (
  <textarea
    value={value} onChange={onChange} placeholder={placeholder} rows={rows}
    style={{ width:'100%', padding:'8px 11px', border:'1px solid #e5e7eb', borderRadius:7,
             fontSize:13.5, fontFamily:'inherit', resize:'vertical' }}
  />
);

/* Convert array ↔ newline-text */
const arrToText = arr => (arr || []).join('\n');
const textToArr = txt => txt.split('\n').map(s => s.trim()).filter(Boolean);

export default function CareersAdmin() {
  const { state, dispatch } = useCMS();
  const toast = useToast();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [confirmTarget, setConfirmTarget] = useState(null);
  /* text-area versions of the array fields */
  const [qualiText, setQualiText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [reqText, setReqText] = useState('');

  const openAdd = () => {
    setForm({ title:'', date:'', jobType:'Full-time', experience:'' });
    setQualiText(''); setBenefitsText(''); setReqText('');
    setModal('add');
  };

  const openEdit = (j) => {
    setForm(j);
    setQualiText(arrToText(j.qualifications));
    setBenefitsText(arrToText(j.benefits));
    setReqText(arrToText(j.requirements));
    setModal(j.id);
  };

  const close = () => setModal(null);

  const save = () => {
    if (!form.title?.trim()) { toast('Job title required','error'); return; }
    const payload = {
      ...form,
      qualifications: textToArr(qualiText),
      benefits:       textToArr(benefitsText),
      requirements:   textToArr(reqText),
    };
    if (modal === 'add') { dispatch({ type:'CAREER_ADD', payload:{ id:uid(), ...payload } }); toast('Position added!'); }
    else                 { dispatch({ type:'CAREER_UPDATE', payload }); toast('Updated!'); }
    close();
  };

  const jobs = state.careers.jobs;

  return (
    <div>
      <div className="cms-page-header">
        <div><h1 className="cms-page-title">Careers</h1><p className="cms-page-sub">Manage open job positions and their requirements</p></div>
        <button className="cms-btn cms-btn--primary" onClick={openAdd}>+ Add Position</button>
      </div>

      {/* Stats */}
      <div className="cms-stats-grid" style={{ gridTemplateColumns:'repeat(3,auto)', justifyContent:'start', marginBottom:18 }}>
        <div className="cms-stat-card"><div className="cms-stat-val">{jobs.length}</div><div className="cms-stat-lbl">Total Positions</div></div>
        <div className="cms-stat-card"><div className="cms-stat-val">{jobs.filter(j=>j.jobType==='Full-time').length}</div><div className="cms-stat-lbl">Full-time</div></div>
        <div className="cms-stat-card"><div className="cms-stat-val">{jobs.filter(j=>j.jobType==='Internship').length}</div><div className="cms-stat-lbl">Internship</div></div>
      </div>

      <div className="cms-card">
        {jobs.length === 0
          ? <div className="cms-empty"><div className="cms-empty-icon">💼</div><p>No positions yet. Click "Add Position" to post a job.</p></div>
          : (
            <table className="cms-table">
              <thead><tr><th>Job Title</th><th>Date Posted</th><th>Type</th><th>Qualifications</th><th>Benefits</th><th>Actions</th></tr></thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j.id}>
                    <td><strong>{j.title}</strong></td>
                    <td style={{ whiteSpace:'nowrap', fontSize:12.5 }}>{j.date||'—'}</td>
                    <td>
                      <span className={`cms-badge ${j.jobType==='Full-time'?'cms-badge--green':j.jobType==='Internship'?'cms-badge--orange':'cms-badge--blue'}`}>
                        {j.jobType}
                      </span>
                    </td>
                    <td style={{ fontSize:12 }}>{(j.qualifications||[]).length} items</td>
                    <td style={{ fontSize:12 }}>{(j.benefits||[]).length} items</td>
                    <td className="cms-td-actions">
                      <button className="cms-btn cms-btn--edit cms-btn--sm" onClick={() => openEdit(j)}>Edit</button>
                      <button className="cms-btn cms-btn--danger cms-btn--sm" onClick={() => setConfirmTarget({ id: j.id, label: j.title })}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>

      {modal && (
        <Modal title={modal==='add'?'Add Position':'Edit Position'} onClose={close} wide>
          <div className="cms-form-row">
            <div className="cms-form-group"><label>Job Title *</label><input value={form.title||''} onChange={e=>setForm(f=>({...f,title:e.target.value}))} /></div>
            <div className="cms-form-group"><label>Date Posted</label><input value={form.date||''} onChange={e=>setForm(f=>({...f,date:e.target.value}))} placeholder="e.g. 01/06/2025" /></div>
          </div>
          <div className="cms-form-group">
            <label>Employment Type</label>
            <select value={form.jobType||'Full-time'} onChange={e=>setForm(f=>({...f,jobType:e.target.value}))}>
              {JOB_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="cms-form-group">
            <label>Experience</label>
            <input value={form.experience||''} onChange={e=>setForm(f=>({...f,experience:e.target.value}))} placeholder="e.g. Preferably with experience as a Company Driver" />
          </div>

          <div className="cms-form-group">
            <label>Qualifications <span style={{color:'#9ca3af',fontWeight:400}}>(one per line)</span></label>
            <TA value={qualiText} onChange={e=>setQualiText(e.target.value)} placeholder={"Male\n23 to 40 years old\nMust have valid driver's license"} rows={5} />
          </div>
          <div className="cms-form-group">
            <label>Requirements <span style={{color:'#9ca3af',fontWeight:400}}>(one per line — leave blank if none)</span></label>
            <TA value={reqText} onChange={e=>setReqText(e.target.value)} rows={4} />
          </div>
          <div className="cms-form-group">
            <label>Benefits <span style={{color:'#9ca3af',fontWeight:400}}>(one per line)</span></label>
            <TA value={benefitsText} onChange={e=>setBenefitsText(e.target.value)} placeholder={"Meal allowance upon regularization\nHMO upon regularization\nRetirement Benefit"} rows={5} />
          </div>

          <ModalActions>
            <button className="cms-btn cms-btn--ghost" onClick={close}>Cancel</button>
            <button className="cms-btn cms-btn--primary" onClick={save}>Save</button>
          </ModalActions>
        </Modal>
      )}
      <ConfirmDelete
        target={confirmTarget}
        onConfirm={(id) => { dispatch({ type:'CAREER_DEL', payload:id }); toast('Position deleted'); }}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
