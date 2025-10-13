import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const Signup = () => {
  const [change, setChange] = useState({ email: "example@gmail.com", text: "xyz123" });
  const functionchange = (e) => {
    setChange({ ...change, [e.target.name]: e.target.value })
    console.log(change)
  }
  const Navigate = useNavigate();
  const sendData = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", change)
    const res = await fetch("http://localhost:5000/signup", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(change)
    })
    if (res.ok) {
      const msgfrombackend = await res.json();
      alert(msgfrombackend.message)
      localStorage.setItem("email", change.email);
      Navigate("/otpverify")

    }

  }
  return (
    < div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",

    }}   >

      <form onSubmit={sendData} style={{
        display: "flex",
        gap: "10px",
        width: "340px",
        justifyContent: "center",
        alignItems: "center",
        border: "2px solid black",
        padding: "70px 0px",
        borderRadius: "10px",
        backgroundColor: "rgb(76 76 76)",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyItems: 'flex-start',
          gap: "10px",
        }}>
          <p style={{
            fontSize: " 28px",
            marginTop: " 0px",
            fontWeight: "600",
            color: "#c2a059",
            marginBottom:"25px",
          }}> Create Your Account</p>
          <p style={{ margin: "0px", fontWeight: "800", color: "#c2a059", }}>Email Address</p>
          <input type="email" name="email" value={change.email} onChange={functionchange} required style={{
            paddingTop: "10px",
            paddingRight: " 40px",
            paddingBottom: "10px",
            paddingLeft: "10px",
            borderRadius: "7px",
          }} />
          <p style={{ margin: "0px", fontWeight: "800", color: "#c2a059", }}>Password</p>
          <input type="text" name="text" value={change.text} onChange={functionchange} required style={{
            paddingTop: "10px",
            paddingRight: " 40px",
            paddingBottom: "10px",
            paddingLeft: "10px",
            borderRadius: "7px",
          }} />
          <input type="submit" value="signup" style={{
            paddingTop: "10px",
            paddingRight: " 40px",
            paddingBottom: "10px",
            paddingLeft: "10px",
            borderRadius: "7px",
          }} />
        </div>
      </form>

    </div>
  )
}

export default Signup
