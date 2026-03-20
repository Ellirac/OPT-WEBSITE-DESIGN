import React, { useState, useEffect } from "react";
import "../styles/Career.css";
import { useCMS } from "../admin/context/CMSContext";

function JobModal({ job, onClose }) {
  if (!job) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <div className="modal-card-title-bar">
          <span className="modal-badge-inline">{job.jobType || "Full-Time"}</span>
          <h2 className="modal-card-heading">{job.title}</h2>
          {job.date && <p className="modal-card-date">📅 Posted: {job.date}</p>}
        </div>
        <div className="modal-body">
          {job.qualifications?.length > 0 && (
            <div className="modal-section">
              <h3 className="modal-section-title"><span>✅</span> Qualifications</h3>
              <ul className="modal-list">
                {job.qualifications.map((q, i) => <li key={i} className="modal-list-item">{q}</li>)}
              </ul>
            </div>
          )}
          {job.experience && (
            <div className="modal-section">
              <h3 className="modal-section-title"><span>💼</span> Experience</h3>
              <p className="modal-text">{job.experience}</p>
            </div>
          )}
          {job.requirements?.length > 0 && (
            <div className="modal-section">
              <h3 className="modal-section-title"><span>📋</span> Requirements</h3>
              <ul className="modal-list">
                {job.requirements.map((r, i) => <li key={i} className="modal-list-item">{r}</li>)}
              </ul>
            </div>
          )}
          {job.benefits?.length > 0 && (
            <div className="modal-section">
              <h3 className="modal-section-title"><span>🎁</span> Benefits</h3>
              <ul className="modal-list">
                {job.benefits.map((b, i) => <li key={i} className="modal-list-item">{b}</li>)}
              </ul>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <p className="modal-footer-note">
            📧 Send your resume to <strong>hr@optphils.com.ph</strong> and indicate the position you're applying for.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Career() {
  const { state } = useCMS();
  const jobs = state.careers.jobs;
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    document.body.style.overflow = selectedJob ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedJob]);

  return (
    <>
      <div className="career-hero">
        <div className="hero-deco tl" />
        <div className="hero-deco br" />
        <div className="career-hero-overlay">
          <span className="hero-eyebrow">Join Our Team</span>
          <h1>Careers</h1>
          <p>Join Ohtsuka Poly-Tech Philippines, Inc. and grow your career in a dynamic and fast-paced environment.</p>
        </div>
      </div>

      <div className="career-container">
        <div className="career-intro">
          <p>Ohtsuka Poly-Tech Philippines, Inc. is currently looking for passionate and career-driven individuals. Check out the available positions below and submit your resume.</p>
          <p className="career-email-note">📧 Email your resume to <strong>hr@optphils.com.ph</strong> and indicate the position you are applying for.</p>
        </div>

        <div className="career-jobs">
          <div className="career-jobs-inner">
            <div className="section-heading">
              <div className="sh-dot" />
              <h2>Available Positions</h2>
              <div className="sh-line" />
            </div>
          </div>
          <table>
            <thead><tr><th>Job Title</th><th>Date Posted</th></tr></thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr key={job.id}>
                  <td>
                    <span className="job-row-num">{index + 1}</span>
                    <span className="job-title-link" onClick={() => setSelectedJob(job)}>{job.title}</span>
                  </td>
                  <td><span className="date-chip">📅 {job.date}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="career-form-section">
          <div className="section-heading">
            <div className="sh-dot" />
            <h2>Apply Now</h2>
            <div className="sh-line" />
          </div>
          <p>Fill-up the form below or email your resume to <strong style={{ color:"#b30000" }}>hr@optphils.com.ph</strong></p>
          <form className="career-form">
            <div className="form-row">
              <input type="text" placeholder="First Name" required />
              <input type="text" placeholder="Last Name" required />
            </div>
            <div className="form-row">
              <input type="email" placeholder="Email Address" required />
              <input type="text" placeholder="Contact Number" required />
            </div>
            <select required defaultValue="">
              <option value="" disabled>— Select Position Applying For —</option>
              {jobs.map(j => <option key={j.id}>{j.title}</option>)}
            </select>
            <input type="file" />
            <textarea placeholder="Message (optional)" rows="4" />
            <button type="submit">Submit Application →</button>
          </form>
        </div>

        <div className="career-contact">
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <div className="contact-label">Address</div>
            <div className="contact-value">Block 5 Lot 1 Binary St., LISPP-1 SEPZ,<br />Bo. Diezmo, Cabuyao, Laguna 4025</div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <div className="contact-label">Phone</div>
            <div className="contact-value">(049) 543-0622 / 23</div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">✉️</span>
            <div className="contact-label">Email</div>
            <div className="contact-value">hr@optphils.com.ph</div>
          </div>
        </div>
      </div>

      <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </>
  );
}
