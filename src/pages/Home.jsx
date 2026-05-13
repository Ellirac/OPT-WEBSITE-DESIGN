import React, { useEffect, useRef, useState } from "react";
import { useCMS } from "../admin/context/CMSContext";

import "../styles/Home.css";
import heroVideo from "../assets/videos/OPT COVER.mp4";
import whoImage from "../assets/images/wwa.jpg";

/* ── Intersection observer hook ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── Products data ── */
const products = [
  {
    num: "01",
    title: "Automobile Products",
    desc: "Precision rubber & plastic components engineered for leading automobile manufacturers worldwide.",
    link: "/products",
  },
  {
    num: "02",
    title: "Motorcycle Products",
    desc: "High-quality rubber & plastic parts specifically designed for motorcycle manufacturers.",
    link: "/products",
  },
];

/* ── Why Choose Us ── */
const whyUs = [
  { num: "01", title: "Japanese Technology",   desc: "Backed by Ohtsuka Poly-Tech Co. Ltd Japan — over 75 years of manufacturing excellence." },
  { num: "02", title: "Quality Assured",        desc: "Strict quality control at every production stage, meeting international automotive standards." },
  { num: "03", title: "Global Reach",           desc: "Supplying to every major vehicle and engine manufacturer across the world." },
  { num: "04", title: "Advanced Production",    desc: "State-of-the-art facilities in Cabuyao, Laguna and Malvar, Batangas." },
  { num: "05", title: "Long-term Partnerships", desc: "Decades of trust built with global automotive and appliance brands." },
  { num: "06", title: "On-time Delivery",       desc: "Reliable logistics and supply chain management to meet your production schedule." },
];

/* ── Industries ── */
const industries = [
  { num: "01", label: "Automobile" },
  { num: "02", label: "Automotive" },
  { num: "03", label: "Electrical" },
  { num: "04", label: "Household" },
  { num: "05", label: "Industrial" },
];

/* ── CMS data replaces hardcoded certs and partners (see useCMS below) ── */

function Reveal({ children, direction = "up", delay = 0, className = "" }) {
  const [ref, inView] = useInView(0.12);
  const dirClass = { up: "reveal-up", left: "reveal-left", right: "reveal-right", pop: "reveal-pop" }[direction] || "reveal-up";
  const delayClass = delay ? `delay-${delay}` : "";
  return (
    <div ref={ref} className={`${dirClass} ${inView ? "visible" : ""} ${delayClass} ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  /* ── CMS data ── */
  const { state } = useCMS();
  const certs       = state.home.certifications;
  const allPartners = state.home.partners;
  const offices     = state.home.offices ?? [];

  /* ── Normalise Drive image URLs ──────────────────────────────────────────────
     Old records stored `uc?export=view` URLs which don't render in <img> tags.
     Extract the file ID and convert to the thumbnail API which always works.    */
  const driveImgSrc = (url, size = 'w800') => {
    if (!url) return null;
    const m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=${size}`;
    return url;
  };

  // If thumbnail API fails → retry with uc?export=view (different Drive code-path)
  const driveImgError = (e, url) => {
    const m = url && (url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/));
    if (m && !e.target.dataset.fallback) {
      e.target.dataset.fallback = '1';
      e.target.src = `https://drive.google.com/uc?export=view&id=${m[1]}`;
    } else {
      e.target.style.opacity = '0.3'; // show broken gracefully
    }
  };

  /* ── Certificate lightbox ── */
  const [selectedCert, setSelectedCert] = useState(null);
  // Dynamic rows — works for any partner count
  const chunkSize = 8;
  const partnerRows = [];
  for (let i = 0; i < allPartners.length; i += chunkSize) {
    partnerRows.push(allPartners.slice(i, i + chunkSize));
  }
  while (partnerRows.length < 4) partnerRows.push([]);
  const [rowOne, rowTwo, rowThree, rowFour] = partnerRows;

  /* ── Legal notice ── */
  const [showNotice, setShowNotice] = useState(false);
  useEffect(() => {
    const accepted = localStorage.getItem("opt_notice_accepted");
    if (!accepted) { setShowNotice(true); document.body.style.overflow = "hidden"; }
  }, []);

  // ESC closes cert lightbox
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSelectedCert(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  const handleAcceptNotice = () => {
    localStorage.setItem("opt_notice_accepted", "true");
    setShowNotice(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const els = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right, .reveal-pop");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── WHO WE ARE ── */
  const wwaRef = useRef(null);
  useEffect(() => {
    const section = wwaRef.current;
    if (!section) return;
    const textEls = section.querySelectorAll(".wwa-animate");
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          textEls.forEach((el, i) => {
            setTimeout(() => el.classList.add("wwa-in"), i * 110);
          });
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="home-page">

      {/* ── Legal Entry Notice ── */}
      {showNotice && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.78)", backdropFilter: "blur(10px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
        }}>
          <div style={{ background: "#fff", maxWidth: "520px", width: "100%", padding: "44px 40px 36px", boxShadow: "0 24px 80px rgba(0,0,0,0.35)" }}>
            <p style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", color: "#c0392b", marginBottom: "12px" }}>
              Notice &amp; Data Protection Policy
            </p>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0d1117", marginBottom: "6px", lineHeight: 1.2, fontFamily: "'Playfair Display', serif" }}>
              Before You Continue
            </h3>
            <div style={{ width: "32px", height: "2px", background: "#c0392b", margin: "12px 0 22px" }} />
            <p style={{ fontSize: "13.5px", color: "#555", lineHeight: "1.8", marginBottom: "14px" }}>
              This website contains proprietary information, images, and materials owned by{" "}
              <strong>Ohtsuka Poly-Tech Philippines, Inc.</strong>
            </p>
            <p style={{ fontSize: "13.5px", color: "#555", lineHeight: "1.8", marginBottom: "14px" }}>
              Unauthorized copying, reproduction, distribution, modification, or use of any company
              materials is <strong>strictly prohibited</strong> and may be punishable under:
            </p>
            <div style={{ background: "#f6f5f2", borderLeft: "3px solid #c0392b", padding: "12px 16px", marginBottom: "22px" }}>
              <p style={{ fontSize: "13px", color: "#333", margin: "0 0 6px", lineHeight: "1.6" }}>• <strong>Data Privacy Act of 2012</strong> (RA 10173)</p>
              <p style={{ fontSize: "13px", color: "#333", margin: 0, lineHeight: "1.6" }}>• <strong>Cybercrime Prevention Act of 2012</strong> (RA 10175)</p>
            </div>
            <p style={{ fontSize: "12.5px", color: "#999", lineHeight: "1.7", marginBottom: "26px" }}>
              By clicking <strong>"Continue"</strong>, you acknowledge and agree to these terms.
            </p>
            <button onClick={handleAcceptNotice}
              style={{ background: "#c0392b", color: "#fff", border: "none", padding: "13px 36px", fontWeight: 700, fontSize: "11px", cursor: "pointer", width: "100%", letterSpacing: "2px", textTransform: "uppercase", transition: "background 0.2s" }}
              onMouseEnter={e => e.target.style.background = "#8f0a00"}
              onMouseLeave={e => e.target.style.background = "#c0392b"}
            >
              Continue to Website
            </button>
          </div>
        </div>
      )}

      {/* ── HERO VIDEO ── */}
      <section className="hero-video-section">
        <video className="hero-video" src={heroVideo} autoPlay loop muted playsInline />
        <div className="hero-overlay" />
        <div className="container position-relative">
          <div className="hero-eyebrow">Ohtsuka Poly-Tech Philippines</div>
          <h1>Innovation<br />Molded to Perfection</h1>
          <p className="lead">
            Manufacturing Rubber &amp; Plastic Parts for Automobiles,<br />
            Electrical &amp; Household Appliances
          </p>
          <a href="/products" className="hero-btn-primary">Explore Our Products</a>
          <a href="/about" className="hero-btn-outline">About Us</a>
        </div>
      </section>

      {/* ── WHO WE ARE ── */}
      <section className="wwa-section" ref={wwaRef}>

        <div className="wwa-left-panel">
          <div className="wwa-left-inner">

            <div className="wwa-animate wwa-eyebrow-row">
              <span className="wwa-rule" />
              <span className="wwa-eyebrow-label">Who We Are</span>
            </div>

            <h2 className="wwa-animate wwa-heading">
              A Legacy<br />
              of <em>Precision</em><br />
              &amp; Innovation
            </h2>

            <p className="wwa-animate wwa-lead">
              An affiliate of <strong>OHTSUKA POLY-TECH CO. LTD</strong>, founded in Japan in 1948.
              Among the Philippines' leading manufacturers of rubber &amp; plastic parts for
              automobiles, electrical, and household appliances.
            </p>

            <p className="wwa-animate wwa-body">
              Our customers include every major vehicle and engine manufacturer in the world —
              a testament to decades of trust, precision engineering, and unwavering quality.
            </p>

            <div className="wwa-animate wwa-stats-row">
              <div className="wwa-stat">
                <span className="wwa-stat-n">1948</span>
                <span className="wwa-stat-l">Est. in Japan</span>
              </div>
              <div className="wwa-stat-sep" />
              <div className="wwa-stat">
                <span className="wwa-stat-n">75<sup>+</sup></span>
                <span className="wwa-stat-l">Years Excellence</span>
              </div>
              <div className="wwa-stat-sep" />
              <div className="wwa-stat">
                <span className="wwa-stat-n">3</span>
                <span className="wwa-stat-l">PH Plants</span>
              </div>
            </div>

            <a href="/about" className="wwa-animate wwa-cta">
              Discover About Us
              <span className="wwa-cta-icon">
                <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
                  <path d="M1 5h16M12 1l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>

          </div>
        </div>

        <div className="wwa-right-panel">
          <div className="wwa-image" style={{ backgroundImage: `url(${whoImage})` }} />
          <div className="wwa-image-scrim" />
          <div className="wwa-corner-frame" />
          <div className="wwa-badge">
            <span className="wwa-badge-year">1948</span>
            <span className="wwa-badge-line" />
            <span className="wwa-badge-text">Founded<br/>in Japan</span>
          </div>
          <div className="wwa-float-pill">
            <span className="wwa-float-num">75<sup>+</sup></span>
            <span className="wwa-float-label">Years of Excellence</span>
          </div>
        </div>

      </section>

      <div className="sep sep--wwa-to-products" />

      {/* ── PRODUCTS ── */}
      <section className="products-section">
        <div className="container">
          <Reveal direction="up">
            <div className="section-label">What We Make</div>
            <h2 className="section-title">Our Products &amp; Services</h2>
          </Reveal>
          <div className="products-grid">
            {products.map((p, i) => (
              <Reveal key={i} direction="pop" delay={i + 1}>
                <a href={p.link} className="product-card">
                  <span className="product-num">{p.num}</span>
                  <div className="product-title">{p.title}</div>
                  <p className="product-desc">{p.desc}</p>
                  <span className="product-arrow">View More →</span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="sep sep--products-to-why" />

      {/* ── WHY CHOOSE US ── */}
      <section className="why-section">
        <div className="container">
          <Reveal direction="up">
            <div className="section-label">Why OPT</div>
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-sub">
              Decades of expertise backed by Japanese engineering — delivering quality you can trust for every application.
            </p>
          </Reveal>
          <div className="why-grid">
            {whyUs.map((w, i) => (
              <Reveal key={i} direction="pop" delay={(i % 3) + 1}>
                <div className="why-card">
                  <span className="why-num">{w.num}</span>
                  <div className="why-title">{w.title}</div>
                  <p className="why-desc">{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="sep sep--why-to-industries" />

      {/* ── INDUSTRIES ── */}
      <section className="industries-section">
        <div className="container">
          <Reveal direction="up">
            <div className="section-label">Sectors</div>
            <h2 className="section-title">Industries We Serve</h2>
          </Reveal>
          <div className="industries-grid">
            {industries.map((ind, i) => (
              <Reveal key={i} direction="pop" delay={i + 1}>
                <div className="industry-card">
                  <span className="industry-num">{ind.num}</span>
                  <div className="industry-label">{ind.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="sep sep--industries-to-certs" />

      {/* ── OFFICES ── */}
      {offices.length > 0 && (
        <>
          <section className="offices-section">
            <div className="container">
              <Reveal direction="up">
                <h2 className="section-title">Our Offices</h2>
                <p className="section-sub">
                  Strategically located across the Philippines to serve our partners efficiently.
                </p>
              </Reveal>
            </div>

            {/* Marquee strip — scrolls left continuously */}
            <div className="offices-marquee-wrapper">
              <div className="offices-marquee-track">
                {[...offices, ...offices].map((office, i) => (
                  <div key={i} className="office-marquee-card">
                    <div className="office-marquee-img-wrap">
                      {office.img
                        ? <img src={driveImgSrc(office.img, 'w800')} alt={office.name} className="office-marquee-img" onError={e => driveImgError(e, office.img)} />
                        : <div className="office-img-placeholder">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                            </svg>
                          </div>
                      }
                      <div className="office-img-overlay" />
                      <div className="office-marquee-badge">0{(i % offices.length) + 1}</div>
                    </div>
                    <div className="office-info">
                      <div className="office-name">{office.name}</div>
                      {office.address && <div className="office-addr">{office.address}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <div className="sep sep--offices-to-certs" />
        </>
      )}

      {/* ── CERTIFICATIONS ── */}
      <section className="certs-section">
        <div className="container">
          <Reveal direction="up">
            <div className="section-label">Standards</div>
            <h2 className="section-title">Our Certifications</h2>
            <p className="section-sub">
              We adhere to the highest international standards to ensure consistent quality across all our products.
            </p>
          </Reveal>
        </div>

        {/* 1–2 certs → static, left-aligned | 3+ certs → marquee */}
        {certs.length < 3 ? (
          <div className="certs-static-wrapper">
            {certs.map((c) => (
              <div
                key={c.id}
                className={`cert-card${c.img ? ' cert-card--clickable' : ''}`}
                onClick={() => c.img && setSelectedCert(c)}
                style={{ cursor: c.img ? 'pointer' : 'default' }}
              >
                {c.img && (
                  <div className="cert-img-wrap">
                    <img src={driveImgSrc(c.img, 'w400')} alt={c.code} className="cert-img" onError={e => driveImgError(e, c.img)} />
                    <div className="cert-img-overlay" />
                  </div>
                )}
                <div className="cert-info">
                  <div className="cert-code">{c.code}</div>
                  <div className="cert-label">{c.label}</div>
                  {c.img && <div className="cert-view-hint">View Certificate →</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="certs-marquee-wrapper">
            <div className="certs-track">
              {[...certs, ...certs].map((c, i) => (
                <div
                  key={i}
                  className={`cert-card${c.img ? ' cert-card--clickable' : ''}`}
                  onClick={() => c.img && setSelectedCert(c)}
                  style={{ cursor: c.img ? 'pointer' : 'default' }}
                >
                  {c.img && (
                    <div className="cert-img-wrap">
                      <img src={driveImgSrc(c.img, 'w400')} alt={c.code} className="cert-img" onError={e => driveImgError(e, c.img)} />
                      <div className="cert-img-overlay" />
                    </div>
                  )}
                  <div className="cert-info">
                    <div className="cert-code">{c.code}</div>
                    <div className="cert-label">{c.label}</div>
                    {c.img && <div className="cert-view-hint">View Certificate →</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

          {/* Certificate Lightbox */}
          {selectedCert && (
            <div
              onClick={() => setSelectedCert(null)}
              style={{
                position:'fixed', inset:0, zIndex:9998,
                background:'rgba(0,0,0,0.92)', backdropFilter:'blur(6px)',
                display:'flex', alignItems:'center', justifyContent:'center',
                padding:24, animation:'certFadeIn 0.2s ease',
              }}
            >
              <div onClick={e => e.stopPropagation()} style={{ maxWidth:780, width:'100%', position:'relative' }}>
                {/* Header */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                  <div>
                    <div style={{ color:'#fff', fontSize:22, fontWeight:800, letterSpacing:'-0.3px' }}>
                      {selectedCert.code}
                    </div>
                    <div style={{ color:'rgba(255,255,255,0.55)', fontSize:13.5, marginTop:3 }}>
                      {selectedCert.label}
                      {selectedCert.issuedBy && <span style={{ color:'rgba(255,255,255,0.35)' }}> · {selectedCert.issuedBy}</span>}
                      {selectedCert.validUntil && <span style={{ color:'rgba(255,255,255,0.35)' }}> · Valid until {selectedCert.validUntil}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCert(null)}
                    style={{
                      background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)',
                      color:'#fff', borderRadius:8, padding:'7px 16px', cursor:'pointer',
                      fontSize:13.5, fontWeight:500, flexShrink:0, marginLeft:16,
                    }}
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Certificate image */}
                <div style={{
                  borderRadius:12, overflow:'hidden',
                  boxShadow:'0 32px 80px rgba(0,0,0,0.5)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <img
                    src={driveImgSrc(selectedCert.img, 'w1600')}
                    alt={selectedCert.code}
                    style={{ width:'100%', maxHeight:'75vh', objectFit:'cover', display:'block', borderRadius:12 }}
                    onError={e => driveImgError(e, selectedCert.img)}
                  />
                </div>

                {/* Navigation if multiple certs have images */}
                {certs.filter(c => c.img).length > 1 && (
                  <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:14 }}>
                    {certs.filter(c => c.img).map(c => (
                      <button
                        key={c.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedCert(c); }}
                        style={{
                          padding:'5px 14px', border:'1px solid',
                          borderColor: selectedCert.id === c.id ? '#c0392b' : 'rgba(255,255,255,0.2)',
                          background:  selectedCert.id === c.id ? '#c0392b'  : 'rgba(255,255,255,0.07)',
                          color:'#fff', borderRadius:20, fontSize:12.5, cursor:'pointer',
                          fontWeight: selectedCert.id === c.id ? 700 : 400,
                          transition:'all 0.15s',
                        }}
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                )}

                <p style={{ textAlign:'center', fontSize:12, color:'rgba(255,255,255,0.25)', marginTop:14 }}>
                  Click outside or press ESC to close
                </p>
              </div>
              <style>{`@keyframes certFadeIn{from{opacity:0}to{opacity:1}}`}</style>
            </div>
          )}
      </section>

      <div className="sep sep--certs-to-partners" />

      {/* ── PARTNERS ── */}
      <section className="partners-section">
        <div className="container">
          <Reveal direction="up">
            <div className="section-label">Our Customers</div>
            <h2 className="section-title">Trusted By Industry Leaders</h2>
          </Reveal>
        </div>
        <div className="partners-rows">
          {[rowOne, rowTwo, rowThree, rowFour].map((row, ri) => (
            <div className="partners-row-wrapper" key={ri}>
              <div className={`partners-track ${ri % 2 === 0 ? "row-ltr" : "row-rtl"}`}>
                {[...row, ...row].map((p, i) => (
                  <div key={i} className="partner-card">
                    <span className="partner-bullet">●</span>
                    <span className="partner-name">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="sep sep--partners-to-cta" />

      {/* ── CTA BANNER ── */}
      <section className="cta-section">
        <Reveal direction="up">
          <h2>Ready to Work Together?</h2>
          <p>Whether you're looking to partner, supply, or join our growing team — we'd love to hear from you.</p>
          <div className="cta-buttons">
            <a href="/contact" className="cta-btn-white">Contact Us</a>
            <a href="/careers" className="cta-btn-ghost">View Open Positions</a>
          </div>
        </Reveal>
      </section>

    </div>
  );
}