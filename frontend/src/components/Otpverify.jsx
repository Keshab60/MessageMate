import React, { useState, useRef, useEffect } from "react";
import { FiShield } from "react-icons/fi";
import { API_URL } from "../config";

const Otpverify = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const inputsRef = useRef([]);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP digit entry
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (index < 5 && value) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputsRef.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Handle paste for full 6-digit code
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      inputsRef.current[5]?.focus();
    }
  };

  // Handle verify submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const Otp = otp.join("");
    if (Otp.length < 6) {
      setFeedback({ type: "error", text: "Please enter the full 6-digit code." });
      return;
    }

    setLoading(true);
    setFeedback({ type: "", text: "" });

    try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Otp }),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.removeItem("email");
        setFeedback({ type: "success", text: result.message || "Account verified successfully!" });
        setTimeout(() => {
          window.location.href = result.redirect || "/login";
        }, 1200);
      } else {
        setFeedback({ type: "error", text: result.message || "Verification failed. Invalid OTP." });
      }
    } catch {
      setFeedback({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResend = async () => {
    if (!canResend) return;
    const email = localStorage.getItem("email");
    setFeedback({ type: "", text: "" });

    try {
      const response = await fetch(`${API_URL}/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        setFeedback({ type: "success", text: result.message || "New OTP code sent to your email!" });
        setTimer(60);
        setCanResend(false);
      } else {
        setFeedback({ type: "error", text: result.message || "Failed to resend code." });
      }
    } catch {
      setFeedback({ type: "error", text: "Failed to connect to server." });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        className="glass-panel animate-scale-in"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "44px 36px",
          borderRadius: "24px",
          textAlign: "center",
        }}
      >
        {/* Shield Icon */}
        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 20px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "28px",
            boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)",
          }}
        >
          <FiShield />
        </div>

        <h1
          style={{
            fontSize: "26px",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: "#ffffff",
            marginBottom: "8px",
          }}
        >
          Verify Your Account
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6", marginBottom: "28px" }}>
          We've sent a 6-digit authentication code to your registered email address.
        </p>

        {/* Feedback message */}
        {feedback.text && (
          <div
            style={{
              marginBottom: "24px",
              padding: "12px 16px",
              borderRadius: "12px",
              background: feedback.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
              border: `1px solid ${feedback.type === "success" ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)"}`,
              color: feedback.type === "success" ? "#6ee7b7" : "#fca5a5",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <span>{feedback.type === "success" ? "✓" : "⚠️"}</span>
            <span>{feedback.text}</span>
          </div>
        )}

        {/* 6-Digit Code Inputs */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "32px",
            }}
            onPaste={handlePaste}
          >
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                pattern="\d*"
                inputMode="numeric"
                value={value}
                ref={(el) => (inputsRef.current[index] = el)}
                autoFocus={index === 0}
                required
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                style={{
                  width: "52px",
                  height: "58px",
                  textAlign: "center",
                  fontSize: "22px",
                  fontWeight: 700,
                  borderRadius: "14px",
                  background: "rgba(15, 23, 42, 0.7)",
                  border: value ? "2px solid #818cf8" : "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#ffffff",
                  outline: "none",
                  transition: "all 0.2s ease",
                  boxShadow: value ? "0 0 15px rgba(99, 102, 241, 0.3)" : "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#6366f1";
                  e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.25)";
                }}
                onBlur={(e) => {
                  if (!value) {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.12)";
                    e.target.style.boxShadow = "none";
                  }
                }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gradient"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "15px",
              fontWeight: 700,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "24px",
            }}
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        {/* Resend Action */}
        <div style={{ fontSize: "14px", color: "#94a3b8" }}>
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            style={{
              background: "none",
              border: "none",
              color: canResend ? "#818cf8" : "#64748b",
              fontWeight: 600,
              cursor: canResend ? "pointer" : "not-allowed",
              textDecoration: canResend ? "underline" : "none",
              marginLeft: "4px",
            }}
          >
            Resend Code
          </button>
          {!canResend && (
            <span style={{ color: "#64748b", marginLeft: "6px" }}>
              ({Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Otpverify;
