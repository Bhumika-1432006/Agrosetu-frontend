import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem("role")); 
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));
  }, [location]);

  const isActive = (path) => location.pathname === path;
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
  const authLinks = !userRole ? [{ label: "Signup / Login", to: "/signup" }] : [];

  const linksToRender =
    userRole === "farmer"
      ? [...farmerLinks, ...commonLinks]
      : userRole === "dealer"
      ? [...dealerLinks, ...commonLinks]
      : [...authLinks, ...commonLinks];

  const handleLogout = () => {
    localStorage.clear();
    setUserRole(null);
    closeMenu();
    navigate("/signup");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={closeMenu}>
          <img src="/media/images/logo.png" alt="Logo" width="130" />
        </Link>
        <button className="navbar-toggler border-0 shadow-none" type="button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {linksToRender.map((item) => (
              <li className="nav-item w-100 text-center" key={item.to}>
                <Link to={item.to} className="nav-link py-3 py-lg-2" onClick={closeMenu}
                  style={{ fontWeight: 500, color: isActive(item.to) ? "#0f9b4d" : "#333" }}>
                  {item.label}
                </Link>
              </li>
            ))}
            {userRole && (
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