import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import optLogo from '../../assets/images/opt_logo.png';

// ─── Inline SVG icons ─────────────────────────────────────────────────────────
const Icons = {
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  about: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>

  ),
  
  products: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
    </svg>
  ),
  activities: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  ),
  careers: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/>
      <line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  arrow: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  firebase: (
    <svg width="14" height="14" viewBox="0 0 32 32" fill="currentColor">
      <path d="M19.62 11.558l-3.203 2.98-2.972-5.995 1.538-3.448c.4-.7 1.024-.692 1.414 0z" fill="#FFA000"/>
      <path d="M13.445 8.543l2.972 5.995-11.97 11.135z" fill="#F57F17"/>
      <path d="M23.123 7.003c.572-.55 1.164-.362 1.315.417l3.116 18.105-10.328 6.2c-.36.2-1.32.286-1.32.286s-.874-.104-1.207-.3L4.447 25.673z" fill="#FFCA28"/>
      <path d="M13.445 8.543l-8.997 17.13L8.455 6.802c.148-.78.73-.924 1.294-.32z" fill="#FFA000"/>
    </svg>
  ),
};

// ─── Page definitions ─────────────────────────────────────────────────────────
const PAGES = [
  { path:'/admin/home',       label:'Home',       sub:'Certs & partners',    icon:'home',       color:'#c0392b', bg:'#fff5f5', border:'#fecaca' },
  { path:'/admin/about',      label:'About Us',   sub:'Factories & team',    icon:'about',      color:'#b45309', bg:'#fffbeb', border:'#fde68a' },
  { path:'/admin/products',   label:'Products',   sub:'Parts & hotspots',    icon:'products',   color:'#1d4ed8', bg:'#eff6ff', border:'#bfdbfe' },
  { path:'/admin/activities', label:'Activities', sub:'Events & CSR',        icon:'activities', color:'#0f766e', bg:'#f0fdf4', border:'#86efac' },
  { path:'/admin/careers',    label:'Careers',    sub:'Job openings',        icon:'careers',    color:'#7c3aed', bg:'#f5f3ff', border:'#c4b5fd' },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useStatGroups(state) {
  return useMemo(() => [
    { key:'home',       color:'#c0392b', label:'Home',       items:[{l:'Certifications',v:state.home.certifications.length},{l:'Partners',v:state.home.partners.length}] },
    { key:'about',      color:'#b45309', label:'About Us',   items:[{l:'Factories',v:state.about.factories.length},{l:'Team',v:state.about.organization.length},{l:'History',v:state.about.history.length},{l:'Bases',v:state.about.bases.length}] },
    { key:'products',   color:'#1d4ed8', label:'Products',   items:[{l:'Auto Parts',v:state.products.parts.length},{l:'Motor Parts',v:(state.products.motorParts||[]).length}] },
    { key:'activities', color:'#0f766e', label:'Activities', items:[{l:'Videos',v:state.activities.posts.length}] },
    { key:'careers',    color:'#7c3aed', label:'Careers',    items:[{l:'Positions',v:state.careers.jobs.length}] },
  ], [state]);
}

function useTotalItems(state) {
  return useMemo(() => (
    state.home.certifications.length + state.home.partners.length +
    state.about.factories.length + state.about.organization.length +
    state.about.history.length + state.about.bases.length +
    state.about.management.length + state.products.parts.length +
    (state.products.motorParts||[]).length +
    state.activities.posts.length + state.careers.jobs.length
  ), [state]);
}

// ─── Components ───────────────────────────────────────────────────────────────

function WelcomeBanner({ total, saveStatus }) {
  const creds    = JSON.parse(localStorage.getItem('opt_admin_creds') || 'null');
  const username = creds?.username || 'Admin';
  const h        = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const statusMeta = {
    saved:  { dot:'#4ade80', glow:'#4ade8066', label:'All changes saved to Firebase' },
    saving: { dot:'#fbbf24', glow:'#fbbf2466', label:'Saving to Firebase…' },
    error:  { dot:'#f87171', glow:'#f8717166', label:'Save error — check connection' },
  }[saveStatus || 'saved'];

  return (
    <div style={{
      background:'linear-gradient(135deg,#1a0000 0%,#5c0a00 50%,#8f0a00 100%)',
      borderRadius:20, padding:'28px 32px', marginBottom:24,
      display:'flex', alignItems:'center', justifyContent:'space-between', gap:16,
      position:'relative', overflow:'hidden',
      boxShadow:'0 4px 24px rgba(192,57,43,0.2)',
    }}>
      {/* decorative rings */}
      {[{s:260,t:-80,r:-80},{s:150,t:-40,r:-40}].map((r,i)=>(
        <div key={i} style={{ position:'absolute',top:r.t,right:r.r,width:r.s,height:r.s,
          borderRadius:'50%',border:'1px solid rgba(255,255,255,0.07)',pointerEvents:'none'}}/>
      ))}
      <div style={{position:'absolute',bottom:-50,left:200,width:180,height:180,
        borderRadius:'50%',background:'rgba(192,57,43,0.12)',pointerEvents:'none'}}/>

      {/* left text */}
      <div style={{ position:'relative', zIndex:1 }}>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12.5, margin:'0 0 4px' }}>{greeting},</p>
        <h1 style={{ color:'#fff', fontSize:28, fontWeight:900, margin:'0 0 8px', letterSpacing:-0.5, lineHeight:1.1 }}>
          {username.charAt(0).toUpperCase() + username.slice(1)} 👋
        </h1>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, margin:'0 0 16px' }}>
          Managing <strong style={{color:'rgba(255,255,255,0.85)'}}>{total} content items</strong> across the OPT website.
        </p>
        {/* status pill */}
        <div style={{
          display:'inline-flex', alignItems:'center', gap:7,
          background:'rgba(0,0,0,0.2)', border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:20, padding:'5px 13px',
        }}>
          <div style={{
            width:7, height:7, borderRadius:'50%',
            background: statusMeta.dot, boxShadow:`0 0 8px ${statusMeta.glow}`,
          }}/>
          <span style={{ color:'rgba(255,255,255,0.6)', fontSize:11.5, display:'flex', alignItems:'center', gap:5 }}>
            <span style={{color:'rgba(255,255,255,0.4)'}}>{Icons.firebase}</span>
            {statusMeta.label}
          </span>
        </div>
      </div>

      {/* right logo */}
      <div style={{ position:'relative', zIndex:1, textAlign:'center', flexShrink:0 }}>
        <div style={{
          width:72, height:72, borderRadius:'50%',
          background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(255,255,255,0.15)',
          display:'flex', alignItems:'center', justifyContent:'center',
          backdropFilter:'blur(10px)', marginBottom:8,
        }}>
          <img src={optLogo} alt="OPT" style={{ width:46, height:46, objectFit:'contain' }}/>
        </div>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:10, letterSpacing:2, textTransform:'uppercase' }}>
          CMS Admin
        </p>
      </div>
    </div>
  );
}

// Bento stats layout
function StatsBento({ groups, total }) {
  const S = {
    card: {
      background:'#fff', border:'1px solid #e5e7eb', borderRadius:14,
      overflow:'hidden', position:'relative',
    },
    accent: { height:3, borderRadius:'14px 14px 0 0', marginBottom:14 },
    sectionLbl: { fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:1, marginBottom:10 },
    num: { fontSize:32, fontWeight:900, color:'#111827', lineHeight:1, letterSpacing:-1.5 },
    lbl: { fontSize:10.5, color:'#9ca3af', marginTop:4, fontWeight:500, textTransform:'uppercase', letterSpacing:0.5 },
  };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap:10, marginBottom:24 }}>

      {/* Total */}
      <div style={{ ...S.card, gridColumn:'span 3', padding:'18px 20px' }}>
        <div style={{ ...S.accent, background:'linear-gradient(90deg,#c0392b,#8f0a00)' }}/>
        <div style={{ fontSize:10, fontWeight:800, color:'#c0392b', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Total</div>
        <div style={{ fontSize:52, fontWeight:900, color:'#111827', lineHeight:1, letterSpacing:-3 }}>{total}</div>
        <div style={{ fontSize:11, color:'#9ca3af', marginTop:6 }}>items managed</div>
      </div>

      {/* Home */}
      <div style={{ ...S.card, gridColumn:'span 3', padding:'18px 20px' }}>
        <div style={{ ...S.accent, background:'#c0392b' }}/>
        <div style={{ ...S.sectionLbl, color:'#c0392b' }}>Home</div>
        <div style={{ display:'flex', gap:20 }}>
          {groups[0].items.map(i=>(
            <div key={i.l}><div style={S.num}>{i.v}</div><div style={S.lbl}>{i.l}</div></div>
          ))}
        </div>
      </div>

      {/* About */}
      <div style={{ ...S.card, gridColumn:'span 6', padding:'18px 20px' }}>
        <div style={{ ...S.accent, background:'#b45309' }}/>
        <div style={{ ...S.sectionLbl, color:'#b45309' }}>About Us</div>
        <div style={{ display:'flex', gap:20 }}>
          {groups[1].items.map(i=>(
            <div key={i.l}><div style={S.num}>{i.v}</div><div style={S.lbl}>{i.l}</div></div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div style={{ ...S.card, gridColumn:'span 3', padding:'18px 20px' }}>
        <div style={{ ...S.accent, background:'#1d4ed8' }}/>
        <div style={{ ...S.sectionLbl, color:'#1d4ed8' }}>Products</div>
        <div style={{ display:'flex', gap:20 }}>
          {groups[2].items.map(i=>(
            <div key={i.l}><div style={S.num}>{i.v}</div><div style={S.lbl}>{i.l}</div></div>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div style={{ ...S.card, gridColumn:'span 3', padding:'18px 20px' }}>
        <div style={{ ...S.accent, background:'#0f766e' }}/>
        <div style={{ ...S.sectionLbl, color:'#0f766e' }}>Activities</div>
        {groups[3].items.map(i=>(
          <div key={i.l}><div style={{...S.num, fontSize:38}}>{i.v}</div><div style={S.lbl}>{i.l}</div></div>
        ))}
      </div>

      {/* Careers */}
      <div style={{ ...S.card, gridColumn:'span 3', padding:'18px 20px' }}>
        <div style={{ ...S.accent, background:'#7c3aed' }}/>
        <div style={{ ...S.sectionLbl, color:'#7c3aed' }}>Careers</div>
        {groups[4].items.map(i=>(
          <div key={i.l}><div style={{...S.num, fontSize:38}}>{i.v}</div><div style={S.lbl}>{i.l}</div></div>
        ))}
      </div>

    </div>
  );
}

function NavCard({ page, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? page.bg : '#fff',
        border: `1.5px solid ${hov ? page.color + '50' : '#e5e7eb'}`,
        borderRadius:14, padding:'18px 20px', cursor:'pointer',
        transition:'all .16s ease',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hov ? `0 6px 20px ${page.color}18` : '0 1px 3px rgba(0,0,0,0.05)',
        display:'flex', alignItems:'flex-start', gap:14,
      }}
    >
      <div style={{
        width:42, height:42, borderRadius:11, flexShrink:0,
        background: hov ? page.color : page.bg,
        border: `1px solid ${page.border}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        color: hov ? '#fff' : page.color,
        transition:'all .16s',
      }}>
        {Icons[page.icon]}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:14, fontWeight:700, color:'#111827', marginBottom:2 }}>{page.label}</div>
        <div style={{ fontSize:12, color:'#9ca3af', lineHeight:1.4 }}>{page.sub}</div>
      </div>
      <div style={{
        color: hov ? page.color : '#d1d5db', transition:'all .16s',
        transform: hov ? 'translateX(3px)' : 'none', flexShrink:0, marginTop:2,
      }}>
        {Icons.arrow}
      </div>
    </div>
  );
}

function TipCard() {
  const tips = [
    'Every change saves to Firebase within 1 second — visible on all devices instantly.',
    'Upload images through the admin — they\'re auto-compressed to keep your site fast.',
    'Use Export JSON in the sidebar regularly as a backup of all your content.',
    'Add your backup email in Settings so you can recover your password anytime.',
    'Edit pin positions in Products by adjusting the % values directly in the part editor.',
  ];
  const tip = tips[new Date().getDate() % tips.length];
  return (
    <div style={{
      background:'linear-gradient(135deg,#f0f9ff,#e0f2fe)',
      border:'1px solid #bae6fd', borderRadius:14,
      padding:'15px 20px', display:'flex', alignItems:'center', gap:14,
    }}>
      <div style={{
        width:38, height:38, borderRadius:10, flexShrink:0,
        background:'#0369a1', display:'flex', alignItems:'center',
        justifyContent:'center', fontSize:18,
      }}>
        💡
      </div>
      <div>
        <div style={{ fontSize:10.5, fontWeight:800, color:'#0369a1', textTransform:'uppercase', letterSpacing:1, marginBottom:3 }}>
          Tip of the day
        </div>
        <div style={{ fontSize:13, color:'#0c4a6e', lineHeight:1.55 }}>{tip}</div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize:10.5, fontWeight:800, color:'#9ca3af',
      textTransform:'uppercase', letterSpacing:1.5, marginBottom:12,
    }}>
      {children}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { state, saveStatus } = useCMS();
  const navigate   = useNavigate();
  const statGroups = useStatGroups(state);
  const total      = useTotalItems(state);

  return (
    <div style={{ maxWidth:1080 }}>

      <WelcomeBanner total={total} saveStatus={saveStatus} />

      <SectionLabel>Content overview</SectionLabel>
      <StatsBento groups={statGroups} total={total} />

      <SectionLabel>Manage pages</SectionLabel>
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',
        gap:10, marginBottom:20,
      }}>
        {PAGES.map(p => (
          <NavCard key={p.path} page={p} onClick={() => navigate(p.path)} />
        ))}
      </div>

      <TipCard />

    </div>
  );
}