import React, { useState } from 'react';
import { useCMS, uid, compressImage } from '../context/CMSContext';
import { useToast } from '../components/Toast';
import Modal, { ModalActions } from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';

function getYouTubeId(input) {
  const m = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : input.trim();
}

function formatDate(d) {
  if (!d) return '';
  try { return new Date(d + 'T00:00:00').toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'}); }
  catch { return d; }
}

// ─── Folder List (root view) ──────────────────────────────────────────────────
function FolderList({ folders, posts, images, onOpenFolder, onAddFolder, onEditFolder, onDeleteFolder }) {
  const toast = useToast();
  const [modal, setModal] = useState(null); // null | 'add' | folder.id
  const [form,  setForm]  = useState({ name:'', date:'' });
  const [confirmTarget, setConfirmTarget] = useState(null);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const save = () => {
    if (!form.name.trim()) { toast('Folder name required','error'); return; }
    if (modal === 'add') { onAddFolder({ id:uid(), ...form, name:form.name.trim() }); toast('Folder created!'); }
    else                 { onEditFolder({ ...form, name:form.name.trim() }); toast('Updated!'); }
    setModal(null);
  };

  return (
    <div>
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-title">Activities</h1>
          <p className="cms-page-sub">Click a folder to manage its videos and images</p>
        </div>
        <button className="cms-btn cms-btn--primary"
          onClick={() => { setForm({ name:'', date: new Date().toISOString().split('T')[0] }); setModal('add'); }}>
          + New Folder
        </button>
      </div>

      {folders.length === 0 ? (
        <div className="cms-card">
          <div className="cms-empty">
            <div className="cms-empty-icon">📁</div>
            <p>No folders yet. Create a folder to start organising activities.</p>
          </div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12 }}>
          {folders.map(folder => {
            const vCount = posts.filter(p=>p.folderId===folder.id).length;
            const iCount = images.filter(i=>i.folderId===folder.id).length;
            return (
              <div key={folder.id} style={{
                background:'#fff', border:'1px solid #e5e7eb', borderRadius:14,
                overflow:'hidden', cursor:'pointer', transition:'all .15s',
              }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='#c0392b40'; e.currentTarget.style.boxShadow='0 4px 16px rgba(192,57,43,0.1)'; e.currentTarget.style.transform='translateY(-1px)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}
              >
                {/* Folder thumbnail */}
                <div
                  onClick={() => onOpenFolder(folder)}
                  style={{ height:110, background:'linear-gradient(135deg,#1a0000,#5c0a00)',
                    display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                  <span style={{ fontSize:44, filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}>📁</span>
                  <div style={{ position:'absolute', bottom:8, right:8, display:'flex', gap:5 }}>
                    {vCount > 0 && <span style={{ background:'rgba(0,0,0,0.55)', borderRadius:10, padding:'2px 8px', fontSize:10.5, color:'#fff' }}>▶ {vCount}</span>}
                    {iCount > 0 && <span style={{ background:'rgba(0,0,0,0.55)', borderRadius:10, padding:'2px 8px', fontSize:10.5, color:'#fff' }}>🖼 {iCount}</span>}
                  </div>
                </div>

                {/* Folder info */}
                <div style={{ padding:'12px 14px' }}>
                  <div onClick={() => onOpenFolder(folder)} style={{ fontWeight:700, fontSize:14, color:'#111827', marginBottom:2 }}>{folder.name}</div>
                  {folder.date && <div style={{ fontSize:11.5, color:'#9ca3af', marginBottom:10 }}>{formatDate(folder.date)}</div>}
                  <div style={{ display:'flex', gap:5 }}>
                    <button className="cms-btn cms-btn--primary cms-btn--sm" style={{ flex:1 }} onClick={() => onOpenFolder(folder)}>Open</button>
                    <button className="cms-btn cms-btn--edit cms-btn--sm" onClick={e=>{ e.stopPropagation(); setForm(folder); setModal(folder.id); }}>✎</button>
                    <button className="cms-btn cms-btn--danger cms-btn--sm" onClick={e=>{ e.stopPropagation(); setConfirmTarget({id:folder.id,label:folder.name}); }}>✕</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <Modal title={modal==='add'?'New Folder':'Edit Folder'} onClose={()=>setModal(null)}>
          <div className="cms-form-group"><label>Folder Name *</label>
            <input value={form.name||''} onChange={e=>set('name',e.target.value)} placeholder="e.g. Annual Family Day 2024" autoFocus />
          </div>
          <div className="cms-form-group"><label>Date</label>
            <input type="date" value={form.date||''} onChange={e=>set('date',e.target.value)} />
          </div>
          <ModalActions>
            <button className="cms-btn cms-btn--ghost" onClick={()=>setModal(null)}>Cancel</button>
            <button className="cms-btn cms-btn--primary" onClick={save}>Save</button>
          </ModalActions>
        </Modal>
      )}

      <ConfirmDelete
        target={confirmTarget}
        onConfirm={(id) => { onDeleteFolder(id); toast('Folder deleted'); }}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}

// ─── Folder Contents (inside a folder) ───────────────────────────────────────
function FolderContents({ folder, posts, images, dispatch, onBack }) {
  const toast   = useToast();
  const [tab, setTab] = useState('videos'); // 'videos' | 'images'

  // ── Videos ──
  const [vModal,        setVModal]        = useState(null);
  const [vForm,         setVForm]         = useState({});
  const [confirmV,      setConfirmV]      = useState(null);
  const setV = (k,v) => setVForm(f=>({...f,[k]:v}));

  const folderVideos = posts.filter(p=>p.folderId===folder.id);
  const folderImages = images.filter(i=>i.folderId===folder.id);

  const openAddVideo  = () => { setVForm({ title:'', youtubeId:'', date:folder.date||'' }); setVModal('add'); };
  const openEditVideo = (v) => { setVForm(v); setVModal(v.id); };

  const saveVideo = () => {
    if (!vForm.title?.trim())     { toast('Title required','error'); return; }
    if (!vForm.youtubeId?.trim()) { toast('YouTube URL required','error'); return; }
    const payload = { ...vForm, youtubeId: getYouTubeId(vForm.youtubeId), folderId: folder.id };
    if (vModal==='add') { dispatch({ type:'ACT_ADD',    payload:{ id:uid(), ...payload } }); toast('Video added!'); }
    else                { dispatch({ type:'ACT_UPDATE', payload }); toast('Updated!'); }
    setVModal(null);
  };

  // ── Images ──
  const [iModal,        setIModal]        = useState(null);
  const [iForm,         setIForm]         = useState({});
  const [iPreview,      setIPreview]      = useState(null);
  const [iUploading,    setIUploading]    = useState(false);
  const [confirmI,      setConfirmI]      = useState(null);
  const setI = (k,v) => setIForm(f=>({...f,[k]:v}));

  const openAddImage  = () => { setIForm({ title:'', desc:'', date:folder.date||'' }); setIPreview(null); setIModal('add'); };
  const openEditImage = (img) => { setIForm(img); setIPreview(img.src||null); setIModal(img.id); };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const compressed = await compressImage(ev.target.result, 800, 0.78);
      setIPreview(compressed);
      setIForm(f=>({...f, src: compressed}));
      setIUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const saveImage = () => {
    if (!iForm.title?.trim()) { toast('Title required','error'); return; }
    const payload = { ...iForm, folderId: folder.id };
    if (iModal==='add') { dispatch({ type:'ACT_IMG_ADD',    payload:{ id:uid(), ...payload } }); toast('Image added!'); }
    else                { dispatch({ type:'ACT_IMG_UPDATE', payload }); toast('Updated!'); }
    setIModal(null);
  };

  return (
    <div>
      {/* Breadcrumb header */}
      <div className="cms-page-header">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={onBack}
            style={{ background:'#f3f4f6', border:'1px solid #e5e7eb', borderRadius:8, padding:'7px 13px',
              fontSize:13, fontWeight:600, cursor:'pointer', color:'#374151', display:'flex', alignItems:'center', gap:6 }}>
            ← Back
          </button>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:12, color:'#9ca3af' }}>Activities</span>
              <span style={{ color:'#d1d5db' }}>/</span>
              <h1 className="cms-page-title" style={{ margin:0 }}>📁 {folder.name}</h1>
            </div>
            {folder.date && <p className="cms-page-sub" style={{ margin:0 }}>{formatDate(folder.date)}</p>}
          </div>
        </div>

        {/* Add buttons */}
        <div style={{ display:'flex', gap:8 }}>
          {tab==='videos' && <button className="cms-btn cms-btn--primary" onClick={openAddVideo}>+ Add Video</button>}
          {tab==='images' && <button className="cms-btn cms-btn--primary" onClick={openAddImage}>+ Add Image</button>}
        </div>
      </div>

      {/* Tabs */}
      <div className="cms-tab-bar" style={{ marginBottom:16 }}>
        <button className={`cms-tab${tab==='videos'?' active':''}`} onClick={()=>setTab('videos')}>
          ▶ Videos <span style={{ marginLeft:5, fontSize:11, color:tab==='videos'?'#c0392b':'#9ca3af' }}>({folderVideos.length})</span>
        </button>
        <button className={`cms-tab${tab==='images'?' active':''}`} onClick={()=>setTab('images')}>
          🖼 Images <span style={{ marginLeft:5, fontSize:11, color:tab==='images'?'#c0392b':'#9ca3af' }}>({folderImages.length})</span>
        </button>
      </div>

      {/* ── Videos tab ── */}
      {tab==='videos' && (
        <div className="cms-card">
          {folderVideos.length===0 ? (
            <div className="cms-empty"><div className="cms-empty-icon">▶</div><p>No videos in this folder yet.</p></div>
          ) : (
            <div className="cms-grid-3">
              {folderVideos.map(v => (
                <div key={v.id} className="cms-item-card">
                  <div style={{ position:'relative' }}>
                    <img src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                      alt={v.title} className="cms-item-card-img" style={{ objectFit:'cover' }} />
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.25)' }}>
                      <span style={{ fontSize:28, color:'#fff' }}>▶</span>
                    </div>
                  </div>
                  <div className="cms-item-card-body">
                    {v.date && <span className="cms-badge cms-badge--gray" style={{ fontSize:10, marginBottom:5 }}>{v.date}</span>}
                    <div className="cms-item-card-title">{v.title}</div>
                    <div className="cms-item-card-meta"><code style={{ background:'#f3f4f6', padding:'1px 5px', borderRadius:4, fontSize:11 }}>{v.youtubeId}</code></div>
                    <div className="cms-item-card-actions">
                      <button className="cms-btn cms-btn--edit cms-btn--sm" onClick={()=>openEditVideo(v)}>Edit</button>
                      <button className="cms-btn cms-btn--danger cms-btn--sm" onClick={()=>setConfirmV({id:v.id,label:v.title})}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Images tab ── */}
      {tab==='images' && (
        <div className="cms-card">
          {folderImages.length===0 ? (
            <div className="cms-empty"><div className="cms-empty-icon">🖼</div><p>No images in this folder yet.</p></div>
          ) : (
            <div className="cms-grid-3">
              {folderImages.map(img => (
                <div key={img.id} className="cms-item-card">
                  <div style={{ height:140, overflow:'hidden', background:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {img.src
                      ? <img src={img.src} alt={img.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <span style={{ fontSize:36, color:'#d1d5db' }}>🖼</span>}
                  </div>
                  <div className="cms-item-card-body">
                    {img.date && <span className="cms-badge cms-badge--gray" style={{ fontSize:10, marginBottom:5 }}>{img.date}</span>}
                    <div className="cms-item-card-title">{img.title}</div>
                    {img.desc && <div style={{ fontSize:12, color:'#6b7280', marginTop:3, lineHeight:1.4 }}>{img.desc.substring(0,70)}{img.desc.length>70?'…':''}</div>}
                    <div className="cms-item-card-actions">
                      <button className="cms-btn cms-btn--edit cms-btn--sm" onClick={()=>openEditImage(img)}>Edit</button>
                      <button className="cms-btn cms-btn--danger cms-btn--sm" onClick={()=>setConfirmI({id:img.id,label:img.title})}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Video modal */}
      {vModal && (
        <Modal title={vModal==='add'?'Add Video':'Edit Video'} onClose={()=>setVModal(null)}>
          <div className="cms-form-group"><label>Title *</label>
            <input value={vForm.title||''} onChange={e=>setV('title',e.target.value)} placeholder="e.g. Annual Family Day Highlights" autoFocus />
          </div>
          <div className="cms-form-group"><label>Date</label>
            <input type="date" value={vForm.date||''} onChange={e=>setV('date',e.target.value)} />
          </div>
          <div className="cms-form-group">
            <label>YouTube URL or Video ID *</label>
            <input value={vForm.youtubeId||''} onChange={e=>setV('youtubeId',e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
            <p style={{ fontSize:11.5, color:'#9ca3af', marginTop:4 }}>Paste the full YouTube link or the 11-character ID.</p>
          </div>
          {vForm.youtubeId && (
            <img src={`https://img.youtube.com/vi/${getYouTubeId(vForm.youtubeId)}/hqdefault.jpg`}
              alt="preview" style={{ width:'100%', borderRadius:8, border:'1px solid #e5e7eb', marginBottom:14 }}
              onError={e=>e.target.style.display='none'} />
          )}
          <ModalActions>
            <button className="cms-btn cms-btn--ghost" onClick={()=>setVModal(null)}>Cancel</button>
            <button className="cms-btn cms-btn--primary" onClick={saveVideo}>Save</button>
          </ModalActions>
        </Modal>
      )}

      {/* Image modal */}
      {iModal && (
        <Modal title={iModal==='add'?'Add Image':'Edit Image'} onClose={()=>setIModal(null)}>
          <div className="cms-form-group"><label>Title *</label>
            <input value={iForm.title||''} onChange={e=>setI('title',e.target.value)} placeholder="e.g. Team photo at event" autoFocus />
          </div>
          <div className="cms-form-group"><label>Date</label>
            <input type="date" value={iForm.date||''} onChange={e=>setI('date',e.target.value)} />
          </div>
          <div className="cms-form-group"><label>Description</label>
            <textarea value={iForm.desc||''} onChange={e=>setI('desc',e.target.value)} placeholder="Describe this image..."
              style={{ width:'100%', padding:'8px 11px', border:'1px solid #e5e7eb', borderRadius:7, fontSize:13.5, fontFamily:'inherit', resize:'vertical', minHeight:72 }} />
          </div>
          <div className="cms-form-group">
            <label>Image</label>
            {iPreview && <img src={iPreview} alt="preview" style={{ width:'100%', borderRadius:8, border:'1px solid #e5e7eb', marginBottom:8, maxHeight:200, objectFit:'cover' }} />}
            <input type="file" accept="image/*" onChange={handleImageFile}
              style={{ fontSize:13, color:'#374151', padding:'6px 0' }} />
            {iUploading && <p style={{ fontSize:12, color:'#9ca3af', marginTop:4 }}>⏳ Compressing image…</p>}
          </div>
          <ModalActions>
            <button className="cms-btn cms-btn--ghost" onClick={()=>setIModal(null)}>Cancel</button>
            <button className="cms-btn cms-btn--primary" onClick={saveImage} disabled={iUploading}>Save</button>
          </ModalActions>
        </Modal>
      )}

      <ConfirmDelete target={confirmV} onConfirm={(id)=>{ dispatch({type:'ACT_DEL',payload:id}); toast('Video deleted'); }} onCancel={()=>setConfirmV(null)} />
      <ConfirmDelete target={confirmI} onConfirm={(id)=>{ dispatch({type:'ACT_IMG_DEL',payload:id}); toast('Image deleted'); }} onCancel={()=>setConfirmI(null)} />
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function ActivitiesAdmin() {
  const { state, dispatch } = useCMS();
  const [openFolder, setOpenFolder] = useState(null);

  const folders = state.activities.folders || [];
  const posts   = state.activities.posts   || [];
  const images  = state.activities.images  || [];

  // Sync open folder from state in case name changed
  const currentFolder = openFolder ? folders.find(f=>f.id===openFolder.id) || openFolder : null;

  if (currentFolder) {
    return (
      <FolderContents
        folder={currentFolder}
        posts={posts}
        images={images}
        dispatch={dispatch}
        onBack={() => setOpenFolder(null)}
      />
    );
  }

  return (
    <FolderList
      folders={folders}
      posts={posts}
      images={images}
      onOpenFolder={(f) => setOpenFolder(f)}
      onAddFolder={(f)  => dispatch({ type:'ACT_FOLDER_ADD',    payload:f })}
      onEditFolder={(f) => dispatch({ type:'ACT_FOLDER_UPDATE', payload:f })}
      onDeleteFolder={(id) => dispatch({ type:'ACT_FOLDER_DEL', payload:id })}
    />
  );
}