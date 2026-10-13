import React, { useState } from 'react';
import { FiMail, FiMessageCircle, FiSend, FiCheck, FiMapPin, FiClock } from 'react-icons/fi';

const Contactus = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 4000);
  };

  return (
    <div style={{ flex: 1, padding: "50px 24px 80px", maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "9999px",
            background: "rgba(99, 102, 241, 0.12)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            color: "#a5b4fc",
            fontSize: "13px",
            fontWeight: 600,
            marginBottom: "16px",
          }}
        >
          <FiMail /> Get In Touch
        </div>

        <h1
          style={{
            fontSize: "clamp(30px, 4vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            marginBottom: "12px",
            background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #818cf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          We'd Love to Hear From You
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "16px", maxWidth: "560px", margin: "0 auto" }}>
          Have feedback, found a bug, or need assistance? Reach out to the MessageMate engineering team.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "36px",
          alignItems: "start",
        }}
      >
        {/* Info Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            className="glass-panel"
            style={{
              padding: "28px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "flex-start",
              gap: "18px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(99, 102, 241, 0.15)",
                color: "#818cf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                flexShrink: 0,
              }}
            >
              <FiMail />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
                Direct Email
              </h3>
              <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "6px" }}>
                For technical inquiries and account support
              </p>
              <a
                href="mailto:support@messagemate.local"
                style={{ color: "#818cf8", fontSize: "14px", fontWeight: 600 }}
              >
                support@messagemate.local
              </a>
            </div>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: "28px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "flex-start",
              gap: "18px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(168, 85, 247, 0.15)",
                color: "#c084fc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                flexShrink: 0,
              }}
            >
              <FiClock />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
                Response Time
              </h3>
              <p style={{ fontSize: "14px", color: "#94a3b8" }}>
                Our team monitors inquiries continuously and typically responds within a few hours.
              </p>
            </div>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: "28px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "flex-start",
              gap: "18px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(6, 182, 212, 0.15)",
                color: "#22d3ee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                flexShrink: 0,
              }}
            >
              <FiMapPin />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
                Community & Open Source
              </h3>
              <p style={{ fontSize: "14px", color: "#94a3b8" }}>
                Connect on GitHub, report issues, or contribute to upcoming features.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div
          className="glass-panel"
          style={{
            padding: "36px",
            borderRadius: "24px",
          }}
        >
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>
            Send a Message
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "24px" }}>
            Fill out the details below and we will get back to you shortly.
          </p>

          {submitted && (
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                color: "#6ee7b7",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <FiCheck /> Thank you! Your message has been sent successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#cbd5e1", marginBottom: "8px" }}>
                Your Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Alex Johnson"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#cbd5e1", marginBottom: "8px" }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="alex@example.com"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#cbd5e1", marginBottom: "8px" }}>
                Message
              </label>
              <textarea
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                placeholder="How can we help you?"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-gradient"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "15px",
                fontWeight: 700,
                marginTop: "6px",
              }}
            >
              <FiSend /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contactus;
