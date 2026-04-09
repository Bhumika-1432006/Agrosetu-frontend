import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [isSignup, setIsSignup] = useState(true);
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    farmSize: "",
    cropType: "",
    location: "",
    shopName: "",
    businessType: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const colors = {
    primary: "#4B6F44",
    gold: "#D4AF37",
    textDark: "#2D3436",
    white: "#FFFFFF",
    border: "#E2E8E1",
    sidePanel: "#EBF0E8" 
  };

  const inputStyle = {
    borderRadius: "12px",
    padding: "14px 18px",
    border: `1px solid ${colors.border}`,
    marginBottom: "15px",
    fontSize: "0.95rem",
    width: "100%",
    outline: "none",
    boxSizing: "border-box"
  };

  const mainButtonStyle = {
    background: colors.primary,
    color: colors.white,
    border: "none",
    padding: "16px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
    marginTop: "10px",
    fontSize: "1rem"
  };

  const secondaryButtonStyle = {
    background: "#4A6741",
    color: colors.white,
    border: "none",
    padding: "14px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
    marginTop: "15px",
    fontSize: "0.9rem"
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const endpoint = isSignup ? "/api/signup" : "/api/signin";
  const url = `${baseUrl}${endpoint}`;

  let bodyData = isSignup
    ? { name: formData.name, email: formData.email, password: formData.password, role }
    : { email: formData.email, password: formData.password };
    if (isSignup) {
      if (role === "farmer") {
        bodyData.farmSize = formData.farmSize;
        bodyData.cropType = formData.cropType;
        bodyData.location = formData.location;
      }
      if (role === "dealer") {
        bodyData.shopName = formData.shopName;
        bodyData.businessType = formData.businessType;
      }
    }
    try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });
    
    const result = await res.json();
    setMessage(result.message);

    if (res.status === 200 || res.status === 201) {
      // 1. Determine the name: 
      // If logging in, use backend result. If signing up, use the form data directly.
      const displayName = result.name || formData.name;

      // 2. Save everything to localStorage
      localStorage.setItem("name", displayName);
      localStorage.setItem("role", result.role || role);
      localStorage.setItem("userId", result.userId || result._id);

      console.log("Session Started for:", displayName);

      // 3. Navigate based on role
      const targetRole = result.role || role;
      targetRole === "farmer" ? navigate("/farmer/crops") : navigate("/dealer/crops");
    }
  } catch (err) {
    console.error(err);
    setMessage("Something went wrong!");
  }
};

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#F2F2F2",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Inter', sans-serif"
    }}>
      
      <div style={{
          maxWidth: "900px",
          width: "100%",
          height: "600px", 
          borderRadius: "30px",
          backgroundColor: "#FFFFFF",
          display: "flex",
          overflow: "hidden",
          boxShadow: "0 15px 50px rgba(0,0,0,0.1)"
        }}>
        
        <div style={{ 
          flex: 1, 
          padding: "50px 60px", 
          overflowY: "auto", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center" 
        }}>
          <div style={{ marginBottom: "30px" }}>
            <p style={{ color: colors.primary, fontWeight: "600", fontSize: "0.8rem", margin: 0 }}>
                {isSignup ? `Step ${step} of 3` : "Welcome"}
            </p>
            <h2 style={{ color: colors.textDark, fontWeight: "800", fontSize: "2.2rem", margin: "5px 0" }}>
              {isSignup ? "Create Account" : "Sign In"}
            </h2>
            <div style={{ width: "45px", height: "4px", background: colors.gold, borderRadius: "2px" }}></div>
          </div>

          {isSignup && step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <input type="text" name="name" placeholder="Full Name" required style={inputStyle} value={formData.name} onChange={handleChange} />
              <input type="email" name="email" placeholder="Email Address" required style={inputStyle} value={formData.email} onChange={handleChange} />
              <input type="password" name="password" placeholder="Password" required style={inputStyle} value={formData.password} onChange={handleChange} />
              <button type="submit" style={mainButtonStyle}>Continue</button>
            </form>
          )}

          {isSignup && step === 2 && (
            <div>
              <p style={{ fontWeight: "700", marginBottom: "20px" }}>Select your role</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" onClick={() => { setRole("farmer"); setStep(3); }} style={mainButtonStyle}>Farmer</button>
                <button type="button" onClick={() => { setRole("dealer"); setStep(3); }} style={mainButtonStyle}>Dealer</button>
              </div>
            </div>
          )}

          {isSignup && step === 3 && (
            <form onSubmit={handleSubmit}>
              {role === "farmer" ? (
                <>
                  <input type="text" name="farmSize" placeholder="Farm Size" style={inputStyle} value={formData.farmSize} onChange={handleChange} />
                  <input type="text" name="cropType" placeholder="Primary Crop" style={inputStyle} value={formData.cropType} onChange={handleChange} />
                  <input type="text" name="location" placeholder="Location" style={inputStyle} value={formData.location} onChange={handleChange} />
                </>
              ) : (
                <>
                  <input type="text" name="shopName" placeholder="Shop Name" style={inputStyle} value={formData.shopName} onChange={handleChange} />
                  <input type="text" name="businessType" placeholder="Business Type" style={inputStyle} value={formData.businessType} onChange={handleChange} />
                </>
              )}
              <button type="submit" style={mainButtonStyle}>Register</button>
            </form>
          )}

          {!isSignup && (
            <form onSubmit={handleSubmit}>
              <input type="email" name="email" placeholder="Email" required style={inputStyle} value={formData.email} onChange={handleChange} />
              <input type="password" name="password" placeholder="Password" required style={inputStyle} value={formData.password} onChange={handleChange} />
              <button type="submit" style={mainButtonStyle}>Login</button>
            </form>
          )}

          <button 
            type="button"
            style={secondaryButtonStyle} 
            onClick={() => { setIsSignup(!isSignup); setStep(1); setMessage(""); }}
          >
            {isSignup ? "Already have an account? Login" : "New here? Create account"}
          </button>

          {message && <div style={{ marginTop: "15px", textAlign: "center", fontWeight: "600", color: colors.primary }}>{message}</div>}
        </div>

        <div style={{ 
          flex: 0.8, 
          backgroundColor: colors.sidePanel, 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center",
          padding: "40px",
          height: "100%" 
        }}>
          <div style={{ 
            width: "100%", 
            height: "100%", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center" 
          }}>
            <img 
              src="media/images/agrosetulogo.png" 
              alt="Agro Setu Logo" 
              style={{ 
                width: "100%", 
                maxWidth: "260px", 
                objectFit: "contain",
                marginBottom: "20px" 
              }} 
            />
            <h3 style={{ color: colors.primary, fontWeight: "700", fontSize: "1.6rem", margin: "10px 0" }}>Agro Setu</h3>
            <p style={{ color: "#777", fontSize: "0.85rem", lineHeight: "1.6", textAlign: "center", maxWidth: "240px" }}>
              Modernizing agriculture through connected communities.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Signup;