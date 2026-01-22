import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/UserSlice.js";
const Login = () => {
    const dispatch = useDispatch();
    const [changeinput, setChangeinput] = useState({ email: "example@gmail.com", text: "xyz123" });
    const functionchange = (e) => {
        setChangeinput({ ...changeinput, [e.target.name]: e.target.value })
        console.log(changeinput)
    }
    const Navigate = useNavigate();
    const checkData = async (e) => {
        e.preventDefault();
        console.log("Form submitted:", changeinput)
        const res = await fetch("https://messagemate-backend-0qh0.onrender.com/login", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(changeinput)
        })
        if (res.ok) {
            const messagefrombackend = await res.json();
            console.log(messagefrombackend.email,messagefrombackend.id,messagefrombackend.name)
            dispatch(setUser({
                id: messagefrombackend.id,
                email: messagefrombackend.email,
                name: messagefrombackend.name,
            }));
            alert(messagefrombackend.message)
            if (messagefrombackend.message === "Login successfully") {
                Navigate("/")
            } else {
                Navigate("/signup")
            }

        }

    }
    return (
        < div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",

        }}   >

            <form onSubmit={checkData} style={{
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
                        marginBottom: "20px",
                    }}> Login</p>
                    <p style={{ margin: "0px", fontWeight: "800", color: "#c2a059", }}>Email Address</p>
                    <input type="email" name="email" value={changeinput.email} onChange={functionchange} required style={{
                        paddingTop: "10px",
                        paddingRight: " 40px",
                        paddingBottom: "10px",
                        paddingLeft: "10px",
                        borderRadius: "7px",
                    }} />
                    <p style={{ margin: "0px", fontWeight: "800", color: "#c2a059", }}>Password</p>
                    <input type="text" name="text" value={changeinput.text} onChange={functionchange} required style={{
                        paddingTop: "10px",
                        paddingRight: " 40px",
                        paddingBottom: "10px",
                        paddingLeft: "10px",
                        borderRadius: "7px",
                    }} />
                    <input type="submit" value="Login" style={{
                        paddingTop: "10px",
                        paddingRight: " 40px",
                        paddingBottom: "10px",
                        paddingLeft: "10px",
                        borderRadius: "7px",
                    }} />

                    <p style={{ color: "#c2a059", fontWeight: "800" }}>Don't have account?</p>
                    <p style={{
                        color: "#c2a059", fontWeight: "800"
                    }} onClick={() => Navigate("/signup")}>Signup</p>
                </div>
            </form>

        </div>
    )
}

export default Login
