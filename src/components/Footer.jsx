import React from "react";

const Footer = () => {
  return (
    <>
      {/* ================= FOOTER ================= */}
      <footer className="opt-footer text-center py-4">
        <div className="container">

          <p className="footer-brand mb-1">
            <span className="brand-highlight">OHTSUKA</span> Poly-Tech Philippines, Inc.
          </p>

          <p className="footer-copy">
            © {new Date().getFullYear()} Ohtsuka Poly-Tech Philippines, Inc. — All Rights Reserved
          </p>

          <p className="footer-links">
            <span data-bs-toggle="modal" data-bs-target="#privacyModal">
              Privacy Policy
            </span>
            {" | "}
            <span data-bs-toggle="modal" data-bs-target="#termsModal">
              Terms of Use
            </span>
            {" | "}
            <span data-bs-toggle="modal" data-bs-target="#dataProtectionModal">
              Data Protection
            </span>
          </p>

        </div>
      </footer>

      {/* ================= PRIVACY POLICY ================= */}

      <div className="modal fade" id="privacyModal" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Privacy Policy</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">

              <p>
                Ohtsuka Poly-Tech Philippines, Inc. respects your privacy and
                is committed to protecting personal information collected
                through this website.
              </p>

              <p>
                Personal data may include names, email addresses, contact
                numbers, and documents submitted through inquiries or
                recruitment forms.
              </p>

              <p>
                These data are used only for legitimate business purposes such
                as responding to inquiries, recruitment processing, and
                communication.
              </p>

              <p>
                All personal data are processed in accordance with the
                <strong> Data Privacy Act of 2012 (RA 10173)</strong>.
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* ================= TERMS OF USE ================= */}

      <div className="modal fade" id="termsModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Terms of Use</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">

              <p>
                All materials including images, text, and graphics displayed on
                this website are the property of Ohtsuka Poly-Tech Philippines,
                Inc.
              </p>

              <p>
                Unauthorized copying, reproduction, or distribution of any
                content without prior written consent is strictly prohibited.
              </p>

              <p>
                The company reserves the right to update website content and
                policies without prior notice.
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* ================= DATA PROTECTION ================= */}

      <div className="modal fade" id="dataProtectionModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Data Protection</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">

              <p>
                Ohtsuka Poly-Tech Philippines, Inc. implements appropriate
                technical and organizational measures to protect personal data
                against unauthorized access, disclosure, or misuse.
              </p>

              <p>
                Personal information will not be shared with unauthorized third
                parties unless required by law or with the consent of the data
                subject.
              </p>

              <p>
                For any data privacy concerns, users may contact the company
                through official communication channels provided on this
                website.
              </p>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;