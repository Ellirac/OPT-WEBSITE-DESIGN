import React, { useState } from 'react';
import { useCMS, uid } from '../context/CMSContext';
import { useToast } from '../components/Toast';
import Modal, { ModalActions } from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';

const CATEGORIES = ['Event','CSR','Corporate Milestone','Employee Engagement','Health & Safety','Training','Partnership','Other'];

function getYouTubeId(input) {
  // Accept full URL or bare ID
  const match = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : input.trim();
}

export default function ActivitiesAdmin() {
  const { state, dispatch } = useCMS();
  const toast = useToast();
  const [modal,         setModal]         = useState(null);
  const [form,          setForm]          = useState({});
  const [confirmTarget, setConfirmTarget] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openAdd  = () => { setForm({ title:'', category:'Event', youtubeId:'' }); setModal('add'); };
  const openEdit = (a) => { setForm(a); setModal(a.id); };
  const close    = () => setModal(null);

  const save = () => {
    if (!form.title?.trim())     { toast('Title required','error'); return; }
    if (!form.youtubeId?.trim()) { toast('YouTube URL or ID required','error'); return; }
    const youtubeId = getYouTubeId(form.youtubeId);
    const payload = { ...form, youtubeId };
    if (modal === 'add') { dispatch({ type:'ACT_ADD', payload:{ id:uid(), ...payload } }); toast('Activity added!'); }
    else                 { dispatch({ type:'ACT_UPDATE', payload }); toast('Updated!'); }
    close();
  };

  const posts = state.activities.posts;

  return (
    <div>
      <div className="cms-page-header">
        <div><h1 className="cms-page-title">Activities</h1><p className="cms-page-sub">Company videos, events and CSR initiatives</p></div>
        <button className="cms-btn cms-btn--primary" onClick={openAdd}>+ Add Activity</button>
      </div>

      <div className="cms-card">
        {posts.length === 0
          ? <div className="cms-empty"><div className="cms-empty-icon">🎬</div><p>No activities yet.<br/>Click "Add Activity" to add a YouTube video.</p></div>
          : (
            <div className="cms-grid-3">
              {posts.map(a => (
                <div key={a.id} className="cms-item-card">
                  <div style={{ position:'relative' }}>
                    <img
                      src={`https://img.youtube.com/vi/${a.youtubeId}/hqdefault.jpg`}
                      alt={a.title}
                      className="cms-item-card-img"
                      style={{ objectFit:'cover' }}
                    />
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.25)', borderRadius:0 }}>
                      <span style={{ fontSize:28, color:'#fff', opacity:0.85 }}>▶</span>
                    </div>
                  </div>
                  <div className="cms-item-card-body">
                    <span className="cms-badge cms-badge--blue" style={{ marginBottom:5 }}>{a.category}</span>
                    <div className="cms-item-card-title">{a.title}</div>
                    <div className="cms-item-card-meta" style={{ fontSize:11.5, marginTop:3 }}>
                      ID: <code style={{ background:'#f3f4f6', padding:'1px 5px', borderRadius:4 }}>{a.youtubeId}</code>
                    </div>
                    <div className="cms-item-card-actions">
                      <button className="cms-btn cms-btn--edit cms-btn--sm" onClick={() => openEdit(a)}>Edit</button>
                      <button className="cms-btn cms-btn--danger cms-btn--sm" onClick={() => setConfirmTarget({ id: a.id, label: a.title })}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      {modal && (
        <Modal title={modal==='add'?'Add Activity':'Edit Activity'} onClose={close}>
          <div className="cms-form-group"><label>Title *</label><input value={form.title||''} onChange={e=>set('title',e.target.value)} /></div>
          <div className="cms-form-group">
            <label>Category</label>
            <select value={form.category||'Event'} onChange={e=>set('category',e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="cms-form-group">
            <label>YouTube URL or Video ID *</label>
            <input
              value={form.youtubeId||''}
              onChange={e=>set('youtubeId',e.target.value)}
              placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX or just the ID"
            />
            <p style={{ fontSize:11.5, color:'#9ca3af', marginTop:4 }}>
              Paste the full YouTube link or just the 11-character video ID.
            </p>
          </div>
          {/* Live thumbnail preview */}
          {form.youtubeId && (
            <div style={{ marginBottom:14 }}>
              <p style={{ fontSize:12, color:'#6b7280', marginBottom:6 }}>Thumbnail preview:</p>
              <img
                src={`https://img.youtube.com/vi/${getYouTubeId(form.youtubeId)}/hqdefault.jpg`}
                alt="preview"
                style={{ width:'100%', borderRadius:8, border:'1px solid #e5e7eb' }}
                onError={e => e.target.style.display='none'}
              />
            </div>
          )}
          <ModalActions>
            <button className="cms-btn cms-btn--ghost" onClick={close}>Cancel</button>
            <button className="cms-btn cms-btn--primary" onClick={save}>Save</button>
          </ModalActions>
        </Modal>
      )}
      <ConfirmDelete
        target={confirmTarget}
        onConfirm={(id) => { dispatch({ type:'ACT_DEL', payload:id }); toast('Activity deleted'); }}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
