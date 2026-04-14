import React, { useState } from 'react';
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

// ─── Layout (only shown when logged in) ──────────────────────────────────────
function AdminLayout({ onLogout }) {
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