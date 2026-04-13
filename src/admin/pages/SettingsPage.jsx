import React, { useState } from 'react';
import { useToast } from '../components/Toast';
import { useCMS } from '../context/CMSContext';
import { isStrongPassword, PasswordChecklist, StrengthBar } from '../components/AdminLogin';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Eye({ show }) {
  return show
    ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}

function PassInput({ id, label, value, onChange, show, toggle, placeholder }) {
  return (
    <div className="cms-form-group">
      <label htmlFor={id}>{label}</label>
      <div style={{ position:'relative' }}>
        <input id={id} type={show?'text':'password'} value={value} onChange={onChange}
          placeholder={placeholder} style={{ paddingRight:42 }} />
        <button type="button" onClick={toggle} style={{
          position:'absolute', right:11, top:'50%', transform:'translateY(-50%)',
          background:'none', border:'none', cursor:'pointer', color:'#9ca3af', padding:0, lineHeight:1,
        }}><Eye show={show}/></button>
      </div>
    </div>
  );
}

function ErrMsg({ msg }) {
  if (!msg) return null;
  return <p style={{ fontSize:12, color:'#dc2626', marginTop:-8, marginBottom:10 }}>⚠ {msg}</p>;
}

function EmailJsConfig() {
  const toast = useToast();
  const load = () => {
    try { return JSON.parse(localStorage.getItem('opt_emailjs_config') || '{}'); }
    catch { return {}; }
  };
  const saved = load();
  const [cfg, setCfg] = useState({
    serviceId:  saved.serviceId  || 'service_cj8ubzf',
    templateId: saved.templateId || 'template_eabegmn',
    publicKey:  saved.publicKey  || 'y3YDGpK1hwoGjt4hf',
  });
  const save = () => {
    localStorage.setItem('opt_emailjs_config', JSON.stringify(cfg));
    toast('EmailJS configuration saved!');
  };
  return (
    <details open style={{ marginTop:16 }}>
      <summary style={{ cursor:'pointer', fontSize:13, fontWeight:600, color:'#374151',
        padding:'8px 0', userSelect:'none' }}>⚙ EmailJS Configuration</summary>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginTop:14 }}>
        {[
          { key:'serviceId',  label:'Service ID',  ph:'service_xxxxxxx' },
          { key:'templateId', label:'Template ID', ph:'template_xxxxxxx' },
          { key:'publicKey',  label:'Public Key',  ph:'your_public_key' },
        ].map(f => (
          <div key={f.key} className="cms-form-group" style={{ marginBottom:0 }}>
            <label>{f.label}</label>
            <input value={cfg[f.key] || ''} placeholder={f.ph}
              onChange={e => setCfg(c => ({ ...c, [f.key]: e.target.value }))} />
          </div>
        ))}
      </div>
      <div style={{ marginTop:12 }}>
        <button className="cms-btn cms-btn--primary cms-btn--sm" onClick={save}>Save EmailJS Config</button>
        <span style={{ fontSize:11.5, color:'#9ca3af', marginLeft:10 }}>
          Template needs <code style={{background:'#f3f4f6',padding:'1px 5px',borderRadius:4}}>{'{{otp_code}}'}</code> and <code style={{background:'#f3f4f6',padding:'1px 5px',borderRadius:4}}>{'{{to_email}}'}</code>.
        </span>
      </div>
    </details>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SettingsPage({ onLogout }) {
  const toast = useToast();
  // Read credentials from Firestore (via CMSContext) — syncs across all devices
  const { state, dispatch } = useCMS();
  const adminSettings = state.adminSettings || { username:'admin', password:'OPT@Admin2025', recoveryEmail:'' };

  const updateSettings = (patch) => {
    const updated = { ...adminSettings, ...patch };
    dispatch({ type:'ADMIN_UPDATE_SETTINGS', payload: updated });
    // Also mirror to localStorage so login page (which reads localStorage) stays in sync
    localStorage.setItem('opt_admin_creds', JSON.stringify({ username: updated.username, password: updated.password }));
    localStorage.setItem('opt_admin_recovery', JSON.stringify({ email: updated.recoveryEmail || '' }));
  };

  // ── Username ──
  const [newUser,  setNewUser]  = useState('');
  const [userErr,  setUserErr]  = useState('');

  // ── Password ──
  const [curPass,  setCurPass]  = useState('');
  const [newPass,  setNewPass]  = useState('');
  const [confPass, setConfPass] = useState('');
  const [sCur,     setSCur]     = useState(false);
  const [sNew,     setSNew]     = useState(false);
  const [sConf,    setSConf]    = useState(false);
  const [passErrs, setPassErrs] = useState({});

  // ── Recovery email ──
  const [recEmail, setRecEmail] = useState(adminSettings.recoveryEmail || '');

  const saveUsername = () => {
    if (!newUser.trim())           { setUserErr('Username cannot be empty.'); return; }
    if (newUser.trim().length < 4) { setUserErr('Minimum 4 characters.'); return; }
    updateSettings({ username: newUser.trim() });
    toast('Username updated! Saved globally — all devices will use this.');
    setNewUser(''); setUserErr('');
  };

  const savePassword = () => {
    const errs = {};
    if (!curPass)                            errs.cur  = 'Enter your current password.';
    else if (curPass !== adminSettings.password) errs.cur  = 'Current password is incorrect.';
    if (!newPass)                            errs.new  = 'Enter a new password.';
    else if (!isStrongPassword(newPass))     errs.new  = 'Password does not meet all requirements.';
    else if (newPass === curPass)            errs.new  = 'New password must differ from current.';
    if (!confPass)                           errs.conf = 'Please confirm your new password.';
    else if (newPass !== confPass)           errs.conf = 'Passwords do not match.';
    setPassErrs(errs);
    if (Object.keys(errs).length) return;
    updateSettings({ password: newPass });
    toast('Password changed! Saved globally — all devices updated.');
    setCurPass(''); setNewPass(''); setConfPass(''); setPassErrs({});
  };

  const saveRecoveryContacts = () => {
    if (!recEmail.trim())          { toast('Please enter a backup email address.', 'error'); return; }
    if (!recEmail.includes('@'))   { toast('Enter a valid email address.', 'error'); return; }
    updateSettings({ recoveryEmail: recEmail.trim() });
    toast('Recovery email saved globally!');
  };

  return (
    <div>
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-title">Account Settings</h1>
          <p className="cms-page-sub">Changes sync globally — all devices update instantly via Firestore</p>
        </div>
        <button className="cms-btn cms-btn--danger"
          onClick={() => { sessionStorage.removeItem('opt_admin_session'); onLogout(); }}>
          ⏻ Sign Out
        </button>
      </div>

      {/* Global sync notice */}
      <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10,
        padding:'11px 15px', marginBottom:18, fontSize:13, color:'#166534',
        display:'flex', alignItems:'center', gap:9 }}>
        <span>🌐</span>
        <span><strong>Global sync enabled.</strong> Username, password, and recovery email are stored in Firestore — changes made here apply to every device immediately.</span>
      </div>

      {/* Current user badge */}
      <div className="cms-card" style={{ background:'#fff8f8', border:'1px solid #fecaca', marginBottom:22 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:46, height:46, borderRadius:'50%', flexShrink:0, fontSize:18, fontWeight:700,
            display:'flex', alignItems:'center', justifyContent:'center', color:'#fff',
            background:'linear-gradient(135deg,#c0392b,#8f0a00)' }}>
            {adminSettings.username[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:'#111827' }}>
              Signed in as: <span style={{ color:'#c0392b' }}>{adminSettings.username}</span>
            </div>
            <div style={{ fontSize:12.5, color:'#9ca3af', marginTop:2 }}>Administrator</div>
          </div>
        </div>
      </div>

      <div className="cms-settings-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:22, alignItems:'start' }}>

        {/* Change Username */}
        <div className="cms-card">
          <div className="cms-card-title">Change Username</div>
          <p className="cms-hint">Minimum 4 characters. Saved to Firestore — syncs to all devices.</p>
          <div className="cms-form-group">
            <label>Current Username</label>
            <input value={adminSettings.username} disabled
              style={{ background:'#f9fafb', color:'#9ca3af', cursor:'not-allowed' }} />
          </div>
          <div className="cms-form-group">
            <label>New Username</label>
            <input value={newUser} onChange={e=>{setNewUser(e.target.value);setUserErr('');}}
              placeholder="Enter new username"
              onKeyDown={e=>e.key==='Enter'&&saveUsername()} />
          </div>
          <ErrMsg msg={userErr} />
          <button className="cms-btn cms-btn--primary" style={{ width:'100%' }} onClick={saveUsername}>
            Update Username
          </button>
        </div>

        {/* Change Password */}
        <div className="cms-card">
          <div className="cms-card-title">Change Password</div>
          <p className="cms-hint">Watch for <span style={{color:'#16a34a',fontWeight:700}}>✓</span> checkmarks — all must be green to save.</p>
          <PassInput id="cur" label="Current Password" value={curPass}
            onChange={e=>{setCurPass(e.target.value);setPassErrs(v=>({...v,cur:''}));}}
            show={sCur} toggle={()=>setSCur(s=>!s)} placeholder="Enter current password" />
          <ErrMsg msg={passErrs.cur} />
          <PassInput id="new" label="New Password" value={newPass}
            onChange={e=>{setNewPass(e.target.value);setPassErrs(v=>({...v,new:''}));}}
            show={sNew} toggle={()=>setSNew(s=>!s)} placeholder="Enter new password" />
          <ErrMsg msg={passErrs.new} />
          {newPass.length > 0 && <StrengthBar password={newPass} />}
          <PasswordChecklist password={newPass} />
          <div style={{ marginTop:12 }}>
            <PassInput id="conf" label="Confirm New Password" value={confPass}
              onChange={e=>{setConfPass(e.target.value);setPassErrs(v=>({...v,conf:''}));}}
              show={sConf} toggle={()=>setSConf(s=>!s)} placeholder="Re-enter new password" />
            {confPass.length > 0 && (
              <p style={{ fontSize:12, color:newPass===confPass?'#16a34a':'#dc2626', marginTop:-8, marginBottom:10 }}>
                {newPass===confPass ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
            <ErrMsg msg={passErrs.conf} />
          </div>
          <button className="cms-btn cms-btn--primary" style={{ width:'100%' }} onClick={savePassword}>
            Update Password
          </button>
        </div>
      </div>

      {/* Recovery Email */}
      <div className="cms-card">
        <div className="cms-card-title">🔑 Password Recovery Email</div>
        <p className="cms-hint" style={{ marginBottom:18 }}>
          Add your backup email here. When you click <strong>Forgot Password</strong> on the login screen,
          a 6-digit verification code will be sent to this address.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:22, alignItems:'start' }}>
          <div className="cms-form-group">
            <label>📧 Backup Email Address</label>
            <input type="email" value={recEmail} onChange={e => setRecEmail(e.target.value)}
              placeholder="e.g. admin@optphils.com.ph" />
            <p style={{ fontSize:11.5, color:'#9ca3af', marginTop:4 }}>
              A 6-digit OTP will be sent here when you use Forgot Password.
            </p>
          </div>
          <div style={{ background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:9,
            padding:'12px 14px', fontSize:12, color:'#0369a1', lineHeight:1.7 }}>
            <strong>To enable real email sending:</strong><br/>
            Sign up free at <a href="https://emailjs.com" target="_blank" rel="noreferrer"
              style={{ color:'#0369a1' }}>emailjs.com</a>, create a template with{' '}
            <code>{'{{otp_code}}'}</code> and <code>{'{{to_email}}'}</code>,
            then save your keys below.
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:18 }}>
          <button className="cms-btn cms-btn--primary" onClick={saveRecoveryContacts}>
            Save Recovery Email
          </button>
        </div>
      </div>

      <EmailJsConfig />
    </div>
  );
}