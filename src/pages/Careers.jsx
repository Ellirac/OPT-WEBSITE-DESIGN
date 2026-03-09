import React, { useState } from "react";

const jobList = [
  { title: "Company Driver", date: "01/06/2025" },
  { title: "Mechanical Engineer", date: "01/28/2025" },
  { title: "Molding Operator / Production Operator", date: "01/06/2025" },
  { title: "Electrical Engineer", date: "01/28/2025" },
];

const jobRequirement = [
  {
    title: "Company Driver",
    Qualification: [
      "Male",
      "23 to 40 Years old",
      "Must have valid Driver's License up to Restriction Code C (Large trucks)",
      "Familiar with the area of Metro Manila, Laguna and nearby provinces route",
      "Preferably with own motorcycle vehicle",
    ],
    Benefits: [
      "Meal allowance upon regularization",
      "Rice allowance upon regularization",
      "Transportation allowance",
      "HMO upon regularization",
      "Retirement Benefit",
    ],
    JobType: "Full-time",
    Experience: "Preferably with experience as a Company Driver",
  },
  {
    title: "Mechanical Engineer",
    Qualification: [
      "Candidate must possess at least Bachelor / College Degree of Mechanical Engineering",
      "With PRC License",
      "Newly board passers are welcome to apply",
      "Preferably with AutoCAD certification",
      "Knowledge in Microsoft Office applications",
      "Possess good analytical and problem-solving skills",
      "Must be excellent in presentation and communication skills",
    ],
    Benefits: [
      "Competitive Salary",
      "Meal allowance upon regularization",
      "Rice allowance upon regularization",
      "Transportation allowance (if with owned service)",
      "Free shuttle",
      "HMO upon regularization",
      "Retirement Benefit",
    ],
    JobType: "Full-time",
    Experience: "Preferably with experience as Mechanical Engineer",
  },
  {
    title: "Molding Operator / Production Operator",
    Qualification: [
      "Male",
      "23 to 35 Years Old",
      "At least Senior High school graduate or any vocational course",
      "With familiar in Manufacturing Process",
      "Willing to be assigned in Cabuyao, Laguna or Malvar, Batangas",
    ],
    Benefits: [
      "Minimum wage rate",
      "With Monthly Productivity Incentive",
      "Meal allowance upon regularization",
      "Rice allowance upon regularization",
      "Transportation allowance (if with owned service)",
      "Free shuttle",
      "HMO upon regularization",
      "Retirement Benefits",
    ],
    JobType: "Full-Time",
    Experience: "At least One (1) year experience in related as Mold Operator.",
  },
  {
    title: "Electrical Engineer",
    Qualification: [
      "Bachelor degree (Graduate of Electrical Engineer)",
      "With PRC license",
      "Newly board passers are welcome to apply",
      "Preferably with AutoCAD certification",
    ],
    Benefits: [
      "Competitive Salary",
      "Meal allowance upon regularization",
      "Rice allowance upon regularization",
      "Transportation allowance (if with owned service)",
      "Free shuttle",
      "HMO upon regularization",
      "Retirement Benefit",
    ],
    JobType: "Full-Time",
    Requirements: [
      "Experience in project development, design installation and startup",
      "Experience with design, installation, and maintenance of industrial power, lighting, and control systems",
      "Strong planning, organization, analytical, and troubleshooting skills with a high level of attention to detail",
    ],
  },
];

function JobModal({ job, onClose }) {
  if (!job) return null;
  const details = jobRequirement.find(
    (j) =>
      j.title.toLowerCase().includes(job.title.toLowerCase().split("/")[0].trim()) ||
      job.title.toLowerCase().includes(j.title.toLowerCase().split("/")[0].trim())
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-pattern" />
          <span className="modal-badge">{details?.JobType || "Full-Time"}</span>
          <h2 className="modal-title">{job.title}</h2>
          <p className="modal-date">📅 Posted: {job.date}</p>
        </div>
        <div className="modal-body">
          {details?.Qualification && (
            <div className="modal-section">
              <h3 className="modal-section-title"><span>✅</span> Qualifications</h3>
              <ul className="modal-list">
                {details.Qualification.map((q, i) => <li key={i} className="modal-list-item">{q}</li>)}
              </ul>
            </div>
          )}
          {details?.Experience && (
            <div className="modal-section">
              <h3 className="modal-section-title"><span>💼</span> Experience</h3>
              <p className="modal-text">{details.Experience}</p>
            </div>
          )}
          {details?.Requirements && (
            <div className="modal-section">
              <h3 className="modal-section-title"><span>📋</span> Requirements</h3>
              <ul className="modal-list">
                {details.Requirements.map((r, i) => <li key={i} className="modal-list-item">{r}</li>)}
              </ul>
            </div>
          )}
          {details?.Benefits && (
            <div className="modal-section">
              <h3 className="modal-section-title"><span>🎁</span> Benefits</h3>
              <ul className="modal-list">
                {details.Benefits.map((b, i) => <li key={i} className="modal-list-item">{b}</li>)}
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

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600;700&display=swap');

  * { box-sizing: border-box; }

  .career-page {
    font-family: 'Inter', sans-serif;
    color: #1a1a2e;
    background: #f8f7f4;
    min-height: 100vh;
  }

  /* ── HERO ── */
  .career-hero {
    margin-top: 90px;
    height: 200px;
    position: relative;
    overflow: hidden;
  }
  .career-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(130,0,0,0.85) 0%, rgba(15,15,35,0.78) 100%);
    z-index: 1;
  }
  .hero-deco {
    position: absolute;
    z-index: 2;
    width: 70px; height: 70px;
    border-color: rgba(255,255,255,0.18);
    border-style: solid;
  }
  .hero-deco.tl { top: 24px; left: 24px; border-width: 2px 0 0 2px; }
  .hero-deco.br { bottom: 24px; right: 24px; border-width: 0 2px 2px 0; }
  .career-hero-overlay {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20px;
    gap: 12px;
  }
  .hero-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: rgba(255,200,200,0.85);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .hero-eyebrow::before,
  .hero-eyebrow::after {
    content: '';
    display: block;
    width: 36px;
    height: 1px;
    background: rgba(255,170,170,0.45);
  }
  .career-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: 56px;
    color: #fff;
    line-height: 1.1;
    text-shadow: 0 4px 24px rgba(0,0,0,0.35);
    margin: 0;
  }
  .career-hero p {
    font-size: 15px;
    color: rgba(255,255,255,0.78);
    max-width: 480px;
    line-height: 1.7;
    font-weight: 300;
    margin: 0;
  }

  /* ── CONTAINER ── */
  .career-container {
    max-width: 980px;
    margin: 0 auto;
    padding: 60px 24px 80px;
    display: flex;
    flex-direction: column;
    gap: 56px;
  }

  /* ── SECTION HEADING ── */
  .section-heading {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 26px;
  }
  .section-heading h2 {
    font-family: 'Playfair Display', serif;
    font-size: 27px;
    color: #1a1a2e;
    white-space: nowrap;
  }
  .sh-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #b30000;
    flex-shrink: 0;
  }
  .sh-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, rgba(179,0,0,0.3), transparent);
  }

  /* ── INTRO ── */
  .career-intro {
    background: #fff;
    border-radius: 16px;
    padding: 36px 40px;
    border-left: 5px solid #b30000;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    line-height: 1.8;
    color: #555;
    font-size: 15px;
    position: relative;
    overflow: hidden;
  }
  .career-intro::after {
    content: '"';
    position: absolute;
    right: 28px; top: -8px;
    font-size: 130px;
    font-family: 'Playfair Display', serif;
    color: rgba(179,0,0,0.05);
    line-height: 1;
    pointer-events: none;
  }
  .career-intro p + p { margin-top: 12px; }
  .career-email-note {
    margin-top: 14px !important;
    font-weight: 600;
    color: #b30000 !important;
  }

  /* ── JOB TABLE ── */
  .career-jobs {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  }
  .career-jobs-inner { padding: 28px 32px 0; }
  .career-jobs table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 4px;
  }
  .career-jobs thead tr {
    background: linear-gradient(90deg, #b30000 0%, #880000 100%);
  }
  .career-jobs th {
    color: #fff;
    padding: 13px 28px;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .career-jobs td {
    padding: 15px 28px;
    border-bottom: 1px solid #f3f3f3;
    font-size: 14px;
    color: #555;
    transition: background 0.15s;
    vertical-align: middle;
  }
  .career-jobs tbody tr:last-child td { border-bottom: none; }
  .career-jobs tbody tr:hover td { background: #fff5f5; }
  .job-row-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px; height: 22px;
    border-radius: 50%;
    background: rgba(179,0,0,0.09);
    color: #b30000;
    font-size: 11px;
    font-weight: 700;
    margin-right: 10px;
    vertical-align: middle;
  }
  .job-title-link {
    color: #b30000;
    font-weight: 600;
    cursor: pointer;
    border-bottom: 1.5px dashed rgba(179,0,0,0.35);
    padding-bottom: 1px;
    transition: color 0.2s, border-color 0.2s;
    font-size: 14.5px;
  }
  .job-title-link:hover { color: #7a0000; border-color: #7a0000; }
  .date-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #f9f9f9;
    border: 1px solid #ebebeb;
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 12px;
    color: #888;
  }

  /* ── FORM ── */
  .career-form-section {
    background: #fff;
    border-radius: 16px;
    padding: 36px 40px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  }
  .career-form-section > p {
    font-size: 14px;
    color: #666;
    margin-bottom: 26px;
    line-height: 1.6;
  }
  .career-form {
    display: flex;
    flex-direction: column;
    gap: 13px;
  }
  .form-row { display: flex; gap: 13px; }
  .form-row input { flex: 1; }
  .career-form input,
  .career-form select,
  .career-form textarea {
    padding: 12px 16px;
    border: 1.5px solid #e6e6e6;
    border-radius: 10px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    color: #333;
    background: #fafafa;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    width: 100%;
    outline: none;
  }
  .career-form input:focus,
  .career-form select:focus,
  .career-form textarea:focus {
    border-color: #b30000;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(179,0,0,0.07);
  }
  .career-form input[type="file"] {
    padding: 10px 14px;
    background: #f6f6f6;
    border-style: dashed;
    color: #999;
    cursor: pointer;
  }
  .career-form textarea { resize: vertical; }
  .career-form button {
    background: linear-gradient(135deg, #c0392b, #850000);
    color: #fff;
    padding: 14px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 700;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.5px;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(179,0,0,0.28);
  }
  .career-form button:hover {
    opacity: 0.91;
    transform: translateY(-1px);
    box-shadow: 0 6px 22px rgba(179,0,0,0.34);
  }
  .career-form button:active { transform: translateY(0); }

  /* ── CONTACT ── */
  .career-contact {
    background: linear-gradient(135deg, #1a1a2e 0%, #0f1428 100%);
    border-radius: 16px;
    padding: 40px;
    color: #fff;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 30px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    position: relative;
    overflow: hidden;
  }
  .career-contact::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: rgba(179,0,0,0.1);
    pointer-events: none;
  }
  .career-contact::after {
    content: '';
    position: absolute;
    bottom: -50px; left: -50px;
    width: 160px; height: 160px;
    border-radius: 50%;
    background: rgba(179,0,0,0.07);
    pointer-events: none;
  }
  .contact-item { position: relative; z-index: 1; }
  .contact-icon { font-size: 22px; display: block; margin-bottom: 10px; }
  .contact-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(255,180,180,0.65);
    margin-bottom: 7px;
  }
  .contact-value {
    font-size: 14px;
    color: rgba(255,255,255,0.85);
    line-height: 1.65;
  }

  /* ── MODAL ── */
  @keyframes slideUp {
    from { transform: translateY(28px) scale(0.98); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(8,8,22,0.62);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }
  .modal-card {
    background: #fff;
    border-radius: 20px;
    max-width: 640px;
    width: 100%;
    max-height: 88vh;
    overflow-y: auto;
    box-shadow: 0 32px 80px rgba(0,0,0,0.42);
    animation: slideUp 0.28s cubic-bezier(0.22,1,0.36,1);
  }
  .modal-card::-webkit-scrollbar { width: 4px; }
  .modal-card::-webkit-scrollbar-track { background: transparent; }
  .modal-card::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
  .modal-header {
    background: linear-gradient(135deg, #c0392b 0%, #7a0000 100%);
    padding: 32px 34px 26px;
    border-radius: 20px 20px 0 0;
    position: relative;
    overflow: hidden;
  }
  .modal-header-pattern {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.09) 0%, transparent 50%),
      radial-gradient(circle at 10% 85%, rgba(0,0,0,0.12) 0%, transparent 40%);
    pointer-events: none;
  }
  .modal-badge {
    display: inline-block;
    background: rgba(255,255,255,0.18);
    border: 1px solid rgba(255,255,255,0.28);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 12px;
    position: relative;
  }
  .modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    color: #fff;
    margin: 0 0 8px;
    line-height: 1.3;
    position: relative;
  }
  .modal-date {
    font-size: 12.5px;
    color: rgba(255,255,255,0.62);
    margin: 0;
    position: relative;
  }
  .modal-body {
    padding: 26px 34px;
    display: flex;
    flex-direction: column;
  }
  .modal-section {
    padding: 18px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  .modal-section:last-child { border-bottom: none; }
  .modal-section-title {
    font-size: 11px;
    font-weight: 700;
    color: #b30000;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin: 0 0 13px;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .modal-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
  .modal-list-item {
    font-size: 14px;
    color: #444;
    line-height: 1.55;
    padding-left: 18px;
    position: relative;
  }
  .modal-list-item::before {
    content: '›';
    position: absolute;
    left: 0;
    color: #b30000;
    font-weight: 700;
    font-size: 17px;
    line-height: 1.15;
  }
  .modal-text { font-size: 14px; color: #444; line-height: 1.6; margin: 0; }
  .modal-footer {
    background: linear-gradient(to right, #fdf2f2, #fff9f9);
    border-top: 1px solid #f5e4e4;
    padding: 20px 34px;
    border-radius: 0 0 20px 20px;
  }
  .modal-footer-note { font-size: 13px; color: #666; margin: 0; line-height: 1.5; }
  .modal-footer-note strong { color: #b30000; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .career-hero { height: 300px; }
    .career-hero h1 { font-size: 36px; }
    .career-container { padding: 40px 16px 60px; gap: 36px; }
    .career-intro, .career-form-section { padding: 26px 22px; }
    .career-jobs-inner { padding: 22px 18px 0; }
    .career-jobs th, .career-jobs td { padding: 12px 18px; }
    .form-row { flex-direction: column; }
    .career-contact { grid-template-columns: 1fr; padding: 28px 26px; gap: 22px; }
    .modal-header { padding: 24px 22px 20px; }
    .modal-body { padding: 18px 22px; }
    .modal-footer { padding: 16px 22px; }
    .modal-title { font-size: 20px; }
  }
`;

export default function Career() {
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <>
      <style>{CSS}</style>

      {/* HERO */}
      <div className="career-hero">
        <div className="hero-deco tl" />
        <div className="hero-deco br" />
        <div className="career-hero-overlay">
          <span className="hero-eyebrow">Join Our Team</span>
          <h1>Careers</h1>
          <p>
            Join Ohtsuka Poly-Tech Philippines, Inc. and grow your career in a
            dynamic and fast-paced environment.
          </p>
        </div>
      </div>

      <div className="career-container">

        {/* INTRO */}
        <div className="career-intro">
          <p>
            Ohtsuka Poly-Tech Philippines, Inc. is currently looking for passionate
            and career-driven individuals who are seeking for an opportunity.
            Check out the available positions below and submit your resume.
          </p>
          <p className="career-email-note">
            📧 Email your resume to <strong>hr@optphils.com.ph</strong> and indicate
            the position you are applying for.
          </p>
        </div>

        {/* JOB TABLE */}
        <div className="career-jobs">
          <div className="career-jobs-inner">
            <div className="section-heading">
              <div className="sh-dot" />
              <h2>Available Positions</h2>
              <div className="sh-line" />
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Date Posted</th>
              </tr>
            </thead>
            <tbody>
              {jobList.map((job, index) => (
                <tr key={index}>
                  <td>
                    <span className="job-row-num">{index + 1}</span>
                    <span className="job-title-link" onClick={() => setSelectedJob(job)}>
                      {job.title}
                    </span>
                  </td>
                  <td>
                    <span className="date-chip">📅 {job.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* APPLY FORM */}
        <div className="career-form-section">
          <div className="section-heading">
            <div className="sh-dot" />
            <h2>Apply Now</h2>
            <div className="sh-line" />
          </div>
          <p>
            Fill-up the form below or email your resume to{" "}
            <strong style={{ color: "#b30000" }}>hr@optphils.com.ph</strong>
          </p>
          <form className="career-form">
            <div className="form-row">
              <input type="text" placeholder="First Name" required />
              <input type="text" placeholder="Last Name" required />
            </div>
            <div className="form-row">
              <input type="email" placeholder="Email Address" required />
              <input type="text" placeholder="Contact Number" required />
            </div>
            <select required>
              <option value="">— Select Position Applying For —</option>
              <option>Company Driver</option>
              <option>Mechanical Engineer</option>
              <option>Molding Operator / Production Operator</option>
              <option>Electrical Engineer</option>
            </select>
            <input type="file" />
            <textarea placeholder="Message (optional)" rows="4" />
            <button type="submit">Submit Application →</button>
          </form>
        </div>

        {/* CONTACT */}
        <div className="career-contact">
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <div className="contact-label">Address</div>
            <div className="contact-value">
              Block 5 Lot 1 Binary St., LISPP-1 SEPZ,<br />
              Bo. Diezmo, Cabuyao, Laguna 4025
            </div>
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

      {/* MODAL */}
      <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </>
  );
}