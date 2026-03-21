import React from "react";

function Footer() {
  const colors = {
    primary: "#1E291B",   
    highlight: "#D4AF37", 
    softGreen: "#A7D489", 
    white: "#FFFFFF",
  };

  return (
    <footer style={{
      background: colors.primary,
      color: colors.white,
      padding: "120px 0 60px", // Massive top padding for impact
      borderRadius: "80px 80px 0 0", // More aggressive curves
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.8fr 1fr 1fr 1fr", // Wider brand column
        gap: "60px",
        width: "90%",
        margin: "0 auto"
      }}>
        
        {/* BRAND IDENTITY */}
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "35px" }}>
            <img src="/media/images/logo.png" alt="logo" style={{ height: "90px", marginRight: "25px", filter: "brightness(1.2)" }} />
            <div>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "900", margin: 0, letterSpacing: "-1px" }}>Agro Setu</h2>
              <span style={{ fontSize: "1rem", letterSpacing: "5px", color: colors.highlight, fontWeight: "700" }}>SMART FARMING</span>
            </div>
          </div>
          <p style={{ opacity: 0.8, lineHeight: "1.6", fontSize: "1.25rem", maxWidth: "450px" }}>
            Cultivating a refined future. We weave together the heritage of the land 
            with modern precision, utility, and a commitment to growth.
          </p>
        </div>

        {/* NAVIGATION */}
        <div>
          <h4 style={{ fontSize: "1.1rem", color: colors.highlight, letterSpacing: "4px", textTransform: "uppercase", marginBottom: "35px", fontWeight: "800" }}>The Journal</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {["Home", "Agri News", "Market Prices", "Weather", "Contact"].map((link) => (
              <li key={link} style={{ marginBottom: "20px" }}>
                <a href={`/${link.toLowerCase()}`} style={{ color: colors.white, textDecoration: "none", opacity: 0.8, fontSize: "1.2rem", fontWeight: "600" }}>{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 style={{ fontSize: "1.1rem", color: colors.highlight, letterSpacing: "4px", textTransform: "uppercase", marginBottom: "35px", fontWeight: "800" }}>Inquiries</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <p style={{ opacity: 0.8, fontSize: "1.2rem", margin: 0 }}>Studio Bangalore, India</p>
            <p style={{ opacity: 0.8, fontSize: "1.2rem", margin: 0, fontWeight: "700" }}>+91 123 456 7890</p>
            <p style={{ opacity: 1, fontSize: "1.2rem", color: colors.softGreen, fontWeight: "600" }}>hello@agrosetu.studio</p>
          </div>
        </div>

        {/* SOCIALS */}
        <div>
          <h4 style={{ fontSize: "1.1rem", color: colors.highlight, letterSpacing: "4px", textTransform: "uppercase", marginBottom: "35px", fontWeight: "800" }}>Follow</h4>
          <div style={{ display: "flex", gap: "35px", fontSize: "2.5rem" }}>
            <span style={{ cursor: "pointer", filter: "grayscale(100%) brightness(200%)" }}>🌐</span>
            <span style={{ cursor: "pointer", filter: "grayscale(100%) brightness(200%)" }}>📸</span>
            <span style={{ cursor: "pointer", filter: "grayscale(100%) brightness(200%)" }}>🐦</span>
          </div>
        </div>
      </div>

      {/* SEPARATOR */}
      <div style={{ height: "2px", width: "90%", background: "rgba(255,255,255,0.05)", margin: "100px auto 50px" }} />
      
      {/* FOOTER BOTTOM */}
      <div style={{ display: "flex", justifyContent: "space-between", width: "90%", margin: "0 auto", alignItems: "center" }}>
        <p style={{ opacity: 0.5, fontSize: "1rem", letterSpacing: "6px", fontWeight: "600", margin: 0 }}>
          © {new Date().getFullYear()} AGROSETU — THE AESTHETIC OF GROWTH
        </p>
        <div style={{ display: "flex", gap: "30px", opacity: 0.4, fontSize: "0.9rem", fontWeight: "700" }}>
            <span>PRIVACY POLICY</span>
            <span>TERMS OF SERVICE</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;