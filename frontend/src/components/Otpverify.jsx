import React, { useState, useEffect, useRef } from "react";
import "../styles/Otpverify.css";

const Otpverify = () => {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const inputsRef = useRef([]);

    // Handle OTP input change
    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/, ""); // allow only digits
        if (!value) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // move to next input
        if (index < 5 && value) {
            inputsRef.current[index + 1].focus();
        }
    };

    // Handle backspace navigation
    const handleKeyDown = (e, index) => {

        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = "";
            setOtp(newOtp);
            inputsRef.current[index - 1].focus();
        }

    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const Otp = otp.join("");
        console.log(Otp)
        const email = localStorage.getItem("email");
        localStorage.removeItem("email");

        const res = await fetch("https://messagemate-backend-0qh0.onrender.com/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Otp }),
        });

        const result = await res.json();
        alert(result.message);

        if (res.ok) {
            window.location.href = result.redirect;
        }
    };

    // Resend OTP
    const handleResend = async () => {
        const email = localStorage.getItem("email");
        const response = await fetch("https://messagemate-backend-0qh0.onrender.com/resend-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();
        alert(result.message);
    };

    return (
        <div className="verify-page">
            <div className="otp-container">
                <div className="logo">
                    <img src="/images/keshab.png" alt="Company Logo" />
                </div>

                <h1>Verify your account</h1>
                <p className="subtitle">We've sent a 6-digit verification code to your Email</p>

                <form onSubmit={handleSubmit} id="otpForm">
                    <div className="otp-inputs">
                        {otp.map((value, index) => (
                            <input
                                key={index}
                                type="text"
                                className="otp-input"
                                maxLength="1"
                                pattern="\d*"
                                inputMode="numeric"
                                value={value}
                                ref={(el) => (inputsRef.current[index] = el)}//here i am storing the element input inside inputRef so that it will used to focus the next input after i fill one input e.g
                                // if (index < 5 && value) {
                                //inputsRef.current[index + 1].focus();
                                //}

                                autoFocus={index === 0}
                                required
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>
                    <button type="submit" className="verify-btn">Verify</button>
                </form>

                <p className="resend">
                    Didn't receive code?{" "}
                    <button type="button" onClick={handleResend} className="resend-btn">
                        Resend
                    </button>
                    <span className="timer">(0:59)</span>
                </p>

                <p className="info">
                    If you didn't receive the OTP, please check your internet connection and ensure
                    that the email you entered is correct
                </p>
            </div>
        </div>
    );
};

export default Otpverify;
