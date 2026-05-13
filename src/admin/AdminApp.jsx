import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// NO CMSProvider here — it lives in App.js and wraps everything
import { ToastProvider } from './components/Toast';
import AdminLogin      from './components/AdminLogin';
import Sidebar         from './components/Sidebar';

import Dashboard       from './pages/Dashboard';
import HomeAdmin       from './pages/HomeAdmin';
import AboutAdmin      from './pages/AboutAdmin';
import ProductsAdmin   from './pages/ProductsAdmin';
import ActivitiesAdmin from './pages/ActivitiesAdmin';
import CareersAdmin    from './pages/CareersAdmin';
import SettingsPage    from './pages/SettingsPage';

import { useCMS } from './context/CMSContext';
import './admin.css';

// ─── Auth helpers ─────────────────────────────────────────────────────────────
function getSession() {
  return sessionStorage.getItem('opt_admin_session') === 'yes';
}
function setSession(val) {
  if (val) sessionStorage.setItem('opt_admin_session', 'yes');
  else     sessionStorage.removeItem('opt_admin_session');
}

// ─── Session timeout (30 minutes of inactivity) ───────────────────────────────
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARN_BEFORE_MS     =  2 * 60 * 1000; //  2 minutes warning before logout

// ─── Layout (only shown when logged in) ──────────────────────────────────────
function AdminLayout({ onLogout }) {
  const timerRef   = useRef(null);
  const warnRef    = useRef(null);
  const [showWarn, setShowWarn] = useState(false);
  const [warnSecs, setWarnSecs] = useState(120);
  const warnTickRef = useRef(null);

  const logout = useCallback(() => {
    clearTimeout(timerRef.current);
    clearTimeout(warnRef.current);
    clearInterval(warnTickRef.current);
    setShowWarn(false);
    onLogout();
  }, [onLogout]);

  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    clearTimeout(warnRef.current);
    clearInterval(warnTickRef.current);
    setShowWarn(false);

    // Warn 2 min before logout
    warnRef.current = setTimeout(() => {
      setShowWarn(true);
      setWarnSecs(Math.round(WARN_BEFORE_MS / 1000));
      warnTickRef.current = setInterval(() => {
        setWarnSecs(s => {
          if (s <= 1) { clearInterval(warnTickRef.current); return 0; }
          return s - 1;
        });
      }, 1000);
    }, SESSION_TIMEOUT_MS - WARN_BEFORE_MS);

    // Actual logout
    timerRef.current = setTimeout(logout, SESSION_TIMEOUT_MS);
  }, [logout]);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    const handle = () => resetTimer();
    events.forEach(ev => window.addEventListener(ev, handle, { passive: true }));
    resetTimer(); // start on mount
    return () => {
      events.forEach(ev => window.removeEventListener(ev, handle));
      clearTimeout(timerRef.current);
      clearTimeout(warnRef.current);
      clearInterval(warnTickRef.current);
    };
  }, [resetTimer]);

  return (
    <ToastProvider>
      <div className="cms-root">
        <Sidebar onLogout={onLogout} />
        <main className="cms-main">
          <Routes>
            <Route index             element={<Dashboard />} />
            <Route path="home"       element={<HomeAdmin />} />
            <Route path="about"      element={<AboutAdmin />} />
            <Route path="products"   element={<ProductsAdmin />} />
            <Route path="activities" element={<ActivitiesAdmin />} />
            <Route path="careers"    element={<CareersAdmin />} />
            <Route path="settings"   element={<SettingsPage onLogout={onLogout} />} />
            <Route path="*"          element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>

        {/* ── Inactivity warning modal ── */}
        {showWarn && (
          <div style={{ position:'fixed', inset:0, zIndex:99999,
            background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)',
            display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
            <div style={{ background:'#fff', borderRadius:14, padding:'32px 36px',
              maxWidth:380, width:'100%', textAlign:'center',
              boxShadow:'0 24px 70px rgba(0,0,0,0.4)' }}>
              <div style={{ fontSize:46, marginBottom:10 }}>⏰</div>
              <p style={{ fontSize:17, fontWeight:800, color:'#1a0000', margin:'0 0 8px' }}>
                Session Expiring Soon
              </p>
              <p style={{ fontSize:13.5, color:'#6b7280', margin:'0 0 6px' }}>
                You've been inactive. You'll be logged out in:
              </p>
              <p style={{ fontSize:38, fontWeight:800, color:'#c0392b', margin:'0 0 22px', letterSpacing:-1 }}>
                {String(Math.floor(warnSecs / 60)).padStart(2,'0')}:{String(warnSecs % 60).padStart(2,'0')}
              </p>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={logout}
                  style={{ flex:1, padding:'11px', background:'#f3f4f6', border:'none',
                    borderRadius:8, fontSize:13.5, fontWeight:600, cursor:'pointer', color:'#374151' }}>
                  Log Out
                </button>
                <button onClick={resetTimer}
                  style={{ flex:2, padding:'11px',
                    background:'linear-gradient(135deg,#c0392b,#8f0a00)',
                    border:'none', borderRadius:8, fontSize:13.5, fontWeight:700,
                    cursor:'pointer', color:'#fff',
                    boxShadow:'0 4px 14px rgba(192,57,43,.3)' }}>
                  Stay Logged In →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToastProvider>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AdminApp() {
  const { state } = useCMS();
  const adminSettings = state?.adminSettings;
  const [loggedIn, setLoggedIn] = useState(() => getSession());

  function handleLogin() {
    setSession(true);
    setLoggedIn(true);
  }

  function handleLogout() {
    setSession(false);
    setLoggedIn(false);
  }

  if (!loggedIn) {
    return <AdminLogin onLogin={handleLogin} adminSettings={adminSettings} />;
  }

  return <AdminLayout onLogout={handleLogout} />;
}