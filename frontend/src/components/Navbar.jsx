import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../Redux/UserSlice';
import { API_URL } from '../config';
import {
  FiMessageSquare,
  FiHome,
  FiInfo,
  FiMail,
  FiUser,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiMenu,
  FiX
} from 'react-icons/fi';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/logout`);
      if (res.ok) {
        dispatch(clearUser());
        navigate("/login");
      } else {
        dispatch(clearUser());
        navigate("/login");
      }
    } catch {
      dispatch(clearUser());
      navigate("/login");
    }
  };

  const navLinks = [
    { name: "Chat", path: "/", icon: <FiHome />, authRequired: true },
    { name: "About", path: "/aboutus", icon: <FiInfo />, authRequired: false },
    { name: "Contact", path: "/contactus", icon: <FiMail />, authRequired: false },
  ];

  const visibleLinks = navLinks.filter(link => !link.authRequired || (link.authRequired && user.id));

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      background: "rgba(11, 15, 25, 0.8)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      padding: "0 24px",
    }}>
      <div style={{
        maxWidth: "1380px",
        margin: "0 auto",
        height: "68px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          textDecoration: "none",
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "20px",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.45)",
          }}>
            <FiMessageSquare />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{
              fontSize: "19px",
              fontWeight: 800,
              letterSpacing: "-0.5px",
              background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              MessageMate
            </span>
            <span style={{
              fontSize: "10px",
              color: "#818cf8",
              fontWeight: 600,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              marginTop: "-3px",
            }}>
              Real-Time Connect
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: "none",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255, 255, 255, 0.03)",
          padding: "5px 8px",
          borderRadius: "9999px",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }} className="desktop-nav">
          <style>{`
            @media (min-width: 768px) {
              .desktop-nav { display: flex !important; }
              .mobile-toggle { display: none !important; }
            }
          `}</style>
          {visibleLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 18px",
                  borderRadius: "9999px",
                  fontSize: "14px",
                  fontWeight: 600,
                  transition: "all 0.25s ease",
                  color: isActive ? "#ffffff" : "#94a3b8",
                  background: isActive ? "linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.25))" : "transparent",
                  border: isActive ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#94a3b8";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <span style={{ fontSize: "15px" }}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: User Profile or Auth CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user.id ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "6px 14px 6px 8px",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.5)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                }}
              >
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #d946ef)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 700,
                  boxShadow: "0 0 10px rgba(99, 102, 241, 0.35)",
                }}>
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                </div>
                <div style={{ textAlign: "left", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#f8fafc", maxWidth: "110px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.name || "My Account"}
                  </span>
                </div>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    width: "220px",
                    background: "rgba(17, 24, 39, 0.96)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "16px",
                    padding: "8px",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
                    zIndex: 1000,
                  }}
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div style={{
                    padding: "10px 12px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    marginBottom: "6px",
                  }}>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>
                      {user.name}
                    </p>
                    <p style={{ fontSize: "12px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      color: "#cbd5e1",
                      fontSize: "14px",
                      fontWeight: 500,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(99, 102, 241, 0.15)";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#cbd5e1";
                    }}
                  >
                    <FiUser style={{ color: "#818cf8" }} />
                    View Profile
                  </Link>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout();
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      color: "#f87171",
                      fontSize: "14px",
                      fontWeight: 500,
                      background: "transparent",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <FiLogOut />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link
                to="/login"
                className="btn-ghost"
                style={{ fontSize: "13px", padding: "8px 16px" }}
              >
                <FiLogIn /> Sign In
              </Link>
              <Link
                to="/signup"
                className="btn-gradient"
                style={{ fontSize: "13px", padding: "8px 18px" }}
              >
                <FiUserPlus /> Get Started
              </Link>
            </div>
          )}

          {/* Mobile Toggle Button */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "white",
              fontSize: "18px",
            }}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          padding: "16px 0 20px",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}>
          {visibleLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "10px",
                color: location.pathname === item.path ? "#818cf8" : "#cbd5e1",
                background: location.pathname === item.path ? "rgba(99, 102, 241, 0.12)" : "transparent",
                fontWeight: 600,
                fontSize: "15px",
              }}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
