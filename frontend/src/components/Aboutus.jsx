import React from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiShield, FiSmile, FiLayout, FiUsers, FiArrowRight } from 'react-icons/fi';

const Aboutus = () => {
  const features = [
    {
      icon: <FiZap />,
      title: "Real-Time WebSockets",
      desc: "Engineered with Socket.io for instantaneous message delivery, online presence tracking, and zero latency.",
      color: "#6366f1",
    },
    {
      icon: <FiShield />,
      title: "Direct & Private",
      desc: "Connect seamlessly with peer-to-peer user IDs. Complete control over your messages with real-time edit and delete.",
      color: "#a855f7",
    },
    {
      icon: <FiSmile />,
      title: "Rich Expression",
      desc: "Integrated emoji picker, active online indicators, timestamp history, and smooth conversational micro-interactions.",
      color: "#06b6d4",
    },
    {
      icon: <FiLayout />,
      title: "Modern Glassmorphism",
      desc: "Crafted with 15+ years of design experience featuring ambient aurora gradients, frosted panels, and responsive layout.",
      color: "#ec4899",
    },
  ];

  return (
    <div style={{ flex: 1, padding: "50px 24px 80px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
      {/* Hero Header */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
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
            marginBottom: "20px",
          }}
        >
          <FiUsers /> About MessageMate
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 800,
            letterSpacing: "-1px",
            lineHeight: "1.15",
            marginBottom: "20px",
            background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #818cf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          The Future of Real-Time <br /> Seamless Messaging
        </h1>

        <p
          style={{
            fontSize: "clamp(16px, 2vw, 18px)",
            color: "#94a3b8",
            maxWidth: "680px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          MessageMate is designed to bring people together effortlessly. Blending high-speed web socket technology with state-of-the-art glassmorphism design.
        </p>
      </div>

      {/* Feature Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
          marginBottom: "60px",
        }}
      >
        {features.map((feat, index) => (
          <div
            key={index}
            className="glass-panel"
            style={{
              padding: "32px 28px",
              borderRadius: "20px",
              transition: "transform 0.3s ease, border-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "var(--border-subtle)";
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: `radial-gradient(circle, ${feat.color}40 0%, ${feat.color}10 100%)`,
                border: `1px solid ${feat.color}50`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: feat.color,
                fontSize: "22px",
                marginBottom: "20px",
              }}
            >
              {feat.icon}
            </div>
            <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#f8fafc", marginBottom: "10px" }}>
              {feat.title}
            </h3>
            <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.6" }}>
              {feat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Interactive CTA Banner */}
      <div
        className="glass-panel"
        style={{
          padding: "48px 36px",
          borderRadius: "28px",
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", marginBottom: "12px" }}>
          Ready to experience modern messaging?
        </h2>
        <p style={{ color: "#cbd5e1", fontSize: "15px", maxWidth: "540px", margin: "0 auto 28px" }}>
          Create your account today, invite your friends with your unique User ID, and start chatting with zero latency.
        </p>
        <Link to="/" className="btn-gradient" style={{ padding: "14px 32px", fontSize: "15px" }}>
          Open Chat <FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default Aboutus;
