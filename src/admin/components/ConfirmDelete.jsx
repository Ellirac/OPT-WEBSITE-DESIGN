import React, { useState, useEffect, useRef } from 'react';

//  * ConfirmDelete — typed confirmation modal
//  * Props:
//  *   target    { id, label } | null
//  *   onConfirm (id) => void
//  *   onCancel  () => void
//  *   word      string to type — default "DELETE"

export default function ConfirmDelete({ target, onConfirm, onCancel, word = 'DELETE' }) {
  const [typed,   setTyped]   = useState('');
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (target) {
      setTyped('');
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [target]);

  if (!target) return null;

  const matched = typed.trim().toUpperCase() === word.toUpperCase();

  const handleConfirm = () => {
    if (!matched) { setShaking(true); setTimeout(() => setShaking(false), 500); return; }
    onConfirm(target.id);
    onCancel();
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      style={{
        position:'fixed', inset:0, zIndex:9999,
        background:'rgba(0,0,0,0.55)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:20, backdropFilter:'blur(4px)',
      }}
    >
      <div
        onKeyDown={(e) => { if (e.key==='Escape') onCancel(); if (e.key==='Enter' && matched) handleConfirm(); }}
        style={{
          background:'#fff', borderRadius:18, width:'100%', maxWidth:420,
          boxShadow:'0 32px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06)',
          overflow:'hidden',
          animation: shaking ? 'cd-shake .45s ease' : 'cd-in .22s ease',
        }}
      >
        {/* Red top bar */}
        <div style={{
          background:'linear-gradient(135deg,#c0392b,#8f0a00)',
          padding:'22px 26px 18px',
          display:'flex', alignItems:'flex-start', gap:14,
        }}>
          <div style={{
            width:42, height:42, borderRadius:'50%', flexShrink:0,
            background:'rgba(255,255,255,0.15)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:20,
          }}>
            🗑️
          </div>
          <div>
            <div style={{ color:'#fff', fontSize:17, fontWeight:800, marginBottom:3 }}>
              Delete Permanently?
            </div>
            <div style={{ color:'rgba(255,255,255,0.7)', fontSize:12.5, lineHeight:1.5 }}>
              You are about to delete{' '}
              <strong style={{ color:'#fff' }}>"{target.label}"</strong>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:'22px 26px 24px' }}>

          {/* Warning message */}
          <div style={{
            background:'#fef2f2', border:'1px solid #fecaca',
            borderRadius:10, padding:'11px 14px', marginBottom:20,
            display:'flex', alignItems:'center', gap:10, fontSize:13, color:'#991b1b',
          }}>
            <span style={{ fontSize:16, flexShrink:0 }}>⚠️</span>
            <span>This action <strong>cannot be undone</strong>. The data will be permanently removed from Firebase.</span>
          </div>

          {/* Type to confirm */}
          <label style={{ display:'block', fontSize:12.5, fontWeight:600, color:'#374151', marginBottom:8 }}>
            Type{' '}
            <span style={{
              background:'#fef2f2', color:'#c0392b', border:'1px solid #fecaca',
              padding:'2px 8px', borderRadius:5,
              fontFamily:'monospace', fontWeight:800, fontSize:12, letterSpacing:1,
            }}>
              {word}
            </span>
            {' '}to confirm
          </label>

          <input
            ref={inputRef}
            value={typed}
            onChange={e => setTyped(e.target.value)}
            placeholder={`Type ${word} here…`}
            style={{
              width:'100%', padding:'11px 14px',
              border: `2px solid ${
                typed.length === 0 ? '#e5e7eb' :
                matched           ? '#86efac' : '#fca5a5'
              }`,
              borderRadius:9, fontSize:14,
              fontFamily:'monospace', fontWeight:700, letterSpacing:2,
              color:'#111827', outline:'none',
              background: typed.length === 0 ? '#fff' : matched ? '#f0fdf4' : '#fff8f8',
              transition:'all .15s', boxSizing:'border-box',
            }}
          />

          {/* Live match feedback */}
          <div style={{ height:22, marginTop:6 }}>
            {typed.length > 0 && (
              <p style={{
                fontSize:12.5, margin:0,
                color: matched ? '#16a34a' : '#dc2626',
                display:'flex', alignItems:'center', gap:5, fontWeight:500,
              }}>
                <span style={{
                  width:16, height:16, borderRadius:'50%', fontSize:9, fontWeight:800,
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  background: matched ? '#dcfce7' : '#fef2f2',
                  color: matched ? '#16a34a' : '#dc2626',
                  border: `1.5px solid ${matched ? '#86efac' : '#fca5a5'}`,
                  flexShrink:0,
                }}>
                  {matched ? '✓' : '✗'}
                </span>
                {matched
                  ? 'Ready — click the button below to confirm deletion'
                  : `Keep typing — must match "${word}" exactly (all caps)`}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display:'flex', gap:10, marginTop:16 }}>
            <button
              onClick={onCancel}
              style={{
                flex:1, padding:'11px',
                background:'#f9fafb', border:'1px solid #e5e7eb',
                borderRadius:9, fontSize:13.5, fontWeight:600, color:'#374151',
                cursor:'pointer', transition:'background .12s',
              }}
              onMouseEnter={e => e.target.style.background='#f3f4f6'}
              onMouseLeave={e => e.target.style.background='#f9fafb'}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              style={{
                flex:2, padding:'11px',
                background: matched
                  ? 'linear-gradient(135deg,#c0392b,#8f0a00)'
                  : '#f3f4f6',
                border:'none', borderRadius:9,
                fontSize:13.5, fontWeight:700,
                color: matched ? '#fff' : '#9ca3af',
                cursor: matched ? 'pointer' : 'not-allowed',
                boxShadow: matched ? '0 4px 14px rgba(192,57,43,.35)' : 'none',
                transition:'all .15s',
                display:'flex', alignItems:'center', justifyContent:'center', gap:7,
              }}
            >
              {matched ? '🗑️' : '🔒'} {matched ? 'Yes, Delete Permanently' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cd-in    { from{opacity:0;transform:scale(.94) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes cd-shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
      `}</style>
    </div>
  );
}
