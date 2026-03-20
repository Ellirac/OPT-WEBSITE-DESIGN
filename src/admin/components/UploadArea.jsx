import React, { useRef, useState } from 'react';
import { compressImage } from '../context/CMSContext';

/**
 * UploadArea — auto-compresses images to max 900px / JPEG 75% before calling onUpload.
 * This keeps base64 strings small enough to fit in localStorage comfortably.
 */
export default function UploadArea({ onUpload, preview, label = 'Click to upload image', height = 120, circle = false }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const processFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setCompressing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const compressed = await compressImage(e.target.result);
        onUpload(compressed);
      } catch {
        onUpload(e.target.result); // fallback to original
      } finally {
        setCompressing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className={`cms-upload${dragging ? ' cms-upload--drag' : ''}`}
      onClick={() => !compressing && inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{ cursor: compressing ? 'wait' : 'pointer' }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      {compressing ? (
        <div className="cms-upload-placeholder">
          <span className="cms-upload-icon" style={{ fontSize:20 }}>⏳</span>
          <p style={{ fontSize:12.5, color:'#9ca3af' }}>Compressing image…</p>
        </div>
      ) : preview ? (
        <>
          <img
            src={preview}
            alt="preview"
            className="cms-upload-preview"
            style={{
              maxHeight: height,
              borderRadius: circle ? '50%' : 8,
              width: circle ? height : 'auto',
              height: circle ? height : 'auto',
              objectFit: 'cover',
              display: 'block',
              margin: '0 auto',
            }}
          />
          <div className="cms-upload-change-hint">Click to change image</div>
        </>
      ) : (
        <div className="cms-upload-placeholder">
          <span className="cms-upload-icon">⬆</span>
          <p>{label}</p>
          <span className="cms-upload-hint">Drag & drop or click to browse</span>
        </div>
      )}
    </div>
  );
}
