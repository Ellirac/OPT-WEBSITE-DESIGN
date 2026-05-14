import React, { useRef, useState, useEffect } from 'react';
import { uploadToDrive, checkDriveAuth, openDriveAuthWindow } from '../utils/gdriveUpload';

/**
 * UploadArea — uploads images to the shared company Google Drive.
 * Shows a "Sign in with Google" button when not authenticated.
 *
 * Props:
 *   onUpload(result)   — called with { url, fileId } on success
 *   preview            — current image URL for preview
 *   label              — placeholder text
 *   height             — preview max-height (px)
 *   circle             — round preview (profile photos)
 *   folder             — Drive sub-folder, default 'uploads'
 */
export default function UploadArea({
  onUpload,
  preview,
  label  = 'Click to upload image',
  height = 120,
  circle = false,
  folder = 'uploads',
}) {
  const inputRef = useRef(null);
  const [dragging,   setDragging]   = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [authStatus, setAuthStatus] = useState(null); // null=checking, true, false

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
      if (err.message === 'DRIVE_AUTH_REQUIRED') {
        setAuthStatus(false);
      } else {
        alert(`Upload failed: ${err.message}`);
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleChange = (e) => processFile(e.target.files[0]);
  const handleDrop   = (e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); };

  // ── Not signed in ─────────────────────────────────────────────────────────
  if (authStatus === false) {
    return (
      <div style={{
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        gap:10, padding:24, border:'2px dashed #4285f4', borderRadius:12,
        background:'#f0f4ff', minHeight:height,
      }}>
        <span style={{ fontSize:32 }}>🔗</span>
        <p style={{ margin:0, fontWeight:600, color:'#1a56db', fontSize:14 }}>
          Sign in to upload to Google Drive
        </p>
        <p style={{ margin:0, fontSize:12, color:'#6b7280', textAlign:'center' }}>
          Any Google account — files go to the shared company folder
        </p>
        <button
          onClick={async () => {
            try {
              await openDriveAuthWindow();
              setAuthStatus(true);
            } catch {
              alert('Sign-in was cancelled or failed. Please try again.');
            }
          }}
          style={{
            display:'flex', alignItems:'center', gap:10,
            background:'#fff', color:'#3c4043', border:'1px solid #dadce0',
            borderRadius:8, padding:'9px 20px', fontWeight:600,
            cursor:'pointer', fontSize:14, boxShadow:'0 1px 3px rgba(0,0,0,0.1)',
          }}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.3 33.7 29.7 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.9 20-21 0-1.3-.2-2.7-.5-4z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    );
  }

  // ── Uploading ─────────────────────────────────────────────────────────────
  if (uploading) {
    return (
      <div style={{
        display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:10, minHeight:height,
      }}>
        <span style={{ fontSize:24 }}>☁️</span>
        <p style={{ margin:0, fontSize:13, color:'#374151' }}>Uploading… {progress}%</p>
        <div style={{ width:'80%', height:6, background:'#e5e7eb', borderRadius:4, overflow:'hidden' }}>
          <div style={{
            width:`${progress}%`, height:'100%', background:'#4285f4',
            transition:'width 0.2s ease', borderRadius:4,
          }} />
        </div>
      </div>
    );
  }

  // ── Upload area ───────────────────────────────────────────────────────────
  return (
    <div
      className={`cms-upload${dragging ? ' cms-upload--drag' : ''}`}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{ cursor:'pointer' }}>
      <input
        ref={inputRef} type="file" accept="image/*"
        onChange={handleChange} style={{ display:'none' }} />
      {preview ? (
        <>
          <img src={preview} alt="preview" className="cms-upload-preview"
            style={{
              maxHeight:height, borderRadius:circle?'50%':8,
              width:circle?height:'auto', height:circle?height:'auto',
              objectFit:'cover', display:'block', margin:'0 auto',
            }} />
          <div className="cms-upload-change-hint">Click to change image</div>
        </>
      ) : (
        <div className="cms-upload-placeholder">
          <span className="cms-upload-icon">⬆</span>
          <p>{label}</p>
          <span className="cms-upload-hint">Drag &amp; drop or click to browse</span>
          <span style={{ fontSize:11, color:'#9ca3af', marginTop:4 }}>
            ☁️ Saves to shared Google Drive
          </span>
        </div>
      )}
    </div>
  );
}