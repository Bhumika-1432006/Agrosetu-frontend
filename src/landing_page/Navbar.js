import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Added for mobile toggle
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); 

  const isActive = (path) => location.pathname === path;

  // Closes the menu when a link is clicked
  const closeMenu = () => setIsMenuOpen(false);

  const commonLinks = [{ label: "About", to: "/about" }];

  const farmerLinks = [
    { label: "My Crops", to: "/farmer/crops" },
    { label: "Interests", to: "/farmer/interests" },
    { label: "🔨 Auction", to: "/farmer/auctions" },
  ];

  const dealerLinks = [
    { label: "Available Crops", to: "/dealer/crops" },
    { label: "Bid", to: "/dealer/bid" },
  ];

  const authLinks = !role ? [{ label: "Signup / Login", to: "/signup" }] : [];

  const linksToRender =
    role === "farmer"
      ? [...farmerLinks, ...commonLinks]
      : role === "dealer"
      ? [...dealerLinks, ...commonLinks]
      : [...authLinks, ...commonLinks];

  const handleLogout = () => {
    localStorage.clear();
    closeMenu();
    navigate("/signup");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={closeMenu}>
          <img src="/media/images/logo.png" alt="Logo" width="130" />
        </Link>

        {/* Hamburger Button */}
        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links Container - Logic for showing/hiding on mobile */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {linksToRender.map((item) => (
              <li className="nav-item w-100 text-center" key={item.to}>
                <Link
                  to={item.to}
                  className="nav-link py-3 py-lg-2"
                  onClick={closeMenu}
                  style={{
                    fontWeight: 500,
                    color: isActive(item.to) ? "#0f9b4d" : "#333",
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {role && (
              <li className="nav-item ms-lg-3 w-100 text-center pb-3 pb-lg-0">
                <button onClick={handleLogout} className="btn btn-success px-4 w-75 w-lg-auto" style={{ borderRadius: "10px" }}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;