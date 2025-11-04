import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import brandLogo from "../../assets/brand_logo.png";

const Navbar = ({ onRegisterClick }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // --- Constants for Styling ---
  const PRIMARY_COLOR = "#FF7F00"; // Bright Orange
  const PRIMARY_HOVER_COLOR = "#E66700"; // Darker Orange for hover
  
  const TEXT_COLOR = "#ffffff"; // White text for visibility
  const INDIGO_COLOR = "#4B0082"; // Indigo (Dark)
  // 🚨 CHANGED: Standard Blue for the left side of the gradient
  const SKY_BLUE = "#1E90FF"; // Dodger Blue 
  const SECONDARY_COLOR = "#ffffff"; // Secondary button border/text set to white

  useEffect(() => {
    const loadUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser({ ...storedUser, role: storedUser.role?.toLowerCase() });
      } else {
        setUser(null);
      }
    };
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    setUser(null);
    navigate("/");
  };

  // --- Inline Styles ---
  const containerStyle = {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    // The gradient now goes from standard blue to indigo
    background: `linear-gradient(to right, ${SKY_BLUE}, ${INDIGO_COLOR})`,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
  };

  const contentStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "70px",
  };
  
  const logoWrapperStyle = {
    position: 'relative',
    width: '80px', // Logo size
    padding: '4px',
    borderRadius: '6px',
    backgroundColor: 'white',
    boxShadow: `0 0 10px rgba(255, 255, 255, 0.4)`,
    transition: 'all 500ms ease-in-out',
    cursor: 'pointer',
    marginBottom: 0,
  };

  const logoImageStyle = {
    width: "100%",
    height: "auto",
    display: "block",
  };

  const menuStyle = {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  };
  
  const linkBaseStyle = {
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: 500,
    padding: "8px 12px",
    borderRadius: "4px",
    transition: "all 0.2s ease-in-out",
    color: TEXT_COLOR,
  };

  const primaryButtonBaseStyle = {
    ...linkBaseStyle,
    cursor: "pointer",
    border: `1px solid ${PRIMARY_COLOR}`,
    backgroundColor: PRIMARY_COLOR,
    color: "#ffffff",
    fontWeight: 600,
    padding: "10px 18px",
    borderRadius: "20px",
  };

  const secondaryButtonBaseStyle = {
    ...linkBaseStyle,
    cursor: "pointer",
    border: `1px solid ${SECONDARY_COLOR}`, 
    backgroundColor: "transparent",
    color: SECONDARY_COLOR,
    fontWeight: 600,
    padding: "8px 16px",
  };

  // --- Style Block (for keyframes and :hover effects) ---
  const styleSheet = `
    @keyframes pulse-slow {
      0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.4), 0 0 15px rgba(255, 255, 255, 0.2); }
      50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.3); }
    }

    .logo-wrapper {
      animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; 
    }

    .logo-wrapper:hover {
      transform: scale(1.08) rotate(1deg);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5), 0 0 20px ${SKY_BLUE};
      animation-play-state: paused;
    }

    .nav-link:hover {
      color: ${SKY_BLUE} !important; 
      background-color: rgba(255, 255, 255, 0.1) !important;
    }

    .primary-button:hover {
      background-color: ${PRIMARY_HOVER_COLOR} !important; 
      border-color: ${PRIMARY_HOVER_COLOR} !important;
      box-shadow: 0 4px 10px rgba(255, 127, 0, 0.6);
      transform: translateY(-2px);
    }

    .secondary-button:hover {
      color: ${INDIGO_COLOR} !important; 
      background-color: ${SECONDARY_COLOR} !important;
      border-color: ${SECONDARY_COLOR} !important;
      transform: translateY(-2px);
    }
  `;

  return (
    <>
      <style>{styleSheet}</style>

      <header style={containerStyle}>
        <nav style={contentStyle}>
          <Link to="/">
            <div className="logo-wrapper" style={logoWrapperStyle}>
                <img src={brandLogo} alt="Brand Logo" style={logoImageStyle} />
            </div>
          </Link>

          <div style={menuStyle}>
            <Link to="/" className="nav-link" style={linkBaseStyle}>
              Home
            </Link>

            {!user && (
              <>
                <Link
                  to="/register"
                  className="nav-button primary-button"
                  style={primaryButtonBaseStyle}
                >
                  Create Account
                </Link>
              </>
            )}

            {user && (
              <>
                {user.role === "user" && (
                  <Link to="/my-enrollments" className="nav-link" style={linkBaseStyle}>
                    My Enrollments
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="nav-button secondary-button"
                  style={secondaryButtonBaseStyle}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;