import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import brandLogo from "../../assets/brand_logo.png"; 

const Navbar = ({ onRegisterClick }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // --- Constants for Professional Styling ---
  const PRIMARY_COLOR = "#FF7F00"; // Bright Orange for CTA
  const PRIMARY_HOVER_COLOR = "#E66700"; // Darker Orange
  
  // 🚨 CHANGE 1: Defined LOGOUT button colors
  const LOGOUT_BG_COLOR = PRIMARY_COLOR; 
  const LOGOUT_HOVER_COLOR = PRIMARY_HOVER_COLOR; 
  const LOGOUT_TEXT_COLOR = "#ffffff"; 

  const SKY_BLUE = "#1E90FF"; // Dodger Blue (left side of gradient)
  const INDIGO_COLOR = "#4B0082"; // Indigo (right side of gradient)
  const TEXT_COLOR = "#ffffff"; // White text
  
  const NAVBAR_HEIGHT = "70px"; 

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

  // --- Logo Inline Styles from File 1 ---
  const logoWrapperStyle = {
    position: 'relative',
    width: '80px', 
    padding: '4px',
    borderRadius: '6px',
    backgroundColor: 'white',
    transition: 'all 500ms ease-in-out',
    cursor: 'pointer',
  };

  const logoImageStyle = {
    width: "100%",
    height: "auto",
    display: "block",
  };
  
  // 🚨 CHANGE 2: Logout Button Base Style (inline style)
  const logoutButtonBaseStyle = {
    color: LOGOUT_TEXT_COLOR,
    backgroundColor: LOGOUT_BG_COLOR,
    borderColor: LOGOUT_BG_COLOR, // Border color matches background
  };

  // --- Style Block (for keyframes and :hover effects) ---
  const styleSheet = `
    /* Keyframes for logo pulse */
    @keyframes pulse-slow {
        0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.4), 0 0 15px rgba(255, 255, 255, 0.2); }
        50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.3); }
    }

    /* Logo CSS Class and Hover */
    .logo-wrapper {
        animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; 
    }

    .logo-wrapper:hover {
        transform: scale(1.08) rotate(1deg);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5), 0 0 20px ${SKY_BLUE}; 
        animation-play-state: paused;
    }
    
    /* Nav Styling */
    .nav-link:hover {
        color: ${SKY_BLUE} !important; 
        transform: translateY(-2px);
    }
    .cta-button {
        transition: all 0.3s ease;
    }
    .cta-button:hover {
        background-color: ${PRIMARY_HOVER_COLOR} !important; 
        box-shadow: 0 4px 15px rgba(255, 127, 0, 0.5); 
        transform: scale(1.05) translateY(-1px);
    }
    
    /* 🚨 CHANGE 3: Logout Button Hover Styling */
    .logout-button {
        transition: all 0.3s ease;
    }
    .logout-button:hover {
        background-color: ${LOGOUT_HOVER_COLOR} !important;
        border-color: ${LOGOUT_HOVER_COLOR} !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(255, 127, 0, 0.6);
    }
  `;

  return (
    <>
      <style>{styleSheet}</style>

      {/* Navbar Container: Sticky, Gradient BG, Shadow */}
      <header 
        className="sticky top-0 z-50 shadow-2xl"
        style={{
          background: `linear-gradient(to right, ${SKY_BLUE}, ${INDIGO_COLOR})`,
          height: NAVBAR_HEIGHT,
        }}
      >
        <nav 
          className="max-w-7xl mx-auto flex justify-between items-center h-full px-6 md:px-8"
        >
          {/* Logo Section */}
          <Link to="/" className="flex items-center">
            <div 
                className="logo-wrapper" 
                style={logoWrapperStyle} 
            > 
                <img 
                src={brandLogo} 
                alt="Brand Logo" 
                style={logoImageStyle} 
                />
            </div>
          </Link>

          {/* Links and Buttons Section */}
          <div className="flex items-center space-x-6">
            
            <Link to="/" className="nav-link text-sm font-medium transition duration-200" style={{ color: TEXT_COLOR }}>
              Home
            </Link>

            {!user && (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/register" 
                  className="cta-button text-sm font-semibold px-5 py-2 rounded-full shadow-md"
                  style={{ 
                    backgroundColor: PRIMARY_COLOR, 
                    color: TEXT_COLOR,
                    border: `1px solid ${PRIMARY_COLOR}` 
                  }}
                >
                  Create Account
                </Link>
              </div>
            )}

            {user && (
              <div className="flex items-center space-x-4">
                
                {user.role === "admin" ? (
                  <Link to="/educator" className="nav-link text-sm font-medium transition duration-200" style={{ color: TEXT_COLOR }}>
                    Educator Dashboard
                  </Link>
                ) : (
                    <Link to="/my-enrollments" className="nav-link text-sm font-medium transition duration-200" style={{ color: TEXT_COLOR }}>
                        My Enrollments
                    </Link>
                )}
                
                {/* 🚨 CHANGE 4: Applied new styles to the Logout button */}
                <button 
                  onClick={handleLogout} 
                  className="logout-button text-sm font-medium px-4 py-2 rounded-full border"
                  style={logoutButtonBaseStyle}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;