import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [hoverindex, setHoverindex] = useState();
    const nav = useRef();
    const items = [{ Name: "Home", linkto: "/" }, { Name: "About Us", linkto: "/aboutus" }, { Name: "Signup", linkto: "/signup" }, { Name: "Login", linkto: "/login" },{ Name: "Contact US", linkto: "/contactus" }];
    return (
        <>
            <nav ref={nav} style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "10px",
                height:"40px",
                background: "#1f1f1f",
                color: "white",
                paddingLeft: "40px",
                borderRadius: "10px",
            }}>
                {items.map((item, index) => (
                    <Link to={item.linkto} key={index} onMouseEnter={() => setHoverindex(index)} onMouseLeave={() => setHoverindex(null)} style={{
                        color: hoverindex === index ? "aqua" : "white", transition: "color 0.3s ease",
                    }}>{item.Name}</Link>

                ))}
            </nav>

        </>
    )
}

export default Navbar
