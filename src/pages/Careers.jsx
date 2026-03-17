import React, { useState } from "react";
import "../styles/Career.css";

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

        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>×</button>

        {/* Title Bar */}
        <div className="modal-card-title-bar">
          <span className="modal-badge-inline">{details?.JobType || "Full-Time"}</span>
          <h2 className="modal-card-heading">{job.title}</h2>
          <p className="modal-card-date">📅 Posted: {job.date}</p>
        </div>

        <div className="modal-body">
          {details?.Qualification && (
            <div className="modal-section">
              <h3 className="modal-section-title"><span>✅</span> Qualifications</h3>
              <ul className="modal-list">
                {details.Qualification.map((q, i) => (
                  <li key={i} className="modal-list-item">{q}</li>
                ))}
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
                {details.Requirements.map((r, i) => (
                  <li key={i} className="modal-list-item">{r}</li>
                ))}
              </ul>
            </div>
          )}
          {details?.Benefits && (
            <div className="modal-section">
              <h3 className="modal-section-title"><span>🎁</span> Benefits</h3>
              <ul className="modal-list">
                {details.Benefits.map((b, i) => (
                  <li key={i} className="modal-list-item">{b}</li>
                ))}
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
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <>
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
                    <span
                      className="job-title-link"
                      onClick={() => setSelectedJob(job)}
                    >
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