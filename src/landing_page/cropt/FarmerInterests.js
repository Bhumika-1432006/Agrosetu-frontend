import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FarmerInterests() {
  const [interests, setInterests] = useState([]);
  const navigate = useNavigate();
  const farmerId = localStorage.getItem("userId");

  // --- THEME COLORS ---
  const colors = {
    primary: "#7A9461",   // Soft Sage Green
    gold: "#D4AF37",      
    textDark: "#4A4A4A",
    bgLight: "#F9FAF8",
    white: "#FFFFFF",
    border: "#E2E8E1"
  };

  useEffect(() => {
    const fetchInterests = async () => {
      try {
       const res = await fetch(`${process.env.REACT_APP_API_URL}/api/chat/farmer/${farmerId}`);
        const data = await res.json();
        setInterests(data);
      } catch (err) {
        console.error("Fetch interests error:", err);
      }
    };

    fetchInterests();
  }, [farmerId]);

  const startChat = async (dealerId, cropId) => {
    try {
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";


      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/chat/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealerId, farmerId, cropId }),
      });

      const chat = await res.json();

      if (!res.ok) {
        console.error("Start chat failed:", chat.message);
        return;
      }

      navigate(`/farmer/chat/${chat._id}`, { state: { chatId: chat._id } });
    } catch (err) {
      console.error("Start chat error:", err);
    }
  };

  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: "100vh", padding: "40px 20px" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        
        {/* HEADER SECTION */}
        <div className="mb-5">
          <h2 style={{ color: colors.textDark, fontWeight: "800", marginBottom: "10px" }}>
            My Interests / Messages
          </h2>
          <div style={{ width: "60px", height: "4px", background: colors.gold, borderRadius: "2px" }}></div>
          <p className="mt-3" style={{ color: "#888", fontSize: "0.9rem" }}>
            Review inquiries from dealers interested in your crops.
          </p>
        </div>

        {/* INTERESTS LIST */}
        <div className="mt-3">
          {interests.length === 0 ? (
            <div className="text-center p-5" style={{ backgroundColor: colors.white, borderRadius: "20px", border: `1px solid ${colors.border}` }}>
              <span style={{ fontSize: "2.5rem" }}>📩</span>
              <p className="mt-3" style={{ color: "#999" }}>No inquiries or messages yet.</p>
            </div>
          ) : (
            interests.map((chat) => (
              <div 
                key={chat._id} 
                className="d-flex justify-content-between align-items-center mb-3 p-4 shadow-sm"
                style={{
                  backgroundColor: colors.white,
                  borderRadius: "18px",
                  border: `1px solid ${colors.border}`,
                  transition: "0.3s ease",
                }}
              >
                <div className="d-flex align-items-center">
                  <div 
                    style={{ 
                      width: "50px", 
                      height: "50px", 
                      backgroundColor: "#F0F4ED", 
                      borderRadius: "12px", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      marginRight: "20px",
                      fontSize: "1.2rem"
                    }}
                  >
                    🏪
                  </div>
                  <div>
                    <h6 style={{ margin: 0, fontWeight: "700", color: colors.textDark }}>
                      {chat.dealerId?.shopName || "Unknown Dealer"}
                    </h6>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: colors.primary, fontWeight: "600" }}>
                      Interested in: {chat.cropId?.cropName || "Unknown Crop"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => startChat(chat.dealerId._id, chat.cropId._id)}
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.white,
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "0.9rem",
                    transition: "0.3s",
                    boxShadow: "0 4px 12px rgba(122, 148, 97, 0.2)"
                  }}
                  onMouseOver={(e) => e.target.style.opacity = "0.9"}
                  onMouseOut={(e) => e.target.style.opacity = "1"}
                >
                  Open Chat
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FarmerInterests;