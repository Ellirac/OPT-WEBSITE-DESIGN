import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import optLogo from '../../assets/images/opt_logo2 copy.png';

const NAV = [
  { to: '/admin',             label: 'Dashboard',   icon: '⊞', end: true },
  { to: '/admin/home',        label: 'Home',         icon: '⌂' },
  { to: '/admin/about',       label: 'About Us',     icon: '◎' },
  { to: '/admin/products',    label: 'Products',     icon: '⬡' },
  { to: '/admin/activities',  label: 'Activities',   icon: '◈' },
  { to: '/admin/careers',     label: 'Careers',      icon: '◻' },
];

export default function Sidebar({ onLogout }) {
  const { exportData, saveStatus } = useCMS();
  const { state } = useCMS();
  const username = state?.adminSettings?.username || 'admin';

  const [mobileOpen, setMobileOpen] = useState(false);

  const statusInfo = {
    saved:   { color: '#22c55e', icon: '✓', text: 'All changes saved' },
    saving:  { color: '#f59e0b', icon: '↻', text: 'Saving…' },
    error:   { color: '#ef4444', icon: '⚠', text: 'Storage full — remove large images' },
  }[saveStatus] || { color: '#22c55e', icon: '✓', text: 'Saved' };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="cms-sidebar-logo">
        <img src={optLogo} alt="OPT" style={{ width:200, height:60, objectFit:'inherit' }} />
      </div>

      {/* Save status */}
      <div style={{
        margin:'10px 14px 2px',
        display:'flex', alignItems:'center', gap:7,
        padding:'7px 12px', borderRadius:8,
        background: saveStatus === 'error' ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.08)',
        border: `1px solid ${saveStatus === 'error' ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.2)'}`,
      }}>
        <span style={{
          fontSize:13, color:statusInfo.color,
          animation: saveStatus === 'saving' ? 'opt-spin 1s linear infinite' : 'none',
          display:'inline-block',
        }}>{statusInfo.icon}</span>
        <span style={{ fontSize:11.5, color:statusInfo.color, fontWeight:500 }}>{statusInfo.text}</span>
      </div>

      <nav className="cms-sidebar-nav">
        <div className="cms-nav-label">Overview</div>
        <NavLink to="/admin" end className={({ isActive }) => `cms-nav-item${isActive ? ' active' : ''}`}
          onClick={() => setMobileOpen(false)}>
          <span className="cms-nav-icon">⊞</span>Dashboard
        </NavLink>

        <div className="cms-nav-label">Pages</div>
        {NAV.slice(1).map(n => (
          <NavLink key={n.to} to={n.to}
            className={({ isActive }) => `cms-nav-item${isActive ? ' active' : ''}`}
            onClick={() => setMobileOpen(false)}>
            <span className="cms-nav-icon">{n.icon}</span>{n.label}
          </NavLink>
        ))}

        <div className="cms-nav-label">Account</div>
        <NavLink to="/admin/settings"
          className={({ isActive }) => `cms-nav-item${isActive ? ' active' : ''}`}
          onClick={() => setMobileOpen(false)}>
          <span className="cms-nav-icon">⚙</span>Settings
        </NavLink>
      </nav>

      <div className="cms-sidebar-footer">
        <div style={{
          display:'flex', alignItems:'center', gap:9,
          padding:'9px 12px', background:'rgba(255,255,255,0.05)',
          borderRadius:8, marginBottom:8, border:'1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{
            width:28, height:28, borderRadius:'50%', flexShrink:0,
            background:'linear-gradient(135deg,#c0392b,#8f0a00)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:12, color:'#fff', fontWeight:700,
          }}>
            {username[0].toUpperCase()}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12.5, fontWeight:600, color:'#f3f4f6', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{username}</div>
            <div style={{ fontSize:10.5, color:'#6b7280' }}>Administrator</div>
          </div>
        </div>
        <button className="cms-export-btn" onClick={exportData}>⬇ Export JSON</button>
        <a href="/" className="cms-back-link">← Back to Website</a>
        <button
          onClick={() => { sessionStorage.removeItem('opt_admin_session'); onLogout(); }}
          style={{
            width:'100%', padding:'8px', background:'transparent',
            border:'1px solid rgba(192,57,43,0.35)', borderRadius:8,
            color:'#f87171', fontSize:12.5, cursor:'pointer', transition:'all 0.12s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(192,57,43,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}
        >
          ⏻ Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar (always visible ≥769px) ── */}
      <aside className="cms-sidebar cms-sidebar--desktop">
        <SidebarContent />
        <style>{`@keyframes opt-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </aside>

      {/* ── Mobile: hamburger button ── */}
      <div className="cms-hamburger-bar">
        <img src={optLogo} alt="OPT" style={{ height:36, objectFit:'contain' }} />
        <button
          className="cms-hamburger-btn"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* ── Mobile: slide-in drawer ── */}
      {mobileOpen && (
        <>
          <div className="cms-sidebar-overlay" onClick={() => setMobileOpen(false)} />
          <aside className="cms-sidebar cms-sidebar--mobile">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}