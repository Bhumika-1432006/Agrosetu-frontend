import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

function FarmerChatPage() {
  const { state } = useLocation(); // { chatId }
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);

  // --- PREMIUM THEME COLORS ---
  const colors = {
    primary: "#4B6F44",      // Forest Green
    gold: "#D4AF37",         // Harvest Gold
    textDark: "#1E291B",     // Deep Earth
    white: "#FFFFFF",
    bgLight: "#F2F5F0",      // Soft Sage Background
    bubbleFarmer: "#4B6F44", // Sender: Forest Green
    bubbleDealer: "#FFFFFF", // Receiver: White
    border: "#E2E8E1"
  };

  // 1. FIXED: URL logic to use Environment Variable
 const fetchChat = async () => {
  if (!chatId) return; 
  try {
    // Ensure you use the ENV variable or the fallback Render URL
    const API_BASE = process.env.REACT_APP_API_URL || "https://agrosetu-backend.onrender.com";
    const res = await fetch(`${API_BASE}/api/chat/${chatId}`);
    
    if (!res.ok) throw new Error("Failed to fetch chat");
    
    const data = await res.json();
    setChat(data);
  } catch (err) {
    console.error("Fetch chat error:", err);
  }
};
  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 2000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // 2. FIXED: Variable 'text' and Dynamic URL
 const sendMessage = async () => {
  if (!text.trim()) return;
  try {
    const API_BASE = process.env.REACT_APP_API_URL || "https://agrosetu-backend.onrender.com";
    const res = await fetch(`${API_BASE}/api/chat/${chatId}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderRole: "farmer",
        text: text 
      }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    const updatedChat = await res.json();
    setChat(updatedChat);
    setText(""); 
  } catch (err) {
    console.error(err);
    alert("Failed to send message");
  }
};

  if (!chat) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: colors.bgLight }}>
      <p style={{ color: colors.primary, fontWeight: "700" }}>🌾 Establishing secure line...</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: "100vh", padding: "20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ 
        maxWidth: "800px", 
        margin: "auto", 
        backgroundColor: colors.white, 
        borderRadius: "28px", 
        overflow: "hidden", 
        display: "flex", 
        flexDirection: "column",
        height: "88vh",
        boxShadow: "0 15px 45px rgba(0,0,0,0.06)",
        border: `1px solid ${colors.border}`
      }}>
        
        {/* CHAT HEADER */}
        <div style={{ 
          padding: "20px 30px", 
          borderBottom: `1px solid ${colors.border}`, 
          backgroundColor: colors.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ 
              width: "55px", height: "55px", borderRadius: "16px", 
              backgroundColor: colors.bgLight, display: "flex", 
              alignItems: "center", justifyContent: "center", marginRight: "15px",
              border: `1px solid ${colors.border}`, fontSize: "1.4rem"
            }}>
              🏪
            </div>
            <div>
              <h6 style={{ margin: 0, fontWeight: "800", color: colors.textDark, fontSize: "1.2rem" }}>
                {chat.dealerId?.shopName || "Dealer"}
              </h6>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                 <span style={{ width: "8px", height: "8px", background: "#2ecc71", borderRadius: "50%" }}></span>
                 <p style={{ margin: 0, fontSize: "0.85rem", color: colors.primary, fontWeight: "700", textTransform: "uppercase" }}>
                    Negotiating: {chat.cropId?.cropName || "Crop"}
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGES AREA */}
        <div style={{ 
          flex: 1, 
          padding: "30px", 
          overflowY: "auto", 
          backgroundColor: "#FBFBFA", 
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          {chat.messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.senderRole === "farmer" ? "flex-end" : "flex-start",
                maxWidth: "75%",
              }}
            >
              <div style={{
                padding: "16px 24px", 
                borderRadius: m.senderRole === "farmer" ? "24px 24px 4px 24px" : "24px 24px 24px 4px",
                background: m.senderRole === "farmer" ? colors.bubbleFarmer : colors.bubbleDealer,
                color: m.senderRole === "farmer" ? colors.white : colors.textDark,
                boxShadow: m.senderRole === "farmer" ? "0 4px 12px rgba(75, 111, 68, 0.2)" : "0 4px 12px rgba(0,0,0,0.03)",
                border: m.senderRole === "farmer" ? "none" : `1px solid ${colors.border}`,
                fontSize: "1.15rem",
                lineHeight: "1.5",
                fontWeight: "400"
              }}>
                {m.text}
              </div>
              <div style={{ 
                fontSize: "0.75rem", 
                color: "#999", 
                marginTop: "8px", 
                textAlign: m.senderRole === "farmer" ? "right" : "left",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                {m.senderRole === "farmer" ? "Your Message" : chat.dealerId?.shopName}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* INPUT AREA */}
        <div style={{ padding: "25px 30px", borderTop: `1px solid ${colors.border}`, backgroundColor: colors.white }}>
          <div className="d-flex" style={{ gap: "15px" }}>
            <input
              style={{
                borderRadius: "16px",
                border: `1.5px solid ${colors.border}`,
                padding: "18px 22px",
                fontSize: "1.1rem",
                flex: 1,
                backgroundColor: "#F9FAF9",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
              className="form-control shadow-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your proposal..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button 
              onClick={sendMessage}
              style={{
                backgroundColor: colors.primary,
                border: "none",
                borderRadius: "16px",
                width: "70px",
                color: colors.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                boxShadow: "0 6px 15px rgba(75, 111, 68, 0.2)"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <span style={{ fontSize: "1.4rem" }}>🚀</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerChatPage;