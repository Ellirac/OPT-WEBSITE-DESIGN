import React from "react";
import emailjs from "emailjs-com";

const EmailTest = () => {
  const sendTestEmail = () => {
    const templateParams = {
      to_email: "carillezapata00@gmail.com",
      from_email: "zapatacarille13@gmail.com",
      message: "This is a TEST email from EmailJS. If you receive this, connection is working ✅",
    };

    emailjs
      .send(
        "service_4rn7f89",      // YOUR SERVICE ID
        "template_2bin767",     // YOUR TEMPLATE ID
        templateParams,
        "y3YDGpK1hwoGjt4hf"     // YOUR PUBLIC KEY
      )
      .then(() => {
        alert("✅ Email sent successfully!");
      })
      .catch((error) => {
        console.error(error);
        alert("❌ Failed to send email");
      });
  };

  return (
    <div style={{ padding: "100px", textAlign: "center" }}>
      <h2>EmailJS Test</h2>
      <button onClick={sendTestEmail}>
        Send Test Email
      </button>
    </div>
  );
};

export default EmailTest;
