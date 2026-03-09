import React, { useEffect, useRef, useState } from "react";

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

/* ── Certifications ── */
const certs = [
  { code: "ISO 9001",   label: "Quality Management" },
  { code: "ISO 14001",  label: "Environmental Management" },
  { code: "IATF 16949", label: "Automotive Quality" },
  { code: "5S",         label: "Workplace Excellence" },
];

/* ── Partners ── */
const allPartners = [
  { name: "BIGMATE PHILIPPINES INC." },
  { name: "F.TECH PHILIPPINES MFG., INC." },
  { name: "FCC (PHILIPPINES) CORP." },
  { name: "FURUKAWA ELECTRIC AUTOPARTS PHILS." },
  { name: "HARADA AUTOMOTIVE ANTENNA PHILS." },
  { name: "HIBLOW PHILIPPINES INC." },
  { name: "HKT PHILIPPINES INC." },
  { name: "HONDA CARS PHILIPPINES INC." },
  { name: "HONDA PARTS MFG. CORP." },
  { name: "HONDA PHILIPPINES INC." },
  { name: "HONDA TRADING PHILIPPINES ECOZONE" },
  { name: "KYUSHU F.TECH INC." },
  { name: "LAGUNA AUTO-PARTS MFG. CORP." },
  { name: "MEC ELECTRONICS PHILS. CORP." },
  { name: "MITSUBA PHILIPPINES CORPORATION" },
  { name: "MUBEA DO BRASIL" },
  { name: "MUBEA INC." },
  { name: "OHTSUKA POLY-TECH CO., LTD." },
  { name: "PT MINEBEA ACCESSSOLUTIONS INDONESIA" },
  { name: "PT. MAHLE INDONESIA" },
  { name: "RYONAN ELECTRIC PHILIPPINES CORP." },
  { name: "SANDEN INTERNATIONAL PHILIPPINES" },
  { name: "SHANGHAI O.P.T RUBBER & PLASTIC" },
  { name: "SHANGHAI RI SHANG AUTO RUBBER CO." },
  { name: "SIIX EMS PHILIPPINES, INC." },
  { name: "SUNCHIRIN INDUSTRIES (MALAYSIA)" },
  { name: "TAIYO CORPORATION" },
  { name: "TOYOTA AISIN PHILIPPINES, INC." },
  { name: "TOYOTA MOTORS PHILIPPINES CORP." },
  { name: "TOYU INDUSTRIES (THAILAND) CO., LTD." },
  { name: "TRITON INDUSTRIAL PLASTIC MFG. CORP." },
  { name: "WISTAR CORPORATION" },
];
const rowOne   = allPartners.slice(0, 8);
const rowTwo   = allPartners.slice(8, 16);
const rowThree = allPartners.slice(16, 24);
const rowFour  = allPartners.slice(24, 32);

/* ── Reveal wrapper ── */
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

  /* ── Legal notice ── */
  const [showNotice, setShowNotice] = useState(false);
  useEffect(() => {
    const accepted = localStorage.getItem("opt_notice_accepted");
    if (!accepted) { setShowNotice(true); document.body.style.overflow = "hidden"; }
  }, []);
  const handleAcceptNotice = () => {
    localStorage.setItem("opt_notice_accepted", "true");
    setShowNotice(false);
    document.body.style.overflow = "auto";
  };

  /* ── Generic reveal observer ── */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right, .reveal-pop");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── WHO WE ARE — text stagger on section enter only ── */
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
    <div className="home-page mt-5 pt-5">

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

      {/* ── WHO WE ARE — split-screen, image always fully visible ── */}
      <section className="wwa-section" ref={wwaRef}>

        {/* LEFT — sticky text panel */}
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

        {/* RIGHT — image always fully visible, no curtain */}
        <div className="wwa-right-panel">
          <div className="wwa-image" style={{ backgroundImage: `url(${whoImage})` }} />
          {/* Left-edge gradient so image blends into text panel */}
          <div className="wwa-image-scrim" />
          {/* Decorative corner frame */}
          <div className="wwa-corner-frame" />
          {/* Year badge */}
          <div className="wwa-badge">
            <span className="wwa-badge-year">1948</span>
            <span className="wwa-badge-line" />
            <span className="wwa-badge-text">Founded<br/>in Japan</span>
          </div>
          {/* Floating accent pill top-right */}
          <div className="wwa-float-pill">
            <span className="wwa-float-num">75<sup>+</sup></span>
            <span className="wwa-float-label">Years of Excellence</span>
          </div>
        </div>

      </section>

      {/* ── SEPARATOR: Who We Are → Products ── */}
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

      {/* ── SEPARATOR: Products → Why Choose Us ── */}
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

      {/* ── SEPARATOR: Why → Industries ── */}
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

      {/* ── SEPARATOR: Industries → Certifications ── */}
      <div className="sep sep--industries-to-certs" />

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
          <div className="certs-grid">
            {certs.map((c, i) => (
              <Reveal key={i} direction="pop" delay={i + 1}>
                <div className="cert-card">
                  <div className="cert-code">{c.code}</div>
                  <div className="cert-divider" />
                  <div className="cert-label">{c.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEPARATOR: Certifications → Partners ── */}
      <div className="sep sep--certs-to-partners" />

      {/* ── PARTNERS ── */}
      <section className="partners-section">
        <div className="container">
          <Reveal direction="up">
            <div className="section-label">Global Network</div>
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

      {/* ── SEPARATOR: Partners → CTA ── */}
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