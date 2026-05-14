import React, { useState, useRef } from 'react';
import { useCMS, uid } from '../context/CMSContext';
import { useToast } from '../components/Toast';
import Modal, { ModalActions } from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';
import { uploadToDrive, deleteFromDrive, checkDriveAuth, openDriveAuthWindow } from '../utils/gdriveUpload';

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
  const [modal, setModal] = useState(null);
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
          <p className="cms-page-sub">Create folders to group videos and images by event or campaign</p>
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
            <p>No folders yet. Create a folder to start organising your activities.</p>
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
                overflow:'hidden', transition:'all .15s', cursor:'pointer',
              }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='#c0392b40'; e.currentTarget.style.boxShadow='0 4px 16px rgba(192,57,43,0.1)'; e.currentTarget.style.transform='translateY(-1px)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}
              >
                <div onClick={() => onOpenFolder(folder)}
                  style={{ height:110, background:'linear-gradient(135deg,#1a0000,#5c0a00)',
                    display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                  {(() => {
                    const firstImg    = images.find(i=>i.folderId===folder.id && (i.src || i.driveFileId));
                    const firstVid    = posts.find(p=>p.folderId===folder.id && p.youtubeId);
                    const firstDriveV = posts.find(p=>p.folderId===folder.id && p.driveUrl);
                    const imgSrc = firstImg?.driveFileId
                      ? `https://drive.google.com/thumbnail?id=${firstImg.driveFileId}&sz=w400`
                      : firstImg?.src;
                    if (firstImg)    return <img src={imgSrc} alt={firstImg.title} style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.6 }} onError={e=>{ if(firstImg.src && e.target.src!==firstImg.src) e.target.src=firstImg.src; }} />;
                    if (firstVid)    return <img src={`https://img.youtube.com/vi/${firstVid.youtubeId}/hqdefault.jpg`} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.6 }} />;
                    if (firstDriveV) return <div style={{ fontSize:44 }}>🎬</div>;
                    return <span style={{ fontSize:44, filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}>📁</span>;
                  })()}
                  <div style={{ position:'absolute', bottom:8, right:8, display:'flex', gap:4 }}>
                    {vCount > 0 && <span style={{ background:'rgba(0,0,0,0.7)', borderRadius:10, padding:'2px 8px', fontSize:10.5, color:'#fff' }}>▶ {vCount}</span>}
                    {iCount > 0 && <span style={{ background:'rgba(0,0,0,0.7)', borderRadius:10, padding:'2px 8px', fontSize:10.5, color:'#fff' }}>🖼 {iCount}</span>}
                  </div>
                </div>

                <div style={{ padding:'12px 14px' }}>
                  <div onClick={() => onOpenFolder(folder)} style={{ fontWeight:700, fontSize:14, color:'#111827', marginBottom:2 }}>{folder.name}</div>
                  {folder.date && <div style={{ fontSize:11.5, color:'#9ca3af', marginBottom:10 }}>{formatDate(folder.date)}</div>}
                  {!folder.date && <div style={{ marginBottom:10 }}/>}
                  <div style={{ display:'flex', gap:5 }}>
                    <button className="cms-btn cms-btn--primary cms-btn--sm" style={{ flex:1 }}
                      onClick={() => onOpenFolder(folder)}>Open</button>
                    <button className="cms-btn cms-btn--edit cms-btn--sm"
                      onClick={e=>{ e.stopPropagation(); setForm(folder); setModal(folder.id); }}>✎</button>
                    <button className="cms-btn cms-btn--danger cms-btn--sm"
                      onClick={e=>{ e.stopPropagation(); setConfirmTarget({id:folder.id,label:folder.name}); }}>✕</button>
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

// ─── Drive Auth Banner ────────────────────────────────────────────────────────
// ✅ FIXED: uses direct promise instead of polling interval.
//    openDriveAuthWindow() now resolves when the user finishes signing in.
function DriveAuthBanner({ onConnected }) {
  const [connecting, setConnecting] = useState(false);
  return (
    <div style={{
      background:'#f0f4ff', border:'2px dashed #4285f4', borderRadius:12,
      padding:'20px 24px', marginBottom:16, display:'flex', alignItems:'center', gap:16,
    }}>
      <span style={{ fontSize:32 }}>🔗</span>
      <div style={{ flex:1 }}>
        <p style={{ margin:0, fontWeight:700, color:'#1a56db', fontSize:14 }}>
          Sign in with Google to upload files
        </p>
        <p style={{ margin:'4px 0 0', fontSize:12, color:'#6b7280' }}>
          Any Google account — files go to the shared company Drive folder
        </p>
      </div>
      <button
        disabled={connecting}
        onClick={async () => {
          setConnecting(true);
          try {
            await openDriveAuthWindow(); // resolves when sign-in is complete
            onConnected();
          } catch {
            setConnecting(false);
            alert('Sign-in was cancelled or failed. Please try again.');
          }
        }}
        style={{
          display:'flex', alignItems:'center', gap:8,
          background:'#fff', color:'#3c4043', border:'1px solid #dadce0',
          borderRadius:8, padding:'9px 18px', fontWeight:700,
          cursor: connecting ? 'not-allowed' : 'pointer',
          fontSize:13, whiteSpace:'nowrap',
          boxShadow:'0 1px 3px rgba(0,0,0,0.1)',
          opacity: connecting ? 0.7 : 1,
        }}>
        {connecting ? (
          'Signing in…'
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.3 33.7 29.7 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.9 20-21 0-1.3-.2-2.7-.5-4z"/>
            </svg>
            Sign in with Google
          </>
        )}
      </button>
    </div>
  );
}

// ─── Folder Contents ──────────────────────────────────────────────────────────
function FolderContents({ folder, posts, images, dispatch, onBack }) {
  const toast = useToast();

  const [uploadModal,  setUploadModal]  = useState(false);
  const [uploadType,   setUploadType]   = useState('image');
  const [uForm,        setUForm]        = useState({ title:'', date: folder.date||'', desc:'' });
  const [uFiles,       setUFiles]       = useState([]);
  const [uUploading,   setUUploading]   = useState(false);
  const [uProgress,    setUProgress]    = useState(0);
  const [ytId,         setYtId]         = useState('');
  const [driveAuthed,  setDriveAuthed]  = useState(null);
  const fileInputRef = useRef(null);
  const setU = (k,v) => setUForm(f=>({...f,[k]:v}));

  const [editTarget,    setEditTarget]    = useState(null);
  const [editForm,      setEditForm]      = useState({});
  const [confirmTarget, setConfirmTarget] = useState(null);
  const setE = (k,v) => setEditForm(f=>({...f,[k]:v}));

  const openUploadModal = async () => {
    setUploadModal(true);
    const ok = await checkDriveAuth();
    setDriveAuthed(ok);
  };

  const openEdit = (item) => { setEditTarget(item); setEditForm({...item}); };

  const resetUpload = () => {
    setUploadModal(false);
    setUFiles([]);
    setYtId('');
    setUForm({ title:'', date: folder.date||'', desc:'' });
    setUUploading(false);
    setUProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const stageImageFiles = (files) => {
    const staged = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      staged.push({ name: file.name.replace(/\.[^/.]+$/, ''), file, previewUrl: URL.createObjectURL(file), mime:'image' });
    }
    setUFiles(prev => [...prev, ...staged]);
  };

  const stageVideoFile = (file) => {
    if (!file) return;
    setUFiles([{ name: file.name.replace(/\.[^/.]+$/, ''), file, previewUrl: URL.createObjectURL(file), mime:'video' }]);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    if (uploadType === 'image')            stageImageFiles(files);
    else if (uploadType === 'video_local') stageVideoFile(files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (uploadType === 'image')            stageImageFiles(files);
    else if (uploadType === 'video_local') stageVideoFile(files[0]);
  };

  const saveUpload = async () => {
    // YouTube — no Drive needed
    if (uploadType === 'video_yt') {
      if (!uForm.title?.trim()) { toast('Title required','error'); return; }
      if (!ytId.trim())         { toast('YouTube URL required','error'); return; }
      dispatch({ type:'ACT_ADD', payload:{ id:uid(), title:uForm.title.trim(), date:uForm.date, desc:uForm.desc, youtubeId:getYouTubeId(ytId), folderId:folder.id }});
      toast('YouTube video added!');
      resetUpload(); return;
    }

    if (!uFiles.length) { toast('No files selected yet','error'); return; }

    // Check auth before uploading
    const authed = await checkDriveAuth();
    if (!authed) { setDriveAuthed(false); return; }

    setUUploading(true);
    setUProgress(0);

    try {
      const driveFolder = uploadType === 'image' ? 'activities/images' : 'activities/videos';
      const total = uFiles.length;

      if (uploadType === 'image') {
        for (let i = 0; i < total; i++) {
          const f = uFiles[i];
          const result = await uploadToDrive(f.file, driveFolder, (pct) => {
            setUProgress(Math.round(((i + pct / 100) / total) * 100));
          });
          dispatch({ type:'ACT_IMG_ADD', payload:{
            id: uid(),
            title: total === 1 ? (uForm.title.trim() || f.name) : (uForm.title ? `${uForm.title} ${i+1}` : f.name),
            date: uForm.date, desc: uForm.desc,
            src: result.url,
            driveFileId: result.fileId,
            folderId: folder.id,
          }});
        }
        toast(`${total} image${total>1?'s':''} uploaded to Drive!`);

      } else if (uploadType === 'video_local') {
        if (!uForm.title?.trim()) { toast('Title required','error'); setUUploading(false); return; }
        const f = uFiles[0];
        const result = await uploadToDrive(f.file, driveFolder, (pct) => setUProgress(pct));
        dispatch({ type:'ACT_ADD', payload:{
          id: uid(), title: uForm.title.trim(), date: uForm.date, desc: uForm.desc,
          driveUrl: result.url,
          driveFileId: result.fileId,
          driveEmbed: `https://drive.google.com/file/d/${result.fileId}/preview`,
          folderId: folder.id,
        }});
        toast('Video uploaded to Drive!');
      }

      resetUpload();
    } catch (err) {
      toast(`Upload failed: ${err.message}`, 'error');
    } finally {
      setUUploading(false);
      setUProgress(0);
    }
  };

  const saveEdit = () => {
    if (!editForm.title?.trim()) { toast('Title required','error'); return; }
    if (editTarget._collection === 'image') dispatch({ type:'ACT_IMG_UPDATE', payload: editForm });
    else                                     dispatch({ type:'ACT_UPDATE',     payload: editForm });
    toast('Updated!');
    setEditTarget(null);
  };

  const handleDelete = async (item) => {
    if (item.driveFileId) {
      deleteFromDrive(item.driveFileId).catch(() => {});
    }
    if (item._collection === 'image') dispatch({ type:'ACT_IMG_DEL', payload:item.id });
    else                               dispatch({ type:'ACT_DEL',     payload:item.id });
    toast('Deleted');
  };

  const allFolderItems = [
    ...posts.filter(p=>p.folderId===folder.id).map(p=>({...p, _collection:'post'})),
    ...images.filter(i=>i.folderId===folder.id).map(i=>({...i, _collection:'image'})),
  ].sort((a,b)=>(b.date||'').localeCompare(a.date||''));

  return (
    <div>
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
        <button className="cms-btn cms-btn--primary" onClick={openUploadModal}>
          + Add Content
        </button>
      </div>

      <div className="cms-card">
        {allFolderItems.length === 0 ? (
          <div className="cms-empty">
            <div className="cms-empty-icon">📂</div>
            <p>This folder is empty. Click <strong>+ Add Content</strong> to add photos or videos.</p>
          </div>
        ) : (
          <div className="cms-grid-3">
            {allFolderItems.map(item => (
              <div key={item.id} className="cms-item-card">
                <div style={{ position:'relative', height:148, background:'#111', overflow:'hidden' }}>
                  {item._collection === 'image' && (item.src || item.driveFileId) && (
                    <img
                      src={item.driveFileId
                        ? `https://drive.google.com/thumbnail?id=${item.driveFileId}&sz=w400`
                        : item.src}
                      alt={item.title}
                      style={{ width:'100%', height:'100%', objectFit:'cover' }}
                      onError={e => { if (item.src && e.target.src !== item.src) e.target.src = item.src; }}
                    />
                  )}
                  {item._collection === 'post' && item.youtubeId && (
                    <>
                      <img src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                        alt={item.title} style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.85 }} />
                      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center',
                        justifyContent:'center', background:'rgba(0,0,0,0.25)' }}>
                        <span style={{ fontSize:32, color:'#fff' }}>▶</span>
                      </div>
                    </>
                  )}
                  {item._collection === 'post' && item.driveUrl && (
                    <>
                      <iframe src={item.driveEmbed} title={item.title}
                        style={{ width:'100%', height:'100%', border:'none', pointerEvents:'none' }} />
                      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center',
                        justifyContent:'center', background:'rgba(0,0,0,0.3)' }}>
                        <span style={{ fontSize:32, color:'#fff' }}>🎬</span>
                      </div>
                    </>
                  )}
                  {item._collection === 'post' && item.videoSrc && !item.driveUrl && (
                    <>
                      <video src={item.videoSrc} style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.85 }} muted />
                      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center',
                        justifyContent:'center', background:'rgba(0,0,0,0.3)' }}>
                        <span style={{ fontSize:32, color:'#fff' }}>🎬</span>
                      </div>
                    </>
                  )}
                  <div style={{ position:'absolute', top:7, left:7 }}>
                    {item._collection==='image' && <span style={{ background:'#3498db', color:'#fff', fontSize:10, fontWeight:700, borderRadius:5, padding:'2px 7px' }}>🖼 Photo</span>}
                    {item._collection==='post' && item.youtubeId && <span style={{ background:'#c0392b', color:'#fff', fontSize:10, fontWeight:700, borderRadius:5, padding:'2px 7px' }}>▶ YouTube</span>}
                    {item._collection==='post' && (item.driveUrl||item.videoSrc) && <span style={{ background:'#8e44ad', color:'#fff', fontSize:10, fontWeight:700, borderRadius:5, padding:'2px 7px' }}>🎬 Video</span>}
                    {item.driveFileId && <span style={{ background:'#4285f4', color:'#fff', fontSize:10, fontWeight:700, borderRadius:5, padding:'2px 7px', marginLeft:4 }}>☁ Drive</span>}
                  </div>
                </div>
                <div className="cms-item-card-body">
                  {item.date && <span className="cms-badge cms-badge--gray" style={{ fontSize:10, marginBottom:5 }}>{item.date}</span>}
                  <div className="cms-item-card-title">{item.title}</div>
                  {item.desc && <div style={{ fontSize:12, color:'#6b7280', marginTop:3, lineHeight:1.4 }}>{item.desc.substring(0,60)}{item.desc.length>60?'…':''}</div>}
                  <div className="cms-item-card-actions">
                    <button className="cms-btn cms-btn--edit cms-btn--sm" onClick={()=>openEdit(item)}>Edit</button>
                    <button className="cms-btn cms-btn--danger cms-btn--sm" onClick={()=>setConfirmTarget({id:item.id,label:item.title,_item:item})}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Upload Modal ── */}
      {uploadModal && (
        <Modal title="Add Content to Folder" onClose={resetUpload}>

          {/* Drive auth banner — shown when not signed in */}
          {driveAuthed === false && (
            <DriveAuthBanner onConnected={() => setDriveAuthed(true)} />
          )}

          {/* Type selector */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:18 }}>
            {[
              { val:'image',       label:'📷 Photos',       sub:'JPG, PNG, WebP → Drive' },
              { val:'video_local', label:'🎬 Video File',   sub:'MP4, WebM, MOV → Drive' },
              { val:'video_yt',    label:'▶ YouTube Link', sub:'Paste URL / ID' },
            ].map(opt => (
              <div key={opt.val} onClick={()=>{ setUploadType(opt.val); setUFiles([]); setYtId(''); }}
                style={{
                  border:`2px solid ${uploadType===opt.val ? '#c0392b' : '#e5e7eb'}`,
                  borderRadius:10, padding:'12px 10px', cursor:'pointer', textAlign:'center',
                  background: uploadType===opt.val ? '#fff5f5' : '#f9fafb',
                  transition:'all .12s',
                }}>
                <div style={{ fontSize:22, marginBottom:4 }}>{opt.label.split(' ')[0]}</div>
                <div style={{ fontSize:12, fontWeight:700, color: uploadType===opt.val ? '#c0392b':'#374151' }}>
                  {opt.label.split(' ').slice(1).join(' ')}
                </div>
                <div style={{ fontSize:10.5, color:'#9ca3af', marginTop:2 }}>{opt.sub}</div>
              </div>
            ))}
          </div>

          {/* Upload progress */}
          {uUploading && (
            <div style={{ background:'#f0f4ff', borderRadius:10, padding:'16px 18px', marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:13, fontWeight:600, color:'#1a56db' }}>☁️ Uploading to Google Drive…</span>
                <span style={{ fontSize:13, color:'#1a56db' }}>{uProgress}%</span>
              </div>
              <div style={{ height:8, background:'#dbeafe', borderRadius:4, overflow:'hidden' }}>
                <div style={{ width:`${uProgress}%`, height:'100%', background:'#4285f4',
                  transition:'width 0.3s ease', borderRadius:4 }} />
              </div>
            </div>
          )}

          {/* Photo / Video drop zone */}
          {!uUploading && (uploadType === 'image' || uploadType === 'video_local') && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e=>{ e.preventDefault(); e.currentTarget.style.borderColor='#c0392b'; }}
              onDragLeave={e=>{ e.currentTarget.style.borderColor='#e5e7eb'; }}
              onDrop={e=>{ e.preventDefault(); handleDrop(e); e.currentTarget.style.borderColor='#e5e7eb'; }}
              style={{
                border:'2px dashed #e5e7eb', borderRadius:12, padding:'28px 16px',
                textAlign:'center', cursor:'pointer', marginBottom:16, transition:'border-color .15s',
                background: uFiles.length ? '#f0fdf4' : '#f9fafb',
                borderColor: uFiles.length ? '#86efac' : '#e5e7eb',
              }}
            >
              <input ref={fileInputRef} type="file"
                accept={uploadType==='image' ? 'image/*' : 'video/mp4,video/webm,video/quicktime,video/*'}
                multiple={uploadType === 'image'}
                onChange={handleFileInput}
                style={{ display:'none' }} />

              {uFiles.length > 0 ? (
                <>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center', marginBottom:10 }}>
                    {uFiles.map((f,i) => (
                      f.mime === 'image'
                        ? <img key={i} src={f.previewUrl} alt={f.name} style={{ width:70, height:70, objectFit:'cover', borderRadius:8, border:'1px solid #e5e7eb' }} />
                        : <div key={i} style={{ width:70, height:70, background:'#111', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>🎬</div>
                    ))}
                  </div>
                  <p style={{ fontSize:13, color:'#16a34a', fontWeight:600, marginBottom:4 }}>
                    ✓ {uFiles.length === 1 ? uFiles[0].name : `${uFiles.length} files ready`} — click to change
                  </p>
                  <p style={{ fontSize:11.5, color:'#9ca3af', margin:0 }}>Will upload to Google Drive on Save</p>
                </>
              ) : (
                <>
                  <div style={{ fontSize:36, marginBottom:8 }}>{uploadType==='image' ? '📷' : '🎬'}</div>
                  <p style={{ fontSize:13.5, color:'#374151', fontWeight:600, marginBottom:4 }}>
                    {uploadType==='image' ? 'Click to select photos, or drag & drop' : 'Click to select a video file, or drag & drop'}
                  </p>
                  <p style={{ fontSize:12, color:'#9ca3af', marginBottom:4 }}>
                    {uploadType==='image' ? 'JPG, PNG, WebP — select multiple at once' : 'MP4, WebM, MOV — any size (stored in Drive)'}
                  </p>
                  <p style={{ fontSize:11, color:'#4285f4', margin:0 }}>☁️ Files go to the shared company Google Drive</p>
                </>
              )}
            </div>
          )}

          {/* YouTube input */}
          {uploadType === 'video_yt' && (
            <>
              <div className="cms-form-group">
                <label>YouTube URL or Video ID *</label>
                <input value={ytId} onChange={e=>setYtId(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..." autoFocus />
                <p style={{ fontSize:11.5, color:'#9ca3af', marginTop:4 }}>
                  Paste the full YouTube link or just the 11-character video ID.
                </p>
              </div>
              {ytId && (
                <img src={`https://img.youtube.com/vi/${getYouTubeId(ytId)}/hqdefault.jpg`}
                  alt="preview" style={{ width:'100%', borderRadius:8, border:'1px solid #e5e7eb', marginBottom:14 }}
                  onError={e=>e.target.style.display='none'} />
              )}
            </>
          )}

          {/* Common fields */}
          <div className="cms-form-group">
            <label>
              Title {uploadType==='image' && uFiles.length > 1 ? <span style={{ fontWeight:400, color:'#9ca3af' }}>(optional)</span> : '*'}
            </label>
            <input value={uForm.title} onChange={e=>setU('title',e.target.value)}
              placeholder={uploadType==='image' && uFiles.length > 1 ? 'Optional title prefix…' : 'e.g. Team photo at event'} />
          </div>
          <div className="cms-form-row">
            <div className="cms-form-group">
              <label>Date</label>
              <input type="date" value={uForm.date} onChange={e=>setU('date',e.target.value)} />
            </div>
          </div>
          <div className="cms-form-group">
            <label>Description <span style={{ fontWeight:400, color:'#9ca3af' }}>(optional)</span></label>
            <textarea value={uForm.desc} onChange={e=>setU('desc',e.target.value)}
              placeholder="Describe this event or photo…"
              style={{ width:'100%', padding:'8px 11px', border:'1px solid #e5e7eb', borderRadius:7,
                fontSize:13.5, fontFamily:'inherit', resize:'vertical', minHeight:60 }} />
          </div>

          <ModalActions>
            <button className="cms-btn cms-btn--ghost" onClick={resetUpload}>Cancel</button>
            <button className="cms-btn cms-btn--primary" onClick={saveUpload} disabled={uUploading}>
              {uUploading ? `Uploading… ${uProgress}%` :
                uploadType==='image' && uFiles.length > 1 ? `Upload ${uFiles.length} Photos to Drive` : 'Upload to Drive'}
            </button>
          </ModalActions>
        </Modal>
      )}

      {/* ── Edit Modal ── */}
      {editTarget && (
        <Modal title={`Edit: ${editTarget.title}`} onClose={()=>setEditTarget(null)}>
          <div className="cms-form-group"><label>Title *</label>
            <input value={editForm.title||''} onChange={e=>setE('title',e.target.value)} autoFocus />
          </div>
          <div className="cms-form-group"><label>Date</label>
            <input type="date" value={editForm.date||''} onChange={e=>setE('date',e.target.value)} />
          </div>
          <div className="cms-form-group"><label>Description</label>
            <textarea value={editForm.desc||''} onChange={e=>setE('desc',e.target.value)}
              style={{ width:'100%', padding:'8px 11px', border:'1px solid #e5e7eb', borderRadius:7,
                fontSize:13.5, fontFamily:'inherit', resize:'vertical', minHeight:60 }} />
          </div>
          {editTarget._collection==='post' && editTarget.youtubeId && (
            <div className="cms-form-group"><label>YouTube URL or ID</label>
              <input value={editForm.youtubeId||''} onChange={e=>setE('youtubeId',e.target.value)} />
            </div>
          )}
          {editTarget._collection==='image' && (
            <div className="cms-form-group">
              <label>Current Photo</label>
              {(editForm.src || editForm.driveFileId) && (
                <img
                  src={editForm.driveFileId
                    ? `https://drive.google.com/thumbnail?id=${editForm.driveFileId}&sz=w600`
                    : editForm.src}
                  alt=""
                  style={{ width:'100%', borderRadius:8, marginBottom:8, maxHeight:150, objectFit:'cover', border:'1px solid #e5e7eb' }}
                  onError={e => { if (editForm.src && e.target.src !== editForm.src) e.target.src = editForm.src; }}
                />
              )}
              {editForm.driveFileId && <p style={{ fontSize:11.5, color:'#4285f4', margin:'0 0 8px' }}>☁️ Stored in Google Drive</p>}
              <p style={{ fontSize:12, color:'#9ca3af', margin:0 }}>To replace this photo, delete it and re-upload.</p>
            </div>
          )}
          <ModalActions>
            <button className="cms-btn cms-btn--ghost" onClick={()=>setEditTarget(null)}>Cancel</button>
            <button className="cms-btn cms-btn--primary" onClick={saveEdit}>Save</button>
          </ModalActions>
        </Modal>
      )}

      <ConfirmDelete
        target={confirmTarget}
        onConfirm={() => { handleDelete(confirmTarget._item); setConfirmTarget(null); }}
        onCancel={()=>setConfirmTarget(null)}
      />
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
      onOpenFolder={f => setOpenFolder(f)}
      onAddFolder={f    => dispatch({ type:'ACT_FOLDER_ADD',    payload:f })}
      onEditFolder={f   => dispatch({ type:'ACT_FOLDER_UPDATE', payload:f })}
      onDeleteFolder={id => dispatch({ type:'ACT_FOLDER_DEL',  payload:id })}
    />
  );
}