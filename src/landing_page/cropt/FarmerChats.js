import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom"; // Change 1: Use useParams for URL IDs

function FarmerChatPage() {
  const { chatId } = useParams(); // Change 2: Get ID from the URL directly
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);

  const senderRole = "farmer";

  // --- PREMIUM THEME COLORS ---
  const colors = {
    primary: "#4B6F44",
    gold: "#D4AF37",
    textDark: "#1E291B",
    white: "#FFFFFF",
    bgLight: "#F2F5F0",
    border: "#E2E8E1",
    bubbleFarmer: "#4B6F44",
    bubbleDealer: "#FFFFFF"
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Change 3: Added a hard fallback to your Render URL so it NEVER hits localhost
  const getBaseUrl = () => {
    return process.env.REACT_APP_API_URL || "https://agrosetu-backend.onrender.com";
  };

  const fetchChat = async () => {
    if (!chatId) return;
    try {
      const res = await fetch(`${getBaseUrl()}/api/chat/${chatId}`);
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
    scrollToBottom();
  }, [chat]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await fetch(`${getBaseUrl()}/api/chat/${chatId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderRole, text }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const updatedChat = await res.json();
      setChat(updatedChat);
      setText(""); 
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  if (!chat) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: colors.bgLight }}>
      <div style={{ color: colors.primary, textAlign: "center" }}>
        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
        <span style={{ fontWeight: "700" }}>Securing your connection...</span>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: "100vh", padding: "30px 20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ 
        maxWidth: "850px", 
        margin: "0 auto", 
        backgroundColor: colors.white, 
        borderRadius: "32px", 
        boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        height: "85vh",
        border: `1px solid ${colors.border}`,
        overflow: "hidden"
      }}>
        
        {/* HEADER */}
        <div style={{ 
          padding: "20px 35px", 
          borderBottom: `1px solid ${colors.border}`, 
          display: "flex", 
          alignItems: "center",
          background: colors.white,
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ 
              width: "55px", height: "55px", borderRadius: "16px", 
              background: colors.bgLight, display: "flex", 
              alignItems: "center", justifyContent: "center", marginRight: "18px",
              border: `1px solid ${colors.border}`, fontSize: "1.5rem"
            }}>
              🏪
            </div>
            <div>
              <h5 style={{ margin: 0, fontWeight: "800", color: colors.textDark, fontSize: "1.25rem" }}>
                {chat.dealerId?.name || "Dealer"}
              </h5>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", background: "#2ecc71", borderRadius: "50%" }}></span>
                <p style={{ margin: 0, fontSize: "0.9rem", color: colors.primary, fontWeight: "700", textTransform: "uppercase" }}>
                   {chat.dealerId?.shopName || "Verified Partner"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGES LIST */}
        <div style={{ 
          flex: 1, 
          padding: "35px", 
          overflowY: "auto", 
          display: "flex", 
          flexDirection: "column", 
          gap: "24px",
          background: "#FAFBFA" 
        }}>
          {chat.messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: msg.senderRole === senderRole ? "flex-end" : "flex-start",
                maxWidth: "75%",
              }}
            >
              <div style={{
                padding: "18px 26px",
                borderRadius: msg.senderRole === senderRole ? "26px 26px 4px 26px" : "26px 26px 26px 4px",
                backgroundColor: msg.senderRole === senderRole ? colors.bubbleFarmer : colors.bubbleDealer,
                color: msg.senderRole === senderRole ? "#fff" : colors.textDark,
                fontSize: "1.1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                border: msg.senderRole === senderRole ? "none" : `1px solid ${colors.border}`,
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {/* INPUT AREA */}
        <form onSubmit={handleSend} style={{ 
          padding: "30px 35px", 
          borderTop: `1px solid ${colors.border}`, 
          display: "flex", 
          gap: "18px", 
          background: colors.white 
        }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            style={{ 
              flex: 1, padding: "15px 25px", borderRadius: "18px", 
              border: `1.5px solid ${colors.border}`, outline: "none"
            }}
          />
          <button type="submit" style={{ 
            padding: "0 30px", borderRadius: "18px", border: "none", 
            background: colors.primary, color: "#fff", fontWeight: "bold" 
          }}>
            SEND 🚀
          </button>
        </form>
      </div>
    </div>
  );
}

export default FarmerChatPage;