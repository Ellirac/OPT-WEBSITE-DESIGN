import React, { useRef, useState, useEffect } from 'react';
import { uploadToDrive, checkDriveAuth, openDriveAuthWindow } from '../utils/gdriveUpload';

/**
 * UploadArea — uploads images to Google Drive (FREE, 15 GB).
 *
 * Props:
 *   onUpload(result)   — called with { url, fileId } when upload succeeds
 *   preview            — current image URL to show as preview
 *   label              — placeholder text
 *   height             — preview image max-height (px)
 *   circle             — round preview (for profile photos)
 *   folder             — Drive sub-folder, default 'uploads'
 */
export default function UploadArea({
  onUpload,
  preview,
  label   = 'Click to upload image',
  height  = 120,
  circle  = false,
  folder  = 'uploads',
}) {
  const inputRef = useRef(null);
  const [dragging,   setDragging]   = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    checkDriveAuth().then(setAuthStatus);
  }, []);

  const processFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const authed = await checkDriveAuth();
    if (!authed) { setAuthStatus(false); return; }
    setUploading(true);
    setProgress(0);
    try {
      const result = await uploadToDrive(file, folder, (pct) => setProgress(pct));
      onUpload(result);
    } catch (err) {
      if (err.message === 'DRIVE_AUTH_REQUIRED') setAuthStatus(false);
      else alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleChange = (e) => processFile(e.target.files[0]);
  const handleDrop   = (e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); };

  if (authStatus === false) {
    return (
      <div className="cms-upload" style={{ display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:10, padding:24, border:'2px dashed #4285f4',
        borderRadius:12, background:'#f0f4ff', minHeight:height }}>
        <span style={{ fontSize:32 }}>🔗</span>
        <p style={{ margin:0, fontWeight:600, color:'#1a56db' }}>Connect Google Drive</p>
        <p style={{ margin:0, fontSize:12, color:'#6b7280', textAlign:'center' }}>
          Your images &amp; videos will be stored in your Google Drive (15 GB free)
        </p>
        <button onClick={async () => {
          await openDriveAuthWindow();
          const poll = setInterval(async () => {
            const ok = await checkDriveAuth();
            if (ok) { setAuthStatus(true); clearInterval(poll); }
          }, 1500);
        }} style={{ background:'#4285f4', color:'#fff', border:'none', borderRadius:8,
          padding:'8px 20px', fontWeight:600, cursor:'pointer', fontSize:14 }}>
          Sign in with Google
        </button>
      </div>
    );
  }

  if (uploading) {
    return (
      <div className="cms-upload" style={{ display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', gap:10, minHeight:height }}>
        <span style={{ fontSize:24 }}>☁️</span>
        <p style={{ margin:0, fontSize:13, color:'#374151' }}>Uploading to Drive… {progress}%</p>
        <div style={{ width:'80%', height:6, background:'#e5e7eb', borderRadius:4, overflow:'hidden' }}>
          <div style={{ width:`${progress}%`, height:'100%', background:'#4285f4',
            transition:'width 0.2s ease', borderRadius:4 }} />
        </div>
      </div>
    );
  }

  return (
    <div className={`cms-upload${dragging ? ' cms-upload--drag' : ''}`}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{ cursor:'pointer' }}>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} style={{ display:'none' }} />
      {preview ? (
        <>
          <img src={preview} alt="preview" className="cms-upload-preview"
            style={{ maxHeight:height, borderRadius:circle?'50%':8,
              width:circle?height:'auto', height:circle?height:'auto',
              objectFit:'cover', display:'block', margin:'0 auto' }} />
          <div className="cms-upload-change-hint">Click to change image</div>
        </>
      ) : (
        <div className="cms-upload-placeholder">
          <span className="cms-upload-icon">⬆</span>
          <p>{label}</p>
          <span className="cms-upload-hint">Drag &amp; drop or click to browse</span>
          <span style={{ fontSize:11, color:'#9ca3af', marginTop:4 }}>☁️ Saves to Google Drive</span>
        </div>
      )}
    </div>
  );
}