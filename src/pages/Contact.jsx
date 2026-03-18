import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
import "../styles/contact.css";

const Contact = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: "",
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const templateParams = {
      subject: formData.subject,
      from_name: `${formData.firstName} ${formData.lastName}`,
      from_email: formData.email,
      contact_number: formData.contact,
      message: formData.message,
      to_email: "carillezapata00@gmail.com",
    };

    emailjs
      .send(
        "service_4rn7f89",
        "template_2bin767",
        templateParams,
        "y3YDGpK1hwoGjt4hf"
      )
      .then(() => {
        setLoading(false);
        setShowSuccess(true);

        setFormData({
          subject: "",
          firstName: "",
          lastName: "",
          contact: "",
          email: "",
          message: "",
        });
      })
      .catch((error) => {
        console.error("Email send error:", error);
        setLoading(false);
        setShowError(true);
      });
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
    navigate("/");
  };

  return (
    <div className="contact-page">
      <div className="container py-5">

        <div className="contact-header text-center mb-5">
          <h2>Contact Us</h2>
          <p>We’d love to hear from you. Get in touch anytime.</p>
        </div>

        <div className="row">

          {/* LEFT SIDE */}
          <div className="col-md-5 mb-4">
            <div className="glass contact-info-card p-4">
              <h4>Contact Information</h4>

              <div className="info-block">
                <h5>📍 ADDRESS</h5>
                <p>
                  <strong>Factory 1</strong><br />
                  Block 5 Lot 1 Binary St., LISPP-1 SEPZ,<br />
                  Bo. Diezmo, Cabuyao, Laguna 4025
                </p>

                <p>
                  <strong>Factory 3</strong><br />
                  Block 10 Lot 1B and 2A Mega Drive St.,<br />
                  LISPP-4 PEZA, Brgy. Bulihan,<br />
                  Malvar, Batangas
                </p>
              </div>

              <div className="info-block">
                <h5>📞 CALL US</h5>
                <p>
                  <strong>Telephone:</strong> (049) 543-0622/23/25 loc. 809 & 810<br />
                  <strong>Smart:</strong> 0939-939-3611 / 0998-974-0478<br />
                  <strong>Globe:</strong> 0917-718-7284<br />
                  <strong>Manila Line:</strong> (02) 475-1675
                </p>
              </div>

              <div className="info-block">
                <h5>📩  EMAIL US</h5>
                <p>
                  <strong>Customer Concerns</strong><br />
                  optp@optphils.com.ph<br />
                  sales@optphils.com.ph
                </p>
                <p>
                  <strong>HR & Job Applications</strong><br />
                  hr@optphils.com.ph
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="col-md-7">
            <div className="glass contact-form-card p-4">
              <h4>Send Us a Message</h4>

              <form onSubmit={handleSubmit}>

                <select
                  className="form-control"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    -- Select Your Concern Subject Below --
                  </option>
                  <option value="Customer Concern">Customer Concern</option>
                  <option value="Sales Inquiry">Sales Inquiry</option>
                  <option value="Job Application">Job Application</option>
                  <option value="Others">Others</option>
                </select>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <input
                  type="text"
                  className="form-control mt-3"
                  name="contact"
                  placeholder="Contact Number"
                  value={formData.contact}
                  onChange={handleChange}
                />

                <input
                  type="email"
                  className="form-control mt-3"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <textarea
                  rows="4"
                  className="form-control mt-3"
                  name="message"
                  placeholder="Type Here Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>

                <button type="submit" className="btn-submit mt-3" disabled={loading}>
                  {loading ? <div className="spinner"></div> : "Send Message"}
                </button>

              </form>
            </div>
          </div>

        </div>

        {/* GOOGLE MAP */}
        <div className="map-section mt-5">
          <iframe
            title="OPT Location"
            src= "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14059.17613881145!2d121.09563!3d14.23685!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd627001fdbdf9%3A0xa6125d771a9017ff!2sOhtsuka%20Poly-tech%20Philippines%20Inc.!5e1!3m2!1sen!2sph!4v1771398159710!5m2!1sen!2sph" 
            width="100%"
            height="350"
            style={{ borderRadius: "20px", border: "0" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="success-modal">
          <div className="success-box">
            <h3>✅ Message Sent Successfully!</h3>
            <p>We will get back to you soon.</p>
            <button onClick={closeSuccessModal}>Go to Home</button>
          </div>
        </div>
      )}

      {/* ERROR MODAL */}
      {showError && (
        <div className="success-modal">
          <div className="success-box">
            <h3>❌ Failed to Send Message</h3>
            <p>Please try again later.</p>
            <button onClick={() => setShowError(false)}>Close</button>
          </div>
        </div>
      )}

   </div>
  );
};

export default Contact;
