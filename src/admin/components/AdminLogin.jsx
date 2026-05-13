import React, { useState } from 'react';
import optLogo from '../../assets/images/opt_logo.png';

// ─── Password rules — exported so SettingsPage reuses them ────────────────────
export const PASSWORD_RULES = [
  { id:'len',   label:'At least 8 characters',              test: p => p.length >= 8 },
  { id:'upper', label:'One uppercase letter (A–Z)',          test: p => /[A-Z]/.test(p) },
  { id:'lower', label:'One lowercase letter (a–z)',          test: p => /[a-z]/.test(p) },
  { id:'num',   label:'One number (0–9)',                    test: p => /[0-9]/.test(p) },
  { id:'sym',   label:'One special character (!@#$%^&*)',    test: p => /[^A-Za-z0-9]/.test(p) },
];

export const isStrongPassword = p => PASSWORD_RULES.every(r => r.test(p));

// ─── Live checklist with animated ✓ / ✗ ─────────────────────────────────────
export function PasswordChecklist({ password }) {
  return (
    <ul style={{ listStyle:'none', padding:0, margin:'8px 0 0', display:'flex', flexDirection:'column', gap:5 }}>
      {PASSWORD_RULES.map(r => {
        const empty = password.length === 0;
        const ok    = !empty && r.test(password);
        return (
          <li key={r.id} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12.5,
            color: empty ? '#9ca3af' : ok ? '#16a34a' : '#dc2626', transition:'color 0.18s' }}>
            <span style={{
              width:18, height:18, borderRadius:'50%', flexShrink:0, fontSize:10, fontWeight:800,
              display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.18s',
              background: empty ? '#f3f4f6' : ok ? '#dcfce7' : '#fef2f2',
              color:       empty ? '#9ca3af' : ok ? '#16a34a' : '#dc2626',
              border: `1.5px solid ${empty ? '#e5e7eb' : ok ? '#86efac' : '#fca5a5'}`,
            }}>
              {empty ? '–' : ok ? '✓' : '✗'}
            </span>
            {r.label}
          </li>
        );
      })}
    </ul>
  );
}

// ─── Strength bar ────────────────────────────────────────────────────────────
export function StrengthBar({ password }) {
  const n = PASSWORD_RULES.filter(r => r.test(password)).length;
  const colors = ['#e5e7eb','#ef4444','#f97316','#eab308','#22c55e','#16a34a'];
  const labels = ['','Weak','Fair','Good','Strong','Very Strong'];
  return (
    <div style={{ marginTop:7 }}>
      <div style={{ display:'flex', gap:3, marginBottom:3 }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ flex:1, height:4, borderRadius:2, transition:'background .22s',
            background: password.length > 0 && i <= n ? colors[n] : '#e5e7eb' }} />
        ))}
      </div>
      {password.length > 0 && <div style={{ fontSize:11, fontWeight:700, color:colors[n] }}>{labels[n]}</div>}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Eye({ show }) {
  return show
    ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}

const S = {
  input: { width:'100%', padding:'10px 13px', border:'1.5px solid #e5e7eb', borderRadius:8,
    fontSize:14, color:'#111827', fontFamily:'inherit', outline:'none',
    transition:'border-color .15s', boxSizing:'border-box', background:'#fff' },
  label: { display:'block', fontSize:12.5, fontWeight:600, color:'#374151', marginBottom:5 },
  btn:   { width:'100%', padding:'12px', background:'linear-gradient(135deg,#c0392b,#8f0a00)',
    color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:700,
    cursor:'pointer', letterSpacing:.3, boxShadow:'0 4px 14px rgba(192,57,43,.3)',
    transition:'opacity .15s' },
  card:  { background:'#fff', borderRadius:14, padding:'32px 32px 28px',
    boxShadow:'0 28px 70px rgba(0,0,0,.4)' },
  err:   { background:'#fef2f2', border:'1px solid #fecaca', borderRadius:7,
    padding:'9px 12px', fontSize:13, color:'#dc2626', display:'flex', alignItems:'center', gap:7 },
  eyeBtn:{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%)',
    background:'none', border:'none', cursor:'pointer', color:'#9ca3af', padding:0, lineHeight:1 },
};
const fRed  = e => { e.target.style.borderColor = '#c0392b'; };
const fGray = e => { e.target.style.borderColor = '#e5e7eb'; };

// ─── Credential store helpers ─────────────────────────────────────────────────
const DEFAULT_CREDS = { username:'admin', password:'OPT@Admin2025' };

// Module-level credential readers — localStorage kept in sync with Firestore by AdminLogin
function getCreds() {
  try { return JSON.parse(localStorage.getItem('opt_admin_creds')) || DEFAULT_CREDS; }
  catch { return DEFAULT_CREDS; }
}
// Write to localStorage so login works instantly without waiting for Firestore
function saveCreds(obj) {
  localStorage.setItem('opt_admin_creds', JSON.stringify(obj));
}
function getRecovery() {
  try { return JSON.parse(localStorage.getItem('opt_admin_recovery')) || { email:'' }; }
  catch { return { email:'' }; }
}

function genOtp() { return Math.floor(100000 + Math.random() * 900000).toString(); }

// ─── EmailJS sender ────────────────────────────────────────────────────────────
// Your credentials are stored here as defaults.
// They can also be overridden in Settings → EmailJS Configuration.
const EMAILJS_DEFAULTS = {
  serviceId:  'service_cj8ubzf',
  templateId: 'template_eabegmn',
  publicKey:  'y3YDGpK1hwoGjt4hf',
};

async function sendOtpEmail(toEmail, otp) {
  // Merge saved config over defaults
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('opt_emailjs_config') || '{}'); } catch {}
  const cfg = {
    serviceId:  saved.serviceId  || EMAILJS_DEFAULTS.serviceId,
    templateId: saved.templateId || EMAILJS_DEFAULTS.templateId,
    publicKey:  saved.publicKey  || EMAILJS_DEFAULTS.publicKey,
  };

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id:  cfg.serviceId,
        template_id: cfg.templateId,
        user_id:     cfg.publicKey,
        template_params: {
          to_email: toEmail,
          otp_code: otp,
          company:  'OPT Admin',
        },
      }),
    });
    if (res.ok) return { ok: true };
    const text = await res.text();
    console.error('[OPT CMS] EmailJS error:', res.status, text);
    return { ok: false, error: `EmailJS responded with ${res.status}: ${text}` };
  } catch (err) {
    console.error('[OPT CMS] EmailJS fetch error:', err);
    return { ok: false, error: err.message };
  }
}


// ─── Brute-force protection helpers ──────────────────────────────────────────
const MAX_ATTEMPTS       = 5;
// Lockout durations in seconds — escalates each time the limit is hit
const LOCKOUT_DURATIONS  = [30, 60, 300, 900]; // 30s, 1 min, 5 min, 15 min
const ATTEMPTS_KEY       = 'opt_login_attempts';
const LOCKOUT_KEY        = 'opt_login_lockout';
const LAST_LOGIN_KEY     = 'opt_last_login';

function readAttempts() {
  try { return JSON.parse(localStorage.getItem(ATTEMPTS_KEY)) || { count: 0, level: 0 }; }
  catch { return { count: 0, level: 0 }; }
}
function readLockout() {
  try { return JSON.parse(localStorage.getItem(LOCKOUT_KEY)) || { until: 0 }; }
  catch { return { until: 0 }; }
}
function remainingLockout() {
  return Math.max(0, Math.ceil((readLockout().until - Date.now()) / 1000));
}
function recordFail() {
  const a = readAttempts();
  a.count += 1;
  if (a.count >= MAX_ATTEMPTS) {
    const duration = LOCKOUT_DURATIONS[Math.min(a.level, LOCKOUT_DURATIONS.length - 1)];
    localStorage.setItem(LOCKOUT_KEY, JSON.stringify({ until: Date.now() + duration * 1000 }));
    a.count = 0;
    a.level = Math.min(a.level + 1, LOCKOUT_DURATIONS.length - 1);
  }
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(a));
  return { attemptsLeft: MAX_ATTEMPTS - a.count };
}
function clearAttempts() {
  localStorage.removeItem(ATTEMPTS_KEY);
  localStorage.removeItem(LOCKOUT_KEY);
}
function formatCountdown(s) {
  if (s >= 60) return `${Math.ceil(s / 60)} minute${Math.ceil(s / 60) > 1 ? 's' : ''}`;
  return `${s} second${s !== 1 ? 's' : ''}`;
}
function saveLastLogin() {
  localStorage.setItem(LAST_LOGIN_KEY, JSON.stringify({ at: Date.now() }));
}
function getLastLogin() {
  try {
    const d = JSON.parse(localStorage.getItem(LAST_LOGIN_KEY));
    if (!d?.at) return null;
    return new Date(d.at).toLocaleString('en-PH', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return null; }
}

// ─── STEP 1: Login ────────────────────────────────────────────────────────────
function StepLogin({ onLogin, onForgot }) {
  const [user,      setUser]      = useState('');
  const [pass,      setPass]      = useState('');
  const [show,      setShow]      = useState(false);
  const [err,       setErr]       = useState('');
  const [shake,     setShake]     = useState(false);
  const [countdown, setCountdown] = useState(() => remainingLockout());
  const [attLeft,   setAttLeft]   = useState(() => MAX_ATTEMPTS - readAttempts().count);
  const lastLogin = getLastLogin();

  // Tick down the lockout countdown every second
  React.useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => {
      const r = remainingLockout();
      setCountdown(r);
      if (r <= 0) clearInterval(t);
    }, 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const isLocked = countdown > 0;

  const submit = e => {
    e.preventDefault();
    setErr('');

    if (isLocked) return; // blocked while locked out

    const c = getCreds();
    if (user.trim() === c.username && pass === c.password) {
      clearAttempts();
      saveLastLogin();
      onLogin();
    } else {
      const { attemptsLeft } = recordFail();
      const remaining = remainingLockout();

      if (remaining > 0) {
        setCountdown(remaining);
        setErr(`Too many failed attempts. Account locked for ${formatCountdown(remaining)}.`);
      } else {
        setAttLeft(attemptsLeft);
        setErr(
          attemptsLeft <= 2
            ? `Incorrect credentials. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} left before lockout.`
            : 'Incorrect username or password. Please try again.'
        );
      }
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{ animation: shake ? 'opt-shake .5s ease' : 'opt-in .35s ease' }}>
      <div style={S.card}>
        <p style={{ fontSize:16, fontWeight:700, color:'#1a0000', margin:'0 0 3px' }}>Welcome back</p>
        <p style={{ fontSize:13, color:'#9ca3af', margin:'0 0 4px' }}>Sign in to manage the OPT website content.</p>
        {lastLogin && (
          <p style={{ fontSize:11.5, color:'#c0392b', margin:'0 0 20px', display:'flex', alignItems:'center', gap:5 }}>
            <span>🕐</span> Last login: {lastLogin}
          </p>
        )}
        {!lastLogin && <div style={{ marginBottom:20 }} />}

        {/* Lockout banner */}
        {isLocked && (
          <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8,
            padding:'14px 16px', marginBottom:16, textAlign:'center' }}>
            <div style={{ fontSize:28, marginBottom:6 }}>🔒</div>
            <p style={{ fontSize:13.5, fontWeight:700, color:'#dc2626', margin:'0 0 4px' }}>
              Account Temporarily Locked
            </p>
            <p style={{ fontSize:13, color:'#b91c1c', margin:0 }}>
              Try again in <strong>{formatCountdown(countdown)}</strong>
            </p>
          </div>
        )}

        <form onSubmit={submit}>
          {/* Username */}
          <div style={{ marginBottom:14 }}>
            <label style={S.label}>Username</label>
            <input value={user} onChange={e=>{setUser(e.target.value);setErr('');}}
              placeholder="Enter username" autoComplete="username" required
              disabled={isLocked}
              style={{...S.input, opacity: isLocked ? .5 : 1}} onFocus={fRed} onBlur={fGray} />
          </div>

          {/* Password */}
          <div style={{ marginBottom:14 }}>
            <label style={S.label}>Password</label>
            <div style={{ position:'relative' }}>
              <input type={show?'text':'password'} value={pass}
                onChange={e=>{setPass(e.target.value);setErr('');}}
                placeholder="Enter password" autoComplete="current-password" required
                disabled={isLocked}
                style={{...S.input, paddingRight:40, opacity: isLocked ? .5 : 1}} onFocus={fRed} onBlur={fGray} />
              <button type="button" onClick={()=>setShow(s=>!s)} style={S.eyeBtn}><Eye show={show}/></button>
            </div>
          </div>

          {/* Attempts warning */}
          {!isLocked && attLeft <= 2 && attLeft > 0 && (
            <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:7,
              padding:'8px 12px', fontSize:12.5, color:'#92400e', marginBottom:12,
              display:'flex', alignItems:'center', gap:7 }}>
              <span>⚠️</span>
              <span><strong>{attLeft} attempt{attLeft !== 1 ? 's' : ''} remaining</strong> before lockout</span>
            </div>
          )}

          {err && !isLocked && <div style={{...S.err, marginBottom:14}}><span>⚠</span>{err}</div>}

          <button type="submit" disabled={isLocked}
            style={{...S.btn, opacity: isLocked ? '.45' : '1', cursor: isLocked ? 'not-allowed' : 'pointer'}}
            onMouseEnter={e=>{ if(!isLocked) e.target.style.opacity='.85'; }}
            onMouseLeave={e=>{ if(!isLocked) e.target.style.opacity='1'; }}>
            {isLocked ? `Locked — ${formatCountdown(countdown)}` : 'Sign In →'}
          </button>
        </form>

        {/* Forgot password */}
        <div style={{ textAlign:'center', marginTop:16 }}>
          <button onClick={onForgot} disabled={isLocked}
            style={{ background:'none', border:'none', color: isLocked ? '#d1d5db' : '#c0392b',
              fontSize:13, cursor: isLocked ? 'not-allowed' : 'pointer',
              fontWeight:600, textDecoration:'underline' }}>
            Forgot password?
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── STEP 2: Forgot — email only ──────────────────────────────────────────────
function StepForgotPick({ onBack, onSendOtp }) {
  const recovery = getRecovery();
  const hasEmail = !!recovery.email;
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState('');

  const send = async () => {
    if (!hasEmail) {
      setErr('No backup email set. Log in first and go to Settings → Recovery to add your email.');
      return;
    }
    setLoading(true); setErr('');
    const otp    = genOtp();
    const result = await sendOtpEmail(recovery.email, otp);
    setLoading(false);
    if (result.ok) {
      onSendOtp(otp, 'email', recovery.email);
    } else {
      setErr('Failed to send email: ' + (result.error || 'unknown error') + '. Check your EmailJS config in Settings.');
    }
  };

  return (
    <div style={{ animation:'opt-in .3s ease' }}>
      <div style={S.card}>
        <p style={{ fontSize:28, margin:'0 0 10px' }}>🔐</p>
        <p style={{ fontSize:15, fontWeight:700, color:'#1a0000', margin:'0 0 4px' }}>Forgot Password</p>
        <p style={{ fontSize:13, color:'#6b7280', margin:'0 0 20px' }}>
          A 6-digit verification code will be sent to your backup email address.
        </p>

        {hasEmail ? (
          <div style={{ background:'#f0fdf4', border:'1px solid #86efac', borderRadius:9,
            padding:'12px 16px', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:18 }}>📧</span>
            <div>
              <div style={{ fontWeight:600, fontSize:13.5, color:'#15803d' }}>Sending to:</div>
              <div style={{ fontSize:13, color:'#166534' }}>
                {recovery.email.replace(/(.{2}).+(@.+)/, '$1***$2')}
              </div>
            </div>
          </div>
        ) : (
          <div style={{...S.err, marginBottom:20}}>
            <span>⚠</span>
            <span>No backup email set. Log in first, then go to <strong>Settings → Recovery</strong> to add your email.</span>
          </div>
        )}

        {err && <div style={{...S.err, marginBottom:16}}><span>⚠</span><span>{err}</span></div>}

        <div style={{ display:'flex', gap:8 }}>
          <button onClick={onBack}
            style={{...S.btn, flex:1, background:'#f3f4f6', color:'#374151', boxShadow:'none'}}>
            ← Back
          </button>
          {hasEmail && (
            <button onClick={send} disabled={loading}
              style={{...S.btn, flex:2, opacity:loading?'.65':'1', cursor:loading?'wait':'pointer'}}>
              {loading ? 'Sending…' : 'Send Code →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 3: Enter OTP ────────────────────────────────────────────────────────
function StepOtp({ method, contact, expected, onBack, onVerified }) {
  const [code, setCode] = useState('');
  const [err,  setErr]  = useState('');

  const verify = () => {
    if (code.trim() !== expected) { setErr('Incorrect code. Please check and try again.'); return; }
    onVerified();
  };

  return (
    <div style={{ animation:'opt-in .3s ease' }}>
      <div style={S.card}>
        <p style={{ fontSize:22, margin:'0 0 8px' }}>{method==='email'?'📧':'📱'}</p>
        <p style={{ fontSize:15, fontWeight:700, color:'#1a0000', margin:'0 0 4px' }}>Enter Verification Code</p>
        <p style={{ fontSize:13, color:'#6b7280', margin:'0 0 18px' }}>
          A 6-digit code was sent to <strong style={{color:'#111827'}}>{contact}</strong>.
          Check your inbox (and spam folder).
        </p>

        <label style={S.label}>6-Digit Code</label>
        <input value={code} onChange={e=>{setCode(e.target.value.replace(/\D/g,'').slice(0,6));setErr('');}}
          placeholder="000000" maxLength={6}
          style={{...S.input, fontSize:26, letterSpacing:10, textAlign:'center', fontWeight:700, paddingRight:13}}
          onFocus={fRed} onBlur={fGray} />

        {err && <div style={{...S.err, marginTop:10, marginBottom:0}}><span>⚠</span>{err}</div>}

        <div style={{ display:'flex', gap:8, marginTop:18 }}>
          <button onClick={onBack}
            style={{...S.btn, flex:1, background:'#f3f4f6', color:'#374151', boxShadow:'none'}}>
            ← Back
          </button>
          <button onClick={verify} disabled={code.length<6}
            style={{...S.btn, flex:2, opacity:code.length<6?'.5':'1'}}>
            Verify →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 4: Set new password ─────────────────────────────────────────────────
function StepNewPassword({ onDone }) {
  const [np,   setNp]   = useState('');
  const [cp,   setCp]   = useState('');
  const [sNp,  setSNp]  = useState(false);
  const [sCp,  setSCp]  = useState(false);
  const [err,  setErr]  = useState('');

  const save = () => {
    if (!isStrongPassword(np)) { setErr('Password does not meet all requirements.'); return; }
    if (np !== cp)             { setErr('Passwords do not match.'); return; }
    const c = getCreds();
    saveCreds({ ...c, password: np });
    onDone();
  };

  return (
    <div style={{ animation:'opt-in .3s ease' }}>
      <div style={S.card}>
        <p style={{ fontSize:22, margin:'0 0 8px' }}>🔒</p>
        <p style={{ fontSize:15, fontWeight:700, color:'#1a0000', margin:'0 0 4px' }}>Create New Password</p>
        <p style={{ fontSize:13, color:'#6b7280', margin:'0 0 18px' }}>
          All checkmarks below must turn green before you can save.
        </p>

        <label style={S.label}>New Password</label>
        <div style={{ position:'relative', marginBottom:4 }}>
          <input type={sNp?'text':'password'} value={np}
            onChange={e=>{setNp(e.target.value);setErr('');}}
            placeholder="Enter new password"
            style={{...S.input, paddingRight:40}} onFocus={fRed} onBlur={fGray} />
          <button type="button" onClick={()=>setSNp(s=>!s)} style={S.eyeBtn}><Eye show={sNp}/></button>
        </div>

        <StrengthBar password={np} />
        <PasswordChecklist password={np} />

        <div style={{ marginTop:16, marginBottom:4 }}>
          <label style={S.label}>Confirm New Password</label>
          <div style={{ position:'relative' }}>
            <input type={sCp?'text':'password'} value={cp}
              onChange={e=>{setCp(e.target.value);setErr('');}}
              placeholder="Re-enter new password"
              style={{...S.input, paddingRight:40}} onFocus={fRed} onBlur={fGray} />
            <button type="button" onClick={()=>setSCp(s=>!s)} style={S.eyeBtn}><Eye show={sCp}/></button>
          </div>
          {cp.length > 0 && (
            <p style={{ fontSize:12, marginTop:5, color: np===cp ? '#16a34a' : '#dc2626' }}>
              {np===cp ? '✓ Passwords match' : '✗ Passwords do not match'}
            </p>
          )}
        </div>

        {err && <div style={{...S.err, marginBottom:12}}><span>⚠</span>{err}</div>}

        <button onClick={save}
          style={{...S.btn, marginTop:12, opacity: isStrongPassword(np) && np===cp ? '1' : '.55',
            cursor: isStrongPassword(np) && np===cp ? 'pointer' : 'not-allowed'}}>
          Save New Password →
        </button>
      </div>
    </div>
  );
}

// ─── STEP 5: Success ──────────────────────────────────────────────────────────
function StepSuccess({ onBack }) {
  return (
    <div style={{ animation:'opt-in .3s ease' }}>
      <div style={{...S.card, textAlign:'center'}}>
        <div style={{ fontSize:54, marginBottom:12 }}>✅</div>
        <p style={{ fontSize:17, fontWeight:700, color:'#1a0000', margin:'0 0 8px' }}>Password Reset!</p>
        <p style={{ fontSize:13.5, color:'#6b7280', margin:'0 0 28px' }}>
          Your password has been updated. Sign in with your new password.
        </p>
        <button onClick={onBack} style={S.btn}>Back to Sign In →</button>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function AdminLogin({ onLogin, adminSettings }) {
  // adminSettings from Firestore — mirrors to localStorage so sub-components can read it
  if (adminSettings?.password) { localStorage.setItem('opt_admin_creds', JSON.stringify({ username: adminSettings.username, password: adminSettings.password })); }
  if (adminSettings?.recoveryEmail) { localStorage.setItem('opt_admin_recovery', JSON.stringify({ email: adminSettings.recoveryEmail })); }
  const [step,    setStep]    = useState('login');
  const [otp,     setOtp]     = useState('');
  const [method,  setMethod]  = useState('');
  const [contact, setContact] = useState('');

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      padding:20, position:'relative', overflow:'hidden',
      background:'linear-gradient(135deg,#1a0000 0%,#4a0000 45%,#8f0a00 100%)' }}>

      {/* Decorative rings */}
      <div style={{ position:'absolute', top:-130, right:-130, width:420, height:420, borderRadius:'50%',
        border:'1px solid rgba(255,255,255,0.05)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:-100, left:-80, width:300, height:300, borderRadius:'50%',
        border:'1px solid rgba(255,255,255,0.04)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', inset:0,
        backgroundImage:'radial-gradient(circle at 15% 85%,rgba(192,57,43,.18) 0%,transparent 55%)',
        pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth: step==='new-pass' ? 440 : 400 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:26 }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center',
            width:70, height:70, borderRadius:'50%', backdropFilter:'blur(8px)',
            background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)',
            marginBottom:13 }}>
            <img src={optLogo} alt="OPT" style={{ width:46, height:46, objectFit:'contain' }}/>
          </div>
          <div style={{ color:'#fff', fontSize:19, fontWeight:800, letterSpacing:1 }}>OPT Admin</div>
          <div style={{ color:'rgba(255,255,255,0.38)', fontSize:11, marginTop:3, letterSpacing:2, textTransform:'uppercase' }}>
            Content Management System
          </div>
        </div>

        {/* Step renderer */}
        {step === 'login'    && <StepLogin onLogin={onLogin} onForgot={() => setStep('forgot-pick')} />}
        {step === 'forgot-pick' && (
          <StepForgotPick
            onBack={() => setStep('login')}
            onSendOtp={(o, m, c) => { setOtp(o); setMethod(m); setContact(c); setStep('otp'); }}
          />
        )}
        {step === 'otp'      && (
          <StepOtp
            method={method} contact={contact} expected={otp}
            onBack={() => setStep('forgot-pick')}
            onVerified={() => setStep('new-pass')}
          />
        )}
        {step === 'new-pass' && <StepNewPassword onDone={() => setStep('success')} />}
        {step === 'success'  && <StepSuccess onBack={() => setStep('login')} />}

        <p style={{ textAlign:'center', fontSize:11, color:'rgba(255,255,255,.22)', marginTop:16 }}>
          Ohtsuka Poly-Tech Philippines, Inc. © {new Date().getFullYear()}
        </p>
      </div>

      <style>{`
        @keyframes opt-in    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes opt-shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 40%{transform:translateX(7px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
      `}</style>
    </div>
  );
}